const downloads = [
  'assets/grades_form_1.pdf',
  'assets/grades_form_2.pdf'
];

document.querySelectorAll('.grade-card').forEach((card, index) => {
  card.addEventListener('click', () => {
    const link = document.createElement('a');
    link.href = downloads[index];
    link.download = downloads[index].split('/').pop();
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
      step.classList.toggle("active", index === currentStep);

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

    localStorage.setItem("currentStep", currentStep);
    localStorage.setItem("maxUnlockedStep", maxUnlockedStep);
  }

  // ====== Step click navigation ======
  steps.forEach((step, index) => {
    step.addEventListener("click", () => {
      if (index > maxUnlockedStep) return;

      currentStep = index;
      updateSteps();

      if (typeof showSection === "function") showSection(currentStep);

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
      }
    });
  });

  updateSteps();
});

// =====================================================
// FILE STORAGE - Now with localStorage persistence
// =====================================================
let uploadedFiles = {
  1: null,
  2: null,
  3: null,
  4: null,
  5: null
};

// Load saved file metadata from localStorage on page load
function loadSavedFiles() {
  const savedFiles = localStorage.getItem("uploadedFiles");
  if (savedFiles) {
    try {
      const parsed = JSON.parse(savedFiles);
      // Restore file metadata (name, type, size) but not the actual File object
      Object.keys(parsed).forEach(key => {
        if (parsed[key]) {
          uploadedFiles[key] = parsed[key];
          // Update the UI to show the file is uploaded
          const status = document.getElementById(`status${key}`);
          if (status) {
            status.innerHTML = `
              <i class="fa-solid fa-circle-check" style="color:#28a745;"></i>
              ${escapeHtml(parsed[key].fileName)}
            `;
          }
          // Remove error state
          const input = document.getElementById(`file${key}`);
          if (input) {
            const uploadBox = input.closest(".upload-controls");
            if (uploadBox) uploadBox.classList.remove("input-error");
          }
        }
      });
      updateFileList();
    } catch (e) {
      console.error("Error loading saved files:", e);
    }
  }
}

// Save file metadata to localStorage
function saveFilesToStorage() {
  const filesToSave = {};
  Object.keys(uploadedFiles).forEach(key => {
    if (uploadedFiles[key]) {
      const { file, type } = uploadedFiles[key];
      filesToSave[key] = {
        fileName: file.name,
        fileSize: file.size,
        type: type
      };
    }
  });
  localStorage.setItem("uploadedFiles", JSON.stringify(filesToSave));
}

// =====================================================
// HANDLE FILE UPLOAD
// =====================================================
function handleFileUpload(num, label) {
  const input = document.getElementById(`file${num}`);
  const status = document.getElementById(`status${num}`);
  const file = input && input.files ? input.files[0] : null;

  if (file) {
    const type = label || (input && input.dataset && input.dataset.type) || "Required";
    uploadedFiles[num] = { file, type };

    if (status) {
      status.innerHTML = `
        <i class="fa-solid fa-circle-check" style="color:#28a745;"></i>
        ${escapeHtml(file.name)}
      `;
    }

    const uploadBox = input ? input.closest(".upload-controls") : null;
    if (uploadBox) uploadBox.classList.remove("input-error");

    if (uploadBox) {
      const requiredInside = uploadBox.querySelectorAll(".form-input.input-error");
      requiredInside.forEach(el => el.classList.remove("input-error"));
    }

    updateFileList();
    saveFilesToStorage(); // Save to localStorage
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
    
    // Handle both old File objects and saved metadata
    const fileName = slot.file ? slot.file.name : slot.fileName;
    const fileSize = slot.file ? slot.file.size : slot.fileSize;
    const type = slot.type;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${escapeHtml(key)}</td>
      <td>${escapeHtml(type)}</td>
      <td>${escapeHtml(fileName)}</td>
      <td>${(fileSize / 1024).toFixed(1)} KB</td>
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
// NOTIFICATION
// =====================================================
function showNotification(message) {
  let noti = document.getElementById("notification");
  let notiText;

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

    noti.style.background = "#ffe3e3";
    noti.style.color = "#c20000";

    notiText = document.createElement("div");
    notiText.id = "notification-text";

    noti.appendChild(notiText);
    document.body.appendChild(noti);
  } else {
    notiText = document.getElementById("notification-text");
  }

  notiText.innerText = message;
  noti.style.background = "#ffe3e3";
  noti.style.border = "1px solid #ff9b9b";
  noti.style.color = "#c20000";
  noti.style.display = "flex";

  if (noti._hideTimeout) clearTimeout(noti._hideTimeout);

  noti._hideTimeout = setTimeout(() => {
    noti.style.display = "none";
  }, 4000);
}

// =====================================================
// REMOVE FILE
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

    if (input) {
      const uploadBox = input.closest(".upload-controls");
      if (uploadBox) uploadBox.classList.add("input-error");
    }

    updateFileList();
    saveFilesToStorage(); // Save to localStorage
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
    doRemove();
  }
};

// ===============================
// SAVE/RESTORE INPUTS & TABLES
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  // Load saved files first
  loadSavedFiles();
  
  const allFields = document.querySelectorAll("input, select, textarea");

  allFields.forEach(field => {
    const key = `autosave_${field.id || field.name}`;
    const saved = localStorage.getItem(key);

    if (saved !== null) {
      if (field.type === "checkbox") field.checked = saved === "true";
      else if (field.type === "radio") field.checked = field.value === saved;
      else if (field.type !== "file") field.value = saved; // Don't restore file inputs
    }

    const saveField = () => {
      if (field.type === "checkbox") localStorage.setItem(key, field.checked);
      else if (field.type === "radio") { if (field.checked) localStorage.setItem(key, field.value); }
      else if (field.type !== "file") localStorage.setItem(key, field.value); // Don't save file inputs
    };
    field.addEventListener("input", saveField);
    field.addEventListener("change", saveField);
  });

  const tableInputs = document.querySelectorAll('.grades-table input[type="number"], .grades-table2 input[type="number"], .grades-table2 select');

  tableInputs.forEach(input => {
    const key = `autosave_${input.id || input.name}`;
    const saved = localStorage.getItem(key);
    if (saved !== null) input.value = saved;

    const saveTableInput = () => { localStorage.setItem(key, input.value); };
    input.addEventListener("input", saveTableInput);
    input.addEventListener("change", saveTableInput);
  });
});

// ===============================
// AUTO-UNLOCK NEXT STEP
// ===============================
const thisStep = pageToStep[currentPage];
let maxStep = parseInt(localStorage.getItem("maxUnlockedStep")) || 0;
if (thisStep > maxStep) localStorage.setItem("maxUnlockedStep", thisStep);

// ===============================
// ENABLE CLICKING PREVIOUS STEPS
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".step").forEach((step, index) => {
    step.addEventListener("click", () => {
      const maxUnlocked = parseInt(localStorage.getItem("maxUnlockedStep")) || 0;
      if (index <= maxUnlocked) {
        const page = Object.keys(pageToStep).find(p => pageToStep[p] === index);
        if (page) window.location.href = page;
      }
    });
  });
});

// ===============================
// FORM VALIDATION & NEXT BUTTON
// ===============================
(function setupNextButton() {
  const nextBtn = document.querySelector(".next-btn");
  if (!nextBtn) return;

  nextBtn.addEventListener("click", function (e) {
    e.preventDefault();

    const requiredInputs = document.querySelectorAll(".form-input[required]");
    let isValid = true;

    document.querySelectorAll(".input-error").forEach(el => el.classList.remove("input-error"));

    requiredInputs.forEach(input => {
      if (!input.value || !input.value.trim()) {
        input.classList.add("input-error");
        isValid = false;
      }
    });

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

    const gradeInputsJHS = document.querySelectorAll('.grades-table input[type="number"]');
    let hasEmptyGrades = false;
    gradeInputsJHS.forEach(input => {
      if (!input.value || input.value.trim() === "" || input.value === "0") {
        input.classList.add("input-error");
        hasEmptyGrades = true;
        isValid = false;
      }
    });
    
    if (hasEmptyGrades) {
      const content1Box = document.querySelector('.content1');
      if (content1Box) content1Box.classList.add("input-error");
    }

    const gradeInputsSHS = document.querySelectorAll('.grades-table2 input[type="number"]');
    const gradeSelects = document.querySelectorAll('.grades-table2 select');
    let hasEmptySHSGrades = false;

    gradeInputsSHS.forEach(input => {
      const row = input.closest('tr');
      const naCheckbox = row ? row.querySelector('input[type="checkbox"]') : null;
      if (naCheckbox && naCheckbox.checked) return;

      if (!input.value || input.value.trim() === "" || input.value === "0") {
        input.classList.add("input-error");
        hasEmptySHSGrades = true;
        isValid = false;
      }
    });

    if (hasEmptySHSGrades) {
      const content2Boxes = document.querySelectorAll('.content2');
      content2Boxes.forEach(box => {
        if (box.querySelector('.grades-table2')) box.classList.add("input-error");
      });
    }

    if (!isValid) {
      Object.keys(uploadedFiles).forEach(key => {
        if (!uploadedFiles[key]) {
          const st = document.getElementById(`status${key}`);
          if (st) st.innerHTML = `<i class="fa-solid fa-circle-xmark" style="color:#dc3545;"></i> Missing file`;
        }
      });

      showNotification("Please fill out all required fields, complete all grades, and upload all attachments!", "error");
      return;
    }

    window.location.href = "programs.html";
  });
})();

updateFileList();