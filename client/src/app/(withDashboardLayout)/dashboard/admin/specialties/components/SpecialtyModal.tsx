"use client";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Stack,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Image from "next/image";
import { toast } from "sonner";
import { FieldValues } from "react-hook-form";
import { useCreateSpecialtyMutation } from "@/redux/api/specialtiesApi";
import { modifyPayload } from "@/utils/modifyPayload";
import PHInput from "@/components/Forms/PHInput";
import PHForm from "@/components/Forms/PHForm";

type TProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const SpecialtyModal = ({ open, setOpen }: TProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [createSpecialty, { isLoading }] = useCreateSpecialtyMutation();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFormSubmit = async (values: FieldValues) => {
    if (!selectedFile) {
      toast.error("Please upload an icon");
      return;
    }

    // Create a copy of values and add the file
    const formValues = { ...values, file: selectedFile };
    const data = modifyPayload(formValues);
    
    try {
      const res = await createSpecialty(data).unwrap();
      if (res?.id) {
        toast.success("Specialty created successfully!!");
        setOpen(false);
        // Reset the form
        setSelectedFile(null);
        setPreviewUrl(null);
      }
    } catch (err: any) {
      console.error(err.message);
      toast.error("Failed to create specialty");
    }
  };

  const handleClose = () => {
    setOpen(false);
    // Reset form on close
    setTimeout(() => {
      setSelectedFile(null);
      setPreviewUrl(null);
    }, 300);
  };

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
    
    if (!file) {
      setPreviewUrl(null);
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be less than 2MB");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      fullScreen={isMobile}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 2,
          background: theme.palette.background.default,
        }
      }}
    >
      <DialogTitle sx={{ 
        m: 0, 
        p: 3,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: `1px solid ${theme.palette.divider}`
      }}>
        <Typography variant="h6" component="span" fontWeight="600">
          Create A New Specialty
        </Typography>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            color: theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <PHForm onSubmit={handleFormSubmit} defaultValues={{ title: "" }}>
        <DialogContent sx={{ p: 3 }}>
          <Stack spacing={3}>
            <Grid container >
              <Grid item xs={12}>
                <PHInput   name="title" label="Specialty Title" fullWidth />
              </Grid>
            </Grid>
            
            <Box>
              <Typography variant="body1" fontWeight="500" gutterBottom>
                Specialty Icon
              </Typography>
              
              <Box 
                sx={{ 
                  border: '2px dashed', 
                  borderColor: selectedFile ? 'primary.main' : 'divider',
                  borderRadius: 2, 
                  p: 3, 
                  textAlign: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    backgroundColor: theme.palette.action.hover
                  }
                }}
                onClick={() => document.getElementById('icon-upload')?.click()}
              >
                <input
                  id="icon-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                  style={{ display: 'none' }}
                />
                
                {previewUrl ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Box sx={{ 
                      position: 'relative', 
                      width: 80, 
                      height: 80,
                      mb: 2
                    }}>
                      <Image 
                        src={previewUrl} 
                        alt="Preview" 
                        fill
                        style={{ objectFit: 'contain' }}
                      />
                    </Box>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Click to change icon
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <CloudUploadIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Click to upload an icon
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Recommended: 64x64px PNG with transparent background
                    </Typography>
                  </Box>
                )}
              </Box>
              
              {!selectedFile && (
                <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                  Please upload an icon
                </Typography>
              )}
            </Box>
          </Stack>
        </DialogContent>
        
        <DialogActions sx={{ 
          p: 3, 
          gap: 1,
          borderTop: `1px solid ${theme.palette.divider}`
        }}>
          <Button 
            onClick={handleClose} 
            color="inherit"
            disabled={isLoading}
            sx={{ 
              borderRadius: 2,
              px: 3
            }}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={isLoading}
            sx={{ 
              borderRadius: 2,
              px: 3
            }}
          >
            {isLoading ? (
              <>
                <CircularProgress size={16} sx={{ mr: 1 }} />
                Creating...
              </>
            ) : (
              "Create Specialty"
            )}
          </Button>
        </DialogActions>
      </PHForm>
    </Dialog>
  );
};

export default SpecialtyModal;