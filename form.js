document.querySelectorAll('.grade-card').forEach(card => {
  card.addEventListener('click', () => {
    alert('Downloading form...');
  });
});

// ====== Map pages to step index ======
const pageToStep = {
  "educattach.html": 5,
  "programs.html": 6,
  "form.html": 7,
  "submit.html": 8,
  // add more pages if needed
};

// ====== Get current page ======
const currentPage = window.location.pathname.split("/").pop();

// ====== Load progress safely ======
let savedStep = parseInt(localStorage.getItem("currentStep"));
let currentStep = pageToStep[currentPage] !== undefined ? pageToStep[currentPage] : (savedStep || 5);
let maxUnlockedStep = parseInt(localStorage.getItem("maxUnlockedStep")) || currentStep;

document.addEventListener("DOMContentLoaded", () => {
  const steps = document.querySelectorAll(".step");

  // ====== Update step UI ======
  function updateSteps() {
    steps.forEach((step, index) => {
      // ACTIVE step (green)
      step.classList.toggle("active", index === currentStep);

      // CLICKABLE or LOCKED
      if (index <= maxUnlockedStep) {
        step.classList.add("clickable");
        step.style.pointerEvents = "auto";
        step.style.opacity = "1";
      } else {
        step.classList.remove("clickable");
        step.style.pointerEvents = "none";
        step.style.opacity = "1";
      }
    });

    // Save progress
    localStorage.setItem("currentStep", currentStep);
    localStorage.setItem("maxUnlockedStep", maxUnlockedStep);
  }

  // ====== Step click navigation ======
  steps.forEach((step, index) => {
    step.addEventListener("click", () => {
      if (index > maxUnlockedStep) return; // block locked steps

      currentStep = index;
      updateSteps();

      // Optional: show section if you have this function
      if (typeof showSection === "function") showSection(currentStep);

      // Navigate pages based on step
      switch (index) {
      case 0: window.location.href = "welcome.html"; break;
      case 1: window.location.href = "readfirst.html"; break;
      case 2: window.location.href = "confirmation.html"; break;
      case 3: window.location.href = "aap.html"; break;
      case 4: window.location.href = "personal.html"; break;
      case 5: window.location.href = "educattach.html"; break;
      case 6: window.location.href = "programs.html"; break;
      case 7: window.location.href = "form.html"; break;
      case 8: window.location.href = "submit.html"; break;
        // Add more steps/pages here
      }
    });
  });

  // ====== Initial render ======
  updateSteps();
});