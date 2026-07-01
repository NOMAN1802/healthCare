"use client"

import { Card, CardContent, CardHeader, Typography, Button, Box, Grid, Chip, Avatar } from "@mui/material"
import {
  Favorite,
  MonitorHeart,
  Thermostat,
  FitnessCenter,
  CalendarToday,
  Add,
  Notifications,
  VideoCall,
  LocationOn,
  TrendingUp,
  TrendingDown,
} from "@mui/icons-material"

// Mock data - in real app this would come from props or API
const upcomingAppointments = [
  {
    id: "1",
    doctorName: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    date: "Today",
    time: "2:00 PM",
    type: "video" as const,
    status: "upcoming" as const,
  },
  {
    id: "2",
    doctorName: "Dr. Michael Chen",
    specialty: "General Practitioner",
    date: "Tomorrow",
    time: "10:30 AM",
    type: "in-person" as const,
    status: "upcoming" as const,
    location: "Downtown Clinic",
  },
]

const healthMetrics = [
  {
    title: "Heart Rate",
    value: "72",
    unit: "bpm",
    trend: "stable" as const,
    trendValue: "No change",
    status: "normal" as const,
    icon: <Favorite sx={{ fontSize: 20 }} />,
    lastUpdated: "2 hours ago",
    color: "#ef4444",
  },
  {
    title: "Blood Pressure",
    value: "120/80",
    unit: "mmHg",
    trend: "down" as const,
    trendValue: "5 points",
    status: "normal" as const,
    icon: <MonitorHeart sx={{ fontSize: 20 }} />,
    lastUpdated: "1 day ago",
    color: "#3b82f6",
  },
  {
    title: "Temperature",
    value: "98.6",
    unit: "°F",
    trend: "stable" as const,
    status: "normal" as const,
    icon: <Thermostat sx={{ fontSize: 20 }} />,
    lastUpdated: "3 hours ago",
    color: "#f59e0b",
  },
  {
    title: "Weight",
    value: "165",
    unit: "lbs",
    trend: "down" as const,
    trendValue: "2 lbs",
    status: "normal" as const,
    icon: <FitnessCenter sx={{ fontSize: 20 }} />,
    lastUpdated: "1 week ago",
    color: "#10b981",
  },
]

const PatientPage = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {/* Welcome Section */}
      <Box
        sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 2 }}
      >
        <Box>
          <Typography variant="h3" component="h1" sx={{ fontWeight: "bold", fontFamily: "serif", mb: 1 }}>
            Welcome back, John
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here is your health overview for today
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button variant="outlined" size="small" startIcon={<Notifications />} sx={{ textTransform: "none" }}>
            Notifications
          </Button>
          <Button
            variant="contained"
            size="small"
            startIcon={<Add />}
            sx={{
              backgroundColor: "#6366f1",
              "&:hover": { backgroundColor: "#4f46e5" },
              textTransform: "none",
            }}
          >
            Book Appointment
          </Button>
        </Box>
      </Box>

      {/* Health Metrics */}
      <Box component="section">
        <Typography variant="h5" component="h2" sx={{ fontWeight: 600, fontFamily: "serif", mb: 2 }}>
          Health Metrics
        </Typography>
        <Grid container spacing={3}>
          {healthMetrics.map((metric, index) => (
            <Grid item xs={12} sm={6} lg={3} key={index}>
              <Card sx={{ height: "100%", "&:hover": { boxShadow: 4 }, transition: "box-shadow 0.2s" }}>
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        backgroundColor: `${metric.color}15`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: metric.color,
                      }}
                    >
                      {metric.icon}
                    </Box>
                    <Chip
                      label="Normal"
                      size="small"
                      sx={{
                        backgroundColor: "#dcfce7",
                        color: "#166534",
                        fontSize: "0.75rem",
                      }}
                    />
                  </Box>

                  <Typography variant="h4" component="div" sx={{ fontWeight: "bold", mb: 0.5 }}>
                    {metric.value}
                    <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                      {metric.unit}
                    </Typography>
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {metric.title}
                  </Typography>

                  {/* {metric.trend !== "stable" && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      {metric.trend === "up" ? (
                        <TrendingUp sx={{ fontSize: 16, color: "#10b981" }} />
                      ) : (
                        <TrendingDown sx={{ fontSize: 16, color: "#ef4444" }} />
                      )}
                      <Typography variant="caption" color="text.secondary">
                        {metric.trendValue}
                      </Typography>
                    </Box>
                  )} */}

                  <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
                    Updated {metric.lastUpdated}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Upcoming Appointments */}
      <Box component="section">
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600, fontFamily: "serif" }}>
            Upcoming Appointments
          </Typography>
          <Button variant="outlined" size="small" startIcon={<CalendarToday />} sx={{ textTransform: "none" }}>
            View All
          </Button>
        </Box>
        <Grid container spacing={3}>
          {upcomingAppointments.map((appointment) => (
            <Grid item xs={12} lg={6} key={appointment.id}>
              <Card sx={{ "&:hover": { boxShadow: 4 }, transition: "box-shadow 0.2s" }}>
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar sx={{ bgcolor: "#6366f1", width: 48, height: 48 }}>
                        {appointment.doctorName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                          {appointment.doctorName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {appointment.specialty}
                        </Typography>
                      </Box>
                    </Box>
                    <Chip
                      icon={appointment.type === "video" ? <VideoCall /> : <LocationOn />}
                      label={appointment.type === "video" ? "Video Call" : "In Person"}
                      size="small"
                      variant="outlined"
                      sx={{ textTransform: "capitalize" }}
                    />
                  </Box>

                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {appointment.date} at {appointment.time}
                      </Typography>
                      {appointment.location && (
                        <Typography variant="caption" color="text.secondary">
                          {appointment.location}
                        </Typography>
                      )}
                    </Box>
                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        backgroundColor: "#6366f1",
                        "&:hover": { backgroundColor: "#4f46e5" },
                        textTransform: "none",
                      }}
                    >
                      {appointment.type === "video" ? "Join Call" : "View Details"}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Quick Actions */}
      <Box component="section">
        <Typography variant="h5" component="h2" sx={{ fontWeight: 600, fontFamily: "serif", mb: 2 }}>
          Quick Actions
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                height: "100%",
                cursor: "pointer",
                "&:hover": { boxShadow: 4 },
                transition: "box-shadow 0.2s",
              }}
            >
              <CardHeader
                sx={{ textAlign: "center", pb: 2 }}
                avatar={
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      backgroundColor: "#dbeafe",
                      borderRadius: 3,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      mb: 1,
                    }}
                  >
                    <CalendarToday sx={{ fontSize: 24, color: "#2563eb" }} />
                  </Box>
                }
                title={
                  <Typography variant="h6" component="div" sx={{ fontFamily: "serif", fontWeight: 600 }}>
                    Book Appointment
                  </Typography>
                }
              />
              <CardContent sx={{ pt: 0 }}>
                <Typography variant="body2" color="text.secondary" align="center">
                  Schedule a consultation with our healthcare professionals
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              sx={{
                height: "100%",
                cursor: "pointer",
                "&:hover": { boxShadow: 4 },
                transition: "box-shadow 0.2s",
              }}
            >
              <CardHeader
                sx={{ textAlign: "center", pb: 2 }}
                avatar={
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      backgroundColor: "#dcfce7",
                      borderRadius: 3,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      mb: 1,
                    }}
                  >
                    <MonitorHeart sx={{ fontSize: 24, color: "#16a34a" }} />
                  </Box>
                }
                title={
                  <Typography variant="h6" component="div" sx={{ fontFamily: "serif", fontWeight: 600 }}>
                    Health Records
                  </Typography>
                }
              />
              <CardContent sx={{ pt: 0 }}>
                <Typography variant="body2" color="text.secondary" align="center">
                  View and manage your medical history and test results
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              sx={{
                height: "100%",
                cursor: "pointer",
                "&:hover": { boxShadow: 4 },
                transition: "box-shadow 0.2s",
              }}
            >
              <CardHeader
                sx={{ textAlign: "center", pb: 2 }}
                avatar={
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      backgroundColor: "#f3e8ff",
                      borderRadius: 3,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      mb: 1,
                    }}
                  >
                    <Favorite sx={{ fontSize: 24, color: "#9333ea" }} />
                  </Box>
                }
                title={
                  <Typography variant="h6" component="div" sx={{ fontFamily: "serif", fontWeight: 600 }}>
                    Wellness Plan
                  </Typography>
                }
              />
              <CardContent sx={{ pt: 0 }}>
                <Typography variant="body2" color="text.secondary" align="center">
                  Access personalized health recommendations and goals
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}


export default PatientPage;
