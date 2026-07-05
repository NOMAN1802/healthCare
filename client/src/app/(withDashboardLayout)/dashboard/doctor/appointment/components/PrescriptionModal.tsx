"use client";
import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Typography,
  Box,
  IconButton,
  Divider,
  Avatar,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import { toast } from "sonner";
import { useCreatePrescriptionMutation } from "@/redux/api/prescriptionApi";

type Props = {
  open: boolean;
  onClose: () => void;
  appointment: any;
};

const PrescriptionModal = ({ open, onClose, appointment }: Props) => {
  const [instructions, setInstructions] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [createPrescription, { isLoading }] = useCreatePrescriptionMutation();

  const patient = appointment?.patient;

  const handleSubmit = async () => {
    if (!instructions.trim()) {
      toast.error("Please enter prescription instructions");
      return;
    }

    try {
      await createPrescription({
        appointmentId: appointment.id,
        instructions,
        ...(followUpDate ? { followUpDate: new Date(followUpDate).toISOString() } : {}),
      }).unwrap();
      toast.success("Prescription created and sent to patient's email");
      setInstructions("");
      setFollowUpDate("");
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to create prescription");
    }
  };

  const handleClose = () => {
    setInstructions("");
    setFollowUpDate("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={1}>
            <MedicalServicesIcon color="primary" />
            <Typography variant="h6" fontWeight={600}>
              Write Prescription
            </Typography>
          </Stack>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 2.5 }}>
        {/* Patient info card */}
        <Box
          sx={{
            bgcolor: "primary.50",
            border: "1px solid",
            borderColor: "primary.100",
            borderRadius: 1,
            p: 2,
            mb: 3,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Avatar
            src={patient?.profilePhoto}
            sx={{ width: 44, height: 44, bgcolor: "primary.main" }}
          >
            {patient?.name?.[0]}
          </Avatar>
          <Box flex={1}>
            <Typography variant="subtitle2" fontWeight={700}>
              {patient?.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {patient?.email}
            </Typography>
          </Box>
          <Chip label="COMPLETED" color="success" size="small" />
        </Box>

        <Stack spacing={2.5}>
          <TextField
            label="Prescription / Instructions"
            multiline
            rows={5}
            fullWidth
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder={`e.g.\n• Tab. Napa 500mg — 1 tab after meals, 3 times daily for 5 days\n• Syp. Zimax 200mg — 1 tsp twice daily for 7 days\n• Drink plenty of water and rest`}
            required
          />

          <TextField
            label="Follow-up Date (optional)"
            type="date"
            fullWidth
            value={followUpDate}
            onChange={(e) => setFollowUpDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: new Date().toISOString().split("T")[0] }}
          />
        </Stack>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: "block" }}>
          A copy of this prescription will be sent to the patient&apos;s email automatically.
        </Typography>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button onClick={handleClose} variant="outlined" color="inherit" disabled={isLoading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isLoading || !instructions.trim()}
          startIcon={<MedicalServicesIcon />}
        >
          {isLoading ? "Sending..." : "Issue Prescription"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PrescriptionModal;
