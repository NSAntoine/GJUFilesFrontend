import { ResourceInfoAPIResponse } from "./Models";
import { Card, CardContent, Typography, Box, Chip, IconButton, Dialog, DialogContent, DialogTitle, List, ListItem, ListItemText, SwipeableDrawer, Grow, ListItemIcon, Button, CircularProgress } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import DownloadIcon from '@mui/icons-material/Download';
import PdfIcon from '@mui/icons-material/PictureAsPdf';
import FileIcon from '@mui/icons-material/FilePresent';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { FileResourceInfo } from "./Models";
import JSZip from 'jszip';
import { ImageIcon } from "lucide-react";

interface ResourceCardProps {
    resource: ResourceInfoAPIResponse;
    onSheetStateChange?: (open: boolean) => void;
}

function fileIcon(fileName: string) { 
    let extension = fileName.split('.').pop();
    if (extension === 'pdf') {
        return <PdfIcon />;
    }

    if (extension === 'jpg' || extension === 'jpeg' || extension === 'png' || extension === 'gif' || extension === 'webp') {
        return <ImageIcon />;
    }

    return <FileIcon />;
}

async function downloadAllFilesAsZip(files: FileResourceInfo[], resource: ResourceInfoAPIResponse, setIsLoading: (isLoading: boolean) => void) {
    setIsLoading(true);
    const zip = new JSZip();
    let folder = zip.folder(resource.resource_info.title + ' - ' + resource.resource_info.semester + ' ' + resource.resource_info.academic_year)!;
    for (const file of files) {
        let data = await fetch(file.file_url);
        folder.file(file.file_name, data.blob());
    }

    console.log(folder);

    zip.generateAsync({ type: 'blob' }).then(content => {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(content);
        link.download = `${resource.resource_info.title}.zip`;
        link.click();
    });
    setIsLoading(false);
}

const downloadFile = async (url: string, fileName: string) => {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        
        const link = document.createElement('a');
        const blobUrl = window.URL.createObjectURL(blob);
        
        link.href = blobUrl;
        link.download = fileName;
        
        document.body.appendChild(link);
        link.click();
        
        // Clean up
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
        console.error('Download failed:', error);
    }
};

const StyledCard = styled(Card)(({ theme }) => ({
    position: 'relative',
    background: 'rgba(255, 255, 255, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    borderRadius: '16px',
    backdropFilter: 'blur(10px)',
    cursor: 'pointer',

    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 48px rgba(0, 0, 0, 0.2)',
        background: 'rgba(255, 255, 255, 0.15)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
    }
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    marginBottom: '8px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(5px)',
    transition: 'all 0.2s ease-in-out',
    padding: '4px 16px',

    '&:hover': {
        background: 'rgba(255, 255, 255, 0.15)',
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        cursor: 'pointer'
    }
}));

export default function ResourceCard({ resource, onSheetStateChange }: ResourceCardProps) {
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [isZipLoading, setIsZipLoading] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleSheetState = (open: boolean) => {
        setIsSheetOpen(open);
        onSheetStateChange?.(open);
    };

    const sheetContent = (
        <>
            <DialogTitle sx={{ 
                color: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                gap: 1
            }}>
                <Typography 
                    variant="h6" 
                    component="div"
                    sx={{
                        fontSize: '1.5rem',
                        fontWeight: 600,
                        lineHeight: 1.3
                    }}
                >
                    {resource.resource_info.title}
                </Typography>
                <Chip
                    label={`${resource.resource_info.semester} ${resource.resource_info.academic_year}`}
                    sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontWeight: 500,
                        fontSize: '0.85rem',
                        height: '28px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.02em',
                        alignSelf: 'flex-start',
                        '& .MuiChip-label': {
                            padding: '0 12px'
                        }
                    }}
                />

                <Typography variant="subtitle1" sx={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1rem', lineHeight: 1.5 }}>
                    {resource.resource_info.subtitle}
                </Typography>
            </DialogTitle>
            <DialogContent>
                <List sx={{ px: 1 }}>
                    {resource.files.map((file, index) => (
                        <StyledListItem onClick={(e) => {
                            e.stopPropagation();
                            window.open(file.file_url, '_blank');
                        }} key={index}>
                            <ListItemIcon sx={{
                                minWidth: '40px',
                                '& svg': {
                                    backgroundColor: 'rgba(25, 25, 25, 0.95)',
                                    color: 'rgba(255, 255, 255, 0.9)',
                                    padding: '4px',
                                    borderRadius: '4px',
                                    fontSize: '1.9rem'
                                }
                            }}>
                                {fileIcon(file.file_name)}
                            </ListItemIcon>
                            <ListItemText 
                                primary={file.file_name}
                                sx={{ 
                                    py: 0.5,
                                    mr: 2,
                                    '& .MuiListItemText-primary': { 
                                        color: 'rgba(255, 255, 255, 0.9)',
                                        fontWeight: 500,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    } 
                                }}
                            />
                            <IconButton 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(file.file_url, '_blank');
                                }}
                                sx={{ mr: 1 }}
                            >
                                <OpenInNewIcon sx={{ color: 'rgba(255, 255, 255, 0.9)' }} />
                            </IconButton>
                            <IconButton onClick={(e) => {
                                e.stopPropagation();
                                downloadFile(file.file_url, file.file_name);
                            }}>
                                <DownloadIcon sx={{ color: 'rgba(255, 255, 255, 0.9)' }} /> 
                            </IconButton>
                        </StyledListItem>
                    ))}
                </List>

                <Button
                    fullWidth
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    onClick={(e) => {
                        e.stopPropagation();
                        downloadAllFilesAsZip(resource.files, resource, setIsZipLoading);
                    }}
                    sx={{
                        mt: 2,
                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
                        color: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(5px)',
                        '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.25)',
                        }
                    }}
                    disabled={isZipLoading}
                >
                    {isZipLoading ? <CircularProgress size={20} sx={{ color: 'rgba(255, 255, 255, 0.9)' }} /> : 'Download All as ZIP'}
                </Button>
                
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
                            background: 'linear-gradient(to bottom, #1a1b26 0%, #1f2937 100%)',
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
                            background: 'linear-gradient(to bottom, #1a1b26 0%, #1f2937 100%)',
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