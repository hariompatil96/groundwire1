'use client';

import React from 'react';
import DashboardDataBase from './shared-components/DashboardDataBase';
import DashboardSheet from './shared-components/DashboardSheet';
import { Box, Tab, Tabs } from '@mui/material';
import LightDarkModeToggle from '@/components/LightDarkModeToggle';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function Dashboard() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div>
      <Box sx={{ width: '100%', p: 3 }}>
        
        <DashboardDataBase />
      </Box>
    </div>
  );
}

export default Dashboard;


