'use client';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import LoadingButton from '@mui/lab/LoadingButton';
import dayjs, { Dayjs } from 'dayjs';
import { useState } from 'react';
import { toast } from 'sonner';
import { useUpdateScheduleMutation } from '@/redux/api/scheduleApi';

type TSchedule = {
  id: string;
  startDateTime: string;
  endDateTime: string;
};

type TProps = {
  open: boolean;
  schedule: TSchedule | null;
  onClose: () => void;
};

const EditScheduleModal = ({ open, schedule, onClose }: TProps) => {
  const [date, setDate] = useState<Dayjs | null>(
    schedule ? dayjs(schedule.startDateTime) : dayjs()
  );
  const [startTime, setStartTime] = useState<Dayjs | null>(
    schedule ? dayjs(schedule.startDateTime) : dayjs()
  );
  const [endTime, setEndTime] = useState<Dayjs | null>(
    schedule ? dayjs(schedule.endDateTime) : dayjs()
  );

  const [updateSchedule, { isLoading }] = useUpdateScheduleMutation();

  const handleSubmit = async () => {
    if (!schedule || !date || !startTime || !endTime) return;

    const newStart = date
      .hour(startTime.hour())
      .minute(startTime.minute())
      .second(0)
      .millisecond(0);

    const newEnd = date
      .hour(endTime.hour())
      .minute(endTime.minute())
      .second(0)
      .millisecond(0);

    if (!newEnd.isAfter(newStart)) {
      toast.error('End time must be after start time');
      return;
    }

    try {
      await updateSchedule({
        id: schedule.id,
        startDateTime: newStart.toISOString(),
        endDateTime: newEnd.toISOString(),
      }).unwrap();
      toast.success('Schedule updated successfully');
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message ?? 'Failed to update schedule');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle fontWeight={700}>Edit Schedule Slot</DialogTitle>
      <DialogContent>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Stack spacing={3} sx={{ pt: 1 }}>
            <DatePicker
              label="Date"
              value={date}
              onChange={(v) => setDate(v)}
              sx={{ width: '100%' }}
            />
            <TimePicker
              label="Start Time"
              value={startTime}
              onChange={(v) => setStartTime(v)}
              sx={{ width: '100%' }}
            />
            <TimePicker
              label="End Time"
              value={endTime}
              onChange={(v) => setEndTime(v)}
              sx={{ width: '100%' }}
            />
          </Stack>
        </LocalizationProvider>
      </DialogContent>
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <LoadingButton variant="contained" loading={isLoading} onClick={handleSubmit}>
          Save Changes
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default EditScheduleModal;
