import {
  Box,
  Button,
  Chip,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import StarIcon from "@mui/icons-material/Star";
import WorkIcon from "@mui/icons-material/Work";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

const PLACEHOLDER =
  "https://static.vecteezy.com/system/resources/thumbnails/026/489/224/small_2x/muslim-malay-woman-doctor-in-hospital-with-copy-space-ai-generated-photo.jpg";

const DoctorCard = ({ doctor }: { doctor: any }) => {
  const specialties: any[] = doctor?.doctorSpecialties ?? [];

  return (
    <Box
      sx={{
        bgcolor: "white",
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
        transition: "all 0.3s ease",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 12px 40px rgba(20, 96, 204, 0.18)",
        },
      }}
    >
      {/* Image area */}
      <Box sx={{ position: "relative", height: 220, overflow: "hidden" }}>
        <Image
          src={doctor.profilePhoto || PLACEHOLDER}
          alt={doctor.name}
          fill
          style={{ objectFit: "cover" }}
          sizes="(max-width: 600px) 100vw, (max-width: 960px) 50vw, 25vw"
        />
        {/* Gradient overlay */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(10,10,40,0.65) 0%, transparent 60%)",
          }}
        />
        {/* Fee badge */}
        {doctor.appointmentFee && (
          <Box
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              bgcolor: "primary.main",
              color: "white",
              px: 1.5,
              py: 0.5,
              borderRadius: 2,
              fontSize: "0.75rem",
              fontWeight: 700,
              lineHeight: 1.4,
            }}
          >
            ৳{doctor.appointmentFee}
          </Box>
        )}
        {/* Name on image bottom */}
        <Box
          sx={{
            position: "absolute",
            bottom: 12,
            left: 14,
            right: 14,
          }}
        >
          <Typography
            variant="subtitle1"
            fontWeight={700}
            sx={{ color: "white", lineHeight: 1.2, fontSize: { xs: "0.95rem", md: "1rem" } }}
          >
            {doctor.name}
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: "rgba(255,255,255,0.82)", fontWeight: 500 }}
          >
            {doctor.designation}
          </Typography>
        </Box>
      </Box>

      {/* Body */}
      <Box sx={{ p: 2, flexGrow: 1, display: "flex", flexDirection: "column", gap: 1.5 }}>
        {/* Qualification */}
        <Typography variant="body2" color="text.secondary" noWrap>
          {doctor.qualification}
        </Typography>

        {/* Specialties */}
        {specialties.length > 0 && (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {specialties.slice(0, 2).map((ds: any) => (
              <Chip
                key={ds.specialtiesId}
                label={ds?.specialties?.title ?? "—"}
                size="small"
                color="primary"
                variant="outlined"
                sx={{ fontSize: "0.7rem", height: 22 }}
              />
            ))}
            {specialties.length > 2 && (
              <Chip
                label={`+${specialties.length - 2}`}
                size="small"
                variant="outlined"
                sx={{ fontSize: "0.7rem", height: 22 }}
              />
            )}
          </Box>
        )}

        {/* Stats row */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            py: 1,
            borderTop: "1px solid",
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <WorkIcon sx={{ fontSize: 15, color: "primary.main" }} />
            <Typography variant="caption" color="text.secondary">
              {doctor.experience ?? 0}+ yrs
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <StarIcon sx={{ fontSize: 15, color: "#f59e0b" }} />
            <Typography variant="caption" color="text.secondary">
              {doctor.averageRating ? doctor.averageRating.toFixed(1) : "New"}
            </Typography>
          </Box>
          {doctor.currentWorkingPlace && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, overflow: "hidden" }}>
              <CalendarMonthIcon sx={{ fontSize: 15, color: "success.main", flexShrink: 0 }} />
              <Typography variant="caption" color="text.secondary" noWrap>
                {doctor.currentWorkingPlace}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Spacer */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Actions */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: "auto" }}>
          <Button
            component={Link}
            href={`/doctors/${doctor.id}`}
            variant="contained"
            fullWidth
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 700,
              py: 1.1,
              fontSize: "0.875rem",
            }}
          >
            Book Now
          </Button>
          <Button
            component={Link}
            href={`/doctors/${doctor.id}`}
            variant="outlined"
            fullWidth
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              py: 1,
              fontSize: "0.875rem",
            }}
          >
            View Profile
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

const TopRatedDoctors = async () => {
  let doctors: any[] = [];

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/doctor`, {
      next: { revalidate: 30 },
    });
    if (res.ok) {
      const json = await res.json();
      const raw = json?.data;
      doctors = Array.isArray(raw) ? raw : raw?.data ?? [];
    }
  } catch {
    doctors = [];
  }

  const topDoctors = doctors.slice(0, 4);

  return (
    <Box
      sx={{
        my: 10,
        py: { xs: 8, md: 12 },
        background: "linear-gradient(160deg, #f0f4ff 0%, #e8f5e9 100%)",
        clipPath: {
          xs: "none",
          md: "polygon(0 0, 100% 5%, 100% 100%, 0 95%)",
        },
      }}
    >
      {/* Section Header */}
      <Box sx={{ textAlign: "center", mb: { xs: 4, md: 6 }, px: 2 }}>
        <Typography
          variant="overline"
          sx={{ color: "primary.main", fontWeight: 700, letterSpacing: 2 }}
        >
          Healthcare Experts
        </Typography>
        <Typography
          variant="h4"
          component="h2"
          fontWeight={800}
          sx={{ mt: 0.5, mb: 1.5, fontSize: { xs: "1.6rem", md: "2.2rem" } }}
        >
          Our Top Rated Doctors
        </Typography>
        <Typography
          color="text.secondary"
          sx={{ maxWidth: 520, mx: "auto", fontSize: { xs: "0.95rem", md: "1rem" } }}
        >
          Access to expert physicians and surgeons with advanced technologies
          and top-quality facilities.
        </Typography>
      </Box>

      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {topDoctors.map((doctor: any) => (
            <Grid item key={doctor.id} xs={12} sm={6} md={3}>
              <DoctorCard doctor={doctor} />
            </Grid>
          ))}
        </Grid>

        {topDoctors.length === 0 && (
          <Typography textAlign="center" color="text.secondary" py={6}>
            No doctors available at the moment.
          </Typography>
        )}

        <Box sx={{ textAlign: "center", mt: { xs: 4, md: 6 } }}>
          <Button
            component={Link}
            href="/doctors"
            variant="contained"
            size="large"
            sx={{
              borderRadius: 3,
              textTransform: "none",
              fontWeight: 700,
              px: 5,
              py: 1.5,
              fontSize: "1rem",
              boxShadow: "0 4px 20px rgba(20,96,204,0.25)",
              "&:hover": { boxShadow: "0 6px 28px rgba(20,96,204,0.35)" },
            }}
          >
            View All Doctors
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default TopRatedDoctors;
