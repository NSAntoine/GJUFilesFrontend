import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';
import Button from '@mui/material/Button';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { Menu, MenuItem, Stack } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

export default function SearchAppBar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const menuItems = [
    { 
      text: 'Courses', 
      icon: <AutoStoriesIcon sx={{ mr: 1 }} />,
      href: '/'
    },
    { 
      text: 'About', 
      icon: <InfoIcon sx={{ mr: 1 }} />,
      href: '/about'
    },
  ];

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar 
        position="fixed"
        sx={{
          background: 'rgba(45, 47, 57, 0.92)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          borderRadius: '12px',
          margin: {
            xs: '8px',
            sm: '16px'
          },
          width: 'auto',
          left: {
            xs: '8px',
            sm: '16px'
          },
          right: {
            xs: '8px',
            sm: '16px'
          },
          top: {
            xs: '8px',
            sm: '16px'
          }
        }}
      >
        <Toolbar sx={{ 
          padding: (theme) => theme.spacing(1.5),
          '& .MuiIconButton-root': {
            backgroundColor: 'rgba(255,255,255,0.03)',
            borderRadius: '12px',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.1)',
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            }
          }
        }}>
          {isMobile && (
            <>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="Open Drawer"
                onClick={handleMenuOpen}
                sx={{ mr: 2, ml: 0.5 }}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: {
                    bgcolor: 'rgba(23, 25, 35, 0.95)',
                    backdropFilter: 'blur(8px)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.05)',
                    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.15)',
                    mt: 1.5,
                  }
                }}
              >
                {menuItems.map((item) => (
                  <MenuItem 
                    key={item.text} 
                    onClick={handleMenuClose}
                    component="a"
                    href={item.href}
                    sx={{
                      color: 'white',
                      textDecoration: 'none',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.1)',
                      }
                    }}
                  >
                    {item.icon}
                    <Typography sx={{ ml: 1 }}>{item.text}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </>
          )}

          { !(isMobile && isExpanded) ? <Stack
            sx={{ 
              flexGrow: { xs: 1, sm: 0 },
              mr: { xs: 0, sm: 4 }
            }}
          >
            <a href="/" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ 
                  fontWeight: 500,
                  fontSize: 28,
                  background: 'linear-gradient(to right, #fff, rgba(255,255,255,0.8))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                GJU Files
              </Typography>
              <Typography
                variant="caption"
                sx={{ 
                  mt: -1,
                  fontSize: 13,
                  color: '#A8B3CF',
                  fontWeight: '400'
                }}
              >
                Programmed, Debugged, and Designed by Osama Alhour
              </Typography>
            </a>
          </Stack> : <></>}
          
          {!isMobile && (
            <Box sx={{ 
              flexGrow: 1,
              display: 'flex',
              // gap: 2,
              justifyContent: 'center',
              ml: -50  
            }}>
              {menuItems.map((item) => (
                <Button
                  key={item.text}
                  color="inherit"
                  startIcon={item.icon}
                  component="a"
                  href={item.href}
                  sx={{
                    borderRadius: '12px',
                    padding: '8px 16px',
                    textDecoration: 'none',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    }
                  }}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          )}
          
      
        </Toolbar>
      </AppBar>
    </Box>
  );
}