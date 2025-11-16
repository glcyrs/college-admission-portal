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

// --- signature functionality (file upload + draw) ---
const fileInput = document.getElementById('fileInput');
const chooseFileBtn = document.getElementById('chooseFileBtn');
const fileName = document.getElementById('fileName');
const signatureImage = document.getElementById('signatureImage');
const placeholder = document.getElementById('placeholder');
const certifyCheckbox = document.getElementById('certifyCheckbox');
const submitBtn = document.getElementById('submitBtn');
const drawBtn = document.getElementById('drawBtn');
const canvas = document.getElementById('signatureCanvas');

if (!canvas) {
  console.warn('Signature canvas not found - signature functionality disabled.');
} else {
  let ctx = canvas.getContext('2d');
  let isDrawing = false;
  let drawMode = false;
  let hasSignature = false; // track whether a signature (upload/draw) exists

  // resize canvas drawing buffer to match container size (and devicePixelRatio)
  function fitSignatureCanvas() {
    const box = document.getElementById('signatureBox');
    if (!box || !canvas) return;
    const rect = box.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    // set actual pixel buffer (internal resolution)
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);

    // set CSS size so canvas appears correct size on page
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';

    // reset context and scale for DPR (so context maps CSS pixels -> device pixels)
    ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // drawing style
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
  }

  // initial fit and on resize
  window.addEventListener('DOMContentLoaded', fitSignatureCanvas);
  window.addEventListener('resize', fitSignatureCanvas);

  // helper: show/hide elements
  function showCanvas() {
    canvas.style.display = 'block';
    canvas.classList.add('active');
    signatureImage && signatureImage.classList.remove('show');
    placeholder.style.display = 'none';
    fitSignatureCanvas(); // ensure buffer size correct
  }
  function hideCanvas() {
    canvas.style.display = 'none';
    canvas.classList.remove('active');
  }
  function showImage() {
    if (!signatureImage) return;
    signatureImage.classList.add('show');
    signatureImage.style.display = 'block';
    hideCanvas();
    placeholder.style.display = 'none';
  }
  function hideImage() {
    if (!signatureImage) return;
    signatureImage.classList.remove('show');
    signatureImage.style.display = 'none';
  }
  function showPlaceholder() {
    placeholder.style.display = 'block';
    hideCanvas();
    hideImage();
  }

  // === Success Notification ===
function showSuccessNotif() {
  document.getElementById("notifOverlay").style.display = "flex";
}

function goToEducAttach() {
  window.location.href = "educattach.html";
}

// submit click: ensure conditions then show success popup
if (submitBtn) {
  submitBtn.addEventListener('click', (e) => {
    e.preventDefault();

    if (!hasSignature) {
      alert('Please upload or draw your signature before submitting.');
      return;
    }
    if (!certifyCheckbox || !certifyCheckbox.checked) {
      alert('Please check the certification box.');
      return;
    }

    // Show success popup ONLY when Submit is clicked
    showSuccessNotif();
  });
}

  // --- submit eligibility control ---
  function checkSubmitEligibility() {
    const enabled = !!hasSignature && !!(certifyCheckbox && certifyCheckbox.checked);
    if (submitBtn) submitBtn.disabled = !enabled;
  }

  // Choose file button -> file input click
  if (chooseFileBtn && fileInput) {
    chooseFileBtn.addEventListener('click', () => fileInput.click());
  }

  // File input change -> show image preview
  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      fileName && (fileName.textContent = file.name);
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (signatureImage) signatureImage.src = ev.target.result;
        showImage();
        // clear canvas when image uploaded (optional)
        ctx && ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawMode = false;
        if (drawBtn) {
          drawBtn.innerHTML = `<svg class="pen-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><path d="M2 2l7.586 7.586"></path></svg> Draw Signature`;
        }
        // mark signature present and update submit button
        hasSignature = true;
        checkSubmitEligibility();
      };
      reader.readAsDataURL(file);
    });
  }

  // Draw button toggles draw mode; when turning off it clears and returns to placeholder
  if (drawBtn) {
    drawBtn.addEventListener('click', () => {
      drawMode = !drawMode;
      if (drawMode) {
        // enter draw mode
        showCanvas();
        hideImage();
        drawBtn.textContent = 'Clear Drawing';
        fitSignatureCanvas();
      } else {
        // leaving draw mode: clear drawing and go back to placeholder
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        hideCanvas();
        showPlaceholder();
        drawBtn.innerHTML = `<svg class="pen-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><path d="M2 2l7.586 7.586"></path></svg> Draw Signature`;
        // drawing cleared -> no signature
        hasSignature = false;
        checkSubmitEligibility();
      }
    });
  }

  // --- Accurate pointer handling (use CSS-pixel coords because ctx is scaled by DPR) ---
  // prevent the browser from handling touch gestures while drawing
  canvas.style.touchAction = 'none';

  // Convert event to CSS-pixel coords relative to canvas top-left.
  // IMPORTANT: Do NOT multiply by scale when ctx has been setTransform(dpr,...).
  function getCanvasPointCSS(evt) {
    const rect = canvas.getBoundingClientRect();
    const clientX = (evt.clientX !== undefined) ? evt.clientX : (evt.touches && evt.touches[0] && evt.touches[0].clientX);
    const clientY = (evt.clientY !== undefined) ? evt.clientY : (evt.touches && evt.touches[0] && evt.touches[0].clientY);
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  function pointerDownHandler(e) {
    if (!drawMode) return;
    e.preventDefault();
    // capture pointer for the duration of drawing (smoothness)
    if (e.pointerId) canvas.setPointerCapture && canvas.setPointerCapture(e.pointerId);
    isDrawing = true;
    const p = getCanvasPointCSS(e);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
  }

  function pointerMoveHandler(e) {
    if (!isDrawing || !drawMode) return;
    e.preventDefault();
    const p = getCanvasPointCSS(e);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    // mark signature present once user draws something
    if (!hasSignature) {
      hasSignature = true;
      checkSubmitEligibility();
    }
  }

  function pointerUpHandler(e) {
    if (!drawMode) return;
    e.preventDefault();
    if (e.pointerId) canvas.releasePointerCapture && canvas.releasePointerCapture(e.pointerId);
    if (isDrawing) {
      isDrawing = false;
      ctx.closePath();
    }
  }

  // attach pointer listeners
  canvas.addEventListener('pointerdown', pointerDownHandler);
  canvas.addEventListener('pointermove', pointerMoveHandler);
  canvas.addEventListener('pointerup', pointerUpHandler);
  canvas.addEventListener('pointercancel', pointerUpHandler);
  canvas.addEventListener('pointerleave', pointerUpHandler);

  // checkbox change -> re-check eligibility
  if (certifyCheckbox) {
    certifyCheckbox.addEventListener('change', () => {
      checkSubmitEligibility();
    });
  }

  // submit click: ensure conditions then alert and redirect
if (submitBtn) {
  submitBtn.addEventListener('click', (e) => {
    e.preventDefault();

    if (!hasSignature) {
      alert('Please upload or draw your signature before submitting.');
      return;
    }
    if (!certifyCheckbox || !certifyCheckbox.checked) {
      alert('Please check the certification box.');
      return;
    }

    // Show custom success notification
    const overlay = document.getElementById('notifOverlay');
    overlay.style.display = 'flex';

    // After 2.5 seconds, fade out and redirect
    setTimeout(() => {
      overlay.style.display = 'none';
      window.location.href = 'landing.html';
    }, 2500);
  });
}

  // initialize UI state
  canvas.style.display = 'none';
  if (signatureImage && signatureImage.src) {
    hasSignature = true;
    showImage();
  } else {
    showPlaceholder();
  }

  // ensure submit starts in correct disabled state
  checkSubmitEligibility();
}
