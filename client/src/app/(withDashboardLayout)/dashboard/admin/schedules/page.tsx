'use client';
import { Box, Button, IconButton, Paper, Typography, Chip, Alert, CircularProgress } from '@mui/material';
import ScheduleModal from './components/ScheduleModal';
import { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EventIcon from '@mui/icons-material/Event';
import { useGetAllSchedulesQuery } from '@/redux/api/scheduleApi';
import dayjs from 'dayjs';
import { ISchedule } from '@/types/schedule';
import { dateFormatter } from '@/utils/dateFormatter';

const SchedulesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [allSchedule, setAllSchedule] = useState<any>([]);
  const { data:allSchedules, isLoading, error } = useGetAllSchedulesQuery({});




  
 
  const schedules = allSchedules?.schedules?.data
  const meta = allSchedules?.schedules?.meta


  console.log(meta)


  useEffect(() => {
    if(schedules && schedules.length > 0){
      const updateData = schedules?.map((schedule: ISchedule, index: number) => {
         console.log(schedule)
      return {
        sl: index + 1,
        id: schedule?.id,
        startDate: dateFormatter(schedule.startDateTime),
        endDate: dateFormatter(schedule.endDateTime),
        startTime: dayjs(schedule?.startDateTime).format('hh:mm a'),
        endTime: dayjs(schedule?.endDateTime).format('hh:mm a'),
      };
    });
    setAllSchedule(updateData);
    }else {
      setAllSchedule([])
    }
  }, [schedules]);

  const columns: GridColDef[] = [
    { 
      field: 'sl', 
      headerName: 'SL',
      width: 70,
      headerAlign: 'center',
      align: 'center'
    },
    { 
      field: 'startDate', 
      headerName: 'Date', 
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <EventIcon sx={{ mr: 1, color: 'primary.main' }} />
          {params.value}
        </Box>
      )
    },
    { 
      field: 'startTime', 
      headerName: 'Start Time', 
      flex: 1,
      headerAlign: 'center',
      align: 'center'
    },
    { 
      field: 'endTime', 
      headerName: 'End Time', 
      flex: 1,
      headerAlign: 'center',
      align: 'center'
    },
    {
      field: 'action',
      headerName: 'Action',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }) => {
        return (
          <IconButton 
            aria-label='delete'
            onClick={() => handleDeleteSchedule(row.id)}
            sx={{ 
              '&:hover': { 
                backgroundColor: 'error.light',
                color: 'white'
              } 
            }}
          >
            <DeleteIcon />
          </IconButton>
        );
      },
    },
  ];

  const handleDeleteSchedule = (id: string) => {
    // Implement your delete functionality here
    console.log('Delete schedule with id:', id);
    // You would typically dispatch a delete action here
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box  sx={{ display: 'flex',justifyContent: 'space-between', alignItems: 'center', mb: 3  }}>
        <Typography sx={{ 
         fontSize: '18px'
        }}>
          <EventIcon sx={{ mr: 2, fontSize: '2rem' }} />
          Schedule Management
        </Typography>
        <Button 
          onClick={() => setIsModalOpen(true)}
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1,
            textTransform: 'none',
            fontSize: '1rem',
            boxShadow: 3,
            '&:hover': {
              boxShadow: 5,
              transform: 'translateY(-2px)',
              transition: 'all 0.3s ease'
            }
          }}
        >
          Create Schedule
        </Button>
      </Box>

      <ScheduleModal open={isModalOpen} setOpen={setIsModalOpen} />

      <Paper 
        elevation={2} 
        sx={{ 
          p: 2, 
          borderRadius: 2,
          backgroundColor: 'background.paper'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" color="text.secondary">
            All Schedules
          </Typography>
          <Chip 
            label={`Total: ${allSchedule.length}`} 
            color="primary" 
            variant="outlined" 
          />
        </Box>

        {/* {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Error loading schedules. Please try again.
          </Alert>
        )} */}

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
            <CircularProgress />
            <Typography variant="body1" sx={{ ml: 2 }}>
              Loading schedules...
            </Typography>
          </Box>
        ) : (
          <Box sx={{ height: 500, width: '100%' }}>
            <DataGrid 
              rows={allSchedule} 
              columns={columns}
              pageSizeOptions={[5, 10, 25]}
              disableRowSelectionOnClick
              sx={{
                border: 'none',
                '& .MuiDataGrid-cell:hover': {
                  backgroundColor: 'primary.light',
                  color: 'white'
                },
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: 'grey.100',
                  borderRadius: 1
                }
              }}
            />
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default SchedulesPage;