const closeBtn = document.getElementById('closeBtn');
const triggers = document.querySelectorAll('.modal-trigger');
const modalOverlay = document.getElementById('memberModal');
const modalName = document.getElementById('modalName');
const modalRole = document.getElementById('modalRole');
const modalDetails = document.getElementById('modalDetails');
const modalTraits = document.getElementById('modalTraits');

triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
        const name = trigger.getAttribute('data-name');
        const role = trigger.getAttribute('data-role');
        const details = trigger.getAttribute('data-details');
        const traits = trigger.getAttribute('data-traits');

        modalName.textContent = name;
        modalRole.textContent = role;
        modalDetails.innerHTML = details;
        modalTraits.innerHTML = traits;

        modalOverlay.classList.add('active');
    });
    });

modalOverlay.addEventListener('click', (event) => {
    if (event.target === modalOverlay) {
        modalOverlay.classList.remove('active');
    }
});

closeBtn.addEventListener('click', () =>{ 
    modalOverlay.classList.remove('active');
});