import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import callApi from "../../Services/callApi";
import Swal from "sweetalert2";

const CallbackPage = () => {
    
    const navigate = useNavigate();
    useEffect(() => {
        // ดึง token จาก query string
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (token) {
            // ✅ เก็บ token ลง localStorage
            localStorage.setItem("token", token);
            setTimeout(()=>{
                getProfile();
            },1500)
            // ✅ Redirect ไปหน้า Dashboard
            navigate("/dashboard");
        } else {
            console.error("Token not found in URL");
            navigate("/login");
        }
    }, [navigate]);

    const getProfile = async () => {
        const resultProfile = await callApi.get('/user/info');

        if (resultProfile.data?.data) {
            localStorage.setItem('profile', JSON.stringify(resultProfile.data?.data));
            window.location.replace('/');
        } else {
            window.location.replace('/');
        }
    }

    return <div>Processing login...</div>;
};

export default CallbackPage;