class Tracker {
    constructor(date, title, content) 
    {
        this.date = date;
        this.title = title;
        this.content = content;
    }

    formatter() 
    {
        return `${this.date} - ${this.title}: ${this.content}`;
    }

    getDate() 
    {
        return this.date;
    }

    getTitle() 
    {
        return this.title;
    }

    getContent() 
    {
        return this.content;
    }

    sanitizer() 
    {
        return this.title.replace(/[ /\\:*?"<>|.]/g, "_");
    }
}

class EntryModifier {
    constructor(tracker) 
    {
        this.tracker = tracker;
    }

    appendEntry(text) 
    {
        this.tracker.content += "\n\n" + text;
        return this.tracker;
    }

    replaceEntry(text) 
    {
        this.tracker.content = text;
        return this.tracker;
    }
}

class DiaryApp {
    constructor() 
    {
        this.entries = JSON.parse(
            localStorage.getItem("quietPagesEntries")
        ) || [];
        this.currentEntryIndex = null;
        this.setupEventListeners();
        this.showHome();
    }

    saveEntries() 
    {
        localStorage.setItem("quietPagesEntries", JSON.stringify(this.entries));
    }

    setupEventListeners() {
        document.getElementById("entry-form").addEventListener("submit", (event) => {
            event.preventDefault();
            this.addEntry();
        });

        document.getElementById("edit-form").addEventListener("submit", (event) => {
            event.preventDefault();
            this.saveEditedEntry();
        });

    }

    showView(viewId, heading) 
    {
        const views = document.querySelectorAll(".view");
        views.forEach(view => {
            view.classList.add("hidden");
        });

        document.getElementById(viewId).classList.remove("hidden");
        document.getElementById("page-heading").textContent = heading;
        this.updateNavigation(viewId);
    }

    updateNavigation(viewId) {
        const buttons = document.querySelectorAll(".nav-button");
        buttons.forEach(button => {
            button.classList.remove("active");
        });
        if (viewId === "home-view") 
        {
            buttons[0].classList.add("active");
        }
        else if (viewId === "add-view") 
        {
            buttons[1].classList.add("active");
        }
        else if (viewId === "entries-view" || viewId === "detail-view" || viewId === "edit-view") 
        {
            buttons[2].classList.add("active");
        }
    }

    showHome() 
    {
        this.showView("home-view", "Welcome back.");
        this.displayRecentEntries();

    }

    showAddEntry() 
    {
        this.showView("add-view", "A new page.");
        document.getElementById("entry-form").reset();
        document.getElementById("entry-date").value = new Date().toISOString().split("T")[0];
    }

    addEntry() 
    {
        const date = document.getElementById("entry-date").value;
        const title = document.getElementById("entry-title").value.trim();
        const content = document.getElementById("entry-content").value.trim();

        if (!date || !title || !content) 
        {
            alert("Please complete all fields.");
            return;
        }

        const newEntry = new Tracker(date, title, content);
        this.entries.unshift(newEntry);
        this.saveEntries();
        document.getElementById("entry-form").reset();
        alert("Your entry has been saved.");
        this.showHome();
    }

    displayRecentEntries() {
        const container = document.getElementById("recent-entries");
        container.innerHTML = "";
        if (this.entries.length === 0) 
        {
            container.innerHTML = `<div class="empty-state">
                    <h4>Your creations are waiting.</h4>
                    <p>Write your first entry to begin your collection.</p>
                </div>`;
            return;
        }


        const recentEntries = this.entries.slice(0, 3);
        recentEntries.forEach((entry, index) => {
            const card = this.createEntryCard(entry, index);
            container.appendChild(card);
        });
    }

    showEntries() 
    {
        this.showView("entries-view", "Your collection.");
        this.displayAllEntries();
    }

    displayAllEntries() 
    {
        const container = document.getElementById("all-entries");
        container.innerHTML = "";
        if (this.entries.length === 0) 
        {
            container.innerHTML = `<div class="empty-state">
                    <h4>No entries yet.</h4>
                    <p>Your diary will fill up, one page at a time.</p>
                </div>`;
            return;
        }
        this.entries.forEach((entry, index) => {
            const card = this.createEntryCard(entry, index);
            container.appendChild(card);
        });
    }

    createEntryCard(entry, index) 
    {
        const card = document.createElement("div");
        card.className = "entry-card";
        const date = document.createElement("p");
        date.className = "entry-date";
        date.textContent = entry.date;
        const title = document.createElement("h4");
        title.textContent = entry.title;
        const preview = document.createElement("p");
        preview.className = "entry-preview";
        preview.textContent = entry.content.length > 100 ? entry.content.substring(0, 100) + "..." : entry.content;
        card.appendChild(date);
        card.appendChild(title);
        card.appendChild(preview);
        card.addEventListener("click", () => {
            this.currentEntryIndex = index;
            this.showDetail();
        });
        return card;
    }

    showDetail() 
    {
        const entry = this.entries[this.currentEntryIndex];
        if (!entry) 
        {
            this.showEntries();
            return;
        }
        this.showView("detail-view", "Your journal.");
        document.getElementById("detail-date").textContent = entry.date;
        document.getElementById("detail-title").textContent = entry.title;
        document.getElementById("detail-content").textContent = entry.content;
    }
    
    editEntry() 
    {
        const entry = this.entries[this.currentEntryIndex];
        if (!entry) return;
        this.showView("edit-view", "Edit your entry.");
        document.getElementById("edit-date").value = entry.date;
        document.getElementById("edit-title").value = entry.title;
        document.getElementById("edit-content").value = entry.content;
    }

    saveEditedEntry() 
    {
        const date = document.getElementById("edit-date").value;
        const title = document.getElementById("edit-title").value.trim();
        const content = document.getElementById("edit-content").value.trim();
        if (!date || !title || !content) 
        {
            alert("Please complete all fields.");
            return;
        }
        this.entries[this.currentEntryIndex] = new Tracker(date, title, content);
        this.saveEntries();
        alert("Your changes have been saved.");
        this.showDetail();
    }

    appendEntry() 
    {
        const text = prompt("What would you like to add to this entry?");
        if (text === null || text.trim() === "") 
        {
            return;
        }
        const modifier = new EntryModifier(this.entries[this.currentEntryIndex]);
        modifier.appendEntry(text.trim());
        this.saveEntries();
        this.showDetail();

        alert("Your text has been added.");

    }

    replaceEntry() 
    {
        const newContent = prompt("Enter the new content for this entry:");
        if (newContent === null || newContent.trim() === "") 
        {
            return;
        }
        const modifier = new EntryModifier(this.entries[this.currentEntryIndex]);
        modifier.replaceEntry(newContent.trim());
        this.saveEntries();
        this.showDetail();
        alert("Your entry has been updated.");
    }

    deleteCurrentEntry() 
    {
        const confirmed = confirm("Are you sure you want to delete this entry?");
        if (!confirmed) 
        {
            return;
        }
        this.entries.splice(this.currentEntryIndex, 1);
        this.currentEntryIndex = null;
        this.saveEntries();
        alert("Your entry has been deleted.");
        this.showEntries();
    }
}
const app = new DiaryApp();
