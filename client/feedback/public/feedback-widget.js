(function () {
    console.log("Feedback widget script loaded successfully!");

    function getScriptQueryParam() {
        const scriptSrc = document.currentScript.src; 
        const urlParams = new URLSearchParams(scriptSrc.split('?')[1]); 
        return urlParams.get('fromid');
    }

    let fromid = getScriptQueryParam();
    console.log(fromid);

    if (!fromid) {
        console.error("fromid not provided!");
        return;
    }

    // Remove existing widget if already present
    const existingWidget = document.getElementById("feedback-widget");
    if (existingWidget) {
        existingWidget.remove();
        console.log("Old widget removed.");
    }

    // Create a new feedback widget
    const widget = document.createElement("div");
    widget.id = "feedback-widget";
    widget.style.position = "fixed";
    widget.style.bottom = "20px";
    widget.style.right = "20px";
    widget.style.background = "#fff";
    widget.style.padding = "10px";
    widget.style.border = "1px solid #ddd";
    widget.style.boxShadow = "2px 2px 10px rgba(0,0,0,0.1)";
    widget.innerHTML = "<h3>Feedback Widget</h3><p>Leave your feedback below:</p>";

    document.body.appendChild(widget);

    // Function to remove the widget when navigating away
    function removeWidget() {
        const widget = document.getElementById("feedback-widget");
        if (widget) {
            widget.remove();
            console.log("Widget removed on page navigation.");
        }
    }

    // Listen for route changes to remove widget
    window.addEventListener("popstate", removeWidget);

    // Fetch feedbacks using POST request
    fetch(`http://localhost:8080/GetFeedback/${fromid}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(feedbacks => {
        console.log("Fetched Feedbacks:", feedbacks.form);
        widget.innerHTML += "<ul>";
        feedbacks.form.forEach(fb => {
            widget.innerHTML += `<li>${fb.submittedAt}</li>`;
        });
        widget.innerHTML += "</ul>";
    })
    .catch(error => console.error("Error fetching feedbacks:", error));

    // Ensure widget is removed when the script itself is removed
    document.currentScript.remove();
})();
