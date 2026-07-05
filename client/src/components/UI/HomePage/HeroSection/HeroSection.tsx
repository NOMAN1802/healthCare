"use client";
import { Box, Button, Container, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import assets from "@/assets";
import doctor1 from "@/assets/images/doctor1.png";
import doctor2 from "@/assets/images/doctor2.png";
import useUserInfo from "@/hooks/useUserInfo";
import { USER_ROLE } from "@/contants/role";

const HeroSection = () => {
  const userInfo = useUserInfo();
  const role = userInfo?.role ?? "";

  // Only patients see the Make Appointment button
  const isPatient = role === USER_ROLE.PATIENT;

  return (
    <Container
      sx={{
        display: "flex",
        direction: "row",
        my: 16,
      }}
    >
      {/* ── Left: Text content ── */}
      <Box sx={{ flex: 1, position: "relative" }}>
        <Box
          sx={{
            position: "absolute",
            width: "700px",
            left: "-90px",
            top: "-120px",
          }}
        >
          <Image src={assets.svgs.grid} alt="" />
        </Box>
        <Typography variant="h2" component="h1" fontWeight={600}>
          Healthier Hearts
        </Typography>
        <Typography variant="h2" component="h1" fontWeight={600}>
          Come From
        </Typography>
        <Typography
          variant="h2"
          component="h1"
          fontWeight={600}
          color="primary.main"
        >
          Preventive Care
        </Typography>
        <Typography sx={{ my: 4 }}>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fugit eum
          iusto consequatur eius, doloribus nesciunt facere aliquid eveniet et.
          Rerum maiores saepe cupiditate repellat recusandae atque sed. Saepe,
          vitae id?
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          {/* Visible only for patient role */}
          {isPatient && (
            <Button component={Link} href="/doctors" variant="contained">
              Make Appointment
            </Button>
          )}
          {/* Visible for all users including unauthenticated */}
          <Button component={Link} href="/consultation" variant="outlined">
            Contact Us
          </Button>
        </Box>
      </Box>

      {/* ── Right: Image collage ── */}
      <Box
        sx={{
          p: 1,
          flex: 1,
          display: "flex",
          justifyContent: "center",
          position: "relative",
          mt: 0,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            left: "200px",
            top: "-30px",
          }}
        >
          <Image src={assets.svgs.arrow} width={100} height={100} alt="" />
        </Box>

        {/* doctor1 + doctor2 side by side — oval frames */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Box
            mt={4}
            sx={{
              width: 240,
              height: 380,
              
            }}
          >
            <Image
              src={doctor1}
              width={250}
              height={380}
              alt="doctor"
              style={{ display: "block", objectFit: "cover", width: "100%", height: "100%" }}
            />
          </Box>

          <Box
            sx={{
              width: 250,
              height: 380,
              
            }}
          >
            <Image
              src={doctor2}
              width={250}
              height={380}
              alt="doctor"
              style={{ display: "block", objectFit: "cover", width: "100%", height: "100%" }}
            />
          </Box>
        </Box>

        {/* doctor3 — oval frame, overlapping center */}
        <Box
          sx={{
            position: "absolute",
            top: "250px",
            left: "160px",
            
            width: 200,
            height: 200,
            borderRadius: "10px",
          }}
        >
          <Image
            src={assets.images.doctor3}
            width={200}
            height={200}
            alt="doctor"
            style={{
              display: "block",
              objectFit: "cover",
              objectPosition: "center top",
              width: "100%",
              height: "100%",
            }}
          />
        </Box>

        {/* Stethoscope decoration */}
        <Box
          sx={{
            position: "absolute",
            bottom: "-50px",
            right: 0,
            zIndex: "-1",
          }}
        >
          <Image src={assets.images.stethoscope} width={180} height={180} alt="" />
        </Box>
      </Box>
    </Container>
  );
};

export default HeroSection;
