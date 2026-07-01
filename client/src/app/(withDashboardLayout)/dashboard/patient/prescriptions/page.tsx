"use client"
import { useState } from "react"
import { Box, Chip, IconButton, Typography, Paper, Grid, Divider } from "@mui/material"
import { DataGrid, type GridColDef } from "@mui/x-data-grid"
import VisibilityIcon from "@mui/icons-material/Visibility"
import CloseIcon from "@mui/icons-material/Close"
import PersonIcon from "@mui/icons-material/Person"
import PhoneIcon from "@mui/icons-material/Phone"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import { useGetAllPrescriptionsQuery } from "@/redux/api/prescriptionApi"

const PrescriptionPage = () => {
  const [selectedPrescription, setSelectedPrescription] = useState(null)
  const { data, isLoading } = useGetAllPrescriptionsQuery({})

  const prescriptions = data?.prescriptions?.data || []

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const stripHtmlTags = (html: string) => {
    return html.replace(/<[^>]*>/g, "").trim()
  }

  const columns: GridColDef[] = [
    {
      field: "doctorName",
      headerName: "Doctor Name",
      flex: 1,
      renderCell: ({ row }) => {
        return (
          <Box>
            <Typography variant="body2" fontWeight="medium">
              {row.doctor.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {row.doctor.qualification}
            </Typography>
          </Box>
        )
      },
    },
    {
      field: "patientName",
      headerName: "Patient Name",
      flex: 1,
      renderCell: ({ row }) => {
        return row.patient.name
      },
    },
    {
      field: "prescriptionDate",
      headerName: "Prescription Date",
      headerAlign: "center",
      align: "center",
      flex: 1,
      renderCell: ({ row }) => {
        return formatDate(row.createdAt)
      },
    },
    {
      field: "followUpDate",
      headerName: "Follow-up Date",
      headerAlign: "center",
      align: "center",
      flex: 1,
      renderCell: ({ row }) => {
        return formatDate(row.followUpDate)
      },
    },
    {
      field: "instructions",
      headerName: "Instructions",
      flex: 1.5,
      renderCell: ({ row }) => {
        return (
          <Typography variant="body2" noWrap>
            {stripHtmlTags(row.instructions)}
          </Typography>
        )
      },
    },
    {
      field: "paymentStatus",
      headerName: "Payment Status",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: ({ row }) => {
        return (
          <Chip
            label={row.appointment.paymentStatus}
            color={row.appointment.paymentStatus === "PAID" ? "success" : "error"}
            size="small"
          />
        )
      },
    },
    {
      field: "action",
      headerName: "Actions",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: ({ row }) => {
        return (
          <IconButton onClick={() => setSelectedPrescription(row)} color="primary">
            <VisibilityIcon />
          </IconButton>
        )
      },
    },
  ]

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Prescriptions
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View and manage your medical prescriptions
        </Typography>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Box sx={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={prescriptions}
            columns={columns}
            loading={isLoading}
            pageSizeOptions={[5, 10, 25]}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            disableRowSelectionOnClick
          />
        </Box>
      </Paper>

      {selectedPrescription && (
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="h5" component="h2">
              Prescription Details
            </Typography>
            <IconButton onClick={() => setSelectedPrescription(null)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Grid container spacing={3}>
            {/* Doctor Information */}
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                  <PersonIcon />
                  Doctor Information
                </Typography>
                <Box sx={{ pl: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Name:</strong> {selectedPrescription.doctor.name}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Qualification:</strong> {selectedPrescription.doctor.qualification}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Designation:</strong> {selectedPrescription.doctor.designation}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Workplace:</strong> {selectedPrescription.doctor.currentWorkingPlace}
                  </Typography>
                  <Typography variant="body2" sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                    <PhoneIcon fontSize="small" />
                    {selectedPrescription.doctor.contactNumber}
                  </Typography>
                  <Typography variant="body2" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <LocationOnIcon fontSize="small" />
                    {selectedPrescription.doctor.address}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Patient Information */}
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                  <PersonIcon />
                  Patient Information
                </Typography>
                <Box sx={{ pl: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Name:</strong> {selectedPrescription.patient.name}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Email:</strong> {selectedPrescription.patient.email}
                  </Typography>
                  <Typography variant="body2" sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                    <PhoneIcon fontSize="small" />
                    {selectedPrescription.patient.contactNumber}
                  </Typography>
                  <Typography variant="body2" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <LocationOnIcon fontSize="small" />
                    {selectedPrescription.patient.address}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Prescription Instructions */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Prescription Instructions
            </Typography>
            <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
              <div dangerouslySetInnerHTML={{ __html: selectedPrescription.instructions }} />
            </Paper>
          </Box>

          {/* Appointment Details */}
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Typography variant="caption" color="text.secondary">
                Prescribed Date
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                {formatDate(selectedPrescription.createdAt)}
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="caption" color="text.secondary">
                Follow-up Date
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                {formatDate(selectedPrescription.followUpDate)}
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="caption" color="text.secondary">
                Payment Status
              </Typography>
              <Box sx={{ mt: 0.5 }}>
                <Chip
                  label={selectedPrescription.appointment.paymentStatus}
                  color={selectedPrescription.appointment.paymentStatus === "PAID" ? "success" : "error"}
                  size="small"
                />
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}
    </Box>
  )
}

export default PrescriptionPage
