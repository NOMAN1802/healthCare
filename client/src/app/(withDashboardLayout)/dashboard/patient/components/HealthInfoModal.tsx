"use client";
import { useEffect, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, Grid, Typography,
  IconButton, Divider, Stack, FormControlLabel, Switch, Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { toast } from "sonner";
import { useUpdateMyHealthDataMutation } from "@/redux/api/patientApi";

const BLOOD_GROUPS = [
  { value: "A_POSITIVE",  label: "A+" },
  { value: "A_NEGATIVE",  label: "A−" },
  { value: "B_POSITIVE",  label: "B+" },
  { value: "B_NEGATIVE",  label: "B−" },
  { value: "O_POSITIVE",  label: "O+" },
  { value: "O_NEGATIVE",  label: "O−" },
  { value: "AB_POSITIVE", label: "AB+" },
  { value: "AB_NEGATIVE", label: "AB−" },
];

const GENDERS = [
  { value: "MALE",   label: "Male" },
  { value: "FEMALE", label: "Female" },
];

type Props = {
  open: boolean;
  onClose: () => void;
  existing: any; // current patientHealthData from profile
};

const defaultForm = {
  weight: "",
  height: "",
  bloodGroup: "A_POSITIVE",
  gender: "MALE",
  hasAllergies: false,
  hasDiabetes: false,
  smokingStatus: false,
  hasPastSurgeries: false,
  recentAnxiety: false,
  recentDepression: false,
};

const HealthInfoModal = ({ open, onClose, existing }: Props) => {
  const [form, setForm] = useState(defaultForm);
  const [updateHealthData, { isLoading }] = useUpdateMyHealthDataMutation();

  // Pre-fill form when modal opens
  useEffect(() => {
    if (open && existing) {
      setForm({
        weight:           existing.weight          ?? "",
        height:           existing.height          ?? "",
        bloodGroup:       existing.bloodGroup      ?? "A_POSITIVE",
        gender:           existing.gender          ?? "MALE",
        hasAllergies:     existing.hasAllergies    ?? false,
        hasDiabetes:      existing.hasDiabetes     ?? false,
        smokingStatus:    existing.smokingStatus   ?? false,
        hasPastSurgeries: existing.hasPastSurgeries ?? false,
        recentAnxiety:    existing.recentAnxiety   ?? false,
        recentDepression: existing.recentDepression ?? false,
      });
    } else if (open && !existing) {
      setForm(defaultForm);
    }
  }, [open, existing]);

  const set = (field: string, value: any) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    if (!form.weight || !form.height) {
      toast.error("Weight and height are required");
      return;
    }
    try {
      await updateHealthData(form).unwrap();
      toast.success("Health profile updated successfully");
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to update health data");
    }
  };

  const toggleFields = [
    { key: "hasAllergies",     label: "Has Allergies" },
    { key: "hasDiabetes",      label: "Has Diabetes" },
    { key: "smokingStatus",    label: "Smoking" },
    { key: "hasPastSurgeries", label: "Past Surgeries" },
    { key: "recentAnxiety",    label: "Recent Anxiety" },
    { key: "recentDepression", label: "Recent Depression" },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={1}>
            <FavoriteIcon color="error" />
            <Typography variant="h6" fontWeight={600}>
              {existing ? "Update Health Info" : "Add Health Info"}
            </Typography>
          </Stack>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 3 }}>
        <Grid container spacing={2.5}>
          {/* Weight */}
          <Grid item xs={6}>
            <TextField
              label="Weight"
              type="number"
              fullWidth
              value={form.weight}
              onChange={(e) => set("weight", e.target.value)}
              InputProps={{ endAdornment: <Typography variant="caption" color="text.secondary">kg</Typography> }}
              required
            />
          </Grid>

          {/* Height */}
          <Grid item xs={6}>
            <TextField
              label="Height"
              type="number"
              fullWidth
              value={form.height}
              onChange={(e) => set("height", e.target.value)}
              InputProps={{ endAdornment: <Typography variant="caption" color="text.secondary">cm</Typography> }}
              required
            />
          </Grid>

          {/* Blood Group */}
          <Grid item xs={6}>
            <TextField
              select
              label="Blood Group"
              fullWidth
              value={form.bloodGroup}
              onChange={(e) => set("bloodGroup", e.target.value)}
            >
              {BLOOD_GROUPS.map((bg) => (
                <MenuItem key={bg.value} value={bg.value}>
                  {bg.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Gender */}
          <Grid item xs={6}>
            <TextField
              select
              label="Gender"
              fullWidth
              value={form.gender}
              onChange={(e) => set("gender", e.target.value)}
            >
              {GENDERS.map((g) => (
                <MenuItem key={g.value} value={g.value}>
                  {g.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Health Flags */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ mt: 1 }}>
              Health Flags
            </Typography>
            <Box
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
                px: 2,
                py: 1,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 0.5,
              }}
            >
              {toggleFields.map(({ key, label }) => (
                <FormControlLabel
                  key={key}
                  control={
                    <Switch
                      size="small"
                      checked={!!(form as any)[key]}
                      onChange={(e) => set(key, e.target.checked)}
                      color="error"
                    />
                  }
                  label={<Typography variant="body2">{label}</Typography>}
                />
              ))}
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button onClick={onClose} variant="outlined" color="inherit" disabled={isLoading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isLoading}
          sx={{ backgroundColor: "#6366f1", "&:hover": { backgroundColor: "#4f46e5" } }}
        >
          {isLoading ? "Saving…" : "Save Health Info"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default HealthInfoModal;
