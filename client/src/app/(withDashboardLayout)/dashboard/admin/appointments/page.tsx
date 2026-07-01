"use client";
import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  useGetAllAppointmentsQuery,
  useAppointmentStatusChangeMutation,
} from "@/redux/api/appointmentApi";
import { dateFormatter } from "@/utils/dateFormatter";
import { getTimeIn12HourFormat } from "../../doctor/schedules/components/MultipleSelectFieldChip";
import PhChips from "@/components/Shared/PhChip/PhChips";
import { toast } from "sonner";

const statusChipType: Record<string, "info" | "warning" | "success" | "error"> = {
  SCHEDULED: "info",
  INPROGRESS: "warning",
  COMPLETED: "success",
  CANCELLED: "error",
};

const AppointmentPage = () => {
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [changeStatus] = useAppointmentStatusChangeMutation();

  const query: Record<string, any> = {};
  if (statusFilter) query.status = statusFilter;
  if (paymentFilter) query.paymentStatus = paymentFilter;

  const { data, isLoading } = useGetAllAppointmentsQuery(query);

  const raw = data?.appointments as any;
  const appointments: any[] = Array.isArray(raw) ? raw : raw?.data ?? [];

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await changeStatus({ id, body: { status } }).unwrap();
      toast.success("Status updated successfully");
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
      field: "doctor",
      headerName: "Doctor",
      flex: 1,
      renderCell: ({ row }) => row?.doctor?.name ?? "—",
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
      field: "action",
      headerName: "Change Status",
      flex: 1.5,
      headerAlign: "center",
      align: "center",
      renderCell: ({ row }) =>
        row.status !== "CANCELLED" && row.status !== "COMPLETED" ? (
          <Select
            size="small"
            value=""
            displayEmpty
            onChange={(e) => handleStatusChange(row.id, e.target.value)}
            sx={{ fontSize: 13, minWidth: 140 }}
          >
            <MenuItem value="" disabled>
              Update Status
            </MenuItem>
            {(["SCHEDULED", "INPROGRESS", "COMPLETED", "CANCELLED"] as const)
              .filter((s) => s !== row.status)
              .map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
          </Select>
        ) : (
          <Typography variant="caption" color="text.secondary">
            —
          </Typography>
        ),
    },
  ];

  return (
    <Box>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems={{ sm: "center" }}
        justifyContent="space-between"
        mb={3}
        mt={2}
      >
        <Typography variant="h5" fontWeight={600}>
          All Appointments
        </Typography>

        <Stack direction="row" spacing={2}>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="SCHEDULED">Scheduled</MenuItem>
              <MenuItem value="INPROGRESS">In Progress</MenuItem>
              <MenuItem value="COMPLETED">Completed</MenuItem>
              <MenuItem value="CANCELLED">Cancelled</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Payment</InputLabel>
            <Select
              value={paymentFilter}
              label="Payment"
              onChange={(e) => setPaymentFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="PAID">Paid</MenuItem>
              <MenuItem value="UNPAID">Unpaid</MenuItem>
            </Select>
          </FormControl>

          {(statusFilter || paymentFilter) && (
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                setStatusFilter("");
                setPaymentFilter("");
              }}
            >
              Clear
            </Button>
          )}
        </Stack>
      </Stack>

      <DataGrid
        rows={appointments}
        columns={columns}
        loading={isLoading}
        pageSizeOptions={[10, 25, 50]}
        initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
        autoHeight
        disableRowSelectionOnClick
      />
    </Box>
  );
};

export default AppointmentPage;
