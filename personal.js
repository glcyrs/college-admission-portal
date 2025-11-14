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
