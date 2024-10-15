// Assume you have a button with id "shareButton" in your Google Sites page
document.getElementById("shareButton").addEventListener("click", shareReportState);

// Function to share the current report state
function shareReportState() {
    // Get the embedded report
    var report = powerbi.get(document.getElementById("embedContainer"));

    // Get the current report state
    report.getFilters()
        .then(function (filters) {
            // Get the current page
            return report.getActivePage().then(function (page) {
                return {
                    filters: filters,
                    pageName: page.name
                };
            });
        })
        .then(function (state) {
            // Generate a URL with the state information
            var stateString = JSON.stringify(state);
            var encodedState = encodeURIComponent(stateString);
            var currentUrl = window.location.href.split('?')[0]; // Remove any existing query parameters
            var shareableUrl = currentUrl + "?reportState=" + encodedState;

            // Display the shareable URL to the user
            alert("Shareable URL: " + shareableUrl);
            // Optionally, you could copy the URL to the clipboard here
        })
        .catch(function (error) {
            console.error("Error getting report state:", error);
        });
}

// Function to apply the saved state when loading the report
function applySavedState() {
    var urlParams = new URLSearchParams(window.location.search);
    var savedState = urlParams.get('reportState');

    if (savedState) {
        try {
            var state = JSON.parse(decodeURIComponent(savedState));
            var report = powerbi.get(document.getElementById("embedContainer"));

            // Apply the saved filters
            report.setFilters(state.filters)
                .then(function () {
                    // Navigate to the saved page
                    return report.setPage(state.pageName);
                })
                .catch(function (error) {
                    console.error("Error applying saved state:", error);
                });
        } catch (error) {
            console.error("Error parsing saved state:", error);
        }
    }
}

// Call applySavedState when the report is loaded
document.addEventListener("DOMContentLoaded", function() {
    // Ensure the report is fully loaded before applying the state
    var report = powerbi.get(document.getElementById("embedContainer"));
    report.on("loaded", applySavedState);
});
