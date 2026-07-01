"use client";

import type React from "react";

import useUserInfo from "@/hooks/useUserInfo";
import { logoutUser } from "@/services/actions/logoutUser";
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
  Avatar,
  Divider,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";

const Navbar = () => {
  const userInfo = useUserInfo();

  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(
    null
  );

  const handleLogOut = () => {
    logoutUser(router);
    setUserMenuAnchor(null);
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ py: 1 }}>
          {/* Logo */}
          <Typography
            variant="h5"
            component={Link}
            href="/"
            sx={{
              fontWeight: 700,
              color: "white",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexGrow: isMobile ? 1 : 0,
              mr: isMobile ? 0 : 4,
            }}
          >
            <LocalHospitalIcon sx={{ fontSize: 28 }} />
            health
            <Box component="span" sx={{ color: "#e3f2fd" }}>
              Bridge
            </Box>
          </Typography>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Stack direction="row" spacing={4} sx={{ flexGrow: 1 }}>
              <Typography
                component={Link}
                href="/consultation"
                sx={{
                  color: "white",
                  textDecoration: "none",
                  fontWeight: 500,
                  "&:hover": { color: "#e3f2fd" },
                  transition: "color 0.2s",
                }}
              >
                Consultation
              </Typography>
              <Typography
                component={Link}
                href="/doctors"
                sx={{
                  color: "white",
                  textDecoration: "none",
                  fontWeight: 500,
                  "&:hover": { color: "#e3f2fd" },
                  transition: "color 0.2s",
                }}
              >
                Doctors
              </Typography>
              <Typography
                sx={{
                  color: "white",
                  fontWeight: 500,
                  cursor: "pointer",
                  "&:hover": { color: "#e3f2fd" },
                  transition: "color 0.2s",
                }}
              >
                Diagnostics
              </Typography>
            </Stack>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              color="inherit"
              onClick={handleMobileMenuOpen}
              sx={{ ml: "auto" }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Desktop User Menu */}
          {!isMobile && (
            <Box>
              {userInfo?.email ? (
                <IconButton
                  onClick={handleUserMenuOpen}
                  sx={{
                    color: "white",
                    "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                  }}
                >
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: "rgba(255,255,255,0.2)",
                    }}
                  >
                    <AccountCircleIcon />
                  </Avatar>
                </IconButton>
              ) : (
                <Button
                  component={Link}
                  href="/login"
                  variant="outlined"
                  sx={{
                    color: "white",
                    borderColor: "white",
                    "&:hover": {
                      borderColor: "#e3f2fd",
                      backgroundColor: "rgba(255,255,255,0.1)",
                    },
                  }}
                >
                  Login
                </Button>
              )}
            </Box>
          )}
        </Toolbar>
      </Container>

      {/* Mobile Menu */}
      <Menu
        anchorEl={mobileMenuAnchor}
        open={Boolean(mobileMenuAnchor)}
        onClose={handleMobileMenuClose}
        PaperProps={{
          sx: { mt: 1, minWidth: 200 },
        }}
      >
        <MenuItem
          component={Link}
          href="/consultation"
          onClick={handleMobileMenuClose}
        >
          Consultation
        </MenuItem>
        <MenuItem
          component={Link}
          href="/doctors"
          onClick={handleMobileMenuClose}
        >
          Doctors
        </MenuItem>
        <MenuItem onClick={handleMobileMenuClose}>Diagnostics</MenuItem>
        {userInfo?.email ? [
          <Divider key="divider" />,
          <MenuItem
            key="dashboard"
            component={Link}
            href={`/dashboard/${userInfo.role}`}
            onClick={handleMobileMenuClose}
          >
            <DashboardIcon sx={{ mr: 1 }} />
            Dashboard
          </MenuItem>,
          <MenuItem
            key="profile"
            component={Link}
            href="/profile"
            onClick={handleMobileMenuClose}
          >
            <PersonIcon sx={{ mr: 1 }} />
            Profile
          </MenuItem>,
          <MenuItem
            key="logout"
            onClick={() => {
              handleLogOut();
              handleMobileMenuClose();
            }}
          >
            <LogoutIcon sx={{ mr: 1 }} />
            Logout
          </MenuItem>,
        ] : (
          <MenuItem
            component={Link}
            href="/login"
            onClick={handleMobileMenuClose}
          >
            Login
          </MenuItem>
        )}
      </Menu>

      {/* User Menu */}
      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={handleUserMenuClose}
        PaperProps={{
          sx: { mt: 1, minWidth: 180 },
        }}
      >
        {userInfo?.email && (
          <MenuItem
            component={Link}
             href={`/dashboard/${userInfo.role}`}
            onClick={handleUserMenuClose}
          >
            <DashboardIcon sx={{ mr: 1, fontSize: 20 }} />
            Dashboard
          </MenuItem>
        )}
        <MenuItem
          component={Link}
          href="/profile"
          onClick={handleUserMenuClose}
        >
          <PersonIcon sx={{ mr: 1, fontSize: 20 }} />
          Profile
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogOut} sx={{ color: "error.main" }}>
          <LogoutIcon sx={{ mr: 1, fontSize: 20 }} />
          Logout
        </MenuItem>
      </Menu>
    </AppBar>
  );
};

export default Navbar;
