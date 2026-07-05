'use client';

import { useGetMYProfileQuery } from '@/redux/api/myProfile';
import {
  Avatar,
  Box,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Typography,
  Chip,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BadgeIcon from '@mui/icons-material/Badge';
import Image from 'next/image';

const PatientProfilePage = () => {
  const { data, isLoading } = useGetMYProfileQuery(undefined);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  const infoRows = [
    { icon: <BadgeIcon />, label: 'Full Name', value: data?.name },
    { icon: <EmailIcon />, label: 'Email', value: data?.email },
    { icon: <PhoneIcon />, label: 'Phone', value: data?.contactNumber },
    { icon: <LocationOnIcon />, label: 'Address', value: data?.address },
  ];

  return (
    <Box sx={{ width: '100%', p: { xs: 1, sm: 2, md: 3 } }}>
      <Paper
        elevation={3}
        sx={{
          width: '100%',
          borderRadius: 1,
          overflow: 'hidden',
        }}
      >
        {/* Banner */}
        <Box
          sx={{
            width: '100%',
            height: { xs: 100, sm: 140, md: 180 },
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }}
        />

        {/* Profile header */}
        <Box sx={{ px: { xs: 2, sm: 4 }, pb: { xs: 2, sm: 4 }, mt: { xs: -5, sm: -6 } }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'center', sm: 'flex-end' },
              gap: 2,
              mb: 3,
            }}
          >
            {/* Avatar */}
            <Box
              sx={{
                border: '4px solid white',
                borderRadius: '50%',
                overflow: 'hidden',
                width: { xs: 90, sm: 110, md: 130 },
                height: { xs: 90, sm: 110, md: 130 },
                flexShrink: 0,
                boxShadow: 3,
              }}
            >
              {data?.profilePhoto ? (
                <Image
                  src={data.profilePhoto}
                  alt="Profile Photo"
                  width={130}
                  height={130}
                  style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                />
              ) : (
                <Avatar
                  sx={{
                    width: '100%',
                    height: '100%',
                    bgcolor: 'primary.main',
                    borderRadius: 0,
                  }}
                >
                  <PersonIcon sx={{ fontSize: { xs: 40, md: 56 } }} />
                </Avatar>
              )}
            </Box>

            {/* Name + role */}
            <Box
              sx={{
                textAlign: { xs: 'center', sm: 'left' },
                pb: { sm: 1 },
              }}
            >
              <Typography variant="h4" fontWeight={700} sx={{ fontSize: { xs: '1.4rem', md: '2rem' } }}>
                {data?.name ?? 'Patient'}
              </Typography>
              <Chip
                label="Patient"
                size="small"
                sx={{ mt: 0.5, bgcolor: 'primary.main', color: 'white', fontWeight: 600 }}
              />
            </Box>
          </Box>

          <Divider sx={{ mb: 4 }} />

          {/* Info grid */}
          <Grid container spacing={{ xs: 2, md: 4 }}>
            {infoRows.map(({ icon, label, value }) => (
              <Grid item xs={12} sm={6} key={label}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 2,
                    p: { xs: 1.5, md: 2 },
                    borderRadius: 1,
                    bgcolor: 'grey.50',
                    border: '1px solid',
                    borderColor: 'grey.200',
                    height: '100%',
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 1,
                      bgcolor: 'primary.light',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'primary.main',
                      flexShrink: 0,
                    }}
                  >
                    {icon}
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      {label}
                    </Typography>
                    <Typography variant="body1" fontWeight={500} sx={{ mt: 0.25, wordBreak: 'break-word' }}>
                      {value || 'Not provided'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default PatientProfilePage;
