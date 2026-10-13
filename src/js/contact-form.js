/**
 * contact-form.js
 * Progressive enhancement for the inquiry form.
 *
 * Without JavaScript the form still posts natively to its `action` URL.
 * With JavaScript it adds:
 *   - inline validation with accessible error messages
 *   - submission without a page reload
 *   - a polite status message for screen readers
 *
 * To connect a backend, set the form's `action` attribute in index.html.
 */
(function () {
  'use strict';

  const SUBMIT_TIMEOUT_MS = 15000;

  const form = document.getElementById('inquiry-form');
  if (!form) return;

  const controls = Array.from(form.querySelectorAll('.field__control'));
  const submitButton = form.querySelector('[type="submit"]');
  const statusElement = form.querySelector('.form-status');
  const submitLabel = submitButton.textContent;

  /* ------------------------------------------------------------------------
     Validation
     ------------------------------------------------------------------------ */

  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const PHONE_PATTERN = /^[+\d][\d\s().-]{5,}$/;

  const REQUIRED_MESSAGES = {
    name: 'Enter your name.',
    contact: 'Enter an email address or phone number.',
  };

  /** True when the value looks like an email address or a phone number. */
  function isEmailOrPhone(value) {
    if (value.includes('@')) return EMAIL_PATTERN.test(value);
    const digitCount = value.replace(/\D/g, '').length;
    return PHONE_PATTERN.test(value) && digitCount >= 7 && digitCount <= 15;
  }

  /** Returns an error message for a control, or an empty string if valid. */
  function getErrorMessage(control) {
    const value = control.value.trim();

    if (control.required && value === '') {
      return REQUIRED_MESSAGES[control.name] || 'This field is required.';
    }
    if (control.name === 'contact' && !isEmailOrPhone(value)) {
      return 'Enter a valid email address or phone number.';
    }
    return '';
  }

  /** Shows or clears the inline error for a control. Returns true if valid. */
  function validateControl(control) {
    const message = getErrorMessage(control);
    const errorElement = document.getElementById(`${control.id}-error`);

    if (errorElement) {
      errorElement.textContent = message;
      errorElement.hidden = message === '';
    }
    control.setAttribute('aria-invalid', String(message !== ''));

    return message === '';
  }

  /** Validates every control. Returns the first invalid control, if any. */
  function findFirstInvalidControl() {
    let firstInvalid = null;
    controls.forEach((control) => {
      if (!validateControl(control) && !firstInvalid) firstInvalid = control;
    });
    return firstInvalid;
  }

  /* ------------------------------------------------------------------------
     Status and loading state
     ------------------------------------------------------------------------ */

  /** @param {'success' | 'error' | ''} state */
  function setStatus(state, message = '') {
    statusElement.dataset.state = state;
    statusElement.textContent = message;
  }

  function setSending(isSending) {
    submitButton.disabled = isSending;
    submitButton.textContent = isSending ? 'Sending…' : submitLabel;
  }

  /* ------------------------------------------------------------------------
     Submission
     ------------------------------------------------------------------------ */

  /** The form has no real endpoint until the developer sets `action`. */
  function hasEndpoint() {
    const action = form.getAttribute('action');
    return Boolean(action) && action !== '#';
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus('');

    const firstInvalid = findFirstInvalidControl();
    if (firstInvalid) {
      firstInvalid.focus();
      setStatus('error', 'Fix the highlighted fields and send again.');
      return;
    }

    if (!hasEndpoint()) {
      console.warn('contact-form: set the form "action" attribute in index.html to enable sending.');
      setStatus('error', 'Your inquiry was not sent because this form is not connected yet. Please visit us at the address shown.');
      return;
    }

    setSending(true);
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(SUBMIT_TIMEOUT_MS),
      });
      if (!response.ok) throw new Error(`Server responded with ${response.status}`);

      form.reset();
      controls.forEach((control) => control.removeAttribute('aria-invalid'));
      setStatus('success', 'Thank you. Your inquiry is in, and we will be in touch.');
    } catch (error) {
      console.error('contact-form:', error);
      setStatus('error', 'Your inquiry was not sent. Try again, or visit us at the address shown.');
    } finally {
      setSending(false);
    }
  }

  /* ------------------------------------------------------------------------
     Events
     ------------------------------------------------------------------------ */

  form.addEventListener('submit', handleSubmit);

  // Once a field shows an error, re-check it as the person types so the
  // message disappears as soon as the problem is fixed.
  form.addEventListener('input', (event) => {
    const control = event.target;
    if (controls.includes(control) && control.getAttribute('aria-invalid') === 'true') {
      validateControl(control);
    }
  });

  // Check a field when the person leaves it, but only if they typed something.
  // Tabbing through an empty field should not trigger an error.
  form.addEventListener('focusout', (event) => {
    const control = event.target;
    if (controls.includes(control) && control.value.trim() !== '') {
      validateControl(control);
    }
  });
})();
