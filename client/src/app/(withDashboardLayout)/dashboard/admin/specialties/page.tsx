"use client";
import { 
  Box, 
  Button, 
  IconButton, 
  Stack, 
  TextField, 
  Card,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  AppBar,
  Toolbar,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert
} from "@mui/material";
import { useState, useEffect } from "react";
import {
  useDeleteSpecialtyMutation,
  useGetAllSpecialtiesQuery,
} from "@/redux/api/specialtiesApi";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Image from "next/image";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "sonner";
import { styled } from "@mui/material/styles";
import { DoctorSpecialty, Specialty } from "@/types/doctor";
import SpecialtyModal from "./components/SpecialtyModal"; // Import the new modal
import DeleteConfirmationModal from "./components/DeleteConfirmationModal";

// Styled components for better UI
const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  },
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    textAlign: 'center',
    padding: theme.spacing(1.5),
  }
}));

const SpecialtyImage = styled(Box)(({ theme }) => ({
  marginRight: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  [theme.breakpoints.down('sm')]: {
    marginRight: 0,
    marginBottom: theme.spacing(1),
  }
}));

const SearchContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  maxWidth: 400,
  [theme.breakpoints.down('sm')]: {
    maxWidth: '100%',
    marginTop: theme.spacing(1),
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

// Main Component
const SpecialtiesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { data, isLoading, error, refetch } = useGetAllSpecialtiesQuery({});
  const [deleteSpecialty, { isLoading: isDeleting }] = useDeleteSpecialtyMutation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter data based on search term
  const filteredData = data?.filter((specialty:Specialty) => 
    specialty.title.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleDeleteClick = (specialty: Specialty) => {
    setSelectedSpecialty(specialty);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedSpecialty) return;
    
    try {
      const res = await deleteSpecialty(selectedSpecialty.id).unwrap();
      if (res?.id) {
        toast.success("Specialty deleted successfully!");
        refetch(); // Refresh the list
      }
    } catch (err: any) {
      console.error(err.message);
      toast.error("Failed to delete specialty");
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedSpecialty(null);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setSelectedSpecialty(null);
  };

  const columns: GridColDef[] = [
    { field: "title", headerName: "Title", width: 400 },
    {
      field: "icon",
      headerName: "Icon",
      flex: 1,
      renderCell: ({ row }) => {
        return (
          <Box>
            <Image src={row.icon} width={30} height={30} alt="icon" />
          </Box>
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: ({ row }) => {
        return (
          <IconButton 
            onClick={() => handleDeleteClick(row)} 
            aria-label="delete"
            color="error"
            size="small"
          >
            <DeleteIcon />
          </IconButton>
        );
      },
    },
  ];

  // For mobile card view
  const renderMobileCards = () => {
    return filteredData.map((specialty:Specialty) => (
      <StyledCard key={specialty.id}>
        <SpecialtyImage>
          <Image 
            src={specialty.icon} 
            width={40} 
            height={40} 
            alt={specialty.title}
            style={{ objectFit: 'contain' }}
          />
        </SpecialtyImage>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle1">{specialty.title}</Typography>
        </Box>
        <IconButton 
          onClick={() => handleDeleteClick(specialty)} 
          aria-label="delete"
          color="error"
          size="small"
        >
          <DeleteIcon />
        </IconButton>
      </StyledCard>
    ));
  };

  return (
    <Box sx={{ p: isMobile ? 1 : 3 }}>
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
            Specialties
          </Typography>
          
          {!isMobile && (
            <Button 
              onClick={() => setIsModalOpen(true)} 
              variant="contained" 
              startIcon={<AddIcon />}
            >
              Create Specialty
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
            placeholder="Search specialties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />
        </SearchContainer>
        
        {isMobile ? (
          <Button 
            onClick={() => setIsModalOpen(true)} 
            variant="contained" 
            fullWidth
            startIcon={<AddIcon />}
          >
            Create Specialty
          </Button>
        ) : (
          <></>
        )}
      </Stack>

      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : filteredData.length === 0 ? (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            {searchTerm ? 'No specialties found' : 'No specialties yet'}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {searchTerm 
              ? 'Try adjusting your search terms' 
              : 'Get started by creating your first specialty'
            }
          </Typography>
          {!searchTerm && (
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={() => setIsModalOpen(true)}
              sx={{ mt: 2 }}
            >
              Create Specialty
            </Button>
          )}
        </Box>
      ) : (
        <>
          {isMobile || viewMode === 'grid' ? (
            <Box>
              {renderMobileCards()}
            </Box>
          ) : (
            <Box sx={{ height: 500, width: '100%' }}>
              <DataGrid 
                rows={filteredData} 
                columns={columns} 
              />
            </Box>
          )}
        </>
      )}

      <SpecialtyModal 
        open={isModalOpen} 
        setOpen={setIsModalOpen} 
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        itemName={selectedSpecialty?.title || ""}
        isLoading={isDeleting}
      />
    </Box>
  );
};

export default SpecialtiesPage;