"use client"

import { Box, List, Stack, Typography, Divider, Chip, useTheme } from "@mui/material"
import Image from "next/image"
import Link from "next/link"
import { drawerItems } from "@/utils/drawerItems"
import type { UserRole } from "@/types"
import { getUserInfo } from "@/services/auth.services"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import SidebarItem from "./SidebarItem"
import logo from '../../../../public/logo.png'
const SideBar = () => {
  const [userRole, setUserRole] = useState("")
  const theme = useTheme()

  useEffect(() => {
    const { role } = getUserInfo() as any
    setUserRole(role)
  }, [])

  return (
    <Box
      sx={{
        height: "100vh",
        background: "linear-gradient(180deg, #667eea 0%, #764ba2 100%)",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
          backdropFilter: "blur(10px)",
        },
      }}
    >
      <Stack
        sx={{
          py: 3,
          px: 2,
          position: "relative",
          zIndex: 1,
        }}
        direction="row"
        justifyContent="center"
        alignItems="center"
        gap={2}
        component={Link}
        href="/"
      >
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image src={logo} width={48} height={48} alt="healthBridge logo" className="rounded-xl" />
        </Box>
        <Box>
          <Typography
            variant="h5"
            component="h1"
            sx={{
              color: "white",
              fontWeight: 800,
              letterSpacing: "-0.5px",
              textShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            healthBridge
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: "rgba(255,255,255,0.8)",
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Healthcare Platform
          </Typography>
        </Box>
      </Stack>

      <Box sx={{ px: 2, mb: 2, position: "relative", zIndex: 1 }}>
        <Chip
          label={userRole || "Loading..."}
          size="small"
          sx={{
            background: "rgba(255,255,255,0.2)",
            color: "white",
            fontWeight: 600,
            textTransform: "capitalize",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.3)",
          }}
        />
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.2)", mx: 2, mb: 2 }} />

      <Box sx={{ px: 1, position: "relative", zIndex: 1, flex: 1, overflow: "auto" }}>
        <List sx={{ py: 0 }}>
          {drawerItems(userRole as UserRole).map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <SidebarItem item={item} />
            </motion.div>
          ))}
        </List>
      </Box>

      <Box
        sx={{
          p: 2,
          position: "relative",
          zIndex: 1,
          borderTop: "1px solid rgba(255,255,255,0.2)",
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: "rgba(255,255,255,0.6)",
            textAlign: "center",
            display: "block",
          }}
        >
          Version 2.0.1
        </Typography>
      </Box>
    </Box>
  )
}

export default SideBar
