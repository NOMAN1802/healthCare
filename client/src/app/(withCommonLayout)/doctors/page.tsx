"use client";
import DashedLine from "@/components/UI/Doctor/DashedLine";
import DoctorCard from "@/components/UI/Doctor/DoctorCard";
import ScrollCategory from "@/components/UI/Doctor/ScrollCategory";
import { useGetAllDoctorsQuery } from "@/redux/api/doctorApi";
import { Doctor } from "@/types/doctor";
import {
  Box,
  Container,
  CircularProgress,
  Typography,
  Alert,
} from "@mui/material";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const DoctorList = () => {
  const searchParams = useSearchParams();
  const specialty = searchParams.get("specialties") ?? "";

  const { data, isLoading, error } = useGetAllDoctorsQuery(
    specialty ? { specialties: specialty } : {}
  );

  const doctors: any[] = data?.doctors ?? [];

  return (
    <Box sx={{ mt: 2, p: 3, bgcolor: "secondary.light", borderRadius: 1, minHeight: "60vh" }}>
      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="40vh">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mt: 2 }}>
          Error loading doctors. Please try again later.
        </Alert>
      ) : doctors.length > 0 ? (
        doctors.map((doctor: Doctor, index: number) => (
          <Box key={doctor.id}>
            <DoctorCard doctor={doctor} />
            {index < doctors.length - 1 && <DashedLine />}
          </Box>
        ))
      ) : (
        <Typography variant="h6" textAlign="center" sx={{ py: 4 }}>
          No doctors found{specialty ? ` with specialty "${specialty}"` : ""}
        </Typography>
      )}
    </Box>
  );
};

const Doctors = () => {
  return (
    <Container>
      <Suspense fallback={null}>
        <ScrollCategoryWrapper />
      </Suspense>
      <Suspense
        fallback={
          <Box display="flex" justifyContent="center" alignItems="center" height="40vh">
            <CircularProgress />
          </Box>
        }
      >
        <DoctorList />
      </Suspense>
    </Container>
  );
};

const ScrollCategoryWrapper = () => {
  const searchParams = useSearchParams();
  const specialty = searchParams.get("specialties") ?? "";
  return <ScrollCategory specialties={specialty} />;
};

export default Doctors;
