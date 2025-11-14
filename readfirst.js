
// readfirst.js
/*
document.addEventListener("DOMContentLoaded", () => {
  const continueBtn = document.querySelector(".continue-btn");
  if (continueBtn) {
    continueBtn.addEventListener("click", () => {
      window.location.href = "confirmation.html"; // Or next step page
    });
  }
});
*/
/*
document.addEventListener("DOMContentLoaded", () => {
  const nextBtn = document.querySelector(".next-btn");
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      window.location.href = "confirmation.html"; // Or next step page
    });
  }
});
*/
/*
console.log("✅ readfirst.js loaded successfully");
document.addEventListener("DOMContentLoaded", () => {
  const nextBtn = document.querySelector(".next-btn");
  
  if (nextBtn) {
    nextBtn.addEventListener("click", async () => {
      // mimic what startButton does but go to step 2
      const steps = document.querySelectorAll(".step");
      
      // Unlock step 2
      window.maxUnlockedStep = 2;
      window.currentStep = 2;

      // Trigger the same function as script.js uses
      document.dispatchEvent(new CustomEvent("gotoStep", { detail: { step: 2 } }));
    });
  }
});
*/

console.log("✅ readfirst.js loaded successfully");

// Wait until .next-btn exists (since content is dynamically injected)
const checkNextBtn = setInterval(() => {
  const nextBtn = document.querySelector(".next-btn");
  if (nextBtn) {
    console.log("✅ .next-btn found, attaching click event");

    nextBtn.addEventListener("click", () => {
      console.log("➡️ Next button clicked — dispatching gotoStep(2)");

      // Dispatch the gotoStep event to trigger confirmation load
      document.dispatchEvent(new CustomEvent("gotoStep", { detail: { step: 2 } }));
    });

    clearInterval(checkNextBtn);
  }
}, 300);


/*
document.addEventListener("DOMContentLoaded", () => {
  const nextBtn = document.querySelector(".next-btn");

  if (nextBtn) {
    nextBtn.addEventListener("click", async () => {
      const steps = document.querySelectorAll(".step");
      let currentStep = 2; // 3rd circle (index 2)
      let maxUnlockedStep = 2;

      async function loadConfirmationSection() {
        try {
          const response = await fetch("confirmation.html");
          const html = await response.text();

          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = html;

          const confirmationContent = tempDiv.querySelector("#confirmation-section");
          document.body.appendChild(confirmationContent);

          const script = document.createElement("script");
          script.src = "confirmation.js";
          document.body.appendChild(script);

          // Update step indicator
          steps.forEach(step => step.classList.remove("active"));
          steps[currentStep].classList.add("active");
        } catch (err) {
          console.error("Error loading Confirmation section:", err);
        }
      }

      // Remove the Read First section before loading Confirmation
      const readFirstSection = document.querySelector("#read-first-section");
      if (readFirstSection) readFirstSection.remove();

      // Load the confirmation section dynamically
      loadConfirmationSection();
    });
  }
});
*/

/*
document.addEventListener("DOMContentLoaded", () => {
  const nextButton = document.getElementById("go-to-confirmation");
  if (nextButton) {
    nextButton.addEventListener("click", async () => {
      // Update current step to Confirmation
      const steps = document.querySelectorAll(".step");
      const currentStep = 2; // 0 = welcome, 1 = read first, 2 = confirmation

      steps.forEach((step, index) => {
        const circle = step.querySelector("span");
        step.classList.toggle("active", index === currentStep);
        circle.style.borderColor = index === currentStep ? "#1a9737" : "#ccc";
      });

      // Remove Read First section
      const readFirstSection = document.querySelector("#read-first-section");
      if (readFirstSection) readFirstSection.remove();

      // Load Confirmation Section dynamically
      try {
        const response = await fetch("confirmation.html");
        const html = await response.text();
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = html;

        const confirmationSection = tempDiv.querySelector("#confirmation-section");
        document.body.appendChild(confirmationSection);

        // Load confirmation.js dynamically
        const script = document.createElement("script");
        script.src = "confirmation.js";
        document.body.appendChild(script);
      } catch (err) {
        console.error("Error loading Confirmation section:", err);
      }
    });
  }
});
*/
