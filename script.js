/*
document.querySelectorAll('.grade-card').forEach(card => {
  card.addEventListener('click', () => {
    alert('Downloading form...');
  });
});
*/

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


document.addEventListener("DOMContentLoaded", () => {
  const steps = document.querySelectorAll(".step");
  const startButton = document.querySelector(".start-btn");
  const welcomeSection = document.querySelector(".welcome-section");

  let currentStep = 0;
  let maxUnlockedStep = 0;
  
  // near where you define currentStep / maxUnlockedStep in script.js
  document.addEventListener("stepCompleted", (e) => {
    const completedStep = e.detail?.step;
    if (typeof completedStep === "number") {
      if (maxUnlockedStep < completedStep + 1) {
        maxUnlockedStep = completedStep + 1; // unlock next
        updateSteps();
      }
    }
  });

  document.addEventListener("gotoStep", async (e) => {
    console.log("🔔 script.js received gotoStep event:", e && e.detail);
    const step = e.detail?.step;
    console.log("    -> requested step:", step, "currentStep:", currentStep, "maxUnlockedStep:", maxUnlockedStep);

    if (typeof step === "number" && step <= maxUnlockedStep) {
      currentStep = step;
      updateSteps();
      await updateSectionVisibility();
    } else if (typeof step === "number" && step > maxUnlockedStep) {
      // optionally allow navigation after unlocking
      maxUnlockedStep = step;
      currentStep = step;
      updateSteps();
      await updateSectionVisibility();
    }
  });
  /*
  //for confirmation part
    // --- Delegated handler: ensure Confirmation "Next" always triggers step 3 ---
  document.addEventListener('click', (e) => {
    // find the nearest button clicked
    const btn = e.target.closest && e.target.closest('.next-btn');
    if (!btn) return;

    // check if this button is inside the confirmation section
    const inConfirmation = !!btn.closest && !!btn.closest('#confirmation-section');
    if (inConfirmation) {
      console.log('🖱️ Delegated handler: Confirmation Next clicked — forcing gotoStep(3)');
      // allow normal flow unlocking if needed
      if (maxUnlockedStep < 3) maxUnlockedStep = 3;
      currentStep = 3;
      updateSteps();
      updateSectionVisibility().catch(err => console.error('updateSectionVisibility error:', err));
      // prevent any default form submit behavior
      e.preventDefault();
      e.stopPropagation();
    }
  });
  */

  function updateSteps() {
    steps.forEach((step, index) => {
      const circle = step.querySelector("span");
      const icon = step.querySelector("i");
      const label = step.querySelector("p");

      if (index <= maxUnlockedStep) {
        step.classList.add("clickable");
        step.style.pointerEvents = "auto";
        icon?.style.setProperty("opacity", "1");
        label.style.opacity = "1";
      } else {
        step.classList.remove("clickable");
        step.style.pointerEvents = "none";
        circle.style.borderColor = "#ddd";
        icon?.style.setProperty("opacity", "0.4");
        label.style.opacity = "0.5";
      }

      step.classList.toggle("active", index === currentStep);
      if (index !== currentStep && index <= maxUnlockedStep) {
        circle.style.borderColor = "#ccc";
      } else if (index === currentStep) {
        circle.style.borderColor = "#1a9737";
      }
    });
  }

  steps.forEach((step, index) => {
    step.addEventListener("click", async () => {
      if (index <= maxUnlockedStep) {
        currentStep = index;
        updateSteps();
        await updateSectionVisibility();
      }
    });
  });

  if (startButton) {
    startButton.addEventListener("click", async () => {
      if (maxUnlockedStep < 1) maxUnlockedStep = 1;
      currentStep = 1;
      updateSteps();
      await updateSectionVisibility();
    });
  }
  /*
  async function updateSectionVisibility() {
    const readFirst = document.querySelector("#read-first-section");
    const confirmation = document.querySelector("#confirmation-section");

    if (currentStep === 0) {
      // Show welcome only
      welcomeSection.style.display = "flex";
      if (readFirst) readFirst.remove();
      if (confirmation) confirmation.remove();
     

    } else if (currentStep === 1) {
      // Show read first
      welcomeSection.style.display = "none";
      if (confirmation) confirmation.remove();

      if (!readFirst) {
        try {
          const response = await fetch("readfirst.html");
          const html = await response.text();

          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = html;

          const readFirstContent = tempDiv.querySelector("#read-first-section");
          document.body.appendChild(readFirstContent);

          const script = document.createElement("script");
          script.src = "readfirst.js";
          document.body.appendChild(script);


        } catch (err) {
          console.error("Error loading Read First section:", err);
        }
      }
     
    } else if (currentStep === 2) {
      // Show confirmation
      welcomeSection.style.display = "none";
      if (readFirst) readFirst.remove();

      if (!confirmation) {
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
    
        } catch (err) {
          console.error("Error loading Confirmation section:", err);
        }
      }
    }
  }
  */
  async function updateSectionVisibility() {
    const readFirst = document.querySelector("#read-first-section");
    const confirmation = document.querySelector("#confirmation-section");
    const aap = document.querySelector("#aap-section");
    const personal = document.querySelector("#personal-section");

    // Hide all sections initially
    if (readFirst) readFirst.classList.add("hidden");
    if (confirmation) confirmation.classList.add("hidden");
    if (aap) aap.classList.add("hidden");
    if (personal) personal.classList.add("hidden");

    if (currentStep === 0) {
      // Show welcome only
      welcomeSection.style.display = "flex";
    } else {
      // Hide welcome section for steps 1 and 2
      welcomeSection.style.display = "none";

      if (currentStep === 1) {
        // Show Read First
        if (!readFirst) {
          try {
            const response = await fetch("readfirst.html");
            const html = await response.text();

            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = html;

            const readFirstContent = tempDiv.querySelector("#read-first-section");
            if (readFirstContent) {
              readFirstContent.classList.add("hidden"); // start hidden
              document.body.appendChild(readFirstContent);

              // Load JS for Read First
              const script = document.createElement("script");
              script.src = "readfirst.js";
              document.body.appendChild(script);
            }
          } catch (err) {
            console.error("Error loading Read First section:", err);
          }
        }

        // Reveal the section
        const readFirstUpdated = document.querySelector("#read-first-section");
        if (readFirstUpdated) readFirstUpdated.classList.remove("hidden");

      } else if (currentStep === 2) {
        // Show Confirmation
        if (!confirmation) {
          try {
            const response = await fetch("confirmation.html");
            const html = await response.text();

            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = html;

            const confirmationContent = tempDiv.querySelector("#confirmation-section");
            if (confirmationContent) {
              confirmationContent.classList.add("hidden"); // start hidden
              document.body.appendChild(confirmationContent);

              // Load JS for Confirmation
              const script = document.createElement("script");
              script.src = "confirmation.js";
              document.body.appendChild(script);
            }
          } catch (err) {
            console.error("Error loading Confirmation section:", err);
          }
        }
        const confirmationUpdated = document.querySelector("#confirmation-section");
        if (confirmationUpdated) confirmationUpdated.classList.remove("hidden");

      } else if (currentStep === 3) {
        //Show AAP Section
        if (!aap) {
          try {
            const response = await fetch("aap.html");
            const html = await response.text();

            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = html;

            const aapContent = tempDiv.querySelector("#aap-section");
            if (aapContent) {
              aapContent.classList.add("hidden");
              document.body.appendChild(aapContent);

              //Load JS for AAP
              const script = document.createElement("script");
              script.src = "aap.js";
              document.body.appendChild(script);
            }
          } catch (err) {
            console.error("Error loading AAP section:", err);
          }
        }
        const aapUpdated = document.querySelector("#aap-section");
        if (aapUpdated) aapUpdated.classList.remove("hidden");

      } else if (currentStep === 4) {
        // Show personal section
        if (!personal) {
          try {
            const response = await fetch("personal.html");
            const html = await response.text();

            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = html;

            const personalContent = tempDiv.querySelector("#personal-section");
            if (personalContent) {
              personalContent.classList.add("hidden");
              document.body.appendChild(personalContent);

              //Load JS for Personal
              const script = document.createElement("script");
              script.src = "personal.js";
              document.body.appendChild(script);
            }
          } catch (err) {
            console.error("Error loading AAP section:", err);
          }
        }
        const personalUpdated = document.querySelector("#personal-section");
        if (personalUpdated) personalUpdated.classList.remove("hidden");
      }
    }
  }


  /*
  async function updateSectionVisibility() {
    if (currentStep === 0) {
      welcomeSection.style.display = "flex";
      const readFirst = document.querySelector("#read-first-section");
      if (readFirst) readFirst.remove();
    } else if (currentStep === 1) {
      welcomeSection.style.display = "none";

      // Check if already loaded
      if (!document.querySelector("#read-first-section")) {
        try {
          const response = await fetch("readfirst.html");
          const html = await response.text();

          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = html;

          const readFirstContent = tempDiv.querySelector("#read-first-section");
          document.body.appendChild(readFirstContent);

          // Load readfirst.js dynamically
          const script = document.createElement("script");
          script.src = "readfirst.js";
          document.body.appendChild(script);
        } catch (err) {
          console.error("Error loading Read First section:", err);
        }
      }
    } else if (currentStep === 2) {
      welcomeSection.style.display = "none";

      const readFirst = document.querySelector("#read-first-section");
      if (readFirst) readFirst.remove();

      // If confirmation not already loaded
      if (!document.querySelector("#confirmation-section")) {
        try {
          const response = await fetch("confirmation.html");
          const html = await response.text();

          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = html;
          const confirmationContent = tempDiv.querySelector("#confirmation-section");
          document.body.appendChild(confirmationContent);

          // Load confirmation.js dynamically
          const script = document.createElement("script");
          script.src = "confirmation.js";
          document.body.appendChild(script);
        } catch (err) {
          console.error("Error loading Confirmation section:", err);
        }
      }
    }
  }
  */

  updateSteps();
  updateSectionVisibility();
});
