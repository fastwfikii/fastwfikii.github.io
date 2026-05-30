/*
   form-validation.js
   - real-time validation (name, email, message)
   - accessible error messaging
   - client-side submit simulation
*/

(() => {
  const $ = (sel, root = document) => root.querySelector(sel);

  const form = $("#contactForm");
  if (!form) return;

  const nameEl = $("#name");
  const emailEl = $("#email");
  const msgEl = $("#message");

  const nameErr = $("#nameError");
  const emailErr = $("#emailError");
  const msgErr = $("#messageError");
  const successEl = $("#formSuccess");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

  const setFieldState = (input, errorEl, ok, message) => {
    input.setAttribute("aria-invalid", String(!ok));
    errorEl.textContent = ok ? "" : message;

    // Subtle visual cue without relying on color alone (border change)
    input.style.borderColor = ok
      ? "color-mix(in oklab, var(--border) 100%, transparent)"
      : "rgba(239,68,68,.85)";
  };

  const validateName = () => {
    const v = (nameEl.value || "").trim();
    if (v.length < 2) {
      setFieldState(nameEl, nameErr, false, "Please enter at least 2 characters.");
      return false;
    }
    setFieldState(nameEl, nameErr, true, "");
    return true;
  };

  const validateEmail = () => {
    const v = (emailEl.value || "").trim();
    if (!emailRegex.test(v)) {
      setFieldState(emailEl, emailErr, false, "Please enter a valid email (e.g., name@example.com).");
      return false;
    }
    setFieldState(emailEl, emailErr, true, "");
    return true;
  };

  const validateMessage = () => {
    const v = (msgEl.value || "").trim();
    if (v.length < 10) {
      setFieldState(msgEl, msgErr, false, "Message should be at least 10 characters.");
      return false;
    }
    setFieldState(msgEl, msgErr, true, "");
    return true;
  };

  // Real-time validation
  nameEl.addEventListener("input", () => { successEl.textContent = ""; validateName(); });
  emailEl.addEventListener("input", () => { successEl.textContent = ""; validateEmail(); });
  msgEl.addEventListener("input", () => { successEl.textContent = ""; validateMessage(); });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    successEl.textContent = "";

    const ok = [validateName(), validateEmail(), validateMessage()].every(Boolean);
    if (!ok) return;

    // Demo-only submit behavior
    successEl.textContent = "Message ready to send! (Client-side demo — connect to a backend or email service.)";
    form.reset();

    // Reset aria-invalid after reset
    [nameEl, emailEl, msgEl].forEach((el) => el.setAttribute("aria-invalid", "false"));
  });
})();
