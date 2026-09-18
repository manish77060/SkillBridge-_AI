import React from "react";
import { Phone, Mail, LogIn } from "lucide-react";

export default function LandingTopBar() {
    const handleLogin = () => {
    window.location.href = "/login";
};

return (
    <div className="landing-topbar">

    <div className="landing-contact">

    <div className="landing-contact-item">
    <Phone size={17} />
    <span>Call us : 0120-4806824</span>
    </div>

    <div className="landing-contact-item">
    <Mail size={17} />
    <span>Email : support@skillbridge.ai</span>
    </div>

    </div>

    <button
    className="landing-login"
    onClick={handleLogin}
    >
    <LogIn size={17} />
    <span>Log in</span>
    </button>

    </div>
);
}