/**
 * Mukul Bithi School - Admissions & Academics Controller
 * Manages Curriculum Tabs, Form Real-time Validation & Success Confirmation Modal
 */

document.addEventListener('DOMContentLoaded', () => {
  initAcademicsTabs();
  initAdmissionsForm();
});

/* 1. Academics Tabs Switcher */
function initAcademicsTabs() {
  const tabBtns = document.querySelectorAll('.academics-tab-btn');
  const panels = document.querySelectorAll('.academics-panel');

  if (!tabBtns.length || !panels.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');

      tabBtns.forEach(b => b.classList.remove('is-active'));
      panels.forEach(p => p.classList.remove('is-active'));

      btn.classList.add('is-active');
      const activePanel = document.querySelector(`.academics-panel[data-panel="${targetId}"]`);
      if (activePanel) {
        activePanel.classList.add('is-active');
      }
    });
  });
}

/* 2. Admissions Form Validation & Modal */
function initAdmissionsForm() {
  const form = document.getElementById('admissionEnquiryForm');
  const modal = document.getElementById('admissionSuccessModal');
  const modalCloseBtn = document.getElementById('closeSuccessModalBtn');
  const refCodeSpan = document.getElementById('enquiryRefCode');

  if (!form) return;

  const validateField = (input) => {
    const parent = input.closest('.form-group');
    if (!parent) return true;

    const errorEl = parent.querySelector('.form-error');
    let isValid = true;
    let errorMsg = '';

    const val = input.value.trim();

    if (input.hasAttribute('required') && !val) {
      isValid = false;
      errorMsg = 'This field is required.';
    } else if (input.type === 'email' && val) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(val)) {
        isValid = false;
        errorMsg = 'Please enter a valid email address.';
      }
    } else if (input.type === 'tel' && val) {
      const phoneRegex = /^(\+91[\-\s]?)?[0-9]{10}$/;
      if (!phoneRegex.test(val.replace(/[\s\-]/g, ''))) {
        isValid = false;
        errorMsg = 'Please enter a valid 10-digit phone number.';
      }
    } else if (input.id === 'parentName' && val.length < 2) {
      isValid = false;
      errorMsg = 'Please enter a full parent/guardian name.';
    } else if (input.id === 'childName' && val.length < 2) {
      isValid = false;
      errorMsg = 'Please enter the child\'s name.';
    }

    if (!isValid) {
      parent.classList.add('has-error');
      if (errorEl) errorEl.textContent = errorMsg;
      input.setAttribute('aria-invalid', 'true');
    } else {
      parent.classList.remove('has-error');
      input.removeAttribute('aria-invalid');
    }

    return isValid;
  };

  const inputs = form.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      const parent = input.closest('.form-group');
      if (parent && parent.classList.contains('has-error')) {
        validateField(input);
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isFormValid = true;
    inputs.forEach(input => {
      if (!validateField(input)) {
        isFormValid = false;
      }
    });

    if (!isFormValid) {
      const firstError = form.querySelector('.form-group.has-error input, .form-group.has-error select');
      if (firstError) firstError.focus();
      return;
    }

    // Submit Simulation
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.innerHTML : 'Submit Enquiry';

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg style="animation: spin 1s linear infinite; width: 18px; height: 18px; display: inline-block; vertical-align: middle; margin-right: 8px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="10"></circle>
        </svg> Processing Enquiry...
      `;
    }

    setTimeout(() => {
      // Generate Unique Ref Number
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const year = new Date().getFullYear();
      const refCode = `MBS-${year}-${randomNum}`;

      if (refCodeSpan) refCodeSpan.textContent = refCode;

      if (modal) {
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
      }

      form.reset();

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    }, 900);
  });

  if (modalCloseBtn && modal) {
    modalCloseBtn.addEventListener('click', () => {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
      }
    });
  }
}
