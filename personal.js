// ====== js working button personal ======


// ====== Step click navigation ======
const steps = document.querySelectorAll(".step");
let currentStep = parseInt(localStorage.getItem("currentStep")) || 0;
let maxUnlockedStep = parseInt(localStorage.getItem("maxUnlockedStep")) || 0;

function updateSteps() {
  steps.forEach((step, index) => {
    step.classList.toggle("active", index === currentStep);
    step.classList.toggle("completed", index < currentStep);
    step.classList.toggle("locked", index > maxUnlockedStep);
  });
}

steps.forEach((step, index) => {
  step.addEventListener("click", () => {
    if (index > maxUnlockedStep) return;

    // ====== VALIDATION ======
    if (!canProceed(index)) {
      highlightMissingFields(index);
      alert("Please fill out all required fields before proceeding.");
      return;
    }

    currentStep = index;

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

// ====== NEXT BUTTON FUNCTIONALITY ======
const nextBtn = document.querySelector(".next-btn");

if (nextBtn) {
  nextBtn.addEventListener("click", () => {
    // ====== VALIDATION ======
    if (!canProceed(currentStep)) {
      highlightMissingFields(currentStep);
      alert("Please fill out all required fields before proceeding.");
      return;
    }

    // Move to next step
    if (currentStep < steps.length - 1) {
      currentStep++;
      if (currentStep > maxUnlockedStep) maxUnlockedStep = currentStep;

      updateSteps();
      if (typeof showSection === "function") showSection(currentStep);

      // Navigate to page if applicable
      switch (currentStep) {
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
    }

    // Save progress
    localStorage.setItem("currentStep", currentStep);
    localStorage.setItem("maxUnlockedStep", maxUnlockedStep);
  });
}


// ====== REQUIRED FIELDS CHECK ======
function canProceed(stepIndex) {
  switch(stepIndex) {
    case 0: // Personal Info
      const firstName = document.getElementById("firstName")?.value.trim();
      const lastName = document.getElementById("lastName")?.value.trim();
      const photo = document.getElementById("photoInput")?.files[0];
      return firstName && lastName && photo;

    case 1: // Address
      const region = document.getElementById("region")?.value;
      const province = document.getElementById("province")?.value;
      const city = document.getElementById("city")?.value;
      const barangay = document.getElementById("barangay")?.value;
      return region && province && city && barangay;

    case 2: // Siblings
      const hasSiblingsYes = document.getElementById("hasSiblingsYes")?.checked;
      if (hasSiblingsYes) {
        const summaryTable = document.querySelector(".siblings-summary-table");
        return summaryTable.rows.length > 1; // at least 1 sibling added
      }
      return true;

    default:
      return true;
  }
}

// ====== HIGHLIGHT EMPTY FIELDS ======
function highlightMissingFields(stepIndex) {
  // Remove previous highlights
  document.querySelectorAll('.required-highlight').forEach(el => el.classList.remove('required-highlight'));

  switch(stepIndex) {
    case 0:
      const firstName = document.getElementById("firstName");
      const lastName = document.getElementById("lastName");
      const photoInput = document.getElementById("photoInput");

      if (!firstName.value.trim()) firstName.classList.add('required-highlight');
      if (!lastName.value.trim()) lastName.classList.add('required-highlight');
      if (!photoInput.files[0]) photoInput.classList.add('required-highlight');
      break;

    case 1:
      const fields = ["region", "province", "city", "barangay"];
      fields.forEach(id => {
        const el = document.getElementById(id);
        if (!el.value) el.classList.add('required-highlight');
      });
      break;

    case 2:
      const hasSiblingsYes = document.getElementById("hasSiblingsYes")?.checked;
      if (hasSiblingsYes) {
        const summaryTable = document.querySelector(".siblings-summary-table");
        if (summaryTable.rows.length <= 1) summaryTable.classList.add('required-highlight');
      }
      break;
  }
}

// ====== Info popups ======
document.addEventListener('DOMContentLoaded', () => {
  const infoButtons = document.querySelectorAll('.info-btn');
  infoButtons.forEach(button => {
    button.addEventListener('click', () => {
      const popup = button.closest('.idp-section').querySelector('.idp-popup');
      popup.classList.add('show');
    });
  });

  const closeButtons = document.querySelectorAll('.popup-close-btn');
  closeButtons.forEach(closeBtn => {
    closeBtn.addEventListener('click', (e) => {
      const popup = e.target.closest('.idp-popup');
      popup.classList.remove('show');
    });
  });
});

// ====== Photo Upload ======
function handlePhotoUpload() {
  const fileInput = document.getElementById("photoInput");
  const statusText = document.getElementById("photoStatus");
  const photoPreview = document.getElementById("photoPreview");
  const errorMsg = document.querySelector(".photo-error");
  const file = fileInput.files[0];

  if (!file) {
    errorMsg.style.display = "block";
    statusText.textContent = "No file chosen";
    photoPreview.style.backgroundImage = "none";
    return;
  }

  if (!file.type.startsWith("image/")) {
    errorMsg.style.display = "block";
    statusText.textContent = "Invalid file type";
    photoPreview.style.backgroundImage = "none";
    return;
  }

  errorMsg.style.display = "none";
  statusText.textContent = file.name;

  const reader = new FileReader();
  reader.onload = function (e) {
    photoPreview.style.backgroundImage = `url('${e.target.result}')`;
  };
  reader.readAsDataURL(file);
}

// ====== Siblings Table ======
function addSiblingToSummary() {
  const inputTable = document.getElementById('siblingsTable');
  const summaryTable = document.querySelector('.siblings-summary-table');
  const inputRow = inputTable.rows[1];

  const fullname = inputRow.cells[0].innerText.trim();
  const age = inputRow.cells[1].innerText.trim();
  const education = inputRow.cells[2].querySelector('select').value;
  const school = inputRow.cells[3].innerText.trim();
  const yearGraduated = inputRow.cells[4].innerText.trim();

  if (!fullname && !age && !education && !school && !yearGraduated) return;

  const noSiblingsRow = summaryTable.querySelector('.no-siblings-text');
  if (noSiblingsRow) noSiblingsRow.parentNode.remove();

  const nextNumber = summaryTable.rows.length;
  const newRow = summaryTable.insertRow(-1);
  newRow.innerHTML = `
    <td>${nextNumber}</td>
    <td>${fullname}</td>
    <td>${age}</td>
    <td>${education}</td>
    <td>${school}</td>
    <td>${yearGraduated}</td>
    <td><button type="button" class="remove-summary-btn" onclick="removeSummaryRow(this)">X</button></td>
  `;

  inputRow.cells[0].innerText = '';
  inputRow.cells[1].innerText = '';
  inputRow.cells[2].querySelector('select').value = '';
  inputRow.cells[3].innerText = '';
  inputRow.cells[4].innerText = '';
}

function removeSummaryRow(button) {
  const row = button.parentNode.parentNode;
  const summaryTable = document.querySelector('.siblings-summary-table');
  row.parentNode.removeChild(row);

  for (let i = 1; i < summaryTable.rows.length; i++) {
    summaryTable.rows[i].cells[0].innerText = i;
  }

  if (summaryTable.rows.length === 1) {
    const noRow = summaryTable.insertRow(-1);
    const cell = noRow.insertCell(0);
    cell.colSpan = 7;
    cell.className = 'no-siblings-text';
    cell.innerText = '**No siblings**';
  }
}

// Show/hide sibling section
document.getElementById("hasSiblingsYes").addEventListener("change", function () {
  document.getElementById("addSiblingHeader").style.display = "block";
  document.getElementById("addSiblingBox").style.display = "block";
  document.getElementById("summaryHeader").style.display = "block";
  document.getElementById("summaryBox").style.display = "block";
});

document.getElementById("hasSiblingsNo").addEventListener("change", function () {
  document.getElementById("addSiblingHeader").style.display = "none";
  document.getElementById("addSiblingBox").style.display = "none";
  document.getElementById("summaryHeader").style.display = "block";
  document.getElementById("summaryBox").style.display = "block";
});

// ====== Philippines Address Dropdowns ======
(() => {
  let data;

  fetch('ph_address.json')
    .then(res => res.json())
    .then(jsonData => {
      data = jsonData;
      populateRegions();
    })
    .catch(err => console.error('Failed to load JSON', err));

  const regionSelect = document.getElementById("region");
  const provinceSelect = document.getElementById("province");
  const citySelect = document.getElementById("city");
  const barangaySelect = document.getElementById("barangay");

  function populateRegions() {
    regionSelect.innerHTML = '<option value="">Select Region</option>';
    Object.values(data).forEach(region => {
      let option = document.createElement("option");
      option.value = region.region_name;
      option.text = region.region_name;
      regionSelect.add(option);
    });
  }

  regionSelect.addEventListener('change', () => {
    populateProvinces();
    citySelect.innerHTML = '<option value="">Select City/Municipality</option>';
    barangaySelect.innerHTML = '<option value="">Select Barangay</option>';
  });

  provinceSelect.addEventListener('change', () => {
    populateCities();
    barangaySelect.innerHTML = '<option value="">Select Barangay</option>';
  });

  citySelect.addEventListener('change', () => {
    populateBarangays();
  });

  function getSelectedRegionObj() {
    return Object.values(data).find(r => r.region_name === regionSelect.value);
  }

  function populateProvinces() {
    provinceSelect.innerHTML = '<option value="">Select Province</option>';
    let selectedRegion = getSelectedRegionObj();
    if (!selectedRegion) return;

    Object.keys(selectedRegion.province_list).forEach(provName => {
      let option = document.createElement("option");
      option.value = provName;
      option.text = provName;
      provinceSelect.add(option);
    });
  }

  function populateCities() {
    citySelect.innerHTML = '<option value="">Select City/Municipality</option>';
    let selectedRegion = getSelectedRegionObj();
    if (!selectedRegion) return;
    let provinceObj = selectedRegion.province_list[provinceSelect.value];
    if (!provinceObj) return;

    provinceObj.municipality_list.forEach(muni => {
      let cityName = Object.keys(muni)[0];
      let option = document.createElement("option");
      option.value = cityName;
      option.text = cityName;
      citySelect.add(option);
    });
  }

  function populateBarangays() {
    barangaySelect.innerHTML = '<option value="">Select Barangay</option>';
    let selectedRegion = getSelectedRegionObj();
    if (!selectedRegion) return;
    let provinceObj = selectedRegion.province_list[provinceSelect.value];
    if (!provinceObj) return;

    let muniObj = provinceObj.municipality_list.find(m => Object.keys(m)[0] === citySelect.value);
    if (!muniObj) return;

    let barangays = muniObj[citySelect.value].barangay_list;
    if (!barangays) return;

    barangays.forEach(brgy => {
      let option = document.createElement("option");
      option.value = brgy;
      option.text = brgy;
      barangaySelect.add(option);
    });
  }
})();