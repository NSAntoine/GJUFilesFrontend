import { ResourceInfoAPIResponse } from "./Models";
import { Card, CardContent, Typography, Box, Chip, IconButton, Dialog, DialogContent, DialogTitle, List, ListItem, ListItemText, SwipeableDrawer, Grow, ListItemIcon } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import DownloadIcon from '@mui/icons-material/Download';
import PdfIcon from '@mui/icons-material/PictureAsPdf';
import FileIcon from '@mui/icons-material/FilePresent';

interface ResourceCardProps {
    resource: ResourceInfoAPIResponse;
    onSheetStateChange?: (open: boolean) => void;
}

function fileIcon(fileName: string) { 
    let extension = fileName.split('.').pop();
    if (extension === 'pdf') {
        return <PdfIcon />;
    }
    return <FileIcon />;
}

const StyledCard = styled(Card)(({ theme }) => ({
    position: 'relative',
    background: 'rgba(255, 255, 255, 0.15)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    borderRadius: '16px',
    backdropFilter: 'blur(10px)',
    cursor: 'pointer',

    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 48px rgba(0, 0, 0, 0.2)',
        background: 'rgba(255, 255, 255, 0.25)',
        border: '1px solid rgba(255, 255, 255, 0.4)',
    }
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    marginBottom: '8px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(5px)',
    transition: 'all 0.2s ease-in-out',

    '&:hover': {
        background: 'rgba(255, 255, 255, 0.15)',
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        cursor: 'pointer'
    }
}));

export default function ResourceCard({ resource, onSheetStateChange }: ResourceCardProps) {
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleSheetState = (open: boolean) => {
        setIsSheetOpen(open);
        onSheetStateChange?.(open);
    };

    const sheetContent = (
        <>
            <DialogTitle sx={{ color: '#ffffff' }}>
                {resource.resource_info.title}
            </DialogTitle>
            <DialogContent>
                <List sx={{ px: 1 }}>
                    {resource.files.map((file, index) => (
                        <StyledListItem key={index}>
                            <ListItemIcon sx={{}} color="white">
                                {fileIcon(file.file_name)}
                            </ListItemIcon>
                            <ListItemText 
                                primary={file.file_name}
                                sx={{ 
                                    py: 1,
                                    '& .MuiListItemText-primary': { 
                                        color: 'rgba(255, 255, 255, 0.9)',
                                        fontWeight: 500
                                    } 
                                }}
                            />
                            <IconButton href={file.file_url} target="_blank">
                                <DownloadIcon sx={{ color: 'rgba(255, 255, 255, 0.9)' }} /> 
                            </IconButton>
                        </StyledListItem>
                    ))}
                </List>
            </DialogContent>
        </>
    );

    return (
        <>
            <StyledCard onClick={() => handleSheetState(true)}>
                <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Typography 
                                variant="h5" 
                                sx={{ 
                                    color: '#ffffff',
                                    fontWeight: 600,
                                    fontSize: '1.5rem',
                                    lineHeight: 1.3,
                                    mb: 0.5
                                }}
                            >
                                {resource.resource_info.title}
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip
                                label={`${resource.resource_info.semester} ${resource.resource_info.academic_year}`}
                                sx={{
                                    backgroundColor: 'rgba(0, 198, 255, 0.15)',
                                    color: 'rgba(255, 255, 255, 0.9)',
                                    fontWeight: 500,
                                    fontSize: '1.25rem',
                                    height: '32px',
                                    '& .MuiChip-label': {
                                        padding: '0 16px'
                                    }
                                }}
                            />
                            <Chip
                                label={`${resource.files.length} files`}
                                sx={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                    color: 'rgba(255, 255, 255, 0.9)',
                                    fontWeight: 500,
                                    fontSize: '1rem',
                                    height: '32px',
                                    '& .MuiChip-label': {
                                        padding: '0 12px'
                                    }
                                }}
                            />
                        </Box>

                        <Typography 
                            variant="subtitle1"
                            sx={{
                                color: 'rgba(255, 255, 255, 0.9)',
                                fontSize: '1rem',
                                lineHeight: 1.5
                            }}
                        >
                            {resource.resource_info.subtitle}
                        </Typography>
                    </Box>
                </CardContent>
            </StyledCard>

            {isMobile ? (
                <SwipeableDrawer
                    anchor="bottom"
                    open={isSheetOpen}
                    onClose={() => handleSheetState(false)}
                    onOpen={() => handleSheetState(true)}
                    disableSwipeToOpen
                    PaperProps={{
                        sx: {
                            background: 'rgba(25, 25, 25, 0.95)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: '16px 16px 0 0',
                            maxHeight: '90vh',
                            overflow: 'visible',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: '8px',
                                left: '50%',
                                width: '32px',
                                height: '4px',
                                background: 'rgba(255, 255, 255, 0.3)',
                                borderRadius: '2px',
                                transform: 'translateX(-50%)',
                            }
                        }
                    }}
                >
                    {sheetContent}
                </SwipeableDrawer>
            ) : (
                <Dialog
                    open={isSheetOpen}
                    onClose={() => handleSheetState(false)}
                    fullWidth
                    maxWidth="sm"
                    TransitionComponent={Grow}
                    TransitionProps={{
                        timeout: {
                            enter: 400,
                            exit: 300,
                        }
                    }}
                    PaperProps={{
                        sx: {
                            background: 'rgba(25, 25, 25, 0.95)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: '16px',
                            transform: 'none',
                            transition: `
                                transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1),
                                opacity 300ms cubic-bezier(0.4, 0, 0.2, 1)
                            `
                        }
                    }}
                >
                    {sheetContent}
                </Dialog>
            )}
        </>
    );
}