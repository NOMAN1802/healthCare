import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Stack,
  Avatar,
  Chip,
} from "@mui/material";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import VerifiedIcon from "@mui/icons-material/Verified";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PaymentIcon from "@mui/icons-material/Payment";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Link from "next/link";

// ─── Data ────────────────────────────────────────────────────────────────────

const steps = [
  {
    step: "01",
    icon: <CalendarMonthIcon sx={{ fontSize: 32 }} />,
    title: "Book an Appointment",
    desc: "Browse our verified doctors, choose your preferred specialist, and pick a time slot that works for you.",
  },
  {
    step: "02",
    icon: <PaymentIcon sx={{ fontSize: 32 }} />,
    title: "Complete Payment",
    desc: "Pay securely online. Your slot is confirmed instantly after payment. Cancel anytime for a full refund.",
  },
  {
    step: "03",
    icon: <VideoCallIcon sx={{ fontSize: 32 }} />,
    title: "Join Video Call",
    desc: "At the scheduled time, join your video consultation from your Appointments dashboard — no downloads needed.",
  },
  {
    step: "04",
    icon: <VerifiedIcon sx={{ fontSize: 32 }} />,
    title: "Get Prescription",
    desc: "Your doctor reviews your case and issues a digital prescription, sent directly to your email.",
  },
];

const benefits = [
  "Consult from home — no travel, no waiting rooms",
  "Verified, board-certified doctors only",
  "Digital prescriptions sent to your email",
  "Secure, encrypted video calls",
  "Book in under 2 minutes",
  "Flexible scheduling — including evenings & weekends",
  "Full refund if appointment is cancelled",
  "Follow-up reminders via email",
];

const types = [
  {
    icon: <VideoCallIcon sx={{ fontSize: 40, color: "#6366f1" }} />,
    title: "Video Consultation",
    desc: "Face-to-face consultation via secure HD video. Best for detailed assessments and follow-ups.",
    badge: "Most Popular",
    badgeColor: "#6366f1",
  },
  {
    icon: <SupportAgentIcon sx={{ fontSize: 40, color: "#0891b2" }} />,
    title: "Follow-up Visit",
    desc: "Quick check-in with your doctor after a completed appointment. Review your progress and adjust prescriptions.",
    badge: "Recommended",
    badgeColor: "#0891b2",
  },
  {
    icon: <AccessTimeIcon sx={{ fontSize: 40, color: "#16a34a" }} />,
    title: "Urgent Consultation",
    desc: "Need to see a doctor today? Find available slots in the next few hours with our urgent care doctors.",
    badge: "Same Day",
    badgeColor: "#16a34a",
  },
];

const faqs = [
  {
    q: "Who are the doctors on healthBridge?",
    a: "All doctors on our platform are verified, licensed medical professionals. They must provide their medical registration number and credentials before joining.",
  },
  {
    q: "Is my consultation private?",
    a: "Yes. All video calls are end-to-end encrypted. Your medical data is stored securely and never shared with third parties.",
  },
  {
    q: "What if I miss my appointment?",
    a: "If you miss your appointment, the slot is marked as completed. We recommend contacting support if there was a technical issue — we'll try to help reschedule.",
  },
  {
    q: "Can I get a prescription online?",
    a: "Yes. After your consultation, the doctor can issue a digital prescription directly through the platform, which is sent to your email immediately.",
  },
  {
    q: "How do I join the video call?",
    a: "Go to your Appointments dashboard and click the video camera icon when it becomes active — 10 minutes before your scheduled time.",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

const ConsultationPage = () => {
  return (
    <Box>
      {/* Hero */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          py: { xs: 8, md: 12 },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={7}>
              <Chip
                label="Online Healthcare Platform"
                sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white", mb: 3, fontWeight: 600 }}
              />
              <Typography
                variant="h2"
                fontWeight={800}
                sx={{ mb: 3, lineHeight: 1.2, fontSize: { xs: "2rem", md: "3rem" } }}
              >
                World-class doctors,{" "}
                <Box component="span" sx={{ color: "#e0e7ff" }}>
                  from your home
                </Box>
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, color: "rgba(255,255,255,0.85)", fontWeight: 400, lineHeight: 1.7 }}>
                Connect with verified specialists for video consultations, get digital prescriptions, and manage your health — all in one place.
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button
                  component={Link}
                  href="/doctors"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    bgcolor: "white",
                    color: "#6366f1",
                    fontWeight: 700,
                    px: 4,
                    "&:hover": { bgcolor: "#f0f0ff" },
                    textTransform: "none",
                    borderRadius: 1,
                  }}
                >
                  Find a Doctor
                </Button>
                <Button
                  component={Link}
                  href="/dashboard/patient/appointments"
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: "rgba(255,255,255,0.6)",
                    color: "white",
                    fontWeight: 600,
                    px: 4,
                    "&:hover": { borderColor: "white", bgcolor: "rgba(255,255,255,0.1)" },
                    textTransform: "none",
                    borderRadius: 1,
                  }}
                >
                  My Appointments
                </Button>
              </Stack>
            </Grid>

            <Grid item xs={12} md={5}>
              <Grid container spacing={2}>
                {[
                  { value: "500+", label: "Verified Doctors" },
                  { value: "50K+", label: "Consultations Done" },
                  { value: "4.9★", label: "Average Rating" },
                  { value: "24/7", label: "Support Available" },
                ].map((stat) => (
                  <Grid item xs={6} key={stat.label}>
                    <Box
                      sx={{
                        bgcolor: "rgba(255,255,255,0.15)",
                        borderRadius: 1,
                        p: 3,
                        textAlign: "center",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255,255,255,0.2)",
                      }}
                    >
                      <Typography variant="h4" fontWeight={800}>
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)", mt: 0.5 }}>
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

      {/* Consultation Types */}
      <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: "#f8fafc" }}>
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight={700} textAlign="center" mb={1}>
            Types of Consultation
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center" mb={6}>
            Choose the consultation type that fits your needs
          </Typography>
          <Grid container spacing={4}>
            {types.map((type) => (
              <Grid item xs={12} md={4} key={type.title}>
                <Card
                  sx={{
                    height: "100%",
                    borderRadius: 1,
                    border: "1px solid #e2e8f0",
                    boxShadow: "none",
                    transition: "box-shadow 0.2s, transform 0.2s",
                    "&:hover": { boxShadow: 6, transform: "translateY(-4px)" },
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ mb: 2 }}>{type.icon}</Box>
                    <Chip
                      label={type.badge}
                      size="small"
                      sx={{ bgcolor: `${type.badgeColor}15`, color: type.badgeColor, fontWeight: 700, mb: 2 }}
                    />
                    <Typography variant="h6" fontWeight={700} mb={1.5}>
                      {type.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" lineHeight={1.7}>
                      {type.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* How It Works */}
      <Box sx={{ py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight={700} textAlign="center" mb={1}>
            How It Works
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center" mb={6}>
            Get a consultation in 4 simple steps
          </Typography>
          <Grid container spacing={4}>
            {steps.map((step, i) => (
              <Grid item xs={12} sm={6} md={3} key={step.step}>
                <Box sx={{ textAlign: "center", position: "relative" }}>
                  <Avatar
                    sx={{
                      width: 72,
                      height: 72,
                      bgcolor: "#6366f115",
                      color: "#6366f1",
                      mx: "auto",
                      mb: 2,
                    }}
                  >
                    {step.icon}
                  </Avatar>
                  <Typography
                    variant="caption"
                    sx={{ color: "#6366f1", fontWeight: 700, letterSpacing: 1 }}
                  >
                    STEP {step.step}
                  </Typography>
                  <Typography variant="h6" fontWeight={700} mt={0.5} mb={1.5}>
                    {step.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" lineHeight={1.7}>
                    {step.desc}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Benefits */}
      <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: "#f8fafc" }}>
        <Container maxWidth="lg">
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h4" fontWeight={700} mb={2}>
                Why consult online with healthBridge?
              </Typography>
              <Typography variant="body1" color="text.secondary" mb={4} lineHeight={1.8}>
                Skip the commute and waiting rooms. Get expert medical advice from the comfort of your home — faster, cheaper, and just as effective.
              </Typography>
              <Grid container spacing={1.5}>
                {benefits.map((b) => (
                  <Grid item xs={12} sm={6} key={b}>
                    <Stack direction="row" spacing={1.5} alignItems="flex-start">
                      <CheckCircleIcon sx={{ color: "#16a34a", fontSize: 20, mt: 0.2, flexShrink: 0 }} />
                      <Typography variant="body2" color="text.secondary">
                        {b}
                      </Typography>
                    </Stack>
                  </Grid>
                ))}
              </Grid>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  borderRadius: 1,
                  p: 5,
                  color: "white",
                  textAlign: "center",
                }}
              >
                <VideoCallIcon sx={{ fontSize: 64, mb: 2, opacity: 0.9 }} />
                <Typography variant="h5" fontWeight={700} mb={1}>
                  Ready to consult?
                </Typography>
                <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)", mb: 3, lineHeight: 1.7 }}>
                  Browse hundreds of verified doctors across all specialties. Book your slot in under 2 minutes.
                </Typography>
                <Button
                  component={Link}
                  href="/doctors"
                  variant="contained"
                  size="large"
                  fullWidth
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    bgcolor: "white",
                    color: "#6366f1",
                    fontWeight: 700,
                    textTransform: "none",
                    borderRadius: 1,
                    "&:hover": { bgcolor: "#f0f0ff" },
                  }}
                >
                  Browse Doctors
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* FAQ */}
      <Box sx={{ py: { xs: 6, md: 10 } }}>
        <Container maxWidth="md">
          <Typography variant="h4" fontWeight={700} textAlign="center" mb={1}>
            Frequently Asked Questions
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center" mb={6}>
            Everything you need to know about online consultations
          </Typography>
          <Stack spacing={2}>
            {faqs.map((faq) => (
              <Card
                key={faq.q}
                sx={{ borderRadius: 1, border: "1px solid #e2e8f0", boxShadow: "none" }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="subtitle1" fontWeight={700} mb={1}>
                    {faq.q}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" lineHeight={1.8}>
                    {faq.a}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* Bottom CTA */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
          color: "white",
          py: { xs: 6, md: 10 },
          textAlign: "center",
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="h4" fontWeight={700} mb={2}>
            Start your health journey today
          </Typography>
          <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.7)", mb: 4 }}>
            Join thousands of patients who manage their health smarter with healthBridge.
          </Typography>
          <Button
            component={Link}
            href="/doctors"
            variant="contained"
            size="large"
            endIcon={<ArrowForwardIcon />}
            sx={{
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              fontWeight: 700,
              px: 5,
              py: 1.5,
              textTransform: "none",
              borderRadius: 1,
              fontSize: "1rem",
            }}
          >
            Book a Consultation
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default ConsultationPage;
