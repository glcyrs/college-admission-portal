document.querySelectorAll('.grade-card').forEach(card => {
  card.addEventListener('click', () => {
    alert('Downloading form...');
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const steps = document.querySelectorAll(".step");
  const startButton = document.querySelector(".start-btn");
  const welcomeSection = document.querySelector(".welcome-section");
  const readFirstSection = document.querySelector("#read-first-section"); // add this later

  let currentStep = 0;
  let maxUnlockedStep = 0;

  function updateSteps() {
    steps.forEach((step, index) => {
      const circle = step.querySelector("span");
      const icon = step.querySelector("i");
      const label = step.querySelector("p");

        if (index <= maxUnlockedStep) {
          step.classList.add("clickable");
          step.style.pointerEvents = "auto";
          /*circle.style.borderColor = "#ccc"; // normal border */
          icon?.style.setProperty("opacity", "1"); // normal icon
          label.style.opacity = "1"; // normal text
        } else {
          step.classList.remove("clickable");
          step.style.pointerEvents = "none";
          circle.style.borderColor = "#ddd"; // dimmed border only
          icon?.style.setProperty("opacity", "0.4"); // dimmed icon
          label.style.opacity = "0.5"; // dimmed text
        }

        // highlight active step
        step.classList.toggle("active", index === currentStep);
        // ✅ Only set border color manually for *non-active* circles
        if (index !== currentStep && index <= maxUnlockedStep) {
          circle.style.borderColor = "#ccc"; // normal unlocked step
        } else if (index === currentStep) {
          circle.style.borderColor = "#1a9737"; // active step border
        }
    });

  }

  steps.forEach((step, index) => {
    step.addEventListener("click", () => {
      if (index <= maxUnlockedStep) { // can only click unlocked steps
        currentStep = index;
        updateSteps();
        updateSectionVisibility();
      }
    });
  });

  if (startButton) {
    startButton.addEventListener("click", () => {
      if (maxUnlockedStep < 1) maxUnlockedStep = 1; // unlock Read First once Start is clicked
      currentStep = 1;
      updateSteps();
      updateSectionVisibility();
      readFirstSection?.scrollIntoView({ behavior: "smooth" });
    });
  }

  function updateSectionVisibility() {
    if (welcomeSection) welcomeSection.style.display = currentStep === 0 ? "flex" : "none";
    if (readFirstSection) readFirstSection.style.display = currentStep === 1 ? "flex" : "none";
  }

  updateSteps();
  updateSectionVisibility();
});
