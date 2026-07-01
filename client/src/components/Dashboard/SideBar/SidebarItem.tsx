"use client"

import Link from "next/link"
import { ListItem, ListItemButton, ListItemIcon, ListItemText, Box, Tooltip } from "@mui/material"
import type { DrawerItem } from "@/types"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"

type IProps = {
  item: DrawerItem
}

const SidebarItem = ({ item }: IProps) => {
  const linkPath = `/dashboard/${item.path}`
  const pathname = usePathname()
  const isActive = pathname === linkPath

  return (
    <Tooltip title={item.title} placement="right" arrow>
      <ListItem
        disablePadding
        sx={{
          mb: 0.5,
          mx: 1,
        }}
      >
        <Link href={linkPath} style={{ width: "100%", textDecoration: "none" }}>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.2 }}>
            <ListItemButton
              sx={{
                borderRadius: "12px",
                py: 1.5,
                px: 2,
                position: "relative",
                overflow: "hidden",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                ...(isActive
                  ? {
                      background: "rgba(255,255,255,0.2)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255,255,255,0.3)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: "4px",
                        background: "white",
                        borderRadius: "0 2px 2px 0",
                      },
                      "& .MuiListItemIcon-root": {
                        color: "white",
                        transform: "scale(1.1)",
                      },
                      "& .MuiListItemText-primary": {
                        color: "white",
                        fontWeight: 700,
                      },
                    }
                  : {
                      "&:hover": {
                        background: "rgba(255,255,255,0.1)",
                        backdropFilter: "blur(5px)",
                        transform: "translateX(4px)",
                        "& .MuiListItemIcon-root": {
                          color: "rgba(255,255,255,0.9)",
                          transform: "scale(1.05)",
                        },
                        "& .MuiListItemText-primary": {
                          color: "rgba(255,255,255,0.9)",
                        },
                      },
                      "& .MuiListItemIcon-root": {
                        color: "rgba(255,255,255,0.7)",
                        transition: "all 0.3s ease",
                      },
                      "& .MuiListItemText-primary": {
                        color: "rgba(255,255,255,0.8)",
                        transition: "all 0.3s ease",
                      },
                    }),
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon && <item.icon />}</ListItemIcon>
              <ListItemText
                primary={item.title}
                primaryTypographyProps={{
                  fontSize: "0.95rem",
                  fontWeight: isActive ? 700 : 500,
                }}
              />

              {isActive && (
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "white",
                    boxShadow: "0 0 8px rgba(255,255,255,0.5)",
                  }}
                />
              )}
            </ListItemButton>
          </motion.div>
        </Link>
      </ListItem>
    </Tooltip>
  )
}

export default SidebarItem
