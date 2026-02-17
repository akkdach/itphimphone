import { Home, Padding, Person } from "@mui/icons-material";
import { BottomNavigation, BottomNavigationAction, Box } from "@mui/material";
import React from "react";
import Profile from "../Pages/Profile";
import { useNavigate } from "react-router-dom";
import ImageIcon from "../Component/ImageIcon";
import HomeImage from '../assets/HomeImage.png'
import Menu4 from '../assets/Menu4.png'

export default function Footer() {
  const [value, setValue] = React.useState(0);

  const navigate = useNavigate();

  return (
    <div style={{ height: 100 }}>
      <Box sx={{ width: '100%', position: 'fixed', bottom: 0, margin: 'auto' }}>
        <BottomNavigation
          style={{ padding: 5 }}
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
        >
          <BottomNavigationAction onClick={() => navigate('/')} label="Home" icon={<ImageIcon image={HomeImage} alt="Home" size={48} />} />
          <BottomNavigationAction onClick={() => navigate('profile')} label="Profile" icon={<ImageIcon image={Menu4} alt="Profile" size={48} />} />
        </BottomNavigation>
      </Box>
    </div>
  );
}