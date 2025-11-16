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
    notif.style.opacity = 1;

    // Fade out after 4 seconds
    setTimeout(() => {
        notif.style.opacity = 0;
        setTimeout(() => {
            notif.style.display = 'none';
        }, 500);
    }, 4000);
}

// =====================================================
// HANDLE NEXT BUTTON
// =====================================================
function handleNext() {
    let error = false;

    // Reset previous errors
    document.querySelectorAll('.question').forEach(q => q.classList.remove('error'));
    document.querySelectorAll('input[type="text"], select').forEach(t => t.classList.remove('error'));

    // Q1-Q3: required radio buttons
    const q1 = document.querySelector('input[name="academicStatus"]:checked');
    const q2 = document.querySelector('input[name="alreadyEnrolled"]:checked');
    const q3 = document.querySelector('input[name="firstTimeApplying"]:checked');

    if (!q1) { document.getElementById('q1').classList.add('error'); error = true; }
    if (!q2) { document.getElementById('q2').classList.add('error'); error = true; }
    if (!q3) { document.getElementById('q3').classList.add('error'); error = true; }

    // Q4: transferred
    const transferred = document.querySelector('input[name="transferred"]:checked');
    if (!transferred) {
        document.getElementById('q4').classList.add('error');
        error = true;
    } else if (transferred.value === "yes") {
        const school = document.getElementById('transferredFrom');
        const year = document.getElementById('transferredYear');
        if (!school.value.trim()) { school.classList.add('error'); document.getElementById('q4').classList.add('error'); error = true; }
        if (!year.value.trim()) { year.classList.add('error'); document.getElementById('q4').classList.add('error'); error = true; }
    }

    // Q5: BSU graduate
    const bsu = document.querySelector('input[name="bsuGraduate"]:checked');
    if (!bsu) {
        document.getElementById('q5').classList.add('error');
        error = true;
    } else if (bsu.value === "yes") {
        const school = document.getElementById('bsuSchool');
        if (!school.value) { school.classList.add('error'); document.getElementById('q5').classList.add('error'); error = true; }
    }

    // Show error if any missing
    if (error) {
        showNotification("Please complete all required fields before proceeding.");
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
    }

    // Success → go to next page
    window.location.href = "aap.html";
}
