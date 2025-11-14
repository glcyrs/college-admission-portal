/*
document.addEventListener("DOMContentLoaded", () => {
  const nextBtn = document.querySelector("#go-to-personal");
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      alert("Next step: AAP section will load here soon!");
    });
  }
});

*/

console.log("✅ aap.js loaded successfully");

// Wait until the "Next" button actually exists (because the section is dynamically injected)
const selectNextBtn = setInterval(() => {
  const nextBtn = document.querySelector("#aap-section .next-btn");

  if (nextBtn) {
    console.log("✅ .next-btn found in aap section, attaching click event");

    nextBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      console.log("➡️ Confirmation Next button clicked — dispatching gotoStep(4)");

      // Dispatch an event that the main script.js can catch
      document.dispatchEvent(
        new CustomEvent("gotoStep", { detail: { step: 4 } })
      );
    });

    clearInterval(selectNextBtn);
  }
}, 300);
