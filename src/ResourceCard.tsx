import { ResourceInfoAPIResponse } from "./Models";
import { Card, CardContent, Typography, Box, Chip, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";

interface ResourceCardProps {
    resource: ResourceInfoAPIResponse;
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

export default function ResourceCard({ resource }: ResourceCardProps) {
    return (
        <StyledCard>
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

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
    );
}