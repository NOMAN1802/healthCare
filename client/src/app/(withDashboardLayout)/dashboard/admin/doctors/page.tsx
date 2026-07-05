"use client";
import { 
  Box, 
  Button, 
  IconButton, 
  Stack, 
  TextField, 
  Card,
  Typography,
  AppBar,
  Toolbar,
  CircularProgress,
  Chip,
  Avatar
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useState } from "react";
import {
  useDeleteDoctorMutation,
  useGetAllDoctorsQuery,
} from "@/redux/api/doctorApi";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDebounced } from "@/redux/hooks";
import { toast } from "sonner";
import EditIcon from "@mui/icons-material/Edit";
import Link from "next/link";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import DoctorModal from "./components/DoctorModal";
import { styled } from "@mui/material/styles";

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  },
}));

const SearchContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  maxWidth: 400,
  [theme.breakpoints.down('sm')]: {
    maxWidth: '100%',
  }
}));

const SearchIconWrapper = styled(Box)(({ theme }) => ({
  position: 'absolute',
  right: 10,
  top: '50%',
  transform: 'translateY(-50%)',
  pointerEvents: 'none',
  color: theme.palette.text.secondary,
}));

const DoctorsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const debouncedTerm = useDebounced({
    searchQuery: searchTerm,
    delay: 600,
  });

  const query: Record<string, any> = {};
  if (!!debouncedTerm) {
    query["searchTerm"] = searchTerm;
  }

  const { data, isLoading, error } = useGetAllDoctorsQuery({ ...query });
  const [deleteDoctor, { isLoading: isDeleting }] = useDeleteDoctorMutation();

  const doctors = data?.doctors || [];
  const meta = data?.meta;

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;
    
    try {
      const res = await deleteDoctor(id).unwrap();
      if (res?.id) {
        toast.success("Doctor deleted successfully!");
      }
    } catch (err: any) {
      console.error(err.message);
      toast.error("Failed to delete doctor");
    }
  };

  const columns: GridColDef[] = [
    { 
      field: "name", 
      headerName: "Doctor Name", 
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
            {params.value.charAt(0)}
          </Avatar>
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      )
    },
    { 
      field: "email", 
      headerName: "Email", 
      flex: 1,
      minWidth: 200,
    },
    { 
      field: "contactNumber", 
      headerName: "Contact", 
      flex: 1,
      minWidth: 120,
    },
    {
      field: "specialties",
      headerName: "Specialties",
      flex: 1,
      minWidth: 160,
      renderCell: ({ row }) => {
        const specs = row?.doctorSpecialties ?? [];
        if (!specs.length) return <Typography variant="caption" color="text.secondary">—</Typography>;
        return (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, py: 0.5 }}>
            {specs.slice(0, 2).map((ds: any) => (
              <Chip
                key={ds.specialtiesId}
                label={ds?.specialties?.title ?? "—"}
                size="small"
                color="primary"
                variant="outlined"
              />
            ))}
            {specs.length > 2 && (
              <Chip label={`+${specs.length - 2}`} size="small" variant="outlined" />
            )}
          </Box>
        );
      },
    },
    { 
      field: "appointmentFee", 
      headerName: "Fee", 
      flex: 0.5,
      minWidth: 80,
      renderCell: (params) => (
        <Chip 
          label={`$${params.value}`} 
          size="small" 
          color="primary" 
          variant="outlined" 
        />
      )
    },
    {
      field: "action",
      headerName: "Actions",
      flex: 1,
      minWidth: 120,
      headerAlign: "center",
      align: "center",
      renderCell: ({ row }) => {
        return (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Link href={`/dashboard/admin/doctors/edit/${row.id}`}>
              <IconButton size="small" color="primary">
                <EditIcon />
              </IconButton>
            </Link>
            <IconButton
              onClick={() => handleDelete(row.id)}
              size="small"
              color="error"
              disabled={isDeleting}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        );
      },
    },
  ];

  // For mobile card view
  const renderMobileCards = () => {
    return doctors.map((doctor: any) => (
      <StyledCard key={doctor.id}>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
            {doctor.name.charAt(0)}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1" fontWeight="500">
              {doctor.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {doctor.email}
            </Typography>
            <Typography variant="body2">
              {doctor.contactNumber} • {doctor.gender}
            </Typography>
            <Chip 
              label={`Fee: $${doctor.appointmentFee}`} 
              size="small" 
              color="primary" 
              variant="outlined"
              sx={{ mt: 0.5 }}
            />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Link href={`/dashboard/admin/doctors/edit/${doctor.id}`}>
            <IconButton size="small" color="primary">
              <EditIcon />
            </IconButton>
          </Link>
          <IconButton
            onClick={() => handleDelete(doctor.id)}
            size="small"
            color="error"
            disabled={isDeleting}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </StyledCard>
    ));
  };

  return (
    <Box sx={{ p: isMobile ? 2 : 3 }}>
      <AppBar 
        position="static" 
        color="transparent" 
        elevation={0}
        sx={{ 
          mb: 3, 
          borderBottom: 1, 
          borderColor: 'divider',
          bgcolor: 'background.paper'
        }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Doctors Management
          </Typography>
          
          {!isMobile && (
            <Button 
              onClick={() => setIsModalOpen(true)} 
              variant="contained" 
              startIcon={<AddIcon />}
            >
              Add New Doctor
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Stack 
        direction={isMobile ? "column" : "row"} 
        justifyContent="space-between" 
        alignItems={isMobile ? "stretch" : "center"}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <SearchContainer>
          <TextField
            fullWidth
            size="small"
            placeholder="Search doctors by name, email, or specialty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />
        </SearchContainer>
        
        {isMobile && (
          <Button 
            onClick={() => setIsModalOpen(true)} 
            variant="contained" 
            fullWidth
            startIcon={<AddIcon />}
          >
            Add New Doctor
          </Button>
        )}
      </Stack>

      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="error">
            Error loading doctors
          </Typography>
        </Box>
      ) : doctors.length === 0 ? (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            {searchTerm ? 'No doctors found' : 'No doctors yet'}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {searchTerm 
              ? 'Try adjusting your search terms' 
              : 'Get started by adding your first doctor'
            }
          </Typography>
          {!searchTerm && (
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={() => setIsModalOpen(true)}
              sx={{ mt: 2 }}
            >
              Add New Doctor
            </Button>
          )}
        </Box>
      ) : (
        <>
          {isMobile ? (
            <Box>
              {renderMobileCards()}
            </Box>
          ) : (
            <Box sx={{ height: 600, width: '100%' }}>
              <DataGrid 
                rows={doctors} 
                columns={columns} 
                sx={{
                  '& .MuiDataGrid-cell:hover': {
                    color: 'primary.main',
                  },
                }}
              />
            </Box>
          )}
        </>
      )}

      <DoctorModal open={isModalOpen} setOpen={setIsModalOpen} />
    </Box>
  );
};

export default DoctorsPage;