"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Button,
  TextField,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Alert,
  Box,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material"
import { Visibility, VisibilityOff, LocalHospital, Email, Lock } from "@mui/icons-material"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { FieldValues } from "react-hook-form"
import { userLogin } from "@/services/actions/userLogin"
import { storeUserInfo } from "@/services/auth.services"
import { toast } from "sonner"

const validationSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type FormData = z.infer<typeof validationSchema>

export default function LoginPage() {
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      email: "abdullahnoman4537@gmail.com",
      password: "noman4131",
    },
  })

  const onSubmit = async (values: FieldValues) => {
    setIsLoading(true)
    setError("")

    try {
      const res = await userLogin(values)
      console.log(res)
      if (res?.data?.accessToken) {
        toast.success(res?.message || "Login successful!")
        storeUserInfo({ accessToken: res.data.accessToken })
        router.push("/dashboard")
      } else if (res.message === "Password did not match"){
        toast.error(res.message)
      }else {
        setError(res?.message || "Login failed. Please try again.")
      }
    } catch (err: any) {
      setError("An error occurred. Please try again.")
      console.error(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 400 }}>
        <Card
          sx={{
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            border: "none",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(8px)",
          }}
        >
          <CardHeader
            sx={{
              textAlign: "center",
              pb: 4,
              pt: 4,
            }}
          >
            <Box
              sx={{
                mx: "auto",
                width: 64,
                height: 64,
                backgroundColor: "#6366f1",
                borderRadius: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <LocalHospital sx={{ fontSize: 32, color: "white" }} />
            </Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: "bold", mb: 1, fontFamily: "serif" }}>
              Welcome to healthBridge
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in to access your healthcare dashboard
            </Typography>
          </CardHeader>

          <CardContent sx={{ px: 3, pb: 3 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 3, backgroundColor: "#fef2f2", color: "#991b1b" }}>
                {error}
              </Alert>
            )}

            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              sx={{ display: "flex", flexDirection: "column", gap: 3 }}
            >
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                error={!!errors.email}
                helperText={errors.email?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" />
                    </InputAdornment>
                  ),
                  sx: { height: 56 },
                }}
                {...register("email")}
              />

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: { height: 56 },
                }}
                {...register("password")}
              />

              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Link href="/forgot-password" style={{ textDecoration: "none" }}>
                  <Typography
                    variant="body2"
                    sx={{ color: "#6366f1", "&:hover": { color: "#4f46e5" }, fontWeight: 500 }}
                  >
                    Forgot password?
                  </Typography>
                </Link>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isLoading}
                sx={{
                  height: 48,
                  backgroundColor: "#6366f1",
                  "&:hover": { backgroundColor: "#4f46e5" },
                  fontWeight: 500,
                  textTransform: "none",
                  fontSize: "1rem",
                  transition: "all 0.2s",
                  // "&:hover": {
                  //   backgroundColor: "#4f46e5",
                  //   transform: "scale(1.02)",
                  // },
                }}
                startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </Box>
          </CardContent>

          <Box sx={{ p: 3, pt: 0 }}>
            <Typography variant="body2" color="text.secondary" align="center">
              Do not have an account?{" "}
              <Link href="/register" style={{ textDecoration: "none" }}>
                <Typography
                  component="span"
                  sx={{ color: "#6366f1", "&:hover": { color: "#4f46e5" }, fontWeight: 500 }}
                >
                  Create account
                </Typography>
              </Link>
            </Typography>
          </Box>
        </Card>

        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography variant="caption" color="text.secondary">
            Secure healthcare platform powered by healthBridge
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
