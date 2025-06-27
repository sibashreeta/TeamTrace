// src/pages/EmployeeDashboardPage.tsx
import React, { useState } from "react";
import {
  AppBar,
  Box,
  Container,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  Paper,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AttendanceButtons from "../components/AttendanceButtons";
import MyAttendanceLogs from "./MyAttendanceLogs";
import MarkLeaveButton from "../components/MarkLeaveButton";
import EmployeeAvailabilityBoard from "../components/EmployeeAvailabilityBoard";
import ChatUserList from "../components/chat/ChatUserList";

const drawerWidth = 240;

const EmployeeDashboardPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState("attendance");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleMenuClick = (page: string) => {
    setSelectedPage(page);
    if (isMobile) setMobileOpen(false);
  };

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6">Employee Menu</Typography>
      </Toolbar>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => handleMenuClick("attendance")}>
            <ListItemText primary="Attendance & Logs" />
          </ListItemButton>
        </ListItem>
        <Divider />

        <ListItem disablePadding>
          <ListItemButton onClick={() => handleMenuClick("availability")}>
            <ListItemText primary="Availability Board" />
          </ListItemButton>
        </ListItem>
        <Divider />

        <ListItem disablePadding>
          <ListItemButton onClick={() => handleMenuClick("chat")}>
            <ListItemText primary="Chat" />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: "#1976d2",
        }}
      >
        <Toolbar sx={{ justifyContent: "center" }}>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ position: "absolute", left: 16 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap>
            Employee Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
          bgcolor: "#f5f7fa",
          minHeight: "100vh",
        }}
      >
        <Container maxWidth="lg">
          <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, mb: 4 }}>
            {selectedPage === "attendance" && (
              <>
                <Typography variant="h5" gutterBottom>
                  Mark Attendance
                </Typography>
                <AttendanceButtons />
                <MarkLeaveButton />
                <MyAttendanceLogs />
              </>
            )}

            {selectedPage === "availability" && (
              <>
                <Typography variant="h5" gutterBottom>
                  Real-Time Availability
                </Typography>
                <EmployeeAvailabilityBoard />
              </>
            )}

            {selectedPage === "chat" && (
              <>
                <Typography variant="h5" gutterBottom>
                  Chat with Team
                </Typography>
                <ChatUserList />
              </>
            )}
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default EmployeeDashboardPage;
