import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Button,
  Divider,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Group,
  Book,
  CalendarToday,
  LibraryBooks,
  AccountCircle,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const drawerWidth = 280;

const DashboardLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully ✅");
    navigate("/login");
  };

  const navItems = [
    { text: "Study Groups", icon: <Group />, path: "/study-groups" },
    { text: "Courses", icon: <Book />, path: "/courses" },
    { text: "Planner", icon: <CalendarToday />, path: "/planner" },
    { text: "Resources", icon: <LibraryBooks />, path: "/resources" },
    { text: "Profile", icon: <AccountCircle />, path: "/profile" },
  ];

  const drawer = (
    <Box
      sx={{
        height: "100%",
        bgcolor: "#111827",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        p: 2,
      }}
    >
      {/* App Logo / Brand */}
      <Box sx={{ px: 2, py: 3, textAlign: "center" }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: 800, letterSpacing: 1, color: "#6366f1" }}
        >
          STUDYFLUX
        </Typography>
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.1)", mb: 3 }} />

      {/* User Info */}
      <Box sx={{ mb: 4, px: 2, textAlign: "center" }}>
        <Avatar
          sx={{
            mx: "auto",
            mb: 1.5,
            width: 60,
            height: 60,
            bgcolor: "#6366f1",
            boxShadow: "0 0 20px rgba(99, 102, 241, 0.4)",
          }}
        >
          {user?.name?.charAt(0).toUpperCase()}
        </Avatar>
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          {user?.name}
        </Typography>
        <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.5)" }}>
          {user?.email}
        </Typography>
      </Box>

      {/* Navigation Links */}
      <List sx={{ flexGrow: 1 }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                component={Link}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                sx={{
                  borderRadius: 2,
                  py: 1.2,
                  px: 2,
                  transition: "all 0.2s",
                  bgcolor: isActive
                    ? "rgba(99, 102, 241, 0.15)"
                    : "transparent",
                  color: isActive ? "#818cf8" : "rgba(255,255,255,0.7)",
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.05)",
                    color: "#fff",
                  },
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {isActive && (
                  <Box
                    sx={{
                      position: "absolute",
                      left: 0,
                      top: "20%",
                      bottom: "20%",
                      width: 4,
                      bgcolor: "#6366f1",
                      borderRadius: "0 4px 4px 0",
                    }}
                  />
                )}
                <ListItemIcon
                  sx={{
                    color: "inherit",
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isActive ? "bold" : "medium",
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Logout Button */}
      <Box sx={{ pt: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{
            py: 1.5,
            borderRadius: 2,
            borderColor: "rgba(255,255,255,0.2)",
            color: "rgba(255,255,255,0.7)",
            textTransform: "none",
            "&:hover": {
              borderColor: "#ef4444",
              color: "#ef4444",
              bgcolor: "rgba(239, 68, 68, 0.1)",
            },
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f9fafb" }}>
      <ToastContainer />

      {/* Sidebars */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              borderRight: "none",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Modern Navbar */}
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            bgcolor: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(8px)",
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton
                color="inherit"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { sm: "none" }, color: "#111827" }}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, color: "#111827" }}
              >
                {navItems.find((item) => item.path === location.pathname)
                  ?.text || "Dashboard"}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography
                variant="body2"
                sx={{
                  display: { xs: "none", md: "block" },
                  color: "text.secondary",
                  fontWeight: 500,
                }}
              >
                Hello, {user?.name}
              </Typography>
              <Avatar
                sx={{
                  width: 35,
                  height: 35,
                  bgcolor: "#6366f1",
                  fontSize: "0.9rem",
                  cursor: "pointer",
                }}
                onClick={() => navigate("/profile")}
              >
                {user?.name?.charAt(0).toUpperCase()}
              </Avatar>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Dynamic Page Content */}
        <Box
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            flexGrow: 1,
            overflowY: "auto",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
