"use client";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  IconButton,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Box,
  Stack,
  Chip,
  OutlinedInput,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
} from "@mui/material";
import { useState } from "react";
import { Gender } from "@/types/common";
import { FieldValues } from "react-hook-form";
import PHForm from "@/components/Forms/PHForm";
import PHInput from "@/components/Forms/PHInput";
import PHSelectField from "@/components/Forms/PHSelectField";
import { useCreateDoctorMutation, useUpdateDoctorMutation } from "@/redux/api/doctorApi";
import { useGetAllSpecialtiesQuery } from "@/redux/api/specialtiesApi";
import { modifyPayload } from "@/utils/modifyPayload";
import { toast } from "sonner";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Image from "next/image";

type TProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const defaultValues = {
  doctor: {
    email: "",
    name: "",
    contactNumber: "",
    address: "",
    registrationNumber: "",
    gender: "",
    experience: "",
    appointmentFee: "",
    qualification: "",
    currentWorkingPlace: "",
    designation: "",
  },
  password: "",
};

const DoctorModal = ({ open, setOpen }: TProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [createDoctor, { isLoading }] = useCreateDoctorMutation();
  const [updateDoctor] = useUpdateDoctorMutation();
  const { data: specialtiesData } = useGetAllSpecialtiesQuery(undefined);
  const specialties: any[] = Array.isArray(specialtiesData) ? specialtiesData : [];

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedSpecialtyIds, setSelectedSpecialtyIds] = useState<string[]>([]);

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
    if (!file) { setPreviewUrl(null); return; }
    if (!file.type.startsWith("image/")) { toast.error("Please upload an image file"); return; }
    if (file.size > 2 * 1024 * 1024) { toast.error("Image must be less than 2MB"); return; }
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleFormSubmit = async (values: FieldValues) => {
    values.doctor.experience = Number(values.doctor.experience) || 0;
    values.doctor.appointmentFee = Number(values.doctor.appointmentFee);

    const payload = selectedFile ? { ...values, file: selectedFile } : values;
    const data = modifyPayload(payload);

    try {
      const res = await createDoctor(data).unwrap();
      if (res?.id) {
        // Assign specialties if any selected
        if (selectedSpecialtyIds.length > 0) {
          await updateDoctor({
            id: res.id,
            body: {
              specialties: selectedSpecialtyIds.map((id) => ({ specialtiesId: id })),
            },
          });
        }
        toast.success("Doctor created successfully!");
        handleClose();
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create doctor");
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedFile(null);
    setPreviewUrl(null);
    setSelectedSpecialtyIds([]);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullScreen={isMobile}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: isMobile ? 0 : 2 } }}
    >
      <DialogTitle
        sx={{
          m: 0, p: 3,
          display: "flex", justifyContent: "space-between", alignItems: "center",
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="h6" component="span" fontWeight={600}>
          Create New Doctor
        </Typography>
        <IconButton aria-label="close" onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <PHForm onSubmit={handleFormSubmit} defaultValues={defaultValues}>
        <DialogContent sx={{ p: 3 }}>
          <Stack spacing={3}>
            {/* Profile Photo */}
            <Box>
              <Typography variant="subtitle2" fontWeight={500} gutterBottom>
                Profile Photo{" "}
                <Typography component="span" variant="caption" color="text.secondary">
                  (optional)
                </Typography>
              </Typography>
              <Box
                sx={{
                  border: "2px dashed",
                  borderColor: selectedFile ? "primary.main" : "divider",
                  borderRadius: 2, p: 2, textAlign: "center", cursor: "pointer",
                  transition: "all 0.2s",
                  "&:hover": { borderColor: "primary.main", bgcolor: "action.hover" },
                }}
                onClick={() => document.getElementById("doctor-photo")?.click()}
              >
                <input id="doctor-photo" type="file" accept="image/*" style={{ display: "none" }}
                  onChange={(e) => handleFileChange(e.target.files?.[0] || null)} />
                {previewUrl ? (
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <Box sx={{ position: "relative", width: 80, height: 80, mb: 1 }}>
                      <Image src={previewUrl} alt="Preview" fill style={{ objectFit: "cover", borderRadius: "50%" }} />
                    </Box>
                    <Typography variant="caption" color="text.secondary">Click to change</Typography>
                  </Box>
                ) : (
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 1 }}>
                    <CloudUploadIcon sx={{ fontSize: 36, color: "text.secondary", mb: 0.5 }} />
                    <Typography variant="body2" color="text.secondary">Click to upload profile photo</Typography>
                  </Box>
                )}
              </Box>
            </Box>

            {/* Personal Info */}
            <Box>
              <Typography variant="subtitle1" fontWeight={600} color="primary" gutterBottom>
                Personal Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <PHInput name="doctor.name" label="Full Name" fullWidth required size="small" />
                </Grid>
                <Grid item xs={12} md={6}>
                  <PHInput name="doctor.email" label="Email Address" fullWidth required size="small" />
                </Grid>
                <Grid item xs={12} md={6}>
                  <PHInput name="doctor.contactNumber" label="Contact Number" fullWidth required size="small" />
                </Grid>
                <Grid item xs={12} md={6}>
                  <PHSelectField items={Gender} name="doctor.gender" label="Gender" fullWidth required size="small" />
                </Grid>
                <Grid item xs={12}>
                  <PHInput name="doctor.address" label="Address" fullWidth size="small" />
                </Grid>
              </Grid>
            </Box>

            {/* Professional Info */}
            <Box>
              <Typography variant="subtitle1" fontWeight={600} color="primary" gutterBottom>
                Professional Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <PHInput name="doctor.registrationNumber" label="Registration Number" fullWidth required size="small" />
                </Grid>
                <Grid item xs={12} md={6}>
                  <PHInput name="doctor.qualification" label="Qualification" fullWidth required size="small" />
                </Grid>
                <Grid item xs={12} md={6}>
                  <PHInput name="doctor.designation" label="Designation" fullWidth required size="small" />
                </Grid>
                <Grid item xs={12} md={6}>
                  <PHInput name="doctor.currentWorkingPlace" label="Current Working Place" fullWidth required size="small" />
                </Grid>
                <Grid item xs={12} md={6}>
                  <PHInput name="doctor.experience" label="Experience (Years)" fullWidth size="small" />
                </Grid>
                <Grid item xs={12} md={6}>
                  <PHInput name="doctor.appointmentFee" label="Appointment Fee (BDT)" fullWidth required size="small" />
                </Grid>

                {/* Specialty Selector */}
                <Grid item xs={12}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Specialties</InputLabel>
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
                      input={<OutlinedInput label="Specialties" />}
                      renderValue={(selected) => (
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                          {(selected as string[]).map((id) => {
                            const sp = specialties.find((s: any) => s.id === id);
                            return <Chip key={id} label={sp?.title ?? id} size="small" />;
                          })}
                        </Box>
                      )}
                    >
                      {specialties.map((sp: any) => (
                        <MenuItem key={sp.id} value={sp.id}>
                          {sp.title}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>

            {/* Account */}
            <Box>
              <Typography variant="subtitle1" fontWeight={600} color="primary" gutterBottom>
                Account Setup
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <PHInput name="password" type="password" label="Password" fullWidth required size="small" />
                </Grid>
              </Grid>
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3, borderTop: `1px solid ${theme.palette.divider}`, gap: 1 }}>
          <Button onClick={handleClose} color="inherit" disabled={isLoading}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isLoading} sx={{ minWidth: 140 }}>
            {isLoading ? (
              <><CircularProgress size={16} sx={{ mr: 1 }} />Creating...</>
            ) : "Create Doctor"}
          </Button>
        </DialogActions>
      </PHForm>
    </Dialog>
  );
};

export default DoctorModal;
