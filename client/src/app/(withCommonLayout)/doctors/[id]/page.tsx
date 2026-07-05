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
  Rating,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import SchoolIcon from '@mui/icons-material/School';
import BadgeIcon from '@mui/icons-material/Badge';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import Image from 'next/image';
import DoctorScheduleSlots from '../components/DoctorScheduleSlots';

const PLACEHOLDER =
  'https://static.vecteezy.com/system/resources/thumbnails/026/489/224/small_2x/muslim-malay-woman-doctor-in-hospital-with-copy-space-ai-generated-photo.jpg';

interface PropType {
  params: { id: string };
}

const InfoRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <Box display="flex" alignItems="flex-start" gap={1.5}>
    <Box sx={{ color: 'primary.main', mt: 0.3, flexShrink: 0 }}>{icon}</Box>
    <Box>
      <Typography variant="caption" color="text.secondary" display="block" lineHeight={1.2}>
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={500}>
        {value || '—'}
      </Typography>
    </Box>
  </Box>
);

const SideCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      borderRadius: 1,
      border: '1px solid',
      borderColor: 'divider',
      bgcolor: 'background.paper',
    }}
  >
    <Typography variant="subtitle1" fontWeight={700} mb={2}>
      {title}
    </Typography>
    {children}
  </Paper>
);

const LoadingSkeleton = () => (
  <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
    <Box display="flex" gap={3} mb={4} flexDirection={{ xs: 'column', md: 'row' }}>
      <Skeleton variant="rectangular" width={200} height={220} sx={{ borderRadius: 1, flexShrink: 0 }} />
      <Box flexGrow={1}>
        <Skeleton variant="text" height={50} width="70%" />
        <Skeleton variant="text" height={28} width="40%" />
        <Skeleton variant="text" height={24} width="30%" />
        <Box mt={2} display="flex" gap={1}>
          <Skeleton variant="rounded" width={90} height={28} />
          <Skeleton variant="rounded" width={110} height={28} />
        </Box>
      </Box>
    </Box>
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 1, mb: 3 }} />
        <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 1 }} />
      </Grid>
      <Grid item xs={12} md={4}>
        <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 1, mb: 2 }} />
        <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 1 }} />
      </Grid>
    </Grid>
  </Container>
);

const DoctorProfile = ({ params }: PropType) => {
  const { data: doctor, isLoading, error } = useGetDoctorQuery(params.id);

  if (isLoading) return <LoadingSkeleton />;

  if (error || !doctor) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity={error ? 'error' : 'warning'}>
          {error ? 'Error loading doctor profile. Please try again.' : 'Doctor not found.'}
        </Alert>
      </Container>
    );
  }

  const specialties: any[] = doctor.doctorSpecialties ?? [];
  const rating = doctor.averageRating ?? 0;

  return (
    <Box sx={{ bgcolor: '#f8faff', minHeight: '100vh', pb: 8 }}>
      {/* Hero Banner */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1a56db 0%, #6c3fc5 100%)',
          pt: { xs: 4, md: 6 },
          pb: { xs: 10, md: 12 },
        }}
      />

      <Container maxWidth="lg" sx={{ mt: { xs: -8, md: -10 } }}>
        {/* Profile Card */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'divider',
            overflow: 'hidden',
            mb: 4,
          }}
        >
          {/* Top section: photo + info */}
          <Box
            sx={{
              p: { xs: 3, md: 4 },
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 3, md: 4 },
              alignItems: { xs: 'center', sm: 'flex-start' },
            }}
          >
            {/* Photo */}
            <Box
              sx={{
                position: 'relative',
                width: { xs: 130, sm: 160, md: 180 },
                height: { xs: 130, sm: 160, md: 180 },
                flexShrink: 0,
                borderRadius: 1,
                overflow: 'hidden',
                border: '4px solid white',
                boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
              }}
            >
              <Image
                src={doctor.profilePhoto || PLACEHOLDER}
                alt={doctor.name}
                fill
                style={{ objectFit: 'cover' }}
                sizes="180px"
              />
            </Box>

            {/* Main Info */}
            <Box flexGrow={1} textAlign={{ xs: 'center', sm: 'left' }}>
              <Typography
                variant="h4"
                fontWeight={800}
                sx={{ fontSize: { xs: '1.5rem', md: '2rem' }, lineHeight: 1.2, mb: 0.5 }}
              >
                {doctor.name}
              </Typography>
              <Typography variant="subtitle1" color="primary.main" fontWeight={600} mb={0.5}>
                {doctor.designation}
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={1.5}>
                {doctor.qualification}
              </Typography>

              {/* Rating */}
              {rating > 0 && (
                <Box
                  display="flex"
                  alignItems="center"
                  gap={1}
                  justifyContent={{ xs: 'center', sm: 'flex-start' }}
                  mb={1.5}
                >
                  <Rating value={rating} precision={0.1} readOnly size="small" />
                  <Typography variant="body2" color="text.secondary">
                    {rating.toFixed(1)} rating
                  </Typography>
                </Box>
              )}

              {/* Specialties */}
              {specialties.length > 0 && (
                <Box
                  display="flex"
                  flexWrap="wrap"
                  gap={1}
                  justifyContent={{ xs: 'center', sm: 'flex-start' }}
                >
                  {specialties.map((ds: any) => (
                    <Chip
                      key={ds.specialtiesId}
                      label={ds?.specialties?.title ?? '—'}
                      color="primary"
                      size="small"
                      sx={{ fontWeight: 600, borderRadius: 1 }}
                    />
                  ))}
                </Box>
              )}
            </Box>

            {/* Fee badge */}
            <Box
              sx={{
                textAlign: 'center',
                flexShrink: 0,
                bgcolor: 'primary.main',
                color: 'white',
                borderRadius: 1,
                px: { xs: 3, md: 4 },
                py: 2,
                minWidth: 120,
              }}
            >
              <Typography variant="caption" sx={{ opacity: 0.85, display: 'block' }}>
                Consultation Fee
              </Typography>
              <Typography variant="h5" fontWeight={800}>
                ৳{doctor.appointmentFee}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.85 }}>
                per visit
              </Typography>
            </Box>
          </Box>

          {/* Quick stats strip */}
          <Box
            sx={{
              borderTop: '1px solid',
              borderColor: 'divider',
              px: { xs: 3, md: 4 },
              py: 2,
              display: 'flex',
              flexWrap: 'wrap',
              gap: { xs: 2, md: 4 },
              justifyContent: { xs: 'center', sm: 'flex-start' },
              bgcolor: '#fafbff',
            }}
          >
            {doctor.experience > 0 && (
              <Box display="flex" alignItems="center" gap={0.75}>
                <AccessTimeIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                <Typography variant="body2" fontWeight={600}>
                  {doctor.experience}+ Years Experience
                </Typography>
              </Box>
            )}
            {doctor.currentWorkingPlace && (
              <Box display="flex" alignItems="center" gap={0.75}>
                <LocalHospitalIcon sx={{ fontSize: 18, color: 'success.main' }} />
                <Typography variant="body2" fontWeight={600}>
                  {doctor.currentWorkingPlace}
                </Typography>
              </Box>
            )}
            {doctor.address && (
              <Box display="flex" alignItems="center" gap={0.75}>
                <LocationOnIcon sx={{ fontSize: 18, color: 'error.main' }} />
                <Typography variant="body2" fontWeight={600}>
                  {doctor.address}
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>

        {/* Main Content */}
        <Grid container spacing={3}>
          {/* Left Column */}
          <Grid item xs={12} md={8}>
            <Stack spacing={3}>
              {/* About */}
              <Paper
                elevation={0}
                sx={{ p: { xs: 3, md: 4 }, borderRadius: 1, border: '1px solid', borderColor: 'divider' }}
              >
                <Typography variant="h6" fontWeight={700} mb={2}>
                  About {doctor.name.split(' ')[0]}
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body1" color="text.secondary" lineHeight={1.8}>
                  {`${doctor.name} is a dedicated ${doctor.designation ?? 'medical professional'} with ${doctor.experience ?? 0}+ years of clinical experience. Currently practicing at ${doctor.currentWorkingPlace ?? 'a leading healthcare facility'}, they bring expert knowledge in ${specialties.length > 0 ? specialties.map((s: any) => s?.specialties?.title).join(', ') : 'their field'}.`}
                </Typography>
                {specialties.length > 0 && (
                  <Typography variant="body1" color="text.secondary" lineHeight={1.8} mt={1.5}>
                    {`Specializing in ${specialties.map((s: any) => s?.specialties?.title).join(' and ')}, they are committed to delivering compassionate, evidence-based care to every patient.`}
                  </Typography>
                )}
              </Paper>

              {/* Professional Details */}
              <Paper
                elevation={0}
                sx={{ p: { xs: 3, md: 4 }, borderRadius: 1, border: '1px solid', borderColor: 'divider' }}
              >
                <Typography variant="h6" fontWeight={700} mb={2}>
                  Professional Details
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <InfoRow
                      icon={<SchoolIcon fontSize="small" />}
                      label="Qualification"
                      value={doctor.qualification}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InfoRow
                      icon={<WorkspacePremiumIcon fontSize="small" />}
                      label="Designation"
                      value={doctor.designation}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InfoRow
                      icon={<LocalHospitalIcon fontSize="small" />}
                      label="Working At"
                      value={doctor.currentWorkingPlace}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InfoRow
                      icon={<BadgeIcon fontSize="small" />}
                      label="Registration Number"
                      value={doctor.registrationNumber}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InfoRow
                      icon={<AccessTimeIcon fontSize="small" />}
                      label="Experience"
                      value={`${doctor.experience ?? 0} Years`}
                    />
                  </Grid>
                  {doctor.address && (
                    <Grid item xs={12} sm={6}>
                      <InfoRow
                        icon={<LocationOnIcon fontSize="small" />}
                        label="Address"
                        value={doctor.address}
                      />
                    </Grid>
                  )}
                </Grid>
              </Paper>

              {/* Availability */}
              <Paper
                elevation={0}
                sx={{ p: { xs: 3, md: 4 }, borderRadius: 1, border: '1px solid', borderColor: 'divider' }}
              >
                <DoctorScheduleSlots id={doctor.id} />
              </Paper>
            </Stack>
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              {/* Specialties */}
              {specialties.length > 0 && (
                <SideCard title="Specialties">
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {specialties.map((ds: any) => (
                      <Chip
                        key={ds.specialtiesId}
                        label={ds?.specialties?.title ?? '—'}
                        color="primary"
                        variant="outlined"
                        size="small"
                        sx={{ borderRadius: 1, fontWeight: 600 }}
                      />
                    ))}
                  </Box>
                </SideCard>
              )}

              {/* Contact */}
              <SideCard title="Contact Information">
                <Stack spacing={2}>
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <Avatar sx={{ bgcolor: 'primary.light', width: 36, height: 36 }}>
                      <PhoneIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                    </Avatar>
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Phone
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {doctor.contactNumber || '—'}
                      </Typography>
                    </Box>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <Avatar sx={{ bgcolor: 'success.light', width: 36, height: 36 }}>
                      <EmailIcon sx={{ fontSize: 18, color: 'success.main' }} />
                    </Avatar>
                    <Box overflow="hidden">
                      <Typography variant="caption" color="text.secondary" display="block">
                        Email
                      </Typography>
                      <Typography variant="body2" fontWeight={600} noWrap>
                        {doctor.email || '—'}
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              </SideCard>

              {/* Fee Summary */}
              <SideCard title="Appointment Fee">
                <Box
                  sx={{
                    textAlign: 'center',
                    py: 2,
                    px: 3,
                    bgcolor: 'primary.main',
                    borderRadius: 1,
                    color: 'white',
                  }}
                >
                  <Typography variant="h4" fontWeight={800}>
                    ৳{doctor.appointmentFee}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.85 }}>
                    Per consultation (incl. VAT)
                  </Typography>
                </Box>
              </SideCard>

              {/* Gender */}
              <SideCard title="General Info">
                <Stack spacing={1.5}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">Gender</Typography>
                    <Chip
                      label={doctor.gender}
                      size="small"
                      variant="outlined"
                      sx={{ borderRadius: 1, textTransform: 'capitalize', fontSize: '0.75rem' }}
                    />
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">Experience</Typography>
                    <Typography variant="body2" fontWeight={600}>{doctor.experience ?? 0} yrs</Typography>
                  </Box>
                  {rating > 0 && (
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2" color="text.secondary">Rating</Typography>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <Rating value={rating} precision={0.1} readOnly size="small" />
                        <Typography variant="body2" fontWeight={600}>{rating.toFixed(1)}</Typography>
                      </Box>
                    </Box>
                  )}
                </Stack>
              </SideCard>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default DoctorProfile;
