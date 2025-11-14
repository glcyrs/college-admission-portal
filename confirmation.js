console.log("✅ confirmation.js loaded successfully");

// Wait until the "Next" button actually exists (because the section is dynamically injected)
const confirmNextBtn = setInterval(() => {
  const nextBtn = document.querySelector("#confirmation-section .next-btn");

  if (nextBtn) {
    console.log("✅ .next-btn found in Confirmation section, attaching click event");

    nextBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      console.log("➡️ Confirmation Next button clicked — dispatching gotoStep(3)");

      // Dispatch an event that the main script.js can catch
      document.dispatchEvent(
        new CustomEvent("gotoStep", { detail: { step: 3 } })
      );
    });

    clearInterval(confirmNextBtn);
  }
}, 300);



document.addEventListener("DOMContentLoaded", function() {

  const nextBtn = document.querySelector(".next-btn");
  nextBtn.addEventListener("click", function (e) {
    e.preventDefault();

    let isValid = true;

    // Remove previous error highlights
    document.querySelectorAll(".input-error").forEach(el => el.classList.remove("input-error"));

    // Validate radio groups
    const radioGroups = ["seniorhigh", "enrolled", "firsttime", "transfer", "graduate"];
    radioGroups.forEach(name => {
      const radios = document.getElementsByName(name);
      if (![...radios].some(r => r.checked)) {
        radios.forEach(r => r.classList.add("input-error")); // highlight
        isValid = false;
      }
    });

    // Validate text fields if "transfer" is yes
    const transferYes = document.querySelector('input[name="transfer"][value="yes"]');
    if (transferYes && transferYes.checked) {
      const prevSchool = document.querySelector('input[placeholder="Enter previous school"]');
      const year = document.querySelector('input[placeholder="Enter year"]');
      if (!prevSchool.value.trim()) {
        prevSchool.classList.add("input-error");
        isValid = false;
      }
      if (!year.value.trim()) {
        year.classList.add("input-error");
        isValid = false;
      }
    }

    // Validate dropdown if graduate yes
    const graduateYes = document.querySelector('input[name="graduate"][value="yes"]');
    const dropdown = document.querySelector(".dropdown");
    if (graduateYes && graduateYes.checked) {
      if (!dropdown.value || dropdown.value === "N/A") {
        dropdown.classList.add("input-error");
        isValid = false;
      }
    }

    // Show notification
    if (!isValid) {
      showNotification("⚠️ Please fill out all required fields!", "error");
    } else {
      showNotification("All required information is complete! Proceeding...", "success");
      // window.location.href = "nextpage.html";
    }
  });

  // ======= NOTIFICATION FUNCTIONS =======
  function showNotification(message, type = "error") {
    const notification = document.getElementById("notification");
    const text = document.getElementById("notification-text");
    text.textContent = message;

    notification.classList.remove("success", "error");
    notification.classList.add(type);

    notification.style.display = "block";

    setTimeout(() => hideNotification(), 4000);
  }

  function hideNotification() {
    document.getElementById("notification").style.display = "none";
  }

});
