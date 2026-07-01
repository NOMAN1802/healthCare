"use client";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

interface DeleteConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  isLoading?: boolean;
}

const DeleteConfirmationModal = ({
  open,
  onClose,
  onConfirm,
  itemName,
  isLoading = false,
}: DeleteConfirmationModalProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={isMobile}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 2,
        },
      }}
    >
      <DialogTitle sx={{ textAlign: "center", py: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <WarningAmberIcon color="warning" sx={{ fontSize: 48 }} />
        </Box>
        <Typography variant="h6" component="h2" fontWeight="600">
          Confirm Delete
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ textAlign: "center", py: 1 }}>
        <Typography variant="body1">
          Are you sure you want to delete{" "}
          <Typography component="span" fontWeight="600" color="primary">
            {itemName}
          </Typography>
          ?
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          This action cannot be undone.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", gap: 2, p: 3 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          disabled={isLoading}
          sx={{ minWidth: 100 }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          disabled={isLoading}
          sx={{ minWidth: 100 }}
        >
          {isLoading ? "Deleting..." : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationModal;