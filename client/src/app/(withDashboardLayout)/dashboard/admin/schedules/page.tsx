'use client';
import {
  Box,
  Button,
  IconButton,
  Paper,
  Typography,
  Chip,
  CircularProgress,
  Stack,
} from '@mui/material';
import ScheduleModal from './components/ScheduleModal';
import EditScheduleModal from './components/EditScheduleModal';
import { useState } from 'react';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import EventIcon from '@mui/icons-material/Event';
import {
  useGetAllSchedulesQuery,
  useDeleteScheduleMutation,
} from '@/redux/api/scheduleApi';
import dayjs from 'dayjs';
import { dateFormatter } from '@/utils/dateFormatter';
import { toast } from 'sonner';

type TScheduleRow = {
  id: string;
  sl: number;
  startDateTime: string;
  endDateTime: string;
  startDate: string;
  startTime: string;
  endTime: string;
};

const SchedulesPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editSchedule, setEditSchedule] = useState<{
    id: string;
    startDateTime: string;
    endDateTime: string;
  } | null>(null);

  // DataGrid uses 0-based page index; backend uses 1-based
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 20,
  });

  const { data: allSchedules, isLoading } = useGetAllSchedulesQuery({
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
  });
  const [deleteSchedule] = useDeleteScheduleMutation();

  const schedules: any[] = allSchedules?.schedules ?? [];

  const rows: TScheduleRow[] = schedules.map((s: any, index: number) => ({
    sl: index + 1,
    id: s.id,
    startDateTime: s.startDateTime,
    endDateTime: s.endDateTime,
    startDate: dateFormatter(s.startDateTime),
    startTime: dayjs(s.startDateTime).format('hh:mm a'),
    endTime: dayjs(s.endDateTime).format('hh:mm a'),
  }));

  const handleDelete = async (id: string) => {
    try {
      await deleteSchedule(id).unwrap();
      toast.success('Schedule deleted successfully');
    } catch (err: any) {
      toast.error(err?.data?.message ?? 'Failed to delete schedule');
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'sl',
      headerName: 'SL',
      width: 60,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'startDate',
      headerName: 'Date',
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <EventIcon fontSize="small" color="primary" />
          {params.value}
        </Box>
      ),
    },
    {
      field: 'startTime',
      headerName: 'Start Time',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'endTime',
      headerName: 'End Time',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'action',
      headerName: 'Action',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      renderCell: ({ row }) => (
        <Stack direction="row" gap={0.5} justifyContent="center">
          <IconButton
            size="small"
            color="primary"
            title="Edit schedule"
            onClick={() =>
              setEditSchedule({
                id: row.id,
                startDateTime: row.startDateTime,
                endDateTime: row.endDateTime,
              })
            }
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            title="Delete schedule"
            onClick={() => handleDelete(row.id)}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography sx={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: 1 }}>
          <EventIcon sx={{ fontSize: '2rem' }} />
          Schedule Management
        </Typography>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            borderRadius: 1,
            px: 3,
            py: 1,
            textTransform: 'none',
            fontSize: '1rem',
            boxShadow: 3,
            '&:hover': { boxShadow: 5, transform: 'translateY(-2px)', transition: 'all 0.3s ease' },
          }}
        >
          Create Schedule
        </Button>
      </Box>

      {/* Modals */}
      <ScheduleModal open={isCreateModalOpen} setOpen={setIsCreateModalOpen} />
      <EditScheduleModal
        key={editSchedule?.id ?? 'none'}
        open={!!editSchedule}
        schedule={editSchedule}
        onClose={() => setEditSchedule(null)}
      />

      {/* Table */}
      <Paper elevation={2} sx={{ p: 2, borderRadius: 1 }}>
        <Box
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
        >
          <Typography variant="h6" color="text.secondary">
            All Schedules
          </Typography>
          <Chip label={`Total: ${allSchedules?.meta?.total ?? rows.length}`} color="primary" variant="outlined" />
        </Box>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>Loading schedules…</Typography>
          </Box>
        ) : (
          <Box sx={{ height: 500, width: '100%' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              paginationMode="server"
              rowCount={allSchedules?.meta?.total ?? 0}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              pageSizeOptions={[10, 20, 50]}
              disableRowSelectionOnClick
              sx={{
                border: 'none',
                '& .MuiDataGrid-columnHeaders': { backgroundColor: 'grey.100', borderRadius: 1 },
              }}
            />
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default SchedulesPage;
