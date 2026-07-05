"use client";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DoctorScheduleModal from "./components/DoctorScheduleModal";
import {
  useGetMyScheduleQuery,
  useDeleteDoctorScheduleMutation,
  useCreateDoctorScheduleMutation,
} from "@/redux/api/doctorScheduleApi";
import { useGetAllSchedulesQuery } from "@/redux/api/scheduleApi";
import { dateFormatter } from "@/utils/dateFormatter";
import { getTimeIn12HourFormat } from "./components/MultipleSelectFieldChip";
import { toast } from "sonner";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import MultipleSelectFieldChip from "./components/MultipleSelectFieldChip";
import LoadingButton from "@mui/lab/LoadingButton";

// ------------------------------------------------------------------
// Edit-slot modal — pick a new date+slot, then swap the old one out
// ------------------------------------------------------------------
const EditSlotModal = ({
  open,
  oldScheduleId,
  onClose,
}: {
  open: boolean;
  oldScheduleId: string;
  onClose: () => void;
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(
    dayjs().toISOString()
  );
  const [selectedScheduleIds, setSelectedScheduleIds] = useState<string[]>([]);

  const query: Record<string, any> = {
    startDate: dayjs(selectedDate).hour(0).minute(0).millisecond(0).toISOString(),
    endDate: dayjs(selectedDate).hour(23).minute(59).millisecond(999).toISOString(),
  };

  const { data } = useGetAllSchedulesQuery(query);
  const schedules: any[] = data?.schedules ?? [];

  const [deleteSchedule] = useDeleteDoctorScheduleMutation();
  const [createSchedule, { isLoading: creating }] = useCreateDoctorScheduleMutation();

  const handleSave = async () => {
    if (!selectedScheduleIds.length) {
      toast.error("Please select a new time slot");
      return;
    }
    try {
      await deleteSchedule(oldScheduleId).unwrap();
      await createSchedule({ scheduleIds: selectedScheduleIds }).unwrap();
      toast.success("Schedule updated successfully");
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to update schedule");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle fontWeight={700}>Change Schedule Slot</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ pt: 1 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Select Date"
              value={dayjs(selectedDate)}
              onChange={(v) => {
                setSelectedDate(dayjs(v).toISOString());
                setSelectedScheduleIds([]);
              }}
              sx={{ width: "100%" }}
            />
          </LocalizationProvider>
          <MultipleSelectFieldChip
            schedules={schedules}
            selectedScheduleIds={selectedScheduleIds}
            setSelectedScheduleIds={setSelectedScheduleIds}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <LoadingButton
          variant="contained"
          loading={creating}
          onClick={handleSave}
        >
          Save Changes
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

// ------------------------------------------------------------------
// Main page
// ------------------------------------------------------------------
const DoctorSchedulesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editScheduleId, setEditScheduleId] = useState<string | null>(null);

  const { data, isLoading } = useGetMyScheduleQuery({} as any);
  const [deleteSchedule] = useDeleteDoctorScheduleMutation();

  // getMySchedule controller sends data: result where result = { meta, data: [...] }
  // so the array is at data.data
  const raw: any[] = Array.isArray((data as any)?.data)
    ? (data as any).data
    : Array.isArray(data)
    ? data
    : [];
  const rows = raw.map((s: any) => ({
    id: s.scheduleId,
    date: s?.schedule?.startDateTime
      ? dateFormatter(s.schedule.startDateTime)
      : "—",
    startTime: s?.schedule?.startDateTime
      ? getTimeIn12HourFormat(s.schedule.startDateTime)
      : "—",
    endTime: s?.schedule?.endDateTime
      ? getTimeIn12HourFormat(s.schedule.endDateTime)
      : "—",
    isBooked: s.isBooked,
  }));

  const handleDelete = async (scheduleId: string) => {
    try {
      await deleteSchedule(scheduleId).unwrap();
      toast.success("Schedule slot removed");
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Cannot remove a booked slot");
    }
  };

  const columns: GridColDef[] = [
    { field: "date", headerName: "Date", flex: 1, minWidth: 120 },
    { field: "startTime", headerName: "Start Time", flex: 1, minWidth: 110 },
    { field: "endTime", headerName: "End Time", flex: 1, minWidth: 110 },
    {
      field: "isBooked",
      headerName: "Status",
      flex: 1,
      minWidth: 110,
      headerAlign: "center",
      align: "center",
      renderCell: ({ row }) => (
        <Chip
          label={row.isBooked ? "Booked" : "Available"}
          color={row.isBooked ? "warning" : "success"}
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      minWidth: 110,
      headerAlign: "center",
      align: "center",
      renderCell: ({ row }) => (
        <Stack direction="row" gap={0.5} justifyContent="center">
          {!row.isBooked && (
            <IconButton
              size="small"
              color="primary"
              onClick={() => setEditScheduleId(row.id)}
              title="Change slot"
            >
              <EditIcon fontSize="small" />
            </IconButton>
          )}
          <IconButton
            aria-label="delete"
            disabled={row.isBooked}
            onClick={() => handleDelete(row.id)}
            color="error"
            size="small"
            title="Remove slot"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mt={2}
        mb={3}
      >
        <Typography variant="h5" fontWeight={600}>
          My Schedule
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsModalOpen(true)}
        >
          Add Slots
        </Button>
      </Stack>

      <DoctorScheduleModal open={isModalOpen} setOpen={setIsModalOpen} />

      {editScheduleId && (
        <EditSlotModal
          open={!!editScheduleId}
          oldScheduleId={editScheduleId}
          onClose={() => setEditScheduleId(null)}
        />
      )}

      <DataGrid
        rows={rows}
        columns={columns}
        loading={isLoading}
        pageSizeOptions={[10, 25]}
        initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
        autoHeight
        disableRowSelectionOnClick
      />
    </Box>
  );
};

export default DoctorSchedulesPage;
