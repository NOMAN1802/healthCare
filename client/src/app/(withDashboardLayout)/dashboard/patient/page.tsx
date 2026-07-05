"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Grid,
  Chip,
  Avatar,
  Skeleton,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  MonitorHeart,
  FitnessCenter,
  CalendarToday,
  Add,
  Notifications,
  VideoCall,
  LocationOn,
  Bloodtype,
  Edit,
} from "@mui/icons-material";
import Link from "next/link";
import { useGetMYProfileQuery } from "@/redux/api/myProfile";
import { useGetMyAppointmentsQuery } from "@/redux/api/appointmentApi";
import { useGetMetaQuery } from "@/redux/api/metaApi";
import dayjs from "dayjs";
import HealthInfoModal from "./components/HealthInfoModal";

const PatientPage = () => {
  const { data: profile, isLoading: profileLoading } = useGetMYProfileQuery(undefined);
  const { data: appointmentsData, isLoading: apptLoading } = useGetMyAppointmentsQuery({ status: "SCHEDULED", limit: 4 });
  const { data: meta } = useGetMetaQuery({});
  const [healthModalOpen, setHealthModalOpen] = useState(false);

  const healthData = (profile as any)?.patientHealthData;

  // Appointment stats from meta
  const distribution: { status: string; count: number }[] =
    meta?.response?.formattedAppointmentStatusDistribution ?? [];
  const countOf = (status: string) =>
    distribution.find((d) => d.status === status)?.count ?? 0;

  // Upcoming SCHEDULED appointments
  const rawAppts = (appointmentsData as any)?.appointments;
  const upcomingAppointments: any[] = Array.isArray(rawAppts) ? rawAppts : [];

  const healthMetrics = [
    {
      title: "Weight",
      value: healthData?.weight ?? "—",
      unit: "kg",
      icon: <FitnessCenter sx={{ fontSize: 20 }} />,
      color: "#10b981",
      note: healthData ? "From your health profile" : "Not recorded yet",
    },
    {
      title: "Height",
      value: healthData?.height ?? "—",
      unit: "cm",
      icon: <MonitorHeart sx={{ fontSize: 20 }} />,
      color: "#3b82f6",
      note: healthData ? "From your health profile" : "Not recorded yet",
    },
    {
      title: "Blood Group",
      value: healthData?.bloodGroup?.replace("_pos", "+").replace("_neg", "-") ?? "—",
      unit: "",
      icon: <Bloodtype sx={{ fontSize: 20 }} />,
      color: "#ef4444",
      note: healthData ? "From your health profile" : "Not recorded yet",
    },
    {
      title: "Total Appointments",
      value: String(meta?.response?.appointmentCount ?? 0),
      unit: "",
      icon: <CalendarToday sx={{ fontSize: 20 }} />,
      color: "#8b5cf6",
      note: `${countOf("COMPLETED")} completed · ${countOf("CANCELLED")} cancelled`,
    },
  ];

  const isLoading = profileLoading || apptLoading;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {/* Welcome Section */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 2 }}>
        <Box>
          {profileLoading ? (
            <Skeleton width={300} height={48} />
          ) : (
            <Typography variant="h3" component="h1" sx={{ fontWeight: "bold", fontFamily: "serif", mb: 1 }}>
              Welcome back, {profile?.name?.split(" ")[0] ?? "Patient"}
            </Typography>
          )}
          <Typography variant="body1" color="text.secondary">
            Here is your health overview for today
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button variant="outlined" size="small" startIcon={<Notifications />} sx={{ textTransform: "none" }}>
            Notifications
          </Button>
          <Link href="/doctors">
            <Button
              variant="contained"
              size="small"
              startIcon={<Add />}
              sx={{ backgroundColor: "#6366f1", "&:hover": { backgroundColor: "#4f46e5" }, textTransform: "none" }}
            >
              Book Appointment
            </Button>
          </Link>
        </Box>
      </Box>

      {/* Health Metrics */}
      <Box component="section">
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600, fontFamily: "serif" }}>
            Health Overview
          </Typography>
          <Tooltip title={healthData ? "Update health info" : "Add health info"}>
            <IconButton
              size="small"
              onClick={() => setHealthModalOpen(true)}
              sx={{
                bgcolor: "#6366f115",
                color: "#6366f1",
                "&:hover": { bgcolor: "#6366f125" },
              }}
            >
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        <Grid container spacing={3}>
          {healthMetrics.map((metric, index) => (
            <Grid item xs={12} sm={6} lg={3} key={index}>
              <Card sx={{ height: "100%", "&:hover": { boxShadow: 4 }, transition: "box-shadow 0.2s" }}>
                <CardContent>
                  {isLoading ? (
                    <>
                      <Skeleton variant="circular" width={40} height={40} sx={{ mb: 2 }} />
                      <Skeleton width="60%" height={40} />
                      <Skeleton width="80%" />
                    </>
                  ) : (
                    <>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                        <Box
                          sx={{
                            width: 40, height: 40, borderRadius: 1,
                            backgroundColor: `${metric.color}15`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: metric.color,
                          }}
                        >
                          {metric.icon}
                        </Box>
                        <Chip
                          label={healthData ? "On record" : "No data"}
                          size="small"
                          sx={{
                            backgroundColor: healthData ? "#dcfce7" : "#f3f4f6",
                            color: healthData ? "#166534" : "#6b7280",
                            fontSize: "0.75rem",
                          }}
                        />
                      </Box>
                      <Typography variant="h4" component="div" sx={{ fontWeight: "bold", mb: 0.5 }}>
                        {metric.value}
                        {metric.unit && (
                          <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                            {metric.unit}
                          </Typography>
                        )}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        {metric.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                        {metric.note}
                      </Typography>
                    </>
                  )}
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
          <Link href="/dashboard/patient/appointments">
            <Button variant="outlined" size="small" startIcon={<CalendarToday />} sx={{ textTransform: "none" }}>
              View All
            </Button>
          </Link>
        </Box>

        {apptLoading ? (
          <Grid container spacing={3}>
            {[0, 1].map((i) => (
              <Grid item xs={12} lg={6} key={i}>
                <Card>
                  <CardContent>
                    <Skeleton variant="rectangular" height={100} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : upcomingAppointments.length === 0 ? (
          <Card>
            <CardContent sx={{ textAlign: "center", py: 6 }}>
              <CalendarToday sx={{ fontSize: 48, color: "text.disabled", mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No upcoming appointments
              </Typography>
              <Typography variant="body2" color="text.disabled" sx={{ mb: 2 }}>
                Book a consultation with one of our doctors
              </Typography>
              <Link href="/doctors">
                <Button variant="contained" sx={{ backgroundColor: "#6366f1", "&:hover": { backgroundColor: "#4f46e5" }, textTransform: "none" }}>
                  Book Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {upcomingAppointments.map((appt: any) => {
              const startDt = appt?.schedule?.startDateTime;
              const endDt = appt?.schedule?.endDateTime;
              const dateStr = startDt ? dayjs(startDt).format("MMM D, YYYY") : "—";
              const timeStr = startDt
                ? `${dayjs(startDt).format("hh:mm A")} – ${dayjs(endDt).format("hh:mm A")}`
                : "—";
              const doctorName = appt?.doctor?.name ?? "Doctor";
              const initials = doctorName.split(" ").map((n: string) => n[0]).join("").slice(0, 2);
              const specialty = appt?.doctor?.designation ?? appt?.doctor?.specialties?.[0]?.specialties?.title ?? "";

              return (
                <Grid item xs={12} lg={6} key={appt.id}>
                  <Card sx={{ "&:hover": { boxShadow: 4 }, transition: "box-shadow 0.2s" }}>
                    <CardContent>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <Avatar
                            src={appt?.doctor?.profilePhoto}
                            sx={{ bgcolor: "#6366f1", width: 48, height: 48 }}
                          >
                            {initials}
                          </Avatar>
                          <Box>
                            <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                              {doctorName}
                            </Typography>
                            {specialty && (
                              <Typography variant="body2" color="text.secondary">
                                {specialty}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                        <Chip
                          icon={appt?.videoCallingId ? <VideoCall /> : <LocationOn />}
                          label={appt?.videoCallingId ? "Video Call" : "In Person"}
                          size="small"
                          variant="outlined"
                        />
                      </Box>

                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {dateStr}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {timeStr}
                          </Typography>
                        </Box>
                        {appt?.videoCallingId && (
                          <Button
                            variant="contained"
                            size="small"
                            sx={{ backgroundColor: "#6366f1", "&:hover": { backgroundColor: "#4f46e5" }, textTransform: "none" }}
                          >
                            Join Call
                          </Button>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Box>

      {/* Health Flags */}
      {healthData && (
        <Box component="section">
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600, fontFamily: "serif", mb: 2 }}>
            Health Flags
          </Typography>
          <Grid container spacing={2}>
            {[
              { label: "Allergies", value: healthData.hasAllergies },
              { label: "Diabetes", value: healthData.hasDiabetes },
              { label: "Smoking", value: healthData.smokingStatus },
              { label: "Past Surgeries", value: healthData.hasPastSurgeries },
              { label: "Recent Anxiety", value: healthData.recentAnxiety },
              { label: "Recent Depression", value: healthData.recentDepression },
            ].map(({ label, value }) => (
              <Grid item key={label}>
                <Chip
                  label={label}
                  size="small"
                  sx={{
                    backgroundColor: value ? "#fee2e2" : "#dcfce7",
                    color: value ? "#991b1b" : "#166534",
                    fontWeight: 500,
                  }}
                  icon={
                    <Box
                      component="span"
                      sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: value ? "#ef4444" : "#22c55e", display: "inline-block" }}
                    />
                  }
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      <HealthInfoModal
        open={healthModalOpen}
        onClose={() => setHealthModalOpen(false)}
        existing={healthData ?? null}
      />
    </Box>
  );
};

export default PatientPage;
