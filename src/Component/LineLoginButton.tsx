import React from "react";
import { generateGUID } from "../Utility/generateGUID";
const LineLoginButton: React.FC = () => {
    const clientId = process.env.REACT_APP_LINE_CLIENT_ID;
    const redirectUri = process.env.REACT_APP_LINE_REDIREC_UTRL ?? '';
    console.log(process.env.REACT_APP_LINE_CLIENT_ID);
    console.log(process.env.REACT_APP_LINE_REDIREC_UTRL);
    const handleLogin = () => {

        const state = generateGUID();
        const scope = 'profile openid email';


        const loginUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
            redirectUri
        )}&state=${state}&scope=${encodeURIComponent(scope)}`;

        window.location.href = loginUrl;
    };

    return (
        <button
            type="button"
            onClick={() => {
                handleLogin();
            }}
            style={{
                backgroundColor: "#09b852ff", // LINE Green
                color: "white",
                fontWeight: "bold",
                border: "none",
                borderRadius: "8px",
                padding: "12px 20px",
                fontSize: "16px",
                cursor: "pointer",
                display: "flex",

                alignItems: "center",      // จัดกลางแนวตั้ง
                justifyContent: "center",  // ✅ จัดกลางแนวนอน

                gap: "8px",
                width: '100%',

            }}
        >
            <img
                src="/line.png" // ใช้จาก public folder
                alt="LINE"
                style={{ width: "24px", height: "24px" }}
            />
            Log in with LINE
        </button>
    );
};

export default LineLoginButton;
