import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Stack,
  Chip,
  Avatar,
} from "@mui/material";
import ScienceIcon from "@mui/icons-material/Science";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BloodtypeIcon from "@mui/icons-material/Bloodtype";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import BiotechIcon from "@mui/icons-material/Biotech";
import MedicationIcon from "@mui/icons-material/Medication";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import HomeIcon from "@mui/icons-material/Home";
import VerifiedIcon from "@mui/icons-material/Verified";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Link from "next/link";

const testCategories = [
  {
    icon: <BloodtypeIcon sx={{ fontSize: 36, color: "#ef4444" }} />,
    title: "Blood Tests",
    desc: "CBC, lipid panel, blood glucose, thyroid, liver function, kidney function and more.",
    count: "50+ tests",
    color: "#ef4444",
  },
  {
    icon: <MonitorHeartIcon sx={{ fontSize: 36, color: "#6366f1" }} />,
    title: "Cardiac Tests",
    desc: "ECG, echocardiography, cardiac enzyme panel, cholesterol profile.",
    count: "15+ tests",
    color: "#6366f1",
  },
  {
    icon: <FavoriteIcon sx={{ fontSize: 36, color: "#ec4899" }} />,
    title: "Hormone Tests",
    desc: "Thyroid hormones, reproductive hormones, cortisol, insulin levels.",
    count: "20+ tests",
    color: "#ec4899",
  },
  {
    icon: <ScienceIcon sx={{ fontSize: 36, color: "#0891b2" }} />,
    title: "Urine & Stool",
    desc: "Urinalysis, urine culture, stool routine, stool for occult blood.",
    count: "12+ tests",
    color: "#0891b2",
  },
  {
    icon: <BiotechIcon sx={{ fontSize: 36, color: "#16a34a" }} />,
    title: "Microbiology",
    desc: "Culture & sensitivity, hepatitis B & C, HIV screening, dengue panel.",
    count: "25+ tests",
    color: "#16a34a",
  },
  {
    icon: <MedicationIcon sx={{ fontSize: 36, color: "#d97706" }} />,
    title: "Health Packages",
    desc: "Comprehensive health checkup packages for preventive screening.",
    count: "8 packages",
    color: "#d97706",
  },
];

const packages = [
  {
    name: "Basic Health Checkup",
    price: "৳ 999",
    tests: ["CBC", "Blood Glucose (Fasting)", "Urine Routine", "Lipid Profile"],
    badge: null,
  },
  {
    name: "Comprehensive Checkup",
    price: "৳ 2,499",
    tests: ["CBC", "Thyroid Panel (T3, T4, TSH)", "Liver Function", "Kidney Function", "Lipid Profile", "Blood Glucose", "Urine & Stool Routine"],
    badge: "Most Popular",
  },
  {
    name: "Cardiac Screening",
    price: "৳ 3,499",
    tests: ["ECG", "Echocardiography", "Cardiac Enzymes", "Lipid Profile", "CBC", "Blood Glucose", "Homocysteine"],
    badge: "Recommended",
  },
];

const features = [
  { icon: <HomeIcon />, title: "Home Sample Collection", desc: "A trained phlebotomist visits your home to collect samples at your convenience." },
  { icon: <AccessTimeIcon />, title: "Fast Turnaround", desc: "Most reports ready within 24 hours. Urgent reports in 4–6 hours." },
  { icon: <VerifiedIcon />, title: "Accredited Labs", desc: "All tests processed at ISO-certified, government-accredited diagnostic labs." },
  { icon: <CheckCircleIcon />, title: "Doctor Review", desc: "A healthBridge doctor reviews your report and flags any abnormal values." },
];

const DiagnosticsPage = () => {
  return (
    <Box>
      {/* Hero */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)",
          color: "white",
          py: { xs: 8, md: 12 },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={7}>
              <Chip
                label="Diagnostic Services"
                sx={{ bgcolor: "rgba(99,102,241,0.3)", color: "#a5b4fc", mb: 3, fontWeight: 600 }}
              />
              <Typography
                variant="h2"
                fontWeight={800}
                sx={{ mb: 3, lineHeight: 1.2, fontSize: { xs: "2rem", md: "3rem" } }}
              >
                Lab tests,{" "}
                <Box component="span" sx={{ color: "#818cf8" }}>
                  delivered to your door
                </Box>
              </Typography>
              <Typography
                variant="h6"
                sx={{ mb: 4, color: "rgba(255,255,255,0.75)", fontWeight: 400, lineHeight: 1.7 }}
              >
                Book a diagnostic test online, get samples collected at home, and receive your reports digitally — reviewed by a real doctor.
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button
                  component={Link}
                  href="/doctors"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    bgcolor: "#6366f1",
                    fontWeight: 700,
                    px: 4,
                    textTransform: "none",
                    borderRadius: 1,
                    "&:hover": { bgcolor: "#4f46e5" },
                  }}
                >
                  Book a Test
                </Button>
                <Button
                  component={Link}
                  href="/consultation"
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: "rgba(255,255,255,0.4)",
                    color: "white",
                    fontWeight: 600,
                    px: 4,
                    textTransform: "none",
                    borderRadius: 1,
                    "&:hover": { borderColor: "white", bgcolor: "rgba(255,255,255,0.08)" },
                  }}
                >
                  Consult a Doctor First
                </Button>
              </Stack>
            </Grid>

            <Grid item xs={12} md={5}>
              <Grid container spacing={2}>
                {[
                  { value: "200+", label: "Diagnostic Tests" },
                  { value: "24h", label: "Report Turnaround" },
                  { value: "ISO", label: "Certified Labs" },
                  { value: "Free", label: "Home Collection" },
                ].map((stat) => (
                  <Grid item xs={6} key={stat.label}>
                    <Box
                      sx={{
                        bgcolor: "rgba(255,255,255,0.07)",
                        borderRadius: 1,
                        p: 3,
                        textAlign: "center",
                        border: "1px solid rgba(255,255,255,0.12)",
                      }}
                    >
                      <Typography variant="h4" fontWeight={800} color="#818cf8">
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)", mt: 0.5 }}>
                        {stat.label}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Test Categories */}
      <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: "#f8fafc" }}>
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight={700} textAlign="center" mb={1}>
            Test Categories
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center" mb={6}>
            Browse from over 200 tests across all major diagnostic categories
          </Typography>
          <Grid container spacing={3}>
            {testCategories.map((cat) => (
              <Grid item xs={12} sm={6} md={4} key={cat.title}>
                <Card
                  sx={{
                    height: "100%",
                    borderRadius: 1,
                    border: "1px solid #e2e8f0",
                    boxShadow: "none",
                    cursor: "pointer",
                    transition: "box-shadow 0.2s, transform 0.2s",
                    "&:hover": { boxShadow: 6, transform: "translateY(-4px)" },
                  }}
                >
                  <CardContent sx={{ p: 3.5 }}>
                    <Box sx={{ mb: 2 }}>{cat.icon}</Box>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                      <Typography variant="h6" fontWeight={700}>
                        {cat.title}
                      </Typography>
                      <Chip
                        label={cat.count}
                        size="small"
                        sx={{ bgcolor: `${cat.color}15`, color: cat.color, fontWeight: 600, fontSize: 11 }}
                      />
                    </Stack>
                    <Typography variant="body2" color="text.secondary" lineHeight={1.7}>
                      {cat.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Health Packages */}
      <Box sx={{ py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight={700} textAlign="center" mb={1}>
            Health Packages
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center" mb={6}>
            Bundled test packages at a discounted price — perfect for annual checkups
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {packages.map((pkg) => (
              <Grid item xs={12} md={4} key={pkg.name}>
                <Card
                  sx={{
                    height: "100%",
                    borderRadius: 1,
                    border: pkg.badge ? "2px solid #6366f1" : "1px solid #e2e8f0",
                    boxShadow: pkg.badge ? 6 : "none",
                    position: "relative",
                  }}
                >
                  {pkg.badge && (
                    <Chip
                      label={pkg.badge}
                      size="small"
                      sx={{
                        position: "absolute",
                        top: -12,
                        left: "50%",
                        transform: "translateX(-50%)",
                        bgcolor: "#6366f1",
                        color: "white",
                        fontWeight: 700,
                        px: 1,
                      }}
                    />
                  )}
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h6" fontWeight={700} mb={0.5}>
                      {pkg.name}
                    </Typography>
                    <Typography variant="h4" fontWeight={800} color="#6366f1" mb={3}>
                      {pkg.price}
                    </Typography>
                    <Stack spacing={1} mb={3}>
                      {pkg.tests.map((test) => (
                        <Stack key={test} direction="row" spacing={1} alignItems="center">
                          <CheckCircleIcon sx={{ fontSize: 16, color: "#16a34a" }} />
                          <Typography variant="body2" color="text.secondary">
                            {test}
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
                    <Button
                      component={Link}
                      href="/doctors"
                      variant={pkg.badge ? "contained" : "outlined"}
                      fullWidth
                      sx={{
                        textTransform: "none",
                        borderRadius: 1,
                        fontWeight: 600,
                        ...(pkg.badge && { bgcolor: "#6366f1", "&:hover": { bgcolor: "#4f46e5" } }),
                      }}
                    >
                      Book Package
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features */}
      <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: "#f8fafc" }}>
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight={700} textAlign="center" mb={1}>
            Why choose healthBridge Diagnostics?
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center" mb={6}>
            A seamless, end-to-end diagnostic experience
          </Typography>
          <Grid container spacing={4}>
            {features.map((f) => (
              <Grid item xs={12} sm={6} md={3} key={f.title}>
                <Box textAlign="center">
                  <Avatar
                    sx={{ width: 64, height: 64, bgcolor: "#6366f115", color: "#6366f1", mx: "auto", mb: 2 }}
                  >
                    {f.icon}
                  </Avatar>
                  <Typography variant="h6" fontWeight={700} mb={1}>
                    {f.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" lineHeight={1.7}>
                    {f.desc}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Bottom CTA */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #6366f1 0%, #764ba2 100%)",
          color: "white",
          py: { xs: 6, md: 10 },
          textAlign: "center",
        }}
      >
        <Container maxWidth="sm">
          <ScienceIcon sx={{ fontSize: 56, mb: 2, opacity: 0.9 }} />
          <Typography variant="h4" fontWeight={700} mb={2}>
            Not sure which test you need?
          </Typography>
          <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.8)", mb: 4, lineHeight: 1.7 }}>
            Consult one of our doctors first. They will prescribe the right diagnostic tests based on your symptoms.
          </Typography>
          <Button
            component={Link}
            href="/consultation"
            variant="contained"
            size="large"
            endIcon={<ArrowForwardIcon />}
            sx={{
              bgcolor: "white",
              color: "#6366f1",
              fontWeight: 700,
              px: 5,
              py: 1.5,
              textTransform: "none",
              borderRadius: 1,
              fontSize: "1rem",
              "&:hover": { bgcolor: "#f0f0ff" },
            }}
          >
            Consult a Doctor
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default DiagnosticsPage;
