// src/pages/LineCallback.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const LineCallback: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchTokenAndProfile = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");
      const state = urlParams.get("state");

      if (!code) return;

      try {
        // 1. แลก code เป็น access token
        const tokenRes = await axios.post(
          "https://api.line.me/oauth2/v2.1/token",
          new URLSearchParams({
            grant_type: "authorization_code",
            code,
            redirect_uri: "http://localhost:3000/callback", // ต้องตรงกับที่ตั้งใน LINE Console
            client_id: "YOUR_CHANNEL_ID",
            client_secret: "YOUR_CHANNEL_SECRET",
          }),
          {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
          }
        );

        const accessToken = tokenRes.data.access_token;

        // 2. ดึงข้อมูล profile
        const profileRes = await axios.get("https://api.line.me/v2/profile", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        setProfile(profileRes.data);
      } catch (err) {
        console.error("LINE login error:", err);
      }
    };

    fetchTokenAndProfile();
  }, []);

  return (
    <div>
      <h2>LINE Login Callback</h2>
      {profile ? (
        <div>
          <p>ID: {profile.userId}</p>
          <p>Name: {profile.displayName}</p>
          <img src={profile.pictureUrl} alt="profile" />
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default LineCallback;
