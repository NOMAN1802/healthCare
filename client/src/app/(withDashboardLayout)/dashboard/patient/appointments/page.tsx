"use client";

import { useGetMyAppointmentsQuery } from "@/redux/api/appointmentApi";
import { Box, Chip, IconButton, Tooltip } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import Link from "next/link";
import { dateFormatter } from "@/utils/dateFormatter";
import { getTimeIn12HourFormat } from "../../doctor/schedules/components/MultipleSelectFieldChip";
import PhChips from "@/components/Shared/PhChip/PhChips";
import dayjs from "dayjs";

// Returns true if now is within the joinable window:
// from 10 minutes before start up to the end of the slot.
const isJoinableNow = (startDateTime: string, endDateTime: string): boolean => {
  const now = dayjs();
  const start = dayjs(startDateTime).subtract(10, "minute");
  const end = dayjs(endDateTime);
  return now.isAfter(start) && now.isBefore(end);
};

const getJoinTooltip = (
  paymentStatus: string,
  status: string,
  startDateTime: string,
  endDateTime: string
): string => {
  if (paymentStatus !== "PAID") return "Payment required to join";
  if (status === "COMPLETED") return "Appointment already completed";
  if (status === "CANCELLED") return "Appointment cancelled";
  const now = dayjs();
  const start = dayjs(startDateTime);
  const end = dayjs(endDateTime);
  if (now.isBefore(start.subtract(10, "minute")))
    return `Join opens at ${start.subtract(10, "minute").format("hh:mm A")}`;
  if (now.isAfter(end)) return "Appointment time has passed";
  return "Join video call";
};

const PatientAppointmentsPage = () => {
  const { data, isLoading } = useGetMyAppointmentsQuery({});

  // The controller passes data: result where result = { meta, data: [...] }
  // so the array lives at appointments.data
  const raw = (data as any)?.appointments;
  const appointments: any[] = Array.isArray(raw)
    ? raw
    : Array.isArray(raw?.data)
    ? raw.data
    : [];

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Doctor Name",
      flex: 1,
      renderCell: ({ row }) => row?.doctor?.name ?? "—",
    },
    {
      field: "appointmentDate",
      headerName: "Appointment Date",
      headerAlign: "center",
      align: "center",
      flex: 1,
      renderCell: ({ row }) => dateFormatter(row?.schedule?.startDateTime),
    },
    {
      field: "appointmentTime",
      headerName: "Appointment Time",
      headerAlign: "center",
      align: "center",
      flex: 1,
      renderCell: ({ row }) => getTimeIn12HourFormat(row?.schedule?.startDateTime),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: ({ row }) => {
        const map: Record<string, "info" | "warning" | "success" | "error"> = {
          SCHEDULED: "info",
          INPROGRESS: "warning",
          COMPLETED: "success",
          CANCELLED: "error",
        };
        return <PhChips label={row.status} type={map[row.status] ?? "info"} />;
      },
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
      headerName: "Join",
      flex: 1,
      headerAlign: "center",
      align: "center",
      sortable: false,
      renderCell: ({ row }) => {
        const startDt: string = row?.schedule?.startDateTime ?? "";
        const endDt: string = row?.schedule?.endDateTime ?? "";
        const paid = row.paymentStatus === "PAID";
        const active = ["SCHEDULED", "INPROGRESS"].includes(row.status);
        const inWindow = startDt && endDt ? isJoinableNow(startDt, endDt) : false;
        const canJoin = paid && active && inWindow;
        const tooltip = getJoinTooltip(row.paymentStatus, row.status, startDt, endDt);

        return (
          <Tooltip title={tooltip} arrow>
            <span>
              <IconButton
                component={canJoin ? Link : "button"}
                href={canJoin ? `/video?videoCallingId=${row?.videoCallingId}` : undefined}
                disabled={!canJoin}
                sx={{
                  color: canJoin ? "primary.main" : "text.disabled",
                  "&.Mui-disabled": { opacity: 0.4 },
                }}
              >
                {canJoin ? (
                  <VideocamIcon />
                ) : (
                  <VideocamOffIcon />
                )}
              </IconButton>
            </span>
          </Tooltip>
        );
      },
    },
  ];

  return (
    <Box sx={{ p: 2 }}>
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

export default PatientAppointmentsPage;
