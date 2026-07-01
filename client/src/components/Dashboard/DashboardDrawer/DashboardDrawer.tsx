"use client"

import * as React from "react"
import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import CssBaseline from "@mui/material/CssBaseline"
import Drawer from "@mui/material/Drawer"
import IconButton from "@mui/material/IconButton"
import MenuIcon from "@mui/icons-material/Menu"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import { Avatar, Badge, Stack, Paper, Chip, useTheme, alpha, Fade } from "@mui/material"
import AccountMenu from "../AccountMenu/AccountMenu"
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone"
import SearchIcon from "@mui/icons-material/Search"
import { useGetSingleUserQuery } from "@/redux/api/userApi"
import { motion } from "framer-motion"
import SideBar from "../SideBar/SideBar"

const drawerWidth = 280

export default function DashboardDrawer({
  children,
}: {
  children: React.ReactNode
}) {
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const [isClosing, setIsClosing] = React.useState(false)
  const theme = useTheme()

  const handleDrawerClose = () => {
    setIsClosing(true)
    setMobileOpen(false)
  }

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false)
  }

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen)
    }
  }

  const { data, isLoading } = useGetSingleUserQuery({})

  const getCurrentTime = () => {
    const now = new Date()
    const hours = now.getHours()
    if (hours < 12) return "Good Morning"
    if (hours < 17) return "Good Afternoon"
    return "Good Evening"
  }

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)",
          backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          boxShadow: "0 1px 20px rgba(0,0,0,0.05)",
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              mr: 2,
              display: { sm: "none" },
              background: alpha(theme.palette.primary.main, 0.1),
              "&:hover": {
                background: alpha(theme.palette.primary.main, 0.2),
              },
            }}
          >
            <MenuIcon sx={{ color: "primary.main" }} />
          </IconButton>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Box>
                <Typography
                  variant="h5"
                  sx={{
                    color: theme.palette.text.primary,
                    fontWeight: 700,
                    mb: 0.5,
                  }}
                >
                  {getCurrentTime()}, {isLoading ? "..." : data?.name}! 👋
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.text.secondary,
                      fontWeight: 500,
                    }}
                  >
                    Welcome back to healthBridge
                  </Typography>
                  <Chip
                    label="Online"
                    size="small"
                    sx={{
                      background: alpha(theme.palette.success.main, 0.1),
                      color: theme.palette.success.main,
                      fontWeight: 600,
                      fontSize: "0.75rem",
                    }}
                  />
                </Stack>
              </Box>
            </motion.div>

            <Stack direction="row" spacing={2} alignItems="center">
              {/* Search Button */}
              <IconButton
                sx={{
                  background: alpha(theme.palette.primary.main, 0.1),
                  width: 44,
                  height: 44,
                  "&:hover": {
                    background: alpha(theme.palette.primary.main, 0.2),
                    transform: "scale(1.05)",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                <SearchIcon sx={{ color: theme.palette.primary.main }} />
              </IconButton>

              {/* Notifications */}
              <Badge
                badgeContent={3}
                color="error"
                sx={{
                  "& .MuiBadge-badge": {
                    fontSize: "0.75rem",
                    minWidth: 18,
                    height: 18,
                  },
                }}
              >
                <IconButton
                  sx={{
                    background: alpha(theme.palette.warning.main, 0.1),
                    width: 44,
                    height: 44,
                    "&:hover": {
                      background: alpha(theme.palette.warning.main, 0.2),
                      transform: "scale(1.05)",
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  <NotificationsNoneIcon sx={{ color: theme.palette.warning.main }} />
                </IconButton>
              </Badge>

              {/* User Avatar */}
              <Paper
                elevation={0}
                sx={{
                  p: 0.5,
                  borderRadius: "12px",
                  background: alpha(theme.palette.primary.main, 0.1),
                  border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                }}
              >
                <Avatar
                  alt={data?.name}
                  src={data?.profilePhoto || "/generic-user-avatar.png"}
                  sx={{
                    width: 40,
                    height: 40,
                    border: "2px solid white",
                  }}
                />
              </Paper>

              <AccountMenu />
            </Stack>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{
          width: { sm: drawerWidth },
          flexShrink: { sm: 0 },
        }}
        aria-label="navigation menu"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              border: "none",
            },
          }}
        >
          <SideBar />
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              border: "none",
              boxShadow: "4px 0 20px rgba(0,0,0,0.1)",
            },
          }}
          open
        >
          <SideBar />
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
        }}
      >
        <Toolbar />
        <Fade in timeout={500}>
          <Box sx={{ p: 3 }}>{children}</Box>
        </Fade>
      </Box>
    </Box>
  )
}
