// src/components/Navbar.jsx
import React, { useContext, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Menu,
  MenuItem,
  useTheme,
} from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const theme = useTheme();
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Login dropdown
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleLogin = (role) => {
    handleMenuClose();
    navigate("/login", { state: { roleHint: role } });
  };

  // helper to style nav links
  const navLink = (to) => ({
    color: pathname === to ? theme.palette.primary.main : theme.palette.text.primary,
    textTransform: "none",
    fontWeight: 500,
    mx: 1,
    position: "relative",
    "&:after": {
      content: '""',
      position: "absolute",
      width: pathname === to ? "100%" : 0,
      height: 2,
      bgcolor: theme.palette.primary.main,
      bottom: -2,
      left: 0,
      transition: "width 0.3s ease",
    },
    "&:hover:after": {
      width: "100%",
    },
  });

  return (
    <AppBar
      position="fixed"
      elevation={2}
      sx={{
        backgroundColor: "rgba(255,255,255,0.9)",
        backdropFilter: "blur(8px)",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", px: { xs: 2, md: 4 } }}>
        {/* Brand */}
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            textDecoration: "none",
            letterSpacing: 1.5,
            fontWeight: 700,
            color: theme.palette.primary.main,
          }}
        >
          E-ASSESSMENT PORTAL
        </Typography>

        {/* Navigation Links */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Button component={Link} to="/" sx={navLink("/")}>
            Home
          </Button>
          <Button component={Link} to="/about" sx={navLink("/about")}>
            About
          </Button>
          <Button component={Link} to="/support" sx={navLink("/support")}>
            Support
          </Button>
          <Button component={Link} to="/feedback" sx={navLink("/feedback")}>
            Feedback
          </Button>
        </Box>

        {/* Auth Actions */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {user ? (
            <>
              {user.role === "admin" && (
                <Button component={Link} to="/admin" sx={navLink("/admin")}>
                  Admin
                </Button>
              )}
              <Button
                onClick={handleLogout}
                sx={{
                  textTransform: "none",
                  ml: 2,
                  color: theme.palette.error.main,
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={handleMenuOpen}
                endIcon={<ArrowDropDownIcon />}
                sx={{
                  textTransform: "none",
                  fontWeight: 500,
                  mx: 1,
                  color: theme.palette.text.primary,
                }}
              >
                Login
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                PaperProps={{ elevation: 3 }}
              >
                <MenuItem onClick={() => handleLogin("student")}>
                  Student
                </MenuItem>
                <MenuItem onClick={() => handleLogin("teacher")}>
                  Teacher
                </MenuItem>
                <MenuItem onClick={() => handleLogin("admin")}>
                  Admin
                </MenuItem>
              </Menu>
              <Button
                component={Link}
                to="/register"
                sx={{
                  textTransform: "none",
                  fontWeight: 500,
                  ml: 1,
                  color: theme.palette.primary.main,
                }}
              >
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
