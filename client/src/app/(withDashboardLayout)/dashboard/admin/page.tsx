"use client";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  LinearProgress,
  Skeleton,
} from "@mui/material";
import {
  Analytics,
  PersonAdd,
  Settings,
  Assessment,
} from "@mui/icons-material";
import Link from "next/link";
import AdminDashboardCardTittle from "@/components/Dashboard/DashboardEssential/AdminDashboardCardTittle";
import { TotalAppointment } from "@/components/Dashboard/DashboardEssential/TotalAppointment";
import { useGetMetaQuery } from "@/redux/api/metaApi";
import { TotalPatient } from "@/components/Dashboard/DashboardEssential/TotalPatient";
import { TotalDoctor } from "@/components/Dashboard/DashboardEssential/TotalDoctor";
import { TotalRevenue } from "@/components/Dashboard/DashboardEssential/TotalRevenue";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

type TActivity = {
  id: string;
  action: string;
  user: string;
  createdAt: string;
  activityStatus: string;
};

const statusChipProps = (
  activityStatus: string
): { label: string; color: "success" | "warning" | "error" | "info" | "default" } => {
  switch (activityStatus) {
    case "PAID":
    case "COMPLETED":
      return { label: "success", color: "success" };
    case "CANCELLED":
      return { label: "cancelled", color: "error" };
    case "INPROGRESS":
      return { label: "in progress", color: "warning" };
    case "SCHEDULED":
      return { label: "scheduled", color: "info" };
    default:
      return { label: activityStatus.toLowerCase(), color: "default" };
  }
};

const AdminPage = () => {
  const { data: meta, isLoading } = useGetMetaQuery({});

  const totalAppointment = Number(meta?.response?.appointmentCount);
  const totalPatient = Number(meta?.response?.patientCoount);
  const totalDoctor = Number(meta?.response?.doctorCount);
  const totalRevenue = Number(
    (meta?.response?.totalRevenue as { _sum: { amount: number } } | undefined)?._sum?.amount ?? 0
  );
  const recentActivities: TActivity[] = meta?.response?.recentActivities ?? [];
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: 700, color: "#1a1a1a", mb: 1 }}
        >
          Admin Dashboard
        </Typography>
        <Typography variant="body1" sx={{ color: "#666", mb: 3 }}>
          Monitor and manage your healthBridge platform
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Appointment Card */}
        <Grid item xs={12} sm={6} md={3}>
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <Link
              href={"/super-admin/my-booking/flight-booking"}
              className="block"
            >
              <AdminDashboardCardTittle tittle="Total Appointment" />
              <TotalAppointment
                totalFlightBookings={totalAppointment}
                capacity={10}
                label={`Total Appointment`}
              />
              {/* <div className="mt-2 text-sm text-blue-600 font-medium">
              View all bookings →
            </div> */}
            </Link>
          </div>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <Link
              href={"/dashboard/admin/doctors"}
              className="block"
            >
              <AdminDashboardCardTittle tittle="Total Doctor" />
              <TotalDoctor
                totalFlightBookings={totalDoctor}
                capacity={10}
                label={`Total Doctor`}
              />
              {/* <div className="mt-2 text-sm text-blue-600 font-medium">
              View all bookings →
            </div> */}
            </Link>
          </div>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <Link
              href={"/super-admin/my-booking/flight-booking"}
              className="block"
            >
              <AdminDashboardCardTittle tittle="Total Patient" />
              <TotalPatient
                totalFlightBookings={totalPatient}
                capacity={10}
                label={`Total Patient`}
              />
              {/* <div className="mt-2 text-sm text-blue-600 font-medium">
              View all bookings →
            </div> */}
            </Link>
          </div>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <AdminDashboardCardTittle tittle="Total Revenue" />
            <TotalRevenue
              totalRevenue={totalRevenue}
              label="Total Revenue (BDT)"
            />
          </div>
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Recent Activities
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Action</TableCell>
                      <TableCell>User</TableCell>
                      <TableCell>Time</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {isLoading
                      ? Array.from({ length: 4 }).map((_, i) => (
                          <TableRow key={i}>
                            {Array.from({ length: 4 }).map((_, j) => (
                              <TableCell key={j}>
                                <Skeleton variant="text" width="80%" />
                              </TableCell>
                            ))}
                          </TableRow>
                        ))
                      : recentActivities.length === 0
                      ? (
                          <TableRow>
                            <TableCell colSpan={4} align="center" sx={{ color: "text.secondary", py: 4 }}>
                              No recent activities found
                            </TableCell>
                          </TableRow>
                        )
                      : recentActivities.map((activity) => {
                          const chip = statusChipProps(activity.activityStatus);
                          return (
                            <TableRow key={activity.id}>
                              <TableCell>{activity.action}</TableCell>
                              <TableCell>{activity.user}</TableCell>
                              <TableCell sx={{ whiteSpace: "nowrap" }}>
                                {dayjs(activity.createdAt).fromNow()}
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={chip.label}
                                  size="small"
                                  color={chip.color}
                                />
                              </TableCell>
                            </TableRow>
                          );
                        })}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Admin Actions
              </Typography>
              <Stack spacing={2}>
                <Button
                  variant="contained"
                  startIcon={<PersonAdd />}
                  fullWidth
                  sx={{
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    py: 1.5,
                  }}
                >
                  Add New Doctor
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Analytics />}
                  fullWidth
                  sx={{ py: 1.5, borderColor: "#667eea", color: "#667eea" }}
                >
                  View Analytics
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Assessment />}
                  fullWidth
                  sx={{ py: 1.5, borderColor: "#667eea", color: "#667eea" }}
                >
                  Generate Reports
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Settings />}
                  fullWidth
                  sx={{ py: 1.5, borderColor: "#667eea", color: "#667eea" }}
                >
                  System Settings
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* System Health */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                System Health
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Box>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Server Performance
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={85}
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      85% - Good
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Database Health
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={92}
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      92% - Excellent
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      API Response Time
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={78}
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      78% - Good
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminPage;
