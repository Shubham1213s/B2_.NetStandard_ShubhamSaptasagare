// spinnerService.js - Manages loading spinner display

var spinnerService = {
    
    /**
     * Shows loading spinner with optional message.
     * @param {string} message
     */
    show: function(message = "Loading...") {
        $("#spinnerText").text(message);
        $("#loadingSpinner").show();
        $("#loadingOverlay").show();
    },
    
    /**
     * Hides loading spinner.
     */
    hide: function() {
        $("#loadingSpinner").hide();
        $("#loadingOverlay").hide();
    }
    
};

// For Node.js
if (typeof module !== "undefined" && module.exports) {
    module.exports = spinnerService;
}

// For browser
if (typeof window !== "undefined") {
    window.spinnerService = spinnerService;
}
