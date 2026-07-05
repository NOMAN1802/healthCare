"use client";
import { useState } from "react";
import { Box, Button, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import VideocamIcon from "@mui/icons-material/Videocam";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import Link from "next/link";
import {
  useGetMyAppointmentsQuery,
  useAppointmentStatusChangeMutation,
} from "@/redux/api/appointmentApi";
import { dateFormatter } from "@/utils/dateFormatter";
import { getTimeIn12HourFormat } from "../schedules/components/MultipleSelectFieldChip";
import PhChips from "@/components/Shared/PhChip/PhChips";
import { toast } from "sonner";
import PrescriptionModal from "./components/PrescriptionModal";

const statusChipType: Record<string, "info" | "warning" | "success" | "error"> = {
  SCHEDULED: "info",
  INPROGRESS: "warning",
  COMPLETED: "success",
  CANCELLED: "error",
};

const DoctorAppointmentPage = () => {
  const { data, isLoading } = useGetMyAppointmentsQuery({});
  const appointments: any[] = data?.appointments?.data ?? [];

  const [changeStatus] = useAppointmentStatusChangeMutation();
  const [prescriptionAppointment, setPrescriptionAppointment] = useState<any>(null);

  const handleStatus = async (id: string, status: string) => {
    try {
      await changeStatus({ id, body: { status } }).unwrap();
      toast.success(`Marked as ${status}`);
    } catch {
      toast.error("Failed to update status");
    }
  };

  const columns: GridColDef[] = [
    {
      field: "patient",
      headerName: "Patient",
      flex: 1,
      renderCell: ({ row }) => row?.patient?.name ?? "—",
    },
    {
      field: "contact",
      headerName: "Contact",
      flex: 1,
      renderCell: ({ row }) => row?.patient?.contactNumber ?? "—",
    },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: ({ row }) => dateFormatter(row?.schedule?.startDateTime),
    },
    {
      field: "time",
      headerName: "Time",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: ({ row }) => getTimeIn12HourFormat(row?.schedule?.startDateTime),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: ({ row }) => (
        <PhChips label={row.status} type={statusChipType[row.status] ?? "info"} />
      ),
    },
    {
      field: "paymentStatus",
      headerName: "Payment",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: ({ row }) => (
        <PhChips
          label={row.paymentStatus}
          type={row.paymentStatus === "PAID" ? "success" : "error"}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1.8,
      headerAlign: "center",
      align: "center",
      renderCell: ({ row }) => (
        <Stack direction="row" spacing={0.5} alignItems="center">
          {row.status === "SCHEDULED" && row.paymentStatus === "PAID" && (
            <Button
              size="small"
              variant="outlined"
              color="warning"
              onClick={() => handleStatus(row.id, "INPROGRESS")}
            >
              Start
            </Button>
          )}
          {row.status === "INPROGRESS" && (
            <Button
              size="small"
              variant="outlined"
              color="success"
              onClick={() => handleStatus(row.id, "COMPLETED")}
            >
              Complete
            </Button>
          )}
          {row.status === "COMPLETED" && row.paymentStatus === "PAID" && (
            <Tooltip title="Write Prescription">
              <Button
                size="small"
                variant="contained"
                color="primary"
                startIcon={<MedicalServicesIcon fontSize="small" />}
                onClick={() => setPrescriptionAppointment(row)}
                sx={{ fontSize: 12 }}
              >
                Prescribe
              </Button>
            </Tooltip>
          )}
          <IconButton
            component={Link}
            href={`/video?videoCallingId=${row?.videoCallingId}`}
            disabled={row.paymentStatus === "UNPAID"}
            color="primary"
            size="small"
          >
            <VideocamIcon fontSize="small" />
          </IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <Box>
      <Typography variant="h5" fontWeight={600} mt={2} mb={3}>
        My Appointments
      </Typography>
      <DataGrid
        rows={appointments}
        columns={columns}
        loading={isLoading}
        pageSizeOptions={[10, 25, 50]}
        initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
        autoHeight
        disableRowSelectionOnClick
      />

      {prescriptionAppointment && (
        <PrescriptionModal
          open={!!prescriptionAppointment}
          onClose={() => setPrescriptionAppointment(null)}
          appointment={prescriptionAppointment}
        />
      )}
    </Box>
  );
};

export default DoctorAppointmentPage;
