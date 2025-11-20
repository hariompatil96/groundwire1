import React, { useMemo, useRef, useState } from 'react';
import { Box, Button, ClickAwayListener, Popper, useTheme, useMediaQuery } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { DateRangePicker } from 'react-date-range';


const formatDisplayDate = (date) => {
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
};

const DateFilter = ({ onFilterChange, currentFilter }) => {
  const [dateRange, setDateRange] = useState([{
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  }]);
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));

  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleInputClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen((prev) => !prev);
  };

  const selectedFilter = currentFilter || 'currentMonth';

  const filters = [
    { id: 'yearToDate', label: 'Year to Date' },
    { id: 'currentMonth', label: 'Current Month' },
  ];


  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US').format(date);
  };

  const handleRangeChange = (ranges) => {
    const selection = ranges.selection;
  
    setDateRange([selection]);
  
    if (selection.startDate && selection.endDate && selection.startDate !== selection.endDate) {
      setOpen(false);
    }
  
    onFilterChange({
      type: 'custom',
      startDate: formatDate(selection.startDate),
      endDate: formatDate(selection.endDate),
    });
  };


  const handlePredefinedFilter = (filterId) => {
    const today = new Date();
    let startDate;
  
    if (filterId === 'yearToDate') {
      startDate = new Date(today.getFullYear(), 0, 1);
    } else if (filterId === 'currentMonth') {
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    }
  
    onFilterChange({
      type: filterId,
      startDate: formatDate(startDate),
      endDate: formatDate(today),
    });
  };

  const getButtonLabel = () => {
    if (selectedFilter === 'custom') {
      const start = formatDisplayDate(dateRange[0].startDate);
      const end = formatDisplayDate(dateRange[0].endDate);
      return `${start} - ${end}`;
    }

    return 'Date Range';
  };


  return (
    <Box className="flex items-center flex-wrap justify-center gap-6 mb-6">
      {filters.map((filter) => (
        <Button
          key={filter.id}
          onClick={() => handlePredefinedFilter(filter.id)}
          variant="contained"
          className={`px-6 py-4 rounded-md transition-all ${selectedFilter === filter.id
            ? 'bg-[#018594] text-white hover:bg-[#018594]'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-300'
            }`}
        >
          {filter.label}
        </Button>
      ))}

      <Button
        variant="contained"
        onClick={handleInputClick}
        className={`px-6 py-4 rounded-md transition-all flex items-center gap-2 ${
          selectedFilter === 'custom'
            ? 'bg-[#018594] text-white hover:bg-[#018594]'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-300'
        }`}
      >
        <span>{getButtonLabel() || 'Date Range'}</span>
        <CalendarMonthIcon className="w-8 h-8" />
      </Button>

      <Popper open={open} anchorEl={anchorEl} placement="bottom-start">
        <ClickAwayListener onClickAway={() => setOpen(false)}>
          <div>
            <DateRangePicker
              onChange={handleRangeChange}
              months={isLargeScreen ? 2 : 1}
              ranges={dateRange}
              direction={isLargeScreen ? 'horizontal' : 'vertical'}
              moveRangeOnFirstSelection={false}
              rangeColors={['#018594']}
              calendarFocus="backwards"
            />
          </div>
        </ClickAwayListener>
      </Popper>
    </Box>
  );
};

export default DateFilter;