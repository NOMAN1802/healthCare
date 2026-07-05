import {
  Box, Container, Typography, Grid, Card, CardContent,
  Button, Stack, Chip, Avatar,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ShieldIcon from "@mui/icons-material/Shield";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import StarIcon from "@mui/icons-material/Star";
import Link from "next/link";

const plans = [
  {
    name: "Basic",
    price: "৳499",
    period: "/month",
    badge: null,
    color: "#64748b",
    icon: <ShieldIcon sx={{ fontSize: 36 }} />,
    desc: "Essential coverage for individuals who need occasional medical consultations.",
    features: [
      { text: "3 video consultations/month", included: true },
      { text: "Digital prescriptions", included: true },
      { text: "24/7 chat support", included: true },
      { text: "Specialist access", included: false },
      { text: "Lab test discounts", included: false },
      { text: "Priority booking", included: false },
    ],
  },
  {
    name: "Standard",
    price: "৳999",
    period: "/month",
    badge: "Most Popular",
    color: "#6366f1",
    icon: <ShieldIcon sx={{ fontSize: 36 }} />,
    desc: "Complete care for individuals with regular health needs and specialist requirements.",
    features: [
      { text: "10 video consultations/month", included: true },
      { text: "Digital prescriptions", included: true },
      { text: "24/7 chat support", included: true },
      { text: "Specialist access", included: true },
      { text: "20% lab test discount", included: true },
      { text: "Priority booking", included: false },
    ],
  },
  {
    name: "Premium",
    price: "৳1,999",
    period: "/month",
    badge: "Best Value",
    color: "#0891b2",
    icon: <ShieldIcon sx={{ fontSize: 36 }} />,
    desc: "Unlimited access with priority support — for those who want the best healthcare experience.",
    features: [
      { text: "Unlimited video consultations", included: true },
      { text: "Digital prescriptions", included: true },
      { text: "24/7 chat support", included: true },
      { text: "Specialist access", included: true },
      { text: "40% lab test discount", included: true },
      { text: "Priority booking", included: true },
    ],
  },
];

const addOns = [
  {
    icon: <FamilyRestroomIcon sx={{ fontSize: 32, color: "#6366f1" }} />,
    title: "Family Add-on",
    price: "৳599/month",
    desc: "Add up to 4 family members to any plan at a discounted rate.",
  },
  {
    icon: <BusinessCenterIcon sx={{ fontSize: 32, color: "#0891b2" }} />,
    title: "Corporate Plan",
    price: "Custom pricing",
    desc: "Bulk plans for teams of 10+. Includes admin dashboard and usage reports.",
  },
  {
    icon: <StarIcon sx={{ fontSize: 32, color: "#d97706" }} />,
    title: "Annual Discount",
    price: "Save 20%",
    desc: "Pay yearly and get 2 months free on any plan.",
  },
];

const HealthPlansPage = () => {
  return (
    <Box>
      {/* Hero */}
      <Box sx={{ background: "linear-gradient(135deg, #6366f1 0%, #764ba2 100%)", color: "white", py: { xs: 8, md: 12 } }}>
        <Container maxWidth="md" sx={{ textAlign: "center" }}>
          <Chip label="Health Plans" sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white", mb: 3, fontWeight: 600 }} />
          <Typography variant="h2" fontWeight={800} mb={2} sx={{ fontSize: { xs: "2rem", md: "3rem" } }}>
            Affordable plans for{" "}
            <Box component="span" sx={{ color: "#e0e7ff" }}>every need</Box>
          </Typography>
          <Typography variant="h6" sx={{ color: "rgba(255,255,255,0.8)", fontWeight: 400, lineHeight: 1.7, mb: 2 }}>
            Choose a healthBridge subscription plan and get unlimited access to consultations, prescriptions, and diagnostic discounts.
          </Typography>
        </Container>
      </Box>

      {/* Plans */}
      <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: "#f8fafc" }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="stretch">
            {plans.map((plan) => (
              <Grid item xs={12} md={4} key={plan.name}>
                <Card
                  sx={{
                    height: "100%",
                    border: plan.badge ? `2px solid ${plan.color}` : "1px solid #e2e8f0",
                    boxShadow: plan.badge ? 8 : "none",
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {plan.badge && (
                    <Chip
                      label={plan.badge}
                      size="small"
                      sx={{
                        position: "absolute", top: -14, left: "50%",
                        transform: "translateX(-50%)",
                        bgcolor: plan.color, color: "white",
                        fontWeight: 700, px: 1,
                      }}
                    />
                  )}
                  <CardContent sx={{ p: 4, display: "flex", flexDirection: "column", flexGrow: 1 }}>
                    <Avatar sx={{ bgcolor: `${plan.color}15`, color: plan.color, width: 56, height: 56, mb: 2 }}>
                      {plan.icon}
                    </Avatar>
                    <Typography variant="h6" fontWeight={700}>{plan.name}</Typography>
                    <Stack direction="row" alignItems="baseline" spacing={0.5} my={1.5}>
                      <Typography variant="h3" fontWeight={800} color={plan.color}>{plan.price}</Typography>
                      <Typography variant="body2" color="text.secondary">{plan.period}</Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary" lineHeight={1.7} mb={3}>
                      {plan.desc}
                    </Typography>
                    <Stack spacing={1.5} flexGrow={1} mb={3}>
                      {plan.features.map((f) => (
                        <Stack key={f.text} direction="row" spacing={1.5} alignItems="center">
                          {f.included
                            ? <CheckCircleIcon sx={{ fontSize: 18, color: "#16a34a", flexShrink: 0 }} />
                            : <CancelIcon sx={{ fontSize: 18, color: "#cbd5e1", flexShrink: 0 }} />}
                          <Typography variant="body2" color={f.included ? "text.primary" : "text.disabled"}>
                            {f.text}
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
                    <Button
                      component={Link}
                      href="/doctors"
                      variant={plan.badge ? "contained" : "outlined"}
                      fullWidth
                      sx={{
                        fontWeight: 700,
                        ...(plan.badge && { bgcolor: plan.color, "&:hover": { bgcolor: plan.color, filter: "brightness(0.9)" } }),
                        ...(!plan.badge && { borderColor: plan.color, color: plan.color }),
                      }}
                    >
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Add-ons */}
      <Box sx={{ py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight={700} textAlign="center" mb={1}>Add-ons & Special Plans</Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center" mb={6}>
            Customize your plan with optional extras
          </Typography>
          <Grid container spacing={4}>
            {addOns.map((a) => (
              <Grid item xs={12} md={4} key={a.title}>
                <Card sx={{ border: "1px solid #e2e8f0", boxShadow: "none", height: "100%" }}>
                  <CardContent sx={{ p: 3.5 }}>
                    <Box mb={2}>{a.icon}</Box>
                    <Typography variant="h6" fontWeight={700} mb={0.5}>{a.title}</Typography>
                    <Chip label={a.price} size="small" sx={{ bgcolor: "#f1f5f9", color: "#475569", fontWeight: 600, mb: 2 }} />
                    <Typography variant="body2" color="text.secondary" lineHeight={1.7}>{a.desc}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA */}
      <Box sx={{ background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)", color: "white", py: { xs: 6, md: 10 }, textAlign: "center" }}>
        <Container maxWidth="sm">
          <Typography variant="h4" fontWeight={700} mb={2}>Not sure which plan is right?</Typography>
          <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.7)", mb: 4 }}>
            Book a free consultation and our team will help you choose the best plan for your health needs.
          </Typography>
          <Button
            component={Link}
            href="/consultation"
            variant="contained"
            size="large"
            endIcon={<ArrowForwardIcon />}
            sx={{ background: "linear-gradient(135deg, #667eea, #764ba2)", fontWeight: 700, px: 5, py: 1.5 }}
          >
            Talk to Us
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default HealthPlansPage;
