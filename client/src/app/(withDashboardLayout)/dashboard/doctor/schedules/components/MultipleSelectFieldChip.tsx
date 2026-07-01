import * as React from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
   PaperProps: {
      style: {
         maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
         width: 250,
      },
   },
};

export function getTimeIn12HourFormat(dateTimeString: string): string {
   if (!dateTimeString) return '—';
   const date: Date = new Date(dateTimeString);
   if (isNaN(date.getTime())) return '—';
   const hours: number = date.getHours();
   const minutes: number = date.getMinutes();
   const ampm: string = hours >= 12 ? 'PM' : 'AM';
   const formattedHours: number = hours % 12 === 0 ? 12 : hours % 12;
   const formattedMinutes: string =
      minutes < 10 ? '0' + minutes : minutes.toString();
   return `${formattedHours}:${formattedMinutes} ${ampm}`;
}

function getScheduleTime(schedule: any): string {
   // backend uses startDateTime/endDateTime (admin schedules)
   const start = schedule?.startDateTime ?? schedule?.startDate ?? '';
   const end = schedule?.endDateTime ?? schedule?.endDate ?? '';
   return `${getTimeIn12HourFormat(start)} – ${getTimeIn12HourFormat(end)}`;
}

const names = [
   'Oliver Hansen',
   'Van Henry',
   'April Tucker',
   'Ralph Hubbard',
   'Omar Alexander',
   'Carlos Abbott',
   'Miriam Wagner',
   'Bradley Wilkerson',
   'Virginia Andrews',
   'Kelly Snyder',
];

function getStyles(name: string, personName: readonly string[], theme: Theme) {
   return {
      fontWeight:
         personName.indexOf(name) === -1
            ? theme.typography.fontWeightRegular
            : theme.typography.fontWeightMedium,
   };
}

export default function MultipleSelectFieldChip({
   schedules,
   selectedScheduleIds,
   setSelectedScheduleIds,
}: any) {
   const theme = useTheme();
   const safeSchedules: any[] = Array.isArray(schedules) ? schedules : [];

   const handleChange = (
      event: SelectChangeEvent<typeof selectedScheduleIds>
   ) => {
      const {
         target: { value },
      } = event;
      setSelectedScheduleIds(
         typeof value === 'string' ? value.split(',') : value
      );
   };

   return (
      <div>
         <FormControl sx={{ width: '100%' }}>
            <InputLabel id='schedule-chip-label'>Select Time Slots</InputLabel>
            <Select
               labelId='schedule-chip-label'
               id='schedule-chip-select'
               multiple
               value={selectedScheduleIds}
               onChange={handleChange}
               input={<OutlinedInput id='select-multiple-chip' label='Select Time Slots' />}
               renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                     {selected.map((value: any) => {
                        const s = safeSchedules.find((sc: any) => sc.id === value);
                        return <Chip key={value} label={s ? getScheduleTime(s) : value} size="small" />;
                     })}
                  </Box>
               )}
               MenuProps={MenuProps}
            >
               {safeSchedules.length === 0 ? (
                  <MenuItem disabled>No slots available for this date</MenuItem>
               ) : (
                  safeSchedules.map((schedule: any) => (
                     <MenuItem
                        key={schedule.id}
                        value={schedule.id}
                        style={getStyles(schedule.id, selectedScheduleIds, theme)}
                     >
                        {getScheduleTime(schedule)}
                     </MenuItem>
                  ))
               )}
            </Select>
         </FormControl>
      </div>
   );
}
