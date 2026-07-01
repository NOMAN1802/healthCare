import { Box, Button, Container, Stack, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

const Specialist = async () => {
  let specialties: any[] = [];

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/specialties`, {
      next: { revalidate: 30 },
    });
    if (res.ok) {
      const json = await res.json();
      const raw = json?.data;
      specialties = Array.isArray(raw) ? raw : raw?.data ?? [];
    }
  } catch {
    specialties = [];
  }

  const topSpecialties = specialties.slice(0, 4);

  return (
    <Container>
      <Box sx={{ margin: "80px 0px", textAlign: "center" }}>
        <Box sx={{ textAlign: "start" }}>
          <Typography variant="h4" fontWeight={600}>
            Explore Treatments Across Specialties
          </Typography>
          <Typography component="p" fontWeight={300} fontSize={18} mt={1}>
            Experienced Doctors Across All Specialties
          </Typography>
        </Box>

        <Stack direction="row" gap={4} mt={5} flexWrap="wrap">
          {topSpecialties.map((specialty: any) => (
            <Box
              key={specialty.id}
              component={Link}
              href={`/doctors?specialties=${encodeURIComponent(specialty.title)}`}
              sx={{
                flex: 1,
                minWidth: "120px",
                backgroundColor: "rgba(245, 245, 245, 1)",
                border: "1px solid rgba(250, 250, 250, 1)",
                borderRadius: "10px",
                textAlign: "center",
                padding: "40px 10px",
                textDecoration: "none",
                color: "inherit",
                "& img": { width: "50px", height: "50px", margin: "0 auto" },
                "&:hover": {
                  border: "1px solid rgba(36, 153, 239, 1)",
                  cursor: "pointer",
                  transition: "all 0.5s",
                },
              }}
            >
              {specialty.icon && (
                <Image
                  src={specialty.icon}
                  width={100}
                  height={100}
                  alt={specialty.title}
                />
              )}
              <Box>
                <Typography component="p" fontWeight={600} fontSize={18} mt={2}>
                  {specialty.title}
                </Typography>
              </Box>
            </Box>
          ))}

          {topSpecialties.length === 0 && (
            <Typography color="text.secondary" sx={{ py: 4, textAlign: "center", width: "100%" }}>
              No specialties available yet.
            </Typography>
          )}
        </Stack>

        <Button
          variant="outlined"
          sx={{ marginTop: "20px" }}
          component={Link}
          href="/doctors"
        >
          View All Specialists
        </Button>
      </Box>
    </Container>
  );
};

export default Specialist;
