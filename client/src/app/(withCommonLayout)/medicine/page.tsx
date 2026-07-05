import {
  Box, Container, Typography, Grid, Card, CardContent,
  Button, Stack, Chip, Avatar, TextField, InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LocalPharmacyIcon from "@mui/icons-material/LocalPharmacy";
import MedicationIcon from "@mui/icons-material/Medication";
import ScienceIcon from "@mui/icons-material/Science";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import VerifiedIcon from "@mui/icons-material/Verified";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Link from "next/link";

const categories = [
  { icon: <MedicationIcon sx={{ fontSize: 32, color: "#6366f1" }} />, label: "Prescription Medicines", count: "2,000+", color: "#6366f1" },
  { icon: <HealthAndSafetyIcon sx={{ fontSize: 32, color: "#16a34a" }} />, label: "Vitamins & Supplements", count: "500+", color: "#16a34a" },
  { icon: <ScienceIcon sx={{ fontSize: 32, color: "#0891b2" }} />, label: "Diabetes Care", count: "150+", color: "#0891b2" },
  { icon: <LocalPharmacyIcon sx={{ fontSize: 32, color: "#d97706" }} />, label: "Cardiac Care", count: "200+", color: "#d97706" },
  { icon: <MedicationIcon sx={{ fontSize: 32, color: "#ec4899" }} />, label: "Women's Health", count: "180+", color: "#ec4899" },
  { icon: <HealthAndSafetyIcon sx={{ fontSize: 32, color: "#ef4444" }} />, label: "Pain Relief", count: "120+", color: "#ef4444" },
];

const features = [
  { icon: <LocalShippingIcon />, title: "Free Home Delivery", desc: "Free delivery on orders over ৳500. Express delivery available within 4 hours." },
  { icon: <VerifiedIcon />, title: "100% Genuine Medicines", desc: "Sourced directly from licensed manufacturers and distributors. No counterfeits." },
  { icon: <AccessTimeIcon />, title: "Order in Minutes", desc: "Upload your prescription, select your medicines, and checkout in under 2 minutes." },
  { icon: <LocalPharmacyIcon />, title: "Licensed Pharmacists", desc: "Our pharmacist team reviews every prescription order before dispatch." },
];

const howItWorks = [
  { step: "01", title: "Get a Prescription", desc: "Consult a doctor on healthBridge and receive a digital prescription instantly." },
  { step: "02", title: "Upload & Order", desc: "Upload your prescription on this page and add your medicines to the cart." },
  { step: "03", title: "Review & Pay", desc: "Our pharmacist verifies your order. Pay securely online." },
  { step: "04", title: "Receive at Home", desc: "Your medicines are delivered to your door — same day or next day." },
];

const MedicinePage = () => {
  return (
    <Box>
      {/* Hero */}
      <Box sx={{ background: "linear-gradient(135deg, #16a34a 0%, #0891b2 100%)", color: "white", py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={7}>
              <Chip label="Online Pharmacy" sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white", mb: 3, fontWeight: 600 }} />
              <Typography variant="h2" fontWeight={800} mb={2} sx={{ fontSize: { xs: "2rem", md: "3rem" }, lineHeight: 1.2 }}>
                Medicines delivered{" "}
                <Box component="span" sx={{ color: "#bbf7d0" }}>to your door</Box>
              </Typography>
              <Typography variant="h6" sx={{ color: "rgba(255,255,255,0.85)", fontWeight: 400, lineHeight: 1.7, mb: 4 }}>
                Order genuine prescription and OTC medicines online. Upload your prescription and get same-day delivery from our licensed pharmacy network.
              </Typography>

              {/* Search bar */}
              <Box sx={{ bgcolor: "white", borderRadius: 1, p: 0.5, display: "flex", gap: 1, maxWidth: 520 }}>
                <TextField
                  fullWidth
                  placeholder="Search for medicines, vitamins…"
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: "text.secondary" }} />
                      </InputAdornment>
                    ),
                    sx: { "& fieldset": { border: "none" } },
                  }}
                />
                <Button variant="contained" sx={{ flexShrink: 0, fontWeight: 700, bgcolor: "#16a34a", "&:hover": { bgcolor: "#15803d" } }}>
                  Search
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12} md={5}>
              <Grid container spacing={2}>
                {[
                  { value: "5,000+", label: "Medicines Available" },
                  { value: "Same Day", label: "Delivery Option" },
                  { value: "100%", label: "Genuine Products" },
                  { value: "Free", label: "Delivery over ৳500" },
                ].map((stat) => (
                  <Grid item xs={6} key={stat.label}>
                    <Box sx={{ bgcolor: "rgba(255,255,255,0.15)", borderRadius: 1, p: 3, textAlign: "center", border: "1px solid rgba(255,255,255,0.2)" }}>
                      <Typography variant="h5" fontWeight={800}>{stat.value}</Typography>
                      <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)", mt: 0.5 }}>{stat.label}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Categories */}
      <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: "#f8fafc" }}>
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight={700} textAlign="center" mb={1}>Shop by Category</Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center" mb={6}>
            Browse from thousands of genuine medicines across all categories
          </Typography>
          <Grid container spacing={3}>
            {categories.map((cat) => (
              <Grid item xs={6} sm={4} md={2} key={cat.label}>
                <Card
                  sx={{
                    textAlign: "center", border: "1px solid #e2e8f0", boxShadow: "none", cursor: "pointer",
                    transition: "box-shadow 0.2s, transform 0.2s",
                    "&:hover": { boxShadow: 4, transform: "translateY(-4px)" },
                  }}
                >
                  <CardContent sx={{ p: 2.5 }}>
                    <Box mb={1.5}>{cat.icon}</Box>
                    <Typography variant="caption" fontWeight={700} display="block" mb={0.5} lineHeight={1.3}>
                      {cat.label}
                    </Typography>
                    <Chip label={cat.count} size="small" sx={{ bgcolor: `${cat.color}15`, color: cat.color, fontWeight: 600, fontSize: 10 }} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* How it works */}
      <Box sx={{ py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight={700} textAlign="center" mb={1}>How It Works</Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center" mb={6}>
            Order your medicines in 4 simple steps
          </Typography>
          <Grid container spacing={4}>
            {howItWorks.map((step) => (
              <Grid item xs={12} sm={6} md={3} key={step.step}>
                <Box textAlign="center">
                  <Avatar sx={{ width: 64, height: 64, bgcolor: "#16a34a15", color: "#16a34a", mx: "auto", mb: 2, fontSize: "1.25rem", fontWeight: 800 }}>
                    {step.step}
                  </Avatar>
                  <Typography variant="h6" fontWeight={700} mb={1}>{step.title}</Typography>
                  <Typography variant="body2" color="text.secondary" lineHeight={1.7}>{step.desc}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features */}
      <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: "#f8fafc" }}>
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight={700} textAlign="center" mb={1}>Why order from healthBridge?</Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center" mb={6}>
            Safe, fast, and convenient medicine delivery
          </Typography>
          <Grid container spacing={4}>
            {features.map((f) => (
              <Grid item xs={12} sm={6} md={3} key={f.title}>
                <Box textAlign="center">
                  <Avatar sx={{ width: 64, height: 64, bgcolor: "#16a34a15", color: "#16a34a", mx: "auto", mb: 2 }}>
                    {f.icon}
                  </Avatar>
                  <Typography variant="h6" fontWeight={700} mb={1}>{f.title}</Typography>
                  <Typography variant="body2" color="text.secondary" lineHeight={1.7}>{f.desc}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Prescription CTA */}
      <Box sx={{ py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card sx={{ background: "linear-gradient(135deg, #16a34a, #0891b2)", color: "white", p: 1 }}>
                <CardContent sx={{ p: 4 }}>
                  <LocalPharmacyIcon sx={{ fontSize: 48, mb: 2, opacity: 0.9 }} />
                  <Typography variant="h5" fontWeight={700} mb={1}>Have a prescription?</Typography>
                  <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.85)", mb: 3, lineHeight: 1.7 }}>
                    Upload your prescription and our pharmacists will prepare your order within 30 minutes.
                  </Typography>
                  <Stack spacing={1} mb={3}>
                    {["Verified by licensed pharmacists", "Substitutes suggested when unavailable", "Full refund if out of stock"].map((t) => (
                      <Stack key={t} direction="row" spacing={1} alignItems="center">
                        <CheckCircleIcon sx={{ fontSize: 16 }} />
                        <Typography variant="body2">{t}</Typography>
                      </Stack>
                    ))}
                  </Stack>
                  <Button
                    component={Link}
                    href="/consultation"
                    variant="contained"
                    endIcon={<ArrowForwardIcon />}
                    sx={{ bgcolor: "white", color: "#16a34a", fontWeight: 700, "&:hover": { bgcolor: "#f0fdf4" } }}
                  >
                    Get a Prescription First
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ border: "1px solid #e2e8f0", boxShadow: "none", height: "100%" }}>
                <CardContent sx={{ p: 4 }}>
                  <MedicationIcon sx={{ fontSize: 48, mb: 2, color: "#6366f1" }} />
                  <Typography variant="h5" fontWeight={700} mb={1}>Need OTC medicines?</Typography>
                  <Typography variant="body2" color="text.secondary" mb={3} lineHeight={1.7}>
                    Browse and order over-the-counter medicines, vitamins, and health supplements without a prescription.
                  </Typography>
                  <Stack spacing={1} mb={3}>
                    {["No prescription required", "Same-day delivery available", "Bulk discounts for families"].map((t) => (
                      <Stack key={t} direction="row" spacing={1} alignItems="center">
                        <CheckCircleIcon sx={{ fontSize: 16, color: "#16a34a" }} />
                        <Typography variant="body2" color="text.secondary">{t}</Typography>
                      </Stack>
                    ))}
                  </Stack>
                  <Button
                    component={Link}
                    href="/doctors"
                    variant="outlined"
                    endIcon={<ArrowForwardIcon />}
                    sx={{ fontWeight: 700 }}
                  >
                    Browse OTC Medicines
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default MedicinePage;
