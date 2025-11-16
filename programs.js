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
};

// ====== Get current page ======
const currentPage = window.location.pathname.split("/").pop();

// ====== Load progress safely ======
let savedStep = parseInt(localStorage.getItem("currentStep"));
let currentStep = pageToStep[currentPage] !== undefined ? pageToStep[currentPage] : (savedStep || 5);

let storedMax = parseInt(localStorage.getItem("maxUnlockedStep"));
let maxUnlockedStep = (storedMax !== null && !isNaN(storedMax)) ? storedMax : currentStep;

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
        step.style.opacity = "1"; // locked steps look dim
      }
    });

    localStorage.setItem("currentStep", currentStep);
    localStorage.setItem("maxUnlockedStep", maxUnlockedStep);
  }

  // ====== Save form fields (example for programs page) ======
  const programSelect = document.querySelector("#programSelect"); // your select input
  if (programSelect) {
    // Load saved value
    const savedProgram = localStorage.getItem("programSelectValue");
    if (savedProgram) programSelect.value = savedProgram;

    // Save on change
    programSelect.addEventListener("change", () => {
      localStorage.setItem("programSelectValue", programSelect.value);
    });
  }

  // ====== Step click navigation ======
  steps.forEach((step, index) => {
    step.addEventListener("click", () => {
      if (index > maxUnlockedStep) return; // block locked steps

      currentStep = index;

      // Optional: auto-unlock next step
      if (currentStep === maxUnlockedStep && maxUnlockedStep < steps.length - 1) {
        maxUnlockedStep++;
      }

      updateSteps();

      if (typeof showSection === "function") showSection(currentStep);

      switch (index) {
        case 0: window.location.href = "index.html"; break;
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

// Mapping programs to their available campuses
document.addEventListener("DOMContentLoaded", () => {
  // canonical campus list
  const allCampuses = [
    "Alangilan","Pablo Borbon","Malvar","Nasugbu","Lipa","San Juan","Aboitiz Lima","Lobo","Lemery","Rosario","Balayan","Mabini"
  ];

  // your mapping (keeps your existing entries)
  const programCampuses = {
    "BS Agriculture - Animal Science": ["Lobo"],
    "BS Agriculture - Crop Science": ["Lobo"],
    "BS Forestry": ["Lobo"],
    "BS Architecture": ["Alangilan"],
    "BS Criminology": ["Pablo Borbon","Malvar","Nasugbu"],
    "BS Aerospace Engineering": ["Aboitiz Lima"],
    "BS Automotive Engineering": ["Aboitiz Lima"],
    "BS Biomedical Engineering": ["Aboitiz Lima"],
    "BS Ceramics Engineering": ["Alangilan"],
    "BS Chemical Engineering": ["Alangilan"],
    "BS Civil Engineering": ["Alangilan"],
    "BS Computer Engineering": ["Alangilan"],
    "BS Electrical Engineering": ["Alangilan"],
    "BS Electronics Engineering": ["Alangilan"],
    "BS Food Engineering": ["Aboitiz Lima"],
    "BS Geodetic Engineering": ["Alangilan"],
    "BS Geological Engineering": ["Alangilan"],
    "BS Industrial Engineering": ["Alangilan"],
    "BS Instrumentation and Control Engineering": ["Aboitiz Lima"],
    "BS Mechanical Engineering": ["Alangilan"],
    "BS Mechatronics Engineering": ["Aboitiz Lima"],
    "BS Metallurgical Engineering": ["Alangilan"],
    "BS Naval Architecture and Marine Engineering": ["Alangilan"],
    "BS Sanitary Engineering": ["Alangilan"],
    "Bachelor of Automotive Engineering Technology": ["Alangilan","Malvar","Balayan"],
    "Bachelor of Civil Engineering Technology": ["Alangilan","Malvar","Balayan"],
    "Bachelor of Computer Engineering Technology": ["Malvar","Lipa","Balayan","Aboitiz Lima"],
    "Bachelor of Drafting Engineering Technology": ["Alangilan","Malvar","Balayan"],
    "Bachelor of Electrical Engineering Technology": ["Malvar","Lipa","Balayan","Aboitiz Lima"],
    "Bachelor of Electronics Engineering Technology": ["Malvar","Lipa","Balayan","Aboitiz Lima"],
    "Bachelor of Food Engineering Technology": ["Alangilan","Malvar"],
    "Bachelor of Instrumentation and Control Engineering Technology": ["Alangilan","Lipa","Balayan"],
    "Bachelor of Mechanical Engineering Technology": ["Alangilan","Malvar","Balayan"],
    "Bachelor of Mechatronics Engineering Technology": ["Alangilan","Malvar"],
    "Bachelor of Welding and Fabrication Engineering Technology": ["Alangilan"],
    "BS Computer Science": ["Alangilan"],
    "BS Information Technology": ["Alangilan","Malvar","Nasugbu","Lipa","Balayan","Mabini"],
    "BS Nursing": ["Pablo Borbon","Nasugbu"],
    "BS Public Health - Disaster Response": ["Pablo Borbon"],
    "Bachelor of Early Childhood Education": ["Pablo Borbon"],
    "Bachelor of Elementary Education": ["Pablo Borbon","Malvar","Nasugbu","Rosario"],
    "Bachelor of Physical Education": ["Pablo Borbon","Malvar","Nasugbu","Lipa","San Juan","Rosario"],
    "Bachelor of Secondary Education - English": ["Pablo Borbon","Malvar","Nasugbu","Lipa","San Juan","Rosario"],
    "Bachelor of Secondary Education - Filipino": ["Pablo Borbon","Malvar","Nasugbu","San Juan"],
    "Bachelor of Secondary Education - Mathematics": ["Pablo Borbon","Malvar","Nasugbu","Lipa","Rosario"],
    "Bachelor of Secondary Education - Sciences": ["Pablo Borbon","Malvar","Nasugbu","Lipa"],
    "Bachelor of Secondary Education - Social Studies": ["Pablo Borbon","Malvar","Nasugbu","Lemery"],
    "Bachelor of Technical-Vocational Teacher Education - Electronics Technology": ["Lemery"],
    "Bachelor of Technical-Vocational Teacher Education - Garments, Fashion and Design": ["Lemery"],
    "Bachelor of Technology and Livelihood Education - Home Economics": ["Pablo Borbon","San Juan","Rosario"]
  };

  // helper: normalize keys case-insensitive
  function lookupCampusesByKey(key) {
    if (!key) return null;
    if (programCampuses[key]) return programCampuses[key];
    const found = Object.keys(programCampuses).find(k => k.toLowerCase() === key.toLowerCase());
    return found ? programCampuses[found] : null;
  }

  // helper: populate a campus <select> element (replaces all options)
  function populateCampusSelect(campusSelect, campuses) {
    if (!campusSelect) return;
    campusSelect.innerHTML = ""; // wipe
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.disabled = true;
    placeholder.selected = true;
    placeholder.textContent = "Select Campus";
    campusSelect.appendChild(placeholder);

    campuses.forEach(c => {
      const opt = document.createElement("option");
      opt.value = c;       // keep values consistent with mapping
      opt.textContent = c; // visible text
      campusSelect.appendChild(opt);
    });

    if (campuses.length === 1) campusSelect.value = campuses[0]; // auto-select single option
  }

  // find every row (.choice) and wire its inner selects
  const rows = document.querySelectorAll(".choice");
  if (!rows.length) {
    console.warn("[mapping] no .choice elements found.");
    return;
  }

  rows.forEach((row, index) => {
    const programSelect = row.querySelector(".choice-select select");
    const campusSelect  = row.querySelector(".campus-select select");

    if (!programSelect || !campusSelect) {
      console.warn("[mapping] row", index + 1, "missing program or campus select");
      return;
    }

    // initialize campus select with full list (use mapping keys' casing if you want)
    populateCampusSelect(campusSelect, allCampuses);

    // when program changes update the campus select for that row only
    programSelect.addEventListener("change", () => {
      const opt = programSelect.options[programSelect.selectedIndex];
      const key = (opt && opt.value && opt.value.trim() !== "") ? opt.value.trim() : (opt ? opt.text.trim() : "");
      const matched = lookupCampusesByKey(key) ?? allCampuses;
      populateCampusSelect(campusSelect, matched);
    });

    // if there's a preselected program (editing); apply mapping once now
    if (programSelect.selectedIndex > 0) {
      programSelect.dispatchEvent(new Event("change", { bubbles: true }));
    }
  });
});

// Next button
const nextBtn = document.getElementById('nextBtn');
const formFields = document.querySelectorAll('.choice-select select');
const errorNotif = document.getElementById('error-notif');

nextBtn.addEventListener('click', (e) => {
  let allFilled = true;

  formFields.forEach(field => {
    const row = field.closest(".choice"); // get full table row

    if (!field.value) {
      allFilled = false;

      field.classList.add('error');        // highlight select
      row.classList.add('row-error');      // highlight whole row
    } else {
      field.classList.remove('error');
      row.classList.remove('row-error');
    }
  });

  if (!allFilled) {
    e.preventDefault();
    showError();
  } else {
    window.location.href = 'form.html';
  }
});

// ===== REMOVE HIGHLIGHT WHEN USER FIXES ANSWER =====
formFields.forEach(field => {
  field.addEventListener('change', () => {
    const row = field.closest('.choice');

    if (field.value) {
      field.classList.remove('error');
      if (row) row.classList.remove('row-error');
    }
  });
});

function showError() {
  errorNotif.style.display = 'block';
  setTimeout(() => {
    errorNotif.style.opacity = 1; // fade in
  }, 10);

  // Fade out after 3 seconds
  setTimeout(() => {
    errorNotif.style.opacity = 0;
    // hide completely after fade out
    setTimeout(() => {
      errorNotif.style.display = 'none';
    }, 500);
  }, 3000);
}