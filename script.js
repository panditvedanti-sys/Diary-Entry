const STUDY_LOGS = "study_history";

let user;
let engine;
let storage;
let timerInterval = null;

class CharacterConfig {

    constructor(name) {
        this.name = name;
        this.behavior = "IDLE";
    }

    changeState(newState) {
        switch (newState) {

            case "IDLE":
            case "STUDYING":
            case "BREAK":
                this.behavior = newState;
                break;

            default:
                console.log("Invalid state ignored: " + newState);
                break;
        }
    }

    getState() {
        return this.behavior;
    }

    getName() {
        return this.name;
    }
}

class StudySession {

    constructor(intention, accomplishment, time = new Date()) {
        this.intention = intention;
        this.accomplishment = accomplishment;
        this.time = new Date(time);
    }

    getIntention() {
        return this.intention;
    }

    getAccomplishment() {
        return this.accomplishment;
    }

    getTime() {
        return this.time;
    }
}

class FileStorageManager {
    saveSession(session) {

        try {
            const sessions = this.loadAllSessions();

            sessions.push({
                time: session.getTime().toISOString(),
                intention: session.getIntention(),
                accomplishment: session.getAccomplishment()
            });

            localStorage.setItem(
                STUDY_LOGS,
                JSON.stringify(sessions)
            );

            alert(
                "Success! The session has been securely saved to your daily logs!"
            );

        } catch (error) {
            console.error(error);

            alert(
                "Sorry, the session ran into an error and could not be saved."
            );
        }
    }

    loadAllSessions() {

        try {
            const savedData = localStorage.getItem(STUDY_LOGS);

            if (!savedData) {
                return [];
            }

            const records = JSON.parse(savedData);

            return records.map(record =>
                new StudySession(
                    record.intention,
                    record.accomplishment,
                    record.time
                )
            );

        } catch (error) {
            console.error("Could not load study history:", error);
            return [];
        }
    }

    getDateKey(date) {

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    calculateCurrentStreak() {

        const sessions = this.loadAllSessions();

        const dates = new Set();

        for (const session of sessions) {
            dates.add(
                this.getDateKey(session.getTime())
            );
        }

        let count = 0;
        const current = new Date();

        current.setHours(0, 0, 0, 0);

        const today = this.getDateKey(current);

        if (!dates.has(today)) {
            current.setDate(current.getDate() - 1);
        }

        while (dates.has(this.getDateKey(current))) {

            count++;

            current.setDate(current.getDate() - 1);
        }

        return count;
    }

    loadHistory() {

        const sessions = this.loadAllSessions();

        const historyDisplay =
            document.getElementById("historyDisplay");

        historyDisplay.replaceChildren();

        if (sessions.length === 0) {

            const message = document.createElement("p");

            message.textContent =
                "You currently have no sessions recorded.";

            historyDisplay.appendChild(message);

            return;
        }

        sessions.forEach(session => {

            const entry = document.createElement("div");
            entry.className = "study-entry";

            const date = document.createElement("p");
            date.textContent =
                "[" + session.getTime().toLocaleString() + "]";

            const intention = document.createElement("p");
            intention.textContent =
                "INTENTION: " + session.getIntention();

            const accomplishment = document.createElement("p");
            accomplishment.textContent =
                "ACCOMPLISHED: " + session.getAccomplishment();

            entry.append(date, intention, accomplishment);

            historyDisplay.appendChild(entry);
        });

        const total = document.createElement("p");

        total.textContent =
            "Total completed habits recorded: " + sessions.length;

        historyDisplay.appendChild(total);
    }
}

class HabitEngine {

    constructor(user, initialSeconds, running) {

        this.user = user;
        this.currentTimerSeconds = initialSeconds;
        this.running = running;
        this.currentIntention = "";
    }

    startFocusBlock(goal) {

        if (goal === null || goal.trim().isEmpty) {
            return;
        }

        this.currentIntention = goal.trim();

        this.user.changeState("STUDYING");

        this.running = true;

        this.currentTimerSeconds = 1500;
    }

    tick() {

        if (!this.running) {
            return;
        }

        if (this.currentTimerSeconds > 0) {

            this.currentTimerSeconds--;

            if (this.currentTimerSeconds === 0) {

                this.user.changeState("BREAK");

                this.running = false;
            }
        }
    }

    finishedSession(reflection) {

        const session = new StudySession(
            this.currentIntention,
            reflection
        );

        this.currentIntention = "";

        this.user.changeState("IDLE");

        this.running = false;

        return session;
    }

    getCurrentTimerSeconds() {
        return this.currentTimerSeconds;
    }


    isRunning() {
        return this.running;
    }
}

function startApp() {

    let characterName = document
        .getElementById("characterName")
        .value.trim();

    if (characterName === "") {
        characterName = "Student";
    }

    user = new CharacterConfig(characterName);

    engine = new HabitEngine(user, 0, false);

    storage = new FileStorageManager();

    document.getElementById("displayName").textContent =
        user.getName();

    updateCharacterStatus();

    showSection("main-menu");
}

function showSection(sectionId) {

    const sections = [
        "character-setup",
        "main-menu",
        "focus-session",
        "study-history",
        "streak-display",
        "exit-message"
    ];

    sections.forEach(id => {

        document.getElementById(id).hidden =
            id !== sectionId;

    });
}

function returnToMenu() {

    showSection("main-menu");

    updateCharacterStatus();
}

function updateCharacterStatus() {

    if (user) {

        document.getElementById("characterStatus").textContent =
            user.getState();

    }
}

function startFocusBlock() {

    showSection("focus-session");

    document.getElementById("goal-entry").hidden = false;

    document.getElementById("active-session").hidden = true;

    document.getElementById("reflection-section").hidden = true;

    document.getElementById("goal").value = "";

    document.getElementById("reflection").value = "";
}

function beginSession() {

    const goal = document.getElementById("goal").value.trim();

    if (goal === "") {

        alert("Please enter a study goal first.");

        return;
    }

    engine.startFocusBlock(goal);

    document.getElementById("goal-entry").hidden = true;

    document.getElementById("active-session").hidden = false;

    document.getElementById("sessionGoal").textContent =
        engine.currentIntention;

    updateCharacterStatus();

    updateTimerDisplay();

    document.getElementById("timerStatus").textContent =
        "Stay focused!";

    clearInterval(timerInterval);

    timerInterval = setInterval(() => {

        engine.tick();

        updateTimerDisplay();

        updateCharacterStatus();

        if (!engine.isRunning()) {

            clearInterval(timerInterval);

            document.getElementById("timerStatus").textContent =
                "Focus block complete! Take a break or finish your reflection.";

        }

    }, 1000);
}

function updateTimerDisplay() {

    const seconds = engine.getCurrentTimerSeconds();

    const minutes = Math.floor(seconds / 60);

    const remainingSeconds = seconds % 60;

    const formattedTime =
        String(minutes).padStart(2, "0") + ":" +
        String(remainingSeconds).padStart(2, "0");

    document.getElementById("timerDisplay").textContent =
        formattedTime;
}

function finishFocusBlock() {

    clearInterval(timerInterval);

    timerInterval = null;

    document.getElementById("active-session").hidden = true;

    document.getElementById("reflection-section").hidden = false;

}

function saveSession() {

    const reflection = document
        .getElementById("reflection")
        .value.trim();

    if (reflection === "") {

        alert("Please complete your reflection before saving.");

        return;
    }

    const session = engine.finishedSession(reflection);

    storage.saveSession(session);

    clearInterval(timerInterval);

    timerInterval = null;

    updateCharacterStatus();

    showSection("main-menu");

}

function viewHistory() {

    showSection("study-history");

    storage.loadHistory();
}

function checkStreak() {

    const streak = storage.calculateCurrentStreak();

    document.getElementById("streakCount").textContent =
        streak;

    showSection("streak-display");
}

function exitApp() {

    clearInterval(timerInterval);

    timerInterval = null;

    showSection("exit-message");
}
