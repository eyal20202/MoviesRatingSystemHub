// components/Header.tsx
import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
interface HeaderProps {
  connectionStatus: boolean;
  lastDataTime: string;
}

const Header: React.FC<HeaderProps> = ({ connectionStatus, lastDataTime }) => {
    return (
        <AppBar position="static" sx={{ backgroundColor: 'rgba(173, 216, 230, 0.6)' }}>
          <Toolbar>
            <Box flexGrow={1}>
              <Typography variant="h6" sx={{ color: 'black' }}>
                Connection Status: 
                <span style={{ color: connectionStatus ? 'green' : 'red' }}>
                  {connectionStatus ? ' Connected' : ' Disconnected'}
                </span>
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ color: 'black' }}>
              Last Received Data Time: {lastDataTime}
            </Typography>
          </Toolbar>
        </AppBar>
      );
};

export default Header;