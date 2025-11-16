/*

document.addEventListener('DOMContentLoaded', () => {
  const infoButtons = document.querySelectorAll('.info-btn');

  infoButtons.forEach(button => {
    button.addEventListener('click', () => {
      const popup = button.closest('.idp-section').querySelector('.idp-popup');
      popup.classList.add('show');
    });
  });

  // Close popup when clicking the close button
  const closeButtons = document.querySelectorAll('.popup-close-btn');
  closeButtons.forEach(closeBtn => {
    closeBtn.addEventListener('click', (e) => {
      const popup = e.target.closest('.idp-popup');
      popup.classList.remove('show');
    });
  });
});


function addSiblingToSummary() {
  const inputTable = document.getElementById('siblingsTable');
  const summaryTable = document.querySelector('.siblings-summary-table');
  const inputRow = inputTable.rows[1]; // only the single input row

  // Get values from input fields
  const fullname = inputRow.cells[0].innerText.trim();
  const age = inputRow.cells[1].innerText.trim();
  const education = inputRow.cells[2].querySelector('select').value;
  const school = inputRow.cells[3].innerText.trim();
  const yearGraduated = inputRow.cells[4].innerText.trim();

  // Don't add if all fields are empty
  if (!fullname && !age && !education && !school && !yearGraduated) return;

  // Remove "No siblings" row if exists
  const noSiblingsRow = summaryTable.querySelector('.no-siblings-text');
  if (noSiblingsRow) noSiblingsRow.parentNode.remove();

  // Determine next number
  const nextNumber = summaryTable.rows.length; // headers row = 1

  // Create new row in summary table
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

  // Clear input fields for next entry
  inputRow.cells[0].innerText = '';
  inputRow.cells[1].innerText = '';
  inputRow.cells[2].querySelector('select').value = '';
  inputRow.cells[3].innerText = '';
  inputRow.cells[4].innerText = '';
}

// Remove a row from summary table and renumber
function removeSummaryRow(button) {
  const row = button.parentNode.parentNode;
  const summaryTable = document.querySelector('.siblings-summary-table');
  row.parentNode.removeChild(row);

  // Renumber remaining rows
  for (let i = 1; i < summaryTable.rows.length; i++) {
    summaryTable.rows[i].cells[0].innerText = i;
  }

  // If no rows remain, show "No siblings"
  if (summaryTable.rows.length === 1) {
    const noRow = summaryTable.insertRow(-1);
    const cell = noRow.insertCell(0);
    cell.colSpan = 7;
    cell.className = 'no-siblings-text';
    cell.innerText = '**No siblings**';
  }
}

// photo upload
function handlePhotoUpload() {
    const fileInput = document.getElementById("photoInput");
    const statusText = document.getElementById("photoStatus");
    const photoPreview = document.getElementById("photoPreview");
    const errorMsg = document.querySelector(".photo-error");
    const file = fileInput.files[0];

    if (!file) {
        // No file → show error
        errorMsg.style.display = "block";
        statusText.textContent = "No file chosen";
        photoPreview.style.backgroundImage = "none";
        return;
    }

    // Validate if file is an image
    if (!file.type.startsWith("image/")) {
        errorMsg.style.display = "block";
        statusText.textContent = "Invalid file type";
        photoPreview.style.backgroundImage = "none";
        return;
    }

    // Hide error for valid image
    errorMsg.style.display = "none";

    // Update filename
    statusText.textContent = file.name;

    // Show preview
    const reader = new FileReader();
    reader.onload = function (e) {
        photoPreview.style.backgroundImage = `url('${e.target.result}')`;
    };
    reader.readAsDataURL(file);
}


// siblings
document.getElementById("hasSiblingsYes").addEventListener("change", function () {
    // YES → show both Add Sibling and Summary
    document.getElementById("addSiblingHeader").style.display = "block";
    document.getElementById("addSiblingBox").style.display = "block";

    document.getElementById("summaryHeader").style.display = "block";
    document.getElementById("summaryBox").style.display = "block";
});

document.getElementById("hasSiblingsNo").addEventListener("change", function () {
    // NO → show only Summary
    document.getElementById("addSiblingHeader").style.display = "none";
    document.getElementById("addSiblingBox").style.display = "none";

    document.getElementById("summaryHeader").style.display = "block";
    document.getElementById("summaryBox").style.display = "block";
});



//ph_address
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

    // province_list is an object
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

    // municipality_list is an array of objects, each with one key
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

    // Find the municipality object
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


//nationality
// === Load Nationality Dropdown ===
fetch("nationalities.json")
  .then(response => response.json())
  .then(list => {
    const nationalitySelect = document.getElementById("nationality");

    if (!nationalitySelect) {
      console.error("Nationality select not found!");
      return;
    }

    // Add all nationalities from JSON
    list.forEach(nationality => {
      const option = document.createElement("option");
      option.value = nationality;
      option.textContent = nationality;
      nationalitySelect.appendChild(option);
    });

    // Add "Other" option at the end
    const otherOption = document.createElement("option");
    otherOption.value = "Other";
    otherOption.textContent = "Other";
    nationalitySelect.appendChild(otherOption);
  })
  .catch(err => console.error("Failed to load nationality list:", err));


  */

// 2 

document.addEventListener('DOMContentLoaded', () => {
  // ================= POPUP INFO BUTTONS =================
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

  // ================= CLEAR INPUT ERRORS =================
  document.querySelectorAll('input, select').forEach(el => {
    el.addEventListener('input', () => {
      el.classList.remove('error');
      const notif = document.getElementById('error-notif');
      if (notif) notif.style.display = 'none';
    });
  });
});

// ================= PHOTO UPLOAD =================
function handlePhotoUpload() {
  const fileInput = document.getElementById("photoInput");
  const statusText = document.getElementById("photoStatus");
  const photoPreview = document.getElementById("photoPreview");
  const errorMsg = document.querySelector(".photo-error");
  const file = fileInput.files[0];

  if (!file || !file.type.startsWith("image/")) {
    errorMsg.style.display = "block";
    statusText.textContent = "No file chosen";
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

// ================= SIBLINGS SHOW/HIDE =================
document.getElementById("hasSiblingsYes").addEventListener("change", () => {
  document.getElementById("addSiblingHeader").style.display = "block";
  document.getElementById("addSiblingBox").style.display = "block";
  document.getElementById("summaryHeader").style.display = "block";
  document.getElementById("summaryBox").style.display = "block";
});
document.getElementById("hasSiblingsNo").addEventListener("change", () => {
  document.getElementById("addSiblingHeader").style.display = "none";
  document.getElementById("addSiblingBox").style.display = "none";
  document.getElementById("summaryHeader").style.display = "block";
  document.getElementById("summaryBox").style.display = "block";
});

// ================= ADD/REMOVE SIBLING SUMMARY =================
/*
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
*/

function addSiblingToSummary() {
  const inputTable = document.getElementById('siblingsTable');
  const summaryTable = document.querySelector('.siblings-summary-table');
  const inputRow = inputTable.rows[1];

  // Read values
  const fullnameCell = inputRow.cells[0];
  const ageCell = inputRow.cells[1];
  const educationSelect = inputRow.cells[2].querySelector('select');
  const schoolCell = inputRow.cells[3];
  const yearGradCell = inputRow.cells[4];

  const fullname = fullnameCell.innerText.trim();
  const age = ageCell.innerText.trim();
  const education = educationSelect.value.trim();
  const school = schoolCell.innerText.trim();
  const yearGraduated = yearGradCell.innerText.trim();

  // Validation
  let hasError = false;

  function markError(cell, condition) {
    if (condition) {
      cell.classList.add("error");
      hasError = true;
    } else {
      cell.classList.remove("error");
    }
  }

  markError(fullnameCell, fullname === "");
  markError(ageCell, age === "");
  markError(educationSelect, education === "");
  markError(schoolCell, school === "");
  markError(yearGradCell, yearGraduated === "");

  // If any field is empty → STOP
  if (hasError) return;

  // Remove "No siblings" row if it exists
  const noSiblingsRow = summaryTable.querySelector('.no-siblings-text');
  if (noSiblingsRow) noSiblingsRow.parentNode.remove();

  // Add row
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

  // Clear inputs after add
  fullnameCell.innerText = '';
  ageCell.innerText = '';
  educationSelect.value = '';
  schoolCell.innerText = '';
  yearGradCell.innerText = '';
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

// ================= PH ADDRESS CASCADING =================
(() => {
  let data;
  fetch('ph_address.json')
    .then(res => res.json())
    .then(jsonData => { data = jsonData; populateRegions(); })
    .catch(err => console.error('Failed to load JSON', err));

  const regionSelect = document.getElementById("region");
  const provinceSelect = document.getElementById("province");
  const citySelect = document.getElementById("city");
  const barangaySelect = document.getElementById("barangay");

  function populateRegions() {
    regionSelect.innerHTML = '<option value="">Select Region</option>';
    Object.values(data).forEach(region => {
      const option = document.createElement("option");
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
  citySelect.addEventListener('change', () => populateBarangays());

  function getSelectedRegionObj() { return Object.values(data).find(r => r.region_name === regionSelect.value); }

  function populateProvinces() {
    provinceSelect.innerHTML = '<option value="">Select Province</option>';
    const selectedRegion = getSelectedRegionObj();
    if (!selectedRegion) return;
    Object.keys(selectedRegion.province_list).forEach(provName => {
      const option = document.createElement("option");
      option.value = provName;
      option.text = provName;
      provinceSelect.add(option);
    });
  }

  function populateCities() {
    citySelect.innerHTML = '<option value="">Select City/Municipality</option>';
    const selectedRegion = getSelectedRegionObj();
    if (!selectedRegion) return;
    const provinceObj = selectedRegion.province_list[provinceSelect.value];
    if (!provinceObj) return;
    provinceObj.municipality_list.forEach(muni => {
      const cityName = Object.keys(muni)[0];
      const option = document.createElement("option");
      option.value = cityName;
      option.text = cityName;
      citySelect.add(option);
    });
  }

  function populateBarangays() {
    barangaySelect.innerHTML = '<option value="">Select Barangay</option>';
    const selectedRegion = getSelectedRegionObj();
    if (!selectedRegion) return;
    const provinceObj = selectedRegion.province_list[provinceSelect.value];
    if (!provinceObj) return;
    const muniObj = provinceObj.municipality_list.find(m => Object.keys(m)[0] === citySelect.value);
    if (!muniObj) return;
    const barangays = muniObj[citySelect.value].barangay_list;
    if (!barangays) return;
    barangays.forEach(brgy => {
      const option = document.createElement("option");
      option.value = brgy;
      option.text = brgy;
      barangaySelect.add(option);
    });
  }
})();

// ================= NATIONALITY =================
fetch("nationalities.json")
  .then(response => response.json())
  .then(list => {
    const nationalitySelect = document.getElementById("nationality");
    if (!nationalitySelect) return;
    list.forEach(nat => {
      const option = document.createElement("option");
      option.value = nat;
      option.textContent = nat;
      nationalitySelect.appendChild(option);
    });
    const otherOption = document.createElement("option");
    otherOption.value = "Other";
    otherOption.textContent = "Other";
    nationalitySelect.appendChild(otherOption);
  })
  .catch(err => console.error("Failed to load nationality list:", err));

// ================= VALIDATION ON NEXT BUTTON =================
function showNotification(message) {
  const notif = document.getElementById('error-notif');
  notif.textContent = message;
  notif.style.display = 'block';
  notif.style.opacity = 1;
  setTimeout(() => { notif.style.opacity = 0; setTimeout(() => { notif.style.display = 'none'; }, 500); }, 4000);
}

// --- Dynamic show/hide logic for Indigenous section ---
document.addEventListener('DOMContentLoaded', () => {
  const indigenousRadios = document.querySelectorAll('input[name="indigenous"]');
  const indigenousSelect = document.getElementById('indigenousSelect');
  const indigenousOther = document.getElementById('indigenousOther');

  // Initially hide dropdown and textfield
  indigenousSelect.parentElement.style.display = "none";
  indigenousOther.parentElement.style.display = "none";

  // Show/hide dropdown when Yes/No is selected
  indigenousRadios.forEach(radio => {
    radio.addEventListener('change', function() {
      if (this.checked && this.value === "Yes") {
        indigenousSelect.parentElement.style.display = "block";
      } else {
        indigenousSelect.parentElement.style.display = "none";
        indigenousOther.parentElement.style.display = "none";
        indigenousSelect.value = "N/A";
        indigenousSelect.classList.remove('error');
        indigenousOther.value = "";
        indigenousOther.classList.remove('error');
      }
    });
  });

  // Show/hide "Others" textfield if selected in dropdown
  indigenousSelect.addEventListener('change', function() {
    if (this.value === "Others") {
      indigenousOther.parentElement.style.display = "block";
    } else {
      indigenousOther.parentElement.style.display = "none";
      indigenousOther.value = "";
      indigenousOther.classList.remove('error');
    }
  });
});


/// handle next
function handleNext() {
  let error = false;
  const requiredText = ['lastName','firstName','birthdate','height','email','mobile','telephone', 'contactName','contactAddress', 'contactMobile'];
  requiredText.forEach(id => {
    const el = document.getElementById(id);
    if (!el.value.trim()) { el.classList.add('error'); error = true; }
  });
  
  // --- SEX REQUIRED ---
  const sexGroup = document.querySelector('.radio-group');
  const sex = document.querySelector('input[name="sex"]:checked');

  if (!sex) {
    sexGroup.classList.add('error-radio-group');
    error = true;
  } else {
    sexGroup.classList.remove('error-radio-group');
  }


  const photo = document.getElementById('photoInput');
  if (!photo.files || !photo.files[0]) { document.querySelector(".photo-error").style.display = "block"; error = true; }

  // Nationality Required
  const nationality = document.getElementById('nationality');
  const otherNationality = document.getElementById('otherNationality');

  // If user has NOT selected anything
  if (nationality.value === "Select Nationality" || nationality.value.trim() === "") {
    nationality.classList.add('error');
    error = true;
  }

  // If user selected "Other", then the text input must NOT be empty
  if (nationality.value === "Other") {
    if (!otherNationality.value.trim()) {
      otherNationality.classList.add('error');
      error = true;
    }
  }

  // --- ADDRESS REQUIRED FIELDS ---
  const requiredSelects = ['region', 'province', 'city', 'barangay'];
  requiredSelects.forEach(id => {
    const el = document.getElementById(id);
    if (!el.value.trim()) {
      el.classList.add('error');
      error = true;
    } else {
      el.classList.remove('error');
    }
  });

  // House No. / Street required
  const houseNo = document.getElementById('houseNo');
  if (!houseNo.value.trim()) {
    houseNo.classList.add('error');
    error = true;
  } else {
    houseNo.classList.remove('error');
  }

  // Emergency Relationship Required
  const contactRelationship = document.getElementById('contactRelationship');
  const otherRelationship = document.getElementById('otherRelationship');

  // Check dropdown
  if (!contactRelationship.value || contactRelationship.value === "Select Relationship") {
    contactRelationship.classList.add('error');
    error = true;
  } else {
  contactRelationship.classList.remove('error');
  }

  // If "Others" is selected, the text input must not be empty
  if (contactRelationship.value === "Others") {
    if (!otherRelationship.value.trim()) {
      otherRelationship.classList.add('error');
      error = true;
    } else {
      otherRelationship.classList.remove('error');
    }
  }

  // Show/hide Other Relationship field dynamically
  contactRelationship.addEventListener('change', function() {
    const otherContainer = document.getElementById('otherRelationshipContainer');

    if (this.value === "Others") {
      otherContainer.style.display = "block";
    } else {
      otherContainer.style.display = "none";

      // Clear and remove error highlight when hidden
      otherRelationship.value = "";
      otherRelationship.classList.remove('error');
    }
  });

  //first member required
  const firstMemberField = document.querySelector('.vertical-field');
  const firstMember = document.querySelector('input[name="first_member"]:checked');
  if (!firstMember) {
    firstMemberField.classList.add('error');
    error = true;
  } else {
    firstMemberField.classList.remove('error');
  }

  //4ps required
  const ppsField = document.getElementById('ppsField');
  const pps = document.querySelector('input[name="4ps"]:checked');

  if (!pps) {
    ppsField.classList.add('error');
    error = true;
  } else {
    ppsField.classList.remove('error');
  }
 
  // Indigenous Field
  const indigenousField = document.getElementById('indigenousField');
  const indigenousRadios = document.querySelectorAll('input[name="indigenous"]');
  const indigenousSelect = document.getElementById('indigenousSelect');
  const indigenousOther = document.getElementById('indigenousOther');

  // Initially hide dropdown and textfield
  indigenousSelect.parentElement.style.display = "none";
  indigenousOther.parentElement.style.display = "none";

  // Show/hide the dropdown when Yes/No is selected
  indigenousRadios.forEach(radio => {
    radio.addEventListener('change', function() {
      if (this.checked && this.value === "Yes") {
        indigenousSelect.parentElement.style.display = "block"; // show dropdown
      } else if  (this.checked && this.value === "No") {
        indigenousSelect.parentElement.style.display = "none"; // hide dropdown
        indigenousOther.parentElement.style.display = "none"; // hide textfield
        indigenousSelect.value = "N/A"; 
        indigenousSelect.classList.remove('error');
        indigenousOther.value = ""; 
        indigenousOther.classList.remove('error');
      }
    });
  });

  // Show/hide the "Others" textfield if selected in dropdown
  indigenousSelect.addEventListener('change', function() {
    if (this.value === "Others") {
      indigenousOther.parentElement.style.display = "block";
    } else {
      indigenousOther.parentElement.style.display = "none";
      indigenousOther.value = "";
      indigenousOther.classList.remove('error');
    }
  });

  // Validation in handleNext()
  const indgns = document.querySelector('input[name="indigenous"]:checked');

  if (!indgns) {
    indigenousField.classList.add('error');
    error = true;

    // hide the dropdown and others just in case
    indigenousSelect.parentElement.style.display = "none";
    indigenousOther.parentElement.style.display = "none";

  } else {
    indigenousField.classList.remove('error');

    // Only validate dropdown if "Yes" is selected
    if (indgns.value === "Yes") {
      indigenousSelect.parentElement.style.display = "block";

      if (!indigenousSelect.value || indigenousSelect.value === "N/A") {
        indigenousSelect.classList.add('error');
        error = true;
      } else {
        indigenousSelect.classList.remove('error');

        // Only validate textfield if "Others" is selected
        if (indigenousSelect.value === "Others") {
          indigenousOther.parentElement.style.display = "block";
          if (!indigenousOther.value.trim()) {
            indigenousOther.classList.add('error');
            error = true;
          } else {
            indigenousOther.classList.remove('error');
          }
        } else {
          indigenousOther.parentElement.style.display = "none"; // hide textfield if not Others
          indigenousOther.classList.remove('error');
        }
      }
    } else {
      indigenousSelect.parentElement.style.display = "none";
      indigenousOther.parentElement.style.display = "none";
      // If "No" is selected, clear errors
      indigenousSelect.classList.remove('error');
      indigenousOther.classList.remove('error');
    }
  }

  //lgbtqia+ required
  const lgbtqiaField = document.getElementById('lgbtqiaField');
  const lgbt = document.querySelector('input[name="lgbtqia"]:checked');

  if (!lgbt) {
    lgbtqiaField.classList.add('error');
    error = true;
  } else {
    lgbtqiaField.classList.remove('error');
  }

  //person w/ disability required
  const pwdField = document.getElementById('pwdField');
  const personDis = document.querySelector('input[name="pwd"]:checked');

  if (!personDis) {
    pwdField.classList.add('error');
    error = true;
  } else {
    pwdField.classList.remove('error');
  }

  //soloparent required
  const soloField = document.getElementById('soloField');
  const solo = document.querySelector('input[name="solo_parent"]:checked');

  if (!solo) {
    soloField.classList.add('error');
    error = true;
  } else {
    soloField.classList.remove('error');
  }

  //income required
  const incomeField = document.getElementById('incomeField');
  const estimatedInc = document.querySelector('input[name="income"]:checked');

  if (!estimatedInc) {
    incomeField.classList.add('error');
    error = true;
  } else {
    incomeField.classList.remove('error');
  }

  //parents table required
  const parentsBox = document.getElementById('parentsBox');
  const parentCells = parentsBox.querySelectorAll('td[contenteditable="true"]');

  // Check if any cell is empty
  let parentsEmpty = false;
  parentCells.forEach(cell => {
    if (!cell.textContent.trim()) {
      parentsEmpty = true;
    }
  });

  // Highlight if empty
  if (parentsEmpty) {
    parentsBox.classList.add('error');
    error = true;
  } else {
    parentsBox.classList.remove('error');
  }

  //Internally Displaced Person required
  const idpField = document.getElementById('idpField');
  const idpRadios = document.querySelectorAll('input[name="idp"]');
  const idpDetailsContainer = document.getElementById('idpDetailsContainer');
  const idpDetails = document.getElementById('idpDetails');

  // Initially hide the details field
  idpDetailsContainer.style.display = "none";

  // Show/hide the details input when Yes/No is selected
  idpRadios.forEach(radio => {
    radio.addEventListener('change', function() {
      if (this.checked && this.value === "Yes") {
        idpDetailsContainer.style.display = "block";
      } else if (this.checked && this.value === "No") {
        idpDetailsContainer.style.display = "none";
        idpDetails.value = "";
        idpDetails.classList.remove('error');
      }
    });
  });

  // Validation inside handleNext()
  const idpChecked = document.querySelector('input[name="idp"]:checked');

  if (!idpChecked) {
    idpField.classList.add('error');
    error = true;

    // Hide details just in case
    idpDetailsContainer.style.display = "none";

  } else {
    idpField.classList.remove('error');

    if (idpChecked.value === "Yes") {
      idpDetailsContainer.style.display = "block";

      if (!idpDetails.value.trim()) {
        idpDetails.classList.add('error');
        error = true;
      } else {
        idpDetails.classList.remove('error');
      }
    } else {
      idpDetailsContainer.style.display = "none";
      idpDetails.classList.remove('error');
    }
  }


  // siblings

  /*
  const siblingsField = document.getElementById('siblingsField');
  const hasSiblings = document.querySelector('input[name="hasSiblings"]:checked');
  if (!hasSiblings) {
    // No option selected → highlight container
    siblingsField.classList.add('error'); // highlight container
    error = true;
  } else {
    siblingsField.classList.remove('error'); // remove highlight if answered

      if (hasSiblings.value === "yes") {
      const inputRow = document.getElementById('siblingsTable').rows[1];
      const fullname = inputRow.cells[0].innerText.trim();
      const age = inputRow.cells[1].innerText.trim();
      const education = inputRow.cells[2].querySelector('select').value;
      const school = inputRow.cells[3].innerText.trim();
      const yearGraduated = inputRow.cells[4].innerText.trim();

      const summaryTable = document.querySelector('.siblings-summary-table');
      const hasNoSiblingsText = summaryTable.querySelector('.no-siblings-text');

      // If any input is filled but not added to summary → keep highlight
      if ((fullname || age || education || school || yearGraduated) && hasNoSiblingsText) {
        siblingsField.classList.add('error');
        error = true;
      }

      // Also validate each editable cell in input row
      const cells = document.getElementById('siblingsTable').querySelectorAll('td[contenteditable="true"]');
      cells.forEach(cell => {
        if (!cell.textContent.trim()) {
          cell.classList.add('error');
          error = true;
        } else {
          cell.classList.remove('error');
        }
      });
    }
  }
  */
  // siblings

  /*
  const siblingsBox = document.getElementById('addSiblingBox');
  const hasSiblings = document.querySelector('input[name="hasSiblings"]:checked');

  if (!hasSiblings) {
    // No radio selected → highlight container
    siblingsField.classList.add('error');
    error = true;
  } else {
    siblingsField.classList.remove('error');

    if (hasSiblings.value === "yes") {
      const inputRow = document.getElementById('siblingsTable').rows[1];
      const cells = inputRow.querySelectorAll('td[contenteditable="true"]');
      let rowEmpty = false;

      // Check if any input cell is empty
      cells.forEach(cell => {
        if (!cell.textContent.trim()) {
          cell.classList.add('error');
          rowEmpty = true;
        } else {
          cell.classList.remove('error');
        }
      });

      const summaryTable = document.querySelector('.siblings-summary-table');
      const hasNoSiblingsText = summaryTable.querySelector('.no-siblings-text');

      // If any cell empty OR row not added to summary → keep highlight
      if (rowEmpty || hasNoSiblingsText) {
        siblingsField.classList.add('error');
        error = true;
      } else {
        siblingsField.classList.remove('error');
      }
    }
  }
  */

  
  // SIBLINGS VALIDATION
  /*
  const siblingsField = document.getElementById('siblingsField');
  const hasSiblings = document.querySelector('input[name="hasSiblings"]:checked');
  const addSiblingBox = document.getElementById('addSiblingBox');
  const summaryTable = document.querySelector('.siblings-summary-table');

  let siblingsError = false;

  // 1️⃣ Check if radio button is selected
  if (!hasSiblings) {
    siblingsError = true;
  } 

  // 2️⃣ If "Yes", check if table row is filled
  if (hasSiblings && hasSiblings.value.toLowerCase() === "yes") {
    const inputRow = document.getElementById('siblingsTable').rows[1];
    const cells = Array.from(inputRow.cells).slice(0,5); // first 5 cells are editable

    let rowEmpty = false;
    cells.forEach(cell => {
      if (cell.tagName === 'TD') {
        if (cell.querySelector('select')) {
          if (!cell.querySelector('select').value) rowEmpty = true;
        } else if (!cell.textContent.trim()) {
          rowEmpty = true;
        }
      }
    });

    // 3️⃣ Check if row is already added to summary table
  
    const noSiblingsRow = summaryTable.querySelector('.no-siblings-text');
    const summaryHasData = summaryTable.rows.length > 1 && !noSiblingsRow;
    


    if (rowEmpty || !summaryHasData) {
      siblingsError = true;
    }
  }

  // Highlight or remove highlight
  if (siblingsError) {
    siblingsField.classList.add('error');
    addSiblingBox.classList.add('error'); // optional, highlights the table container
    error = true;
  } else {
    siblingsField.classList.remove('error');
    addSiblingBox.classList.remove('error');
  }
  */

  /* ///BAGO MAGFINAL AAAAAAA
  // --- SIBLINGS VALIDATION ---
  const hasSiblings = document.querySelector('input[name="hasSiblings"]:checked');
  let siblingsError = false;

  // 1. No radio selected
  if (!hasSiblings) {
    siblingsError = true;
  } 

  // 2. If YES, validate
  if (hasSiblings && hasSiblings.value === "yes") {

    const inputRow = document.getElementById('siblingsTable').rows[1];
    const cells = Array.from(inputRow.cells).slice(0,5);

    let rowEmpty = false;

    cells.forEach(cell => {
      const select = cell.querySelector('select');
      if (select && !select.value.trim()) rowEmpty = true;
      if (!select && !cell.textContent.trim()) rowEmpty = true;
    });

    // 3. Check if summary table has real siblings
    const dataRows = summaryTable.querySelectorAll("tr:not(.no-siblings-text):not(.header-row)");
    const summaryHasData = dataRows.length > 0;

    if (rowEmpty || !summaryHasData) {
      siblingsError = true;
    }
  }

  // Show or clear highlight
  if (siblingsError) {
    siblingsField.classList.add('error');
    addSiblingBox.classList.add('error');
    error = true;  // <-- THIS MUST EXIST IN YOUR MAIN handleNext()
  } else {
    siblingsField.classList.remove('error');
    addSiblingBox.classList.remove('error');
  }
  */
  // --- SIBLINGS VALIDATION ---
const hasSiblings = document.querySelector('input[name="hasSiblings"]:checked');
const summaryTable = document.querySelector('.siblings-summary-table');

let siblingsError = false;

// 1. Radio not selected
if (!hasSiblings) {
  siblingsError = true;
}

// 2. If YES → sibling must be added to summary
if (hasSiblings && hasSiblings.value === "yes") {

  // A. Check if summary table has REAL sibling data
  const dataRows = summaryTable.querySelectorAll("tr:not(.header-row):not(.no-siblings-text)");
  const summaryHasData = dataRows.length > 0;

  if (!summaryHasData) {
    siblingsError = true;
  }

  // B. Check if editable row is still filled (meaning user typed but didn’t click “Add”)
  const inputRow = document.getElementById('siblingsTable').rows[1];
  const cells = Array.from(inputRow.cells).slice(0,5);
  let rowHasText = false;

  cells.forEach(cell => {
    const select = cell.querySelector("select");
    if (select && select.value.trim() !== "") rowHasText = true;
    if (!select && cell.textContent.trim() !== "") rowHasText = true;
  });

  // If user typed something but did not click "Add", block Next
  if (rowHasText && !summaryHasData) {
    siblingsError = true;
  }
}

// APPLY ERROR HIGHLIGHT
if (siblingsError) {
  siblingsField.classList.add("error");
  addSiblingBox.classList.add("error");

  error = true;   // 🔥 MOST IMPORTANT — TRIGGERS YOUR STOP
} else {
  siblingsField.classList.remove("error");
  addSiblingBox.classList.remove("error");
}

 



  /*
  // If yes, validate table cells
  if (hasSiblings && hasSiblings.value === "yes") {
    const cells = document.getElementById('siblingsTable').querySelectorAll('td[contenteditable="true"]');
    cells.forEach(cell => {
      if (!cell.textContent.trim()) { 
        cell.classList.add('error'); 
        error = true;
      } else {
        cell.classList.remove('error');
      }
   });
  }
  */

  if (error) { showNotification("Please complete all required fields before proceeding."); window.scrollTo({top:0, behavior:"smooth"}); return; }

  window.location.href = "next-section.html";
}


// Show/Hide Other Nationality field based on dropdown selection
document.getElementById('nationality').addEventListener('change', function() {
  const otherContainer = document.getElementById('otherNationalityContainer');

  if (this.value === "Other") {
    otherContainer.style.display = "block";
  } else {
    otherContainer.style.display = "none";

    // Clear and remove error highlight when hidden
    document.getElementById('otherNationality').value = "";
    document.getElementById('otherNationality').classList.remove('error');
  }
});

