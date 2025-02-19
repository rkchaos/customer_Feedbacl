(() => {
    console.log("Feedback widget script loaded successfully!")

    function getScriptQueryParam() {
        const scriptSrc = document.currentScript.src
        const urlParams = new URLSearchParams(scriptSrc.split("?")[1])
        return urlParams.get("fromid")
    }

    const fromid = getScriptQueryParam()
    console.log(fromid)

    if (!fromid) {
        console.error("fromid not provided!")
        return
    }

    // Remove existing widget if already present
    const existingWidget = document.getElementById("feedback-widget")
    if (existingWidget) {
        existingWidget.remove()
        console.log("Old widget removed.")
    }

    // Create a container for feedback boxes
    const widgetContainer = document.createElement("div")
    widgetContainer.id = "feedback-widget"
    widgetContainer.style.position = "fixed"
    widgetContainer.style.top = "50%"
    widgetContainer.style.left = "50%"
    widgetContainer.style.transform = "translate(-50%, -50%)"
    widgetContainer.style.display = "flex"
    widgetContainer.style.flexDirection = "column"
    widgetContainer.style.background = "#fff"
    widgetContainer.style.padding = "20px"
    widgetContainer.style.borderRadius = "12px"
    widgetContainer.style.boxShadow = "0 8px 32px rgba(0,0,0,0.12)"
    // widgetContainer.style.zIndex = "9999"
    widgetContainer.style.width = "95vw"
    widgetContainer.style.maxWidth = "1200px"
    widgetContainer.style.maxHeight = "90vh"
    widgetContainer.style.transition = "all 0.3s ease"

    // Add header with title and close button
    const header = document.createElement("div")
    header.style.display = "flex"
    header.style.justifyContent = "space-between"
    header.style.alignItems = "center"
    header.style.marginBottom = "20px"
    header.style.paddingBottom = "15px"
    header.style.borderBottom = "1px solid #eee"

    const title = document.createElement("h2")
    title.textContent = "Customer Feedback"
    title.style.margin = "0"
    title.style.fontSize = "1.5rem"
    title.style.color = "#2d3748"
    title.style.fontWeight = "600"

    const closeButton = document.createElement("button")
    closeButton.innerHTML = "×"
    closeButton.style.background = "none"
    closeButton.style.border = "none"
    closeButton.style.fontSize = "24px"
    closeButton.style.color = "#666"
    closeButton.style.cursor = "pointer"
    closeButton.style.padding = "4px 8px"
    closeButton.style.borderRadius = "4px"
    closeButton.style.transition = "all 0.2s"
    closeButton.addEventListener("mouseover", () => {
        closeButton.style.background = "#f3f4f6"
        closeButton.style.color = "#2d3748"
    })
    closeButton.addEventListener("mouseout", () => {
        closeButton.style.background = "none"
        closeButton.style.color = "#666"
    })
    closeButton.addEventListener("click", () => {
        // Instead of removing the entire widget, just clear the feedback container
        feedbackContainer.innerHTML = ""
        // Remove the "View All" button if it exists
        const viewAllBtn = document.querySelector("#view-all-btn")
        if (viewAllBtn) {
            viewAllBtn.remove()
        }
        // Add a "Show Feedback" button to reopen the feedback
        const showFeedbackBtn = createShowFeedbackButton()
        feedbackContainer.appendChild(showFeedbackBtn)
    })

    header.appendChild(title)
    header.appendChild(closeButton)
    widgetContainer.appendChild(header)

    // Create feedback container
    const feedbackContainer = document.createElement("div")
    feedbackContainer.style.display = "grid"
    feedbackContainer.style.gap = "16px"
    feedbackContainer.style.overflowY = "auto"
    feedbackContainer.style.padding = "4px"
    feedbackContainer.style.scrollbarWidth = "thin"
    feedbackContainer.style.scrollbarColor = "#cbd5e0 #f1f5f9"

    // Responsive grid layout
    const updateGridColumns = () => {
        const containerWidth = widgetContainer.offsetWidth
        if (containerWidth < 640) {
            feedbackContainer.style.gridTemplateColumns = "1fr"
        } else if (containerWidth < 960) {
            feedbackContainer.style.gridTemplateColumns = "repeat(2, 1fr)"
        } else if (containerWidth < 1280) {
            feedbackContainer.style.gridTemplateColumns = "repeat(3, 1fr)"
        } else {
            feedbackContainer.style.gridTemplateColumns = "repeat(4, 1fr)"
        }
    }

    // Update grid on resize
    window.addEventListener("resize", updateGridColumns)

    widgetContainer.appendChild(feedbackContainer)
    document.body.appendChild(widgetContainer)

    function createFeedbackBox(feedback) {
        const feedbackBox = document.createElement("div")
        feedbackBox.style.background = "#f8fafc"
        feedbackBox.style.padding = "16px"
        feedbackBox.style.borderRadius = "8px"
        feedbackBox.style.boxShadow = "0 2px 4px rgba(0,0,0,0.06)"
        feedbackBox.style.border = "1px solid #e2e8f0"
        feedbackBox.style.transition = "transform 0.2s, box-shadow 0.2s"
        feedbackBox.style.minHeight = "150px"
        feedbackBox.style.display = "flex"
        feedbackBox.style.flexDirection = "column"

        feedbackBox.addEventListener("mouseover", () => {
            feedbackBox.style.transform = "translateY(-2px)"
            feedbackBox.style.boxShadow = "0 4px 6px rgba(0,0,0,0.08)"
        })

        feedbackBox.addEventListener("mouseout", () => {
            feedbackBox.style.transform = "translateY(0)"
            feedbackBox.style.boxShadow = "0 2px 4px rgba(0,0,0,0.06)"
        })

        feedbackBox.innerHTML = `
            <h4 style="margin: 0 0 8px; font-size: 1.1rem; font-weight: 600; color: #2d3748;">Feedback</h4>
            <p style="margin: 0 0 12px; font-size: 0.875rem; color: #64748b;">${feedback.submittedAt}</p>
            <p style="margin: 0; font-size: 0.9375rem; color: #334155; line-height: 1.5; flex-grow: 1;">${feedback.content || "No content available"}</p>
        `

        return feedbackBox
    }

    function createShowFeedbackButton() {
        const button = document.createElement("button")
        button.innerText = "Show Feedback"
        button.style.padding = "10px 20px"
        button.style.border = "none"
        button.style.borderRadius = "6px"
        button.style.background = "#3b82f6"
        button.style.color = "#fff"
        button.style.cursor = "pointer"
        button.style.fontSize = "0.9375rem"
        button.style.fontWeight = "500"
        button.style.margin = "auto"
        button.style.transition = "all 0.2s"
        button.style.boxShadow = "0 2px 4px rgba(59, 130, 246, 0.3)"

        button.addEventListener("mouseover", () => {
            button.style.background = "#2563eb"
            button.style.transform = "translateY(-1px)"
            button.style.boxShadow = "0 4px 6px rgba(59, 130, 246, 0.4)"
        })

        button.addEventListener("mouseout", () => {
            button.style.background = "#3b82f6"
            button.style.transform = "translateY(0)"
            button.style.boxShadow = "0 2px 4px rgba(59, 130, 246, 0.3)"
        })

        button.addEventListener("click", () => {
            displayFeedback(4)
        })

        return button
    }

    function createViewAllButton() {
        const buttonContainer = document.createElement("div")
        buttonContainer.style.display = "flex"
        buttonContainer.style.justifyContent = "center"
        buttonContainer.style.marginTop = "20px"

        const button = document.createElement("button")
        button.id = "view-all-btn"
        button.innerText = "View All Feedback"
        button.style.padding = "10px 20px"
        button.style.border = "none"
        button.style.borderRadius = "6px"
        button.style.background = "#3b82f6"
        button.style.color = "#fff"
        button.style.cursor = "pointer"
        button.style.fontSize = "0.9375rem"
        button.style.fontWeight = "500"
        button.style.transition = "all 0.2s"
        button.style.boxShadow = "0 2px 4px rgba(59, 130, 246, 0.3)"

        button.addEventListener("mouseover", () => {
            button.style.background = "#2563eb"
            button.style.transform = "translateY(-1px)"
            button.style.boxShadow = "0 4px 6px rgba(59, 130, 246, 0.4)"
        })

        button.addEventListener("mouseout", () => {
            button.style.background = "#3b82f6"
            button.style.transform = "translateY(0)"
            button.style.boxShadow = "0 2px 4px rgba(59, 130, 246, 0.3)"
        })

        button.addEventListener("click", () => {
            buttonContainer.remove()
            displayFeedback()
        })

        buttonContainer.appendChild(button)
        return buttonContainer
    }

    function displayFeedback(limit = null) {
        feedbackContainer.innerHTML = ""
        const displayedFeedbacks = limit ? feedbacks.slice(0, limit) : feedbacks
        
        displayedFeedbacks.forEach(feedback => feedbackContainer.appendChild(createFeedbackBox(feedback)))
        updateGridColumns()

        if (limit && feedbacks.length > limit) {
            widgetContainer.appendChild(createViewAllButton())
        }
    }

    let feedbacks = []

    // Fetch feedbacks using POST request
    fetch(`https://customer-feedbacl.onrender.com/GetFeedback/${fromid}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.json())
        .then((data) => {
            console.log("Fetched Feedbacks:", data.form)

            if (!data.form || data.form.length === 0) {
                feedbackContainer.innerHTML = `
                    <div style="text-align: center; padding: 40px; color: #64748b; font-size: 1rem;">
                        No feedback available at this time.
                    </div>
                `
                return
            }

            feedbacks = data.form
            displayFeedback(4)
        })
        .catch((error) => {
            console.error("Error fetching feedbacks:", error)
            feedbackContainer.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #dc2626; font-size: 1rem;">
                    Failed to load feedback. Please try again later.
                </div>
            `
        })

    // Ensure widget is removed when the script itself is removed
    document.currentScript.remove()
})()