import React from 'react';
import { Copy } from 'lucide-react';
import { useLocation } from 'react-router-dom'
function Instruction() {
    let location = useLocation()
    let { formid } = location.state || ''

    const copyToClipboard = (text) => {
        navigator.clipboard.write([
            new Instruction({
                'text/plain': new Blob([text], { type: 'text/plain' }),
            }),
        ]);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="w-full h-[400px] relative overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&q=80&w=2070"
                    alt="Code Editor"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-purple-600/90 mix-blend-multiply" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center">
                        Feedback Widget Integration Guide
                    </h1>
                </div>
            </div>

            {/* Steps Section */}
            <div className="max-w-6xl mx-auto px-4 py-16">
                <div className="space-y-12">
                    {/* Step 1 */}
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Step 1: Create feedback-widget.js</h2>
                            <p className="text-gray-600 mb-4">Create this file in your public folder to handle the widget functionality Name feedback-widget.js.</p>
                            <div className="relative">
                                <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
                                    <code className="text-sm font-mono">{`(() => {
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
        const feedbackContainer = document.querySelector("#feedback-widget")
        feedbackContainer.innerHTML = ""
    })

    header.appendChild(title)
    header.appendChild(closeButton)
    widgetContainer.appendChild(header)

    document.body.appendChild(widgetContainer)

})();`}</code>
                                </pre>
                                <button
                                    onClick={() =>
                                        copyToClipboard(`(() => {
    console.log("Feedback widget script loaded successfully!");

    function getScriptQueryParam() {
        const scriptSrc = document.currentScript.src;
        const urlParams = new URLSearchParams(scriptSrc.split("?")[1]);
        return urlParams.get("fromid");
    }

    const fromid = getScriptQueryParam();
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

    // Create a container for feedback boxes
    const widgetContainer = document.createElement("div");
    widgetContainer.id = "feedback-widget";
    widgetContainer.style.position = "fixed";
    widgetContainer.style.top = "50%";
    widgetContainer.style.left = "50%";
    widgetContainer.style.transform = "translate(-50%, -50%)";
    widgetContainer.style.display = "flex";
    widgetContainer.style.flexDirection = "column";
    widgetContainer.style.background = "#fff";
    widgetContainer.style.padding = "20px";
    widgetContainer.style.borderRadius = "12px";
    widgetContainer.style.boxShadow = "0 8px 32px rgba(0,0,0,0.12)";
    widgetContainer.style.width = "95vw";
    widgetContainer.style.maxWidth = "1200px";
    widgetContainer.style.maxHeight = "90vh";
    widgetContainer.style.transition = "all 0.3s ease";

    // Add header with title and close button
    const header = document.createElement("div");
    header.style.display = "flex";
    header.style.justifyContent = "space-between";
    header.style.alignItems = "center";
    header.style.marginBottom = "20px";
    header.style.paddingBottom = "15px";
    header.style.borderBottom = "1px solid #eee";

    const title = document.createElement("h2");
    title.textContent = "Customer Feedback";
    title.style.margin = "0";
    title.style.fontSize = "1.5rem";
    title.style.color = "#2d3748";
    title.style.fontWeight = "600";

    const closeButton = document.createElement("button");
    closeButton.innerHTML = "×";
    closeButton.style.background = "none";
    closeButton.style.border = "none";
    closeButton.style.fontSize = "24px";
    closeButton.style.color = "#666";
    closeButton.style.cursor = "pointer";
    closeButton.style.padding = "4px 8px";
    closeButton.style.borderRadius = "4px";
    closeButton.style.transition = "all 0.2s";
    closeButton.addEventListener("mouseover", () => {
        closeButton.style.background = "#f3f4f6";
        closeButton.style.color = "#2d3748";
    });
    closeButton.addEventListener("mouseout", () => {
        closeButton.style.background = "none";
        closeButton.style.color = "#666";
    });
    closeButton.addEventListener("click", () => {
        const feedbackContainer = document.querySelector("#feedback-widget");
        feedbackContainer.innerHTML = "";
    });

    header.appendChild(title);
    header.appendChild(closeButton);
    widgetContainer.appendChild(header);

    document.body.appendChild(widgetContainer);

})();`)
                                    }
                                    className="absolute top-4 right-4 p-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    <Copy />

                                </button>


                            </div>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Step 2: Create FeedbackWidget Component</h2>
                            <p className="text-gray-600 mb-4">Create a React component to manage the widget integration.</p>
                            <div className="relative">
                                <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
                                    <code className="text-sm font-mono">{`
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const FeedbackWidget = ({ fromid }) => {
    const location = useLocation();

    useEffect(() => {
        const scriptId = "feedback-widget-script";
        const widgetId = "feedback-widget";

        function addScript() {
            if (!document.getElementById(scriptId)) {
                const script = document.createElement("script");
                script.src = \`https://customer-feedbacl-iboy.vercel.app/feedback-widget.js?fromid=\${fromid}\`;
                script.async = true;
                script.id = scriptId;
                document.body.appendChild(script);
                // console.log("Script added!");
            }
        }

        function removeWidget() {
            const widget = document.getElementById(widgetId);
            if (widget) {
                widget.remove();
                // console.log("Widget removed!");
            }
        }

        function removeScript() {
            console.log("Removing script...");
            document.getElementById(scriptId)?.remove();
            removeWidget();
        }

        if (location.pathname === "/workspace") {
            addScript();
        } else {
            removeScript();
        }

        return () => {
            removeScript(); // Cleanup on unmount or route change
        };
    }, [location.pathname]);

    return null;
};

export default FeedbackWidget;
`}</code>

                                </pre>
                                <button
                                    onClick={() => copyToClipboard(`import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const FeedbackWidget = ({ fromid }) => {
    const location = useLocation();

    useEffect(() => {
        const scriptId = "feedback-widget-script";
        const widgetId = "feedback-widget";

        function addScript() {
            if (!document.getElementById(scriptId)) {
                const script = document.createElement("script");
                script.src = \`https://customer-feedbacl-iboy.vercel.app/feedback-widget.js?fromid=\${fromid}\`;
                script.async = true;
                script.id = scriptId;
                document.body.appendChild(script);
                // console.log("Script added!");
            }
        }

        function removeWidget() {
            const widget = document.getElementById(widgetId);
            if (widget) {
                widget.remove();
                // console.log("Widget removed!");
            }
        }

        function removeScript() {
            console.log("Removing script...");
            document.getElementById(scriptId)?.remove();
            removeWidget();
        }

        if (location.pathname === "/workspace") {
            addScript();
        } else {
            removeScript();
        }

        return () => {
            removeScript(); // Cleanup on unmount or route change
        };
    }, [location.pathname]);

    return null;
};

export default FeedbackWidget;`)}
                                    className="absolute top-4 right-4 p-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    <Copy size={20} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Step 3: Implement the Widget</h2>
                            <p className="text-gray-600 mb-4">Import and use the FeedbackWidget component in your desired page.</p>
                            <div className="relative">
                                <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
                                    <code className="text-sm font-mono">{`import FeedbackWidget from './components/FeedbackWidget';

function WorkspacePage() {
    const fromid = "${formid}";
    
    return (
        <div>
            <h1>Workspace</h1>
            <FeedbackWidget fromid={fromid} />
        </div>
    );
}`}</code>
                                </pre>
                                <button
                                    onClick={() => copyToClipboard(`import FeedbackWidget from './components/FeedbackWidget';

function WorkspacePage() {
    const fromid =  '${formid}';
    
    return (
        <div>
            <h1>Workspace</h1>
            <FeedbackWidget fromid={fromid} />
        </div>
    );
}`)}
                                    className="absolute top-4 right-4 p-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    <Copy size={20} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Important Note */}
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-blue-800 mb-2">Important Note</h3>
                        <p className="text-blue-700">
                            To customize the widget's appearance, make sure to use the local path <code className="bg-blue-100 px-2 py-1 rounded">./feedback-widget.js</code> instead of the remote URL. This allows you to modify the styles and behavior according to your needs.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Instruction;
