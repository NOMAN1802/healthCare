'use client';
import { useCreateAppointmentMutation } from '@/redux/api/appointmentApi';
import { useGetAllDoctorSchedulesQuery } from '@/redux/api/doctorScheduleApi';
import { useInitialPaymentMutation } from '@/redux/api/paymentApi';
import { DoctorSchedule } from '@/types/doctorSchedules';
import { Box, Button, Chip, CircularProgress, Stack, Typography } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

dayjs.extend(utc);

function formatTime(dateTimeString: string): string {
  if (!dateTimeString) return '—';
  const date = new Date(dateTimeString);
  if (isNaN(date.getTime())) return '—';
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const h = hours % 12 === 0 ? 12 : hours % 12;
  const m = minutes < 10 ? '0' + minutes : minutes.toString();
  return `${h}:${m} ${ampm}`;
}

function formatSlot(schedule: any): string {
  // backend stores as startDateTime / endDateTime (admin-created slots)
  const start = schedule?.startDateTime ?? schedule?.startDate;
  const end = schedule?.endDateTime ?? schedule?.endDate;
  return `${formatTime(start)} – ${formatTime(end)}`;
}

function dayRange(offsetDays: number) {
  const base = dayjs().add(offsetDays, 'day');
  return {
    startDate: base.startOf('day').toISOString(),
    endDate: base.endOf('day').toISOString(),
  };
}

const SlotGroup = ({
  label,
  slots,
  isLoading,
  selectedId,
  onSelect,
}: {
  label: string;
  slots: DoctorSchedule[] | undefined;
  isLoading: boolean;
  selectedId: string;
  onSelect: (id: string) => void;
}) => {
  const available = slots?.filter((s) => !s.isBooked) ?? [];

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
        <EventAvailableIcon sx={{ color: 'primary.main', fontSize: 20 }} />
        <Typography variant="subtitle1" fontWeight={700}>
          {label}
        </Typography>
      </Box>
      <Box sx={{ borderBottom: '2px dashed', borderColor: 'divider', mb: 2 }} />
      {isLoading ? (
        <Box display="flex" alignItems="center" gap={1} py={1}>
          <CircularProgress size={16} />
          <Typography variant="body2" color="text.secondary">Loading slots…</Typography>
        </Box>
      ) : available.length === 0 ? (
        <Chip
          label="No slots available"
          color="error"
          variant="outlined"
          size="small"
          sx={{ fontSize: '0.8rem' }}
        />
      ) : (
        <Stack direction="row" flexWrap="wrap" gap={1.5}>
          {available.map((ds: DoctorSchedule) => (
            <Button
              key={ds.scheduleId}
              size="small"
              variant={ds.scheduleId === selectedId ? 'contained' : 'outlined'}
              onClick={() => onSelect(ds.scheduleId)}
              startIcon={<AccessTimeIcon sx={{ fontSize: '14px !important' }} />}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.8rem',
                px: 1.5,
                py: 0.75,
              }}
            >
              {formatSlot(ds.schedule)}
            </Button>
          ))}
        </Stack>
      )}
    </Box>
  );
};

const DoctorScheduleSlots = ({ id }: { id: string }) => {
  const [scheduleId, setScheduleId] = useState('');
  const router = useRouter();

  const todayRange = dayRange(0);
  const tomorrowRange = dayRange(1);

  const { data: todayData, isLoading: loadingToday, refetch: refetchToday } = useGetAllDoctorSchedulesQuery({
    doctorId: id,
    ...todayRange,
  });

  const { data: tomorrowData, isLoading: loadingTomorrow, refetch: refetchTomorrow } = useGetAllDoctorSchedulesQuery({
    doctorId: id,
    ...tomorrowRange,
  });

  const todaySlots: DoctorSchedule[] = todayData?.doctorSchedules?.data ?? [];
  const tomorrowSlots: DoctorSchedule[] = tomorrowData?.doctorSchedules?.data ?? [];

  const todayLabel = `Today: ${dayjs().format('MMMM D, YYYY')} (${dayjs().format('dddd')})`;
  const tomorrowLabel = `Tomorrow: ${dayjs().add(1, 'day').format('MMMM D, YYYY')} (${dayjs().add(1, 'day').format('dddd')})`;

  const [createAppointment, { isLoading: booking }] = useCreateAppointmentMutation();
  const [initialPayment, { isLoading: paying }] = useInitialPaymentMutation();

  const handleBookAppointment = async () => {
    if (!scheduleId) {
      toast.error('Please select a time slot first');
      return;
    }
    try {
      const res = await createAppointment({ doctorId: id, scheduleId }).unwrap();
      if (res.id) {
        const response = await initialPayment(res.id).unwrap();
        if (response.paymentUrl) {
          router.push(response.paymentUrl);
        }
      }
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to book appointment');
      // Refetch slots so any now-booked slot is removed from the UI
      setScheduleId('');
      refetchToday();
      refetchTomorrow();
    }
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} color="primary.main" mb={3}>
        Availability
      </Typography>

      <Stack spacing={4}>
        <SlotGroup
          label={todayLabel}
          slots={todaySlots}
          isLoading={loadingToday}
          selectedId={scheduleId}
          onSelect={setScheduleId}
        />
        <SlotGroup
          label={tomorrowLabel}
          slots={tomorrowSlots}
          isLoading={loadingTomorrow}
          selectedId={scheduleId}
          onSelect={setScheduleId}
        />
      </Stack>

      <Button
        variant="contained"
        size="large"
        onClick={handleBookAppointment}
        disabled={!scheduleId || booking || paying}
        sx={{
          mt: 4,
          px: 5,
          py: 1.5,
          borderRadius: 3,
          textTransform: 'none',
          fontWeight: 700,
          fontSize: '1rem',
          minWidth: 220,
          display: 'block',
          mx: 'auto',
        }}
      >
        {booking || paying ? (
          <Box display="flex" alignItems="center" gap={1}>
            <CircularProgress size={18} color="inherit" />
            Processing…
          </Box>
        ) : (
          'Book Appointment Now'
        )}
      </Button>
    </Box>
  );
};

export default DoctorScheduleSlots;
