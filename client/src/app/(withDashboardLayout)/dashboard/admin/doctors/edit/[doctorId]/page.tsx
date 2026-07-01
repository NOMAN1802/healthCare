"use client";

import PHForm from "@/components/Forms/PHForm";
import PHInput from "@/components/Forms/PHInput";
import PHSelectField from "@/components/Forms/PHSelectField";
import { useGetDoctorQuery, useUpdateDoctorMutation } from "@/redux/api/doctorApi";
import { useGetAllSpecialtiesQuery } from "@/redux/api/specialtiesApi";
import { Gender } from "@/types";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FieldValues } from "react-hook-form";
import { toast } from "sonner";

type TParams = { params: { doctorId: string } };

const DoctorUpdatePage = ({ params }: TParams) => {
  const router = useRouter();
  const id = params?.doctorId;

  const { data, isLoading } = useGetDoctorQuery(id);
  const { data: specialtiesData } = useGetAllSpecialtiesQuery(undefined);
  const [updateDoctor, { isLoading: isUpdating }] = useUpdateDoctorMutation();

  const allSpecialties: any[] = Array.isArray(specialtiesData) ? specialtiesData : [];

  const [selectedSpecialtyIds, setSelectedSpecialtyIds] = useState<string[]>([]);

  // Pre-populate specialties once doctor data loads
  useEffect(() => {
    if (data?.doctorSpecialties) {
      setSelectedSpecialtyIds(
        data.doctorSpecialties.map((ds: any) => ds.specialtiesId)
      );
    }
  }, [data]);

  const handleFormSubmit = async (values: FieldValues) => {
    values.experience = Number(values.experience) || 0;
    values.appointmentFee = Number(values.appointmentFee);
    values.id = id;

    // Compute specialty diff
    const currentIds: string[] =
      data?.doctorSpecialties?.map((ds: any) => ds.specialtiesId) ?? [];

    const toAdd = selectedSpecialtyIds
      .filter((id) => !currentIds.includes(id))
      .map((specialtiesId) => ({ specialtiesId }));

    const toRemove = currentIds
      .filter((id) => !selectedSpecialtyIds.includes(id))
      .map((specialtiesId) => ({ specialtiesId, isDeleted: true }));

    const specialties = [...toAdd, ...toRemove];

    try {
      const res = await updateDoctor({
        id,
        body: { ...values, ...(specialties.length > 0 ? { specialties } : {}) },
      }).unwrap();

      if (res?.id) {
        toast.success("Doctor updated successfully!");
        router.push("/dashboard/admin/doctors");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update doctor");
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  const defaultValues = {
    name: data?.name ?? "",
    email: data?.email ?? "",
    contactNumber: data?.contactNumber ?? "",
    address: data?.address ?? "",
    registrationNumber: data?.registrationNumber ?? "",
    gender: data?.gender ?? "",
    experience: data?.experience ?? "",
    appointmentFee: data?.appointmentFee ?? "",
    qualification: data?.qualification ?? "",
    currentWorkingPlace: data?.currentWorkingPlace ?? "",
    designation: data?.designation ?? "",
  };

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", p: { xs: 2, md: 3 } }}>
      <Typography variant="h5" fontWeight={600} mb={3}>
        Update Doctor
      </Typography>

      <PHForm onSubmit={handleFormSubmit} defaultValues={data ? defaultValues : {}}>
        <Stack spacing={4}>
          {/* Personal Info */}
          <Box>
            <Typography variant="subtitle1" fontWeight={600} color="primary" gutterBottom>
              Personal Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <PHInput name="name" label="Full Name" fullWidth size="small" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <PHInput name="email" label="Email" fullWidth size="small" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <PHInput name="contactNumber" label="Contact Number" fullWidth size="small" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <PHSelectField items={Gender} name="gender" label="Gender" fullWidth size="small" />
              </Grid>
              <Grid item xs={12}>
                <PHInput name="address" label="Address" fullWidth size="small" />
              </Grid>
            </Grid>
          </Box>

          {/* Professional Info */}
          <Box>
            <Typography variant="subtitle1" fontWeight={600} color="primary" gutterBottom>
              Professional Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <PHInput name="registrationNumber" label="Registration Number" fullWidth size="small" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <PHInput name="qualification" label="Qualification" fullWidth size="small" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <PHInput name="designation" label="Designation" fullWidth size="small" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <PHInput name="currentWorkingPlace" label="Current Working Place" fullWidth size="small" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <PHInput name="experience" label="Experience (Years)" fullWidth size="small" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <PHInput name="appointmentFee" label="Appointment Fee (BDT)" fullWidth size="small" />
              </Grid>
            </Grid>
          </Box>

          {/* Specialties */}
          <Box>
            <Typography variant="subtitle1" fontWeight={600} color="primary" gutterBottom>
              Specialties
            </Typography>
            <FormControl fullWidth size="small">
              <InputLabel>Select Specialties</InputLabel>
              <Select
                multiple
                value={selectedSpecialtyIds}
                onChange={(e) =>
                  setSelectedSpecialtyIds(
                    typeof e.target.value === "string"
                      ? e.target.value.split(",")
                      : (e.target.value as string[])
                  )
                }
                input={<OutlinedInput label="Select Specialties" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {(selected as string[]).map((id) => {
                      const sp = allSpecialties.find((s: any) => s.id === id);
                      return <Chip key={id} label={sp?.title ?? id} size="small" />;
                    })}
                  </Box>
                )}
              >
                {allSpecialties.map((sp: any) => (
                  <MenuItem key={sp.id} value={sp.id}>
                    {sp.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Stack>

        <Stack direction="row" spacing={2} mt={4}>
          <Button
            variant="outlined"
            onClick={() => router.push("/dashboard/admin/doctors")}
            disabled={isUpdating}
          >
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isUpdating} sx={{ minWidth: 120 }}>
            {isUpdating ? (
              <><CircularProgress size={16} sx={{ mr: 1 }} />Saving...</>
            ) : "Save Changes"}
          </Button>
        </Stack>
      </PHForm>
    </Box>
  );
};

export default DoctorUpdatePage;
