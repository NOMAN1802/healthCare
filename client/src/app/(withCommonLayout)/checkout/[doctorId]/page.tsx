'use client';

import { useGetDoctorQuery } from '@/redux/api/doctorApi';
import {
  Alert,
  Avatar,
  Box,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SchoolIcon from '@mui/icons-material/School';
import DoctorScheduleSlots from '../../doctors/components/DoctorScheduleSlots';

const PLACEHOLDER =
  'https://static.vecteezy.com/system/resources/thumbnails/026/489/224/small_2x/muslim-malay-woman-doctor-in-hospital-with-copy-space-ai-generated-photo.jpg';

interface PageProps {
  params: { doctorId: string };
}

const CheckoutPage = ({ params }: PageProps) => {
  const { data: doctor, isLoading, error } = useGetDoctorQuery(params.doctorId);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !doctor) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Alert severity="error">Doctor not found. Please go back and try again.</Alert>
      </Container>
    );
  }

  const specialties: any[] = doctor.doctorSpecialties ?? [];

  return (
    <Box sx={{ bgcolor: '#f8faff', minHeight: '100vh', py: { xs: 3, md: 5 } }}>
      <Container maxWidth="lg">
        {/* Page heading */}
        <Typography variant="h4" fontWeight={700} mb={1}>
          Book Appointment
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>
          Select an available time slot to confirm your appointment
        </Typography>

        <Grid container spacing={3}>
          {/* Left — Doctor summary */}
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{ p: 3, borderRadius: 1, border: '1px solid', borderColor: 'divider', position: 'sticky', top: 20 }}
            >
              {/* Photo + name */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box
                  sx={{
                    width: 72, height: 72, borderRadius: 1,
                    overflow: 'hidden', flexShrink: 0, border: '2px solid', borderColor: 'primary.light',
                  }}
                >
                  <Image
                    src={doctor.profilePhoto || PLACEHOLDER}
                    alt={doctor.name}
                    width={72}
                    height={72}
                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                  />
                </Box>
                <Box>
                  <Typography variant="subtitle1" fontWeight={700} lineHeight={1.2}>
                    {doctor.name}
                  </Typography>
                  <Typography variant="body2" color="primary.main" fontWeight={600}>
                    {doctor.designation}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {doctor.qualification}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Key details */}
              <Stack spacing={1.5}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar sx={{ bgcolor: 'primary.light', width: 32, height: 32 }}>
                    <LocalHospitalIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                  </Avatar>
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">Working at</Typography>
                    <Typography variant="body2" fontWeight={600}>{doctor.currentWorkingPlace || '—'}</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar sx={{ bgcolor: 'success.light', width: 32, height: 32 }}>
                    <AccessTimeIcon sx={{ fontSize: 16, color: 'success.main' }} />
                  </Avatar>
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">Experience</Typography>
                    <Typography variant="body2" fontWeight={600}>{doctor.experience ?? 0}+ Years</Typography>
                  </Box>
                </Box>

                {specialties.length > 0 && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ bgcolor: 'warning.light', width: 32, height: 32 }}>
                      <SchoolIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                    </Avatar>
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">Specialties</Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.25 }}>
                        {specialties.map((ds: any) => (
                          <Chip
                            key={ds.specialtiesId}
                            label={ds?.specialties?.title}
                            size="small"
                            sx={{ fontSize: '0.7rem', height: 20 }}
                          />
                        ))}
                      </Box>
                    </Box>
                  </Box>
                )}
              </Stack>

              <Divider sx={{ my: 2 }} />

              {/* Fee */}
              <Box
                sx={{
                  textAlign: 'center', py: 2, px: 3,
                  bgcolor: 'primary.main', borderRadius: 1, color: 'white',
                }}
              >
                <Typography variant="caption" sx={{ opacity: 0.85, display: 'block' }}>
                  Consultation Fee
                </Typography>
                <Typography variant="h5" fontWeight={800}>
                  ৳{doctor.appointmentFee}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.75 }}>
                  per visit (incl. VAT)
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Right — Slot picker */}
          <Grid item xs={12} md={8}>
            <Paper
              elevation={0}
              sx={{ p: { xs: 3, md: 4 }, borderRadius: 1, border: '1px solid', borderColor: 'divider' }}
            >
              <DoctorScheduleSlots id={doctor.id} />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CheckoutPage;
