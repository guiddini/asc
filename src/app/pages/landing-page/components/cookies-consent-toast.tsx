import React, { useState, useEffect } from "react";

const CookieConsentToast = () => {
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    // Check if user has already given consent
    const consentGiven = localStorage.getItem("cookieConsent");
    if (!consentGiven) {
      setShowToast(true);
    }
  }, []);

  const handleAccept = () => {
    // Store consent in localStorage
    localStorage.setItem("cookieConsent", "true");
    setShowToast(false);
  };

  // Don't render anything if consent already given or toast is hidden
  if (!showToast) {
    return null;
  }

  return (
    <div className="toast-container position-fixed bottom-0 end-0 p-3">
      <div
        id="cookieConsentToast"
        className="toast show"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div id="cookieConsentToastHeader" className="toast-header">
          <div id="cookieConsentIcon" className="me-2">
            🍪
          </div>
          <strong id="cookieConsentTitle" className="me-auto">
            We respect your privacy.
          </strong>
        </div>
        <div id="cookieConsentToastBody" className="toast-body">
          <p id="cookieConsentText" className="mb-3">
            Cookies are used only for essential features to ensure a secure and
            smooth experience on our site.
            <span id="cookieConsentSubtext" className="d-block mt-1">
              By continuing to use our site, you consent to our use of cookies.
            </span>
          </p>
          <div id="cookieConsentActions" className="d-flex gap-2">
            <button
              id="cookieConsentAcceptBtn"
              type="button"
              className="btn btn-sm flex-grow-1"
              onClick={handleAccept}
            >
              <span id="cookieConsentAcceptIcon" className="me-1">
                ✓
              </span>
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsentToast;
