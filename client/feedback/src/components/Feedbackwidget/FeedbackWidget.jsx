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
                script.src = `./feedback-widget.js?fromid=${fromid}`;
                script.async = true;
                script.id = scriptId;
                document.body.appendChild(script);
                console.log("Script added!");
            }
        }

        function removeWidget() {
            const widget = document.getElementById(widgetId);
            if (widget) {
                widget.remove();
                console.log("Widget removed!");
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
