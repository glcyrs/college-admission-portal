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

// ====== Map pages to step index ======
const pageToStep = {
  "index.html": 0,
  "readfirst.html": 1,
  "confirmation.html": 2,
  "aap.html": 3,
  "personal.html": 4,
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

// =====================================================
// FILE STORAGE (store file + type)
// =====================================================
let uploadedFiles = {
  1: null,
  2: null,
  3: null,
  4: null,
  5: null
};

// =====================================================
// HANDLE FILE UPLOAD
// - label param optional. If not passed, reads data-type from the input element.
// - removes red error highlights for that upload box when file is selected
// =====================================================
function handleFileUpload(num, label) {
  const input = document.getElementById(`file${num}`);
  const status = document.getElementById(`status${num}`);
  const file = input && input.files ? input.files[0] : null;

  if (file) {
    const type = label || (input && input.dataset && input.dataset.type) || "Required";
    uploadedFiles[num] = { file, type };

    // update status text
    if (status) {
      status.innerHTML = `
        <i class="fa-solid fa-circle-check" style="color:#28a745;"></i>
        ${escapeHtml(file.name)}
      `;
    }

    // Remove red highlight from upload box (if any)
    const uploadBox = input ? input.closest(".upload-controls") : null;
    if (uploadBox) uploadBox.classList.remove("input-error");

    // Also remove 'input-error' from any required text input inside the same upload-controls area
    if (uploadBox) {
      const requiredInside = uploadBox.querySelectorAll(".form-input.input-error");
      requiredInside.forEach(el => el.classList.remove("input-error"));
    }

    updateFileList();
  }
}

// =====================================================
// UPDATE FILE LIST TABLE
// =====================================================
function updateFileList() {
  const tableBody = document.getElementById("fileTableBody");
  if (!tableBody) return;
  tableBody.innerHTML = "";

  let noFiles = true;

  Object.keys(uploadedFiles).forEach(key => {
    const slot = uploadedFiles[key];
    if (!slot) return;

    noFiles = false;
    const { file, type } = slot;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${escapeHtml(key)}</td>
      <td>${escapeHtml(type)}</td>
      <td>${escapeHtml(file.name)}</td>
      <td>${(file.size / 1024).toFixed(1)} KB</td>
      <td style="text-align:center;">
        <i class="fa-solid fa-circle-check" style="color:#28a745;"></i>
      </td>
    `;
    tableBody.appendChild(row);
  });

  if (noFiles) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="5">
          <div class="empty-state">
            <div class="empty-icon">🔍</div>
            <div class="empty-text">No Attached files</div>
          </div>
        </td>
      </tr>
    `;
  }
}

// small helper to avoid HTML injection in file names/types
function escapeHtml(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

// =====================================================
// NOTIFICATION/ALERT SYSTEM
// - showNotification(message, status, autoHideMs)
// - status: "error"|"success"|undefined
// =====================================================
function showNotification(message) {
  let noti = document.getElementById("notification");
  let notiText;

  // If notification container does not exist, create one
  if (!noti) {
    noti = document.createElement("div");
    noti.id = "notification";

    noti.style.position = "fixed";
    noti.style.right = "20px";
    noti.style.top = "20px";
    noti.style.zIndex = "9999";
    noti.style.display = "flex";
    noti.style.alignItems = "center";
    noti.style.padding = "12px 16px";
    noti.style.borderRadius = "8px";
    noti.style.boxShadow = "0 6px 18px rgba(0,0,0,0.1)";
    noti.style.fontSize = "15px";
    noti.style.fontWeight = "500";

    // RED ALERT STYLE
    noti.style.background = "#ffe3e3";
    noti.style.color = "#c20000";

    notiText = document.createElement("div");
    notiText.id = "notification-text";

    noti.appendChild(notiText); // NO CLOSE BUTTON ANYMORE
    document.body.appendChild(noti);
  } else {
    notiText = document.getElementById("notification-text");
  }

  // Set message
  notiText.innerText = message;

  // Ensure red styling even if the element is reused
  noti.style.background = "#ffe3e3";
  noti.style.border = "1px solid #ff9b9b";
  noti.style.color = "#c20000";

  // Show it
  noti.style.display = "flex";

  // Auto-hide after 4 seconds
  if (noti._hideTimeout) clearTimeout(noti._hideTimeout);

  noti._hideTimeout = setTimeout(() => {
    noti.style.display = "none";
  }, 4000);
}

// =====================================================
// REMOVE FILE (with confirm box fallback)
// - When removing, add red error highlight back to upload box
// =====================================================
window.removeFile = function (fileNumber) {
  const confirmBox = document.getElementById("confirmBox");
  const confirmYes = document.getElementById("confirmYes");
  const confirmNo = document.getElementById("confirmNo");

  const doRemove = () => {
    uploadedFiles[fileNumber] = null;
    const input = document.getElementById(`file${fileNumber}`);
    if (input) input.value = "";
    const status = document.getElementById(`status${fileNumber}`);
    if (status) status.textContent = "No file chosen";

    // add input-error class back to upload box to indicate missing
    if (input) {
      const uploadBox = input.closest(".upload-controls");
      if (uploadBox) uploadBox.classList.add("input-error");
    }

    updateFileList();
    showNotification("File removed. Please upload a file for this slot.", "error");
  };

  if (confirmBox && confirmYes && confirmNo) {
    confirmBox.style.display = "flex";
    confirmYes.onclick = () => {
      doRemove();
      confirmBox.style.display = "none";
    };
    confirmNo.onclick = () => confirmBox.style.display = "none";
  } else {
    // no confirm modal available -> remove immediately
    doRemove();
  }
};

// =====================================================
// FORM VALIDATION & NEXT BUTTON
// - Single consolidated next-button handler
// =====================================================
(function setupNextButton() {
  const nextBtn = document.querySelector(".next-btn");
  if (!nextBtn) return;

  nextBtn.addEventListener("click", function (e) {
    e.preventDefault();

    const requiredInputs = document.querySelectorAll(".form-input[required]");
    let isValid = true;

    // Remove previous error highlights
    document.querySelectorAll(".input-error").forEach(el => el.classList.remove("input-error"));

    // Check required inputs
    requiredInputs.forEach(input => {
      if (!input.value || !input.value.trim()) {
        input.classList.add("input-error");
        isValid = false;
      }
    });

    // Check file uploads (use uploadedFiles to reflect actual uploads)
    Object.keys(uploadedFiles).forEach(key => {
      if (!uploadedFiles[key]) {
        const fileInput = document.getElementById(`file${key}`);
        if (fileInput) {
          const uploadBox = fileInput.closest(".upload-controls");
          if (uploadBox) uploadBox.classList.add("input-error");
        }
        isValid = false;
      } else {
        const fileInput = document.getElementById(`file${key}`);
        if (fileInput) {
          const uploadBox = fileInput.closest(".upload-controls");
          if (uploadBox) uploadBox.classList.remove("input-error");
        }
      }
    });

    // Check grade table inputs (Junior High School)
    const gradeInputsJHS = document.querySelectorAll('.grades-table input[type="number"]');
    let hasEmptyGrades = false;
    gradeInputsJHS.forEach(input => {
      if (!input.value || input.value.trim() === "" || input.value === "0") {
        input.classList.add("input-error");
        hasEmptyGrades = true;
        isValid = false;
      }
    });
    
    // Highlight content1 container if JHS grades are empty
    if (hasEmptyGrades) {
      const content1Box = document.querySelector('.content1');
      if (content1Box) content1Box.classList.add("input-error");
    }

    // Check Senior High School grade inputs and selects
    const gradeInputsSHS = document.querySelectorAll('.grades-table2 input[type="number"]');
    const gradeSelects = document.querySelectorAll('.grades-table2 select');
    let hasEmptySHSGrades = false;

    gradeInputsSHS.forEach(input => {
      // Skip validation if the corresponding N/A checkbox is checked
      const row = input.closest('tr');
      const naCheckbox = row ? row.querySelector('input[type="checkbox"]') : null;
      
      if (naCheckbox && naCheckbox.checked) {
        return; // Skip this input if N/A is checked
      }
      
      if (!input.value || input.value.trim() === "" || input.value === "0") {
        input.classList.add("input-error");
        hasEmptySHSGrades = true;
        isValid = false;
      }
    });

    gradeSelects.forEach(select => {
      // Only validate selects that are visible/relevant
      const row = select.closest('tr');
      const naCheckbox = row ? row.querySelector('input[type="checkbox"]') : null;
      
      if (naCheckbox && naCheckbox.checked) {
        return; // Skip this select if N/A is checked
      }
      
      // Only flag as error if a select is used but empty
      if (select.value && select.value.trim() !== "") {
        // Select has a value, no error
      } else {
        // Check if alternative subject was needed but not selected
        // You can add more specific logic here if needed
      }
    });

    // Highlight content2 container if SHS grades are empty
    if (hasEmptySHSGrades) {
      const content2Boxes = document.querySelectorAll('.content2');
      content2Boxes.forEach(box => {
        // Only highlight the one with grades-table2
        if (box.querySelector('.grades-table2')) {
          box.classList.add("input-error");
        }
      });
    }

    if (!isValid) {
      // highlight missing statuses visually
      Object.keys(uploadedFiles).forEach(key => {
        if (!uploadedFiles[key]) {
          const st = document.getElementById(`status${key}`);
          if (st) {
            st.innerHTML = `
              <i class="fa-solid fa-circle-xmark" style="color:#dc3545;"></i> Missing file
            `;
          }
        }
      });

      showNotification("Please fill out all required fields, complete all grades, and upload all attachments!", "error");
      return;
    }

    // Proceed action (uncomment or change to your navigation)
    window.location.href = "programs.html";
  });
})();

// =====================================================
// Initialize: optionally call updateFileList to show initial state
// =====================================================
updateFileList();