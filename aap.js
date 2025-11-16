// =====================================================
// GRADE CARD DOWNLOAD ALERT
// =====================================================
const downloads = [
  'assets/grades_form_1.pdf', // for the first card
  'assets/grades_form_2.pdf'  // for the second card
];

document.querySelectorAll('.grade-card').forEach((card, index) => {
  card.addEventListener('click', () => {
    const link = document.createElement('a');
    link.href = downloads[index];
    link.download = downloads[index].split('/').pop(); // set filename
    link.click();
  });
});

// =====================================================
// EXTRA FIELD TOGGLING
// =====================================================
document.getElementById('transferred-yes').addEventListener('change', () => {
    document.getElementById('transfer-fields').classList.remove('hidden');
});

document.getElementById('transferred-no').addEventListener('change', () => {
    document.getElementById('transfer-fields').classList.add('hidden');
    document.getElementById('transferredFrom').value = '';
    document.getElementById('transferredYear').value = '';
});

document.getElementById('bsu-yes').addEventListener('change', () => {
    document.getElementById('bsu-field').classList.remove('hidden');
});

document.getElementById('bsu-no').addEventListener('change', () => {
    document.getElementById('bsu-field').classList.add('hidden');
});

// =====================================================
// CLEAR ERRORS WHEN USER TYPES OR CHANGES
// =====================================================
document.querySelectorAll('input, select').forEach(el => {
    el.addEventListener('input', () => {
        el.classList.remove('error');
        const q = el.closest('.question');
        if (q) q.classList.remove('error');
        const notif = document.getElementById('error-notif');
        notif.style.display = 'none';
    });
});

// =====================================================
// SHOW NOTIFICATION FUNCTION
// =====================================================
function showNotification(message) {
    const notif = document.getElementById('error-notif');
    notif.textContent = message;
    notif.style.display = 'block';
    
    // Force a short delay to ensure opacity transition works
    setTimeout(() => {
        notif.style.opacity = 1; // fade in
    }, 50);

    // Keep notification visible for 6 seconds
    setTimeout(() => {
        notif.style.opacity = 0; // start fade out
        // Completely hide after fade-out
        setTimeout(() => {
            notif.style.display = 'none';
        }, 1000); // match CSS transition duration
    }, 6000); // visible for 6 seconds
}

// =====================================================
// HANDLE NEXT BUTTON
// =====================================================
function handleNext() {
    let error = false;

    const aapField = document.getElementById('aapField');
    const AFProg = document.querySelector('input[name="aap"]:checked');

  if (!AFProg) {
    aapField.classList.add('error');
    error = true;
  } else {
    aapField.classList.remove('error');
  }





    /*
    const aap = document.querySelector('input[name="aap"]:checked');

    // Reset previous errors
    document.querySelectorAll('.aap-option input').forEach(input => input.classList.remove('error'));

    if (!aap) {
        // Highlight all radio buttons (optional)
        document.querySelectorAll('input[name="aap"]').forEach(input => input.classList.add('error'));
        error = true;
    }
    */
    if (error) {
        showNotification("Please complete all required fields before proceeding.");
        window.scrollTo({ top: 0, behavior: "smooth" });
        return; // STOP here, do not redirect
    }

    // SUCCESS → go to next page
    window.location.href = "personal.html";
}

// ====== Step click navigation ======
const steps = document.querySelectorAll('.step'); // your step elements
let maxUnlockedStep = 0; // adjust this according to user progress
let currentStep = 0;

steps.forEach((step, index) => {
    step.addEventListener("click", () => {
        // Only allow clicking unlocked steps
        if (index > maxUnlockedStep) return;

        // Update current step
        currentStep = index;
        updateSteps(); // optional: update step UI if you have this function

        // Navigate pages based on step
        const pageMap = [
            "welcome.html",
            "readfirst.html",
            "confirmation.html",
            "aap.html",
            "personal.html",
            "educattach.html",
            "programs.html",
            "form.html",
            "submit.html"
        ];

        if (pageMap[index]) {
            window.location.href = pageMap[index];
        }
    });
});

// Optional: function to update step UI
function updateSteps() {
    steps.forEach((step, idx) => {
        step.classList.toggle('active', idx === currentStep);
        step.classList.toggle('unlocked', idx <= maxUnlockedStep);
    });
}
