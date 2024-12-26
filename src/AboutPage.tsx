import { Typography, Fade, Card, CardContent, Box } from "@mui/material" 
import InstagramIcon from '@mui/icons-material/Instagram';
import EmailIcon from '@mui/icons-material/Email';
import GitHubIcon from '@mui/icons-material/GitHub';
import SearchAppBar from "./SearchAppBar"

function explanationCard(title: string, body: string) { 
    return (
        <>
        <Fade in={true} timeout={1200+(1200*0.80)}>
         <Card sx={{
                marginTop: 2,
                background: 'rgba(60, 65, 90, 0.75)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                height: 'fit-content'
            }}>
                <CardContent>
                        <Typography variant="h3" sx={{ color: 'white' }}>
                            {title}
                        </Typography>

                        <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                            {body}
                        </Typography>
                </CardContent>
            </Card>
            </Fade>
        </>
    )
}

function Credits() {
    return (
        <>
        <Fade in={true} timeout={1200+(1200*0.80)}>
         <Card sx={{
                flex: 1,
                maxWidth: { xs: 480, md: '50%' },
                marginTop: 2,
                background: 'rgba(60, 65, 90, 0.75)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
            }}>
                <Typography variant="h3" sx={{color: 'white', textAlign: 'center'}}>
                    Creator
                </Typography>
                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' }, 
                    gap: 2,
                    justifyContent: 'center',
                    alignItems: { xs: 'center', md: 'flex-start' },
                    mt: 2
                }}>
                    <img 
                        src="/profilepic.jpg"
                        alt="Creator profile picture"
                        style={{
                            width: '150px',
                            height: '150px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                        }}
                    />
                    <Box>
                        <Typography variant="h6" sx={{color: 'white', textAlign: { xs: 'center', md: 'left' }}}>
                            Osama Alhour
                        </Typography>
                        <Typography variant="body1" sx={{color: 'rgba(255, 255, 255, 0.7)', textAlign: { xs: 'center', md: 'left' }}}>
                            Hello :) I'm a first year Computer Science student mainly interested in Apple Security and iOS Development.
                        </Typography>

                        <br></br>

                        <Typography variant="body1" sx={{color: 'rgba(255, 255, 255, 0.7)', textAlign: { xs: 'center', md: 'left' }}}>
                            if you have any questions, feel free to contact me!
                        </Typography>

                        <Box sx={{
                            display: 'flex', 
                            justifyContent: { xs: 'center', md: 'flex-start' },  // Center on mobile, left on desktop
                            mt: 2,
                            gap: 2
                        }}>
                            <a href="https://www.instagram.com/__osama_alhour/" target="_blank" rel="noopener noreferrer">
                                <InstagramIcon sx={{color: 'white', fontSize: '40px'}}/>
                            </a>

                            <a href="https://github.com/NSAntoine" target="_blank" rel="noopener noreferrer">
                                <GitHubIcon sx={{color: 'white', fontSize: '40px'}}/>
                            </a>

                            <a href="mailto:osama.id78@gmail.com" target="_blank" rel="noopener noreferrer">
                                <EmailIcon sx={{color: 'white', fontSize: '40px'}}/>
                            </a>
                        </Box>
                    </Box>
                </Box>
            </Card>
        </Fade>
        </>
    )
}

export default function AboutPage() {
    return ( 
        <>
        <SearchAppBar/>

        <div style={{paddingTop: '140px', paddingLeft: '30px', paddingRight: '30px'}}>
            <Fade in={true} timeout={1200} style={{paddingBottom: '20px'}}>
                <Typography variant="h3">
                    About GJUFiles
                </Typography>
            </Fade>

            <div style={{
                display: 'flex',
                gap: '16px',
                flexWrap: 'wrap',
                paddingBottom: '20px'
            }}>
                {Credits()}
                <Box sx={{ display: 'grid', gap: 2, maxWidth: { xs: 480, md: '50%' } }}>
                    {explanationCard("What is this?", "GJUFiles is a student-driven website for GJU students to share resources for courses such as notes and past exams to help each other academically. Inspired by PSUTArchive")}
                    {explanationCard("Why?", "During midterm and final seasons, it was very apperant that resources are scattered very randomly throughout social media channels (WhatsApp, Discord, Telegram, etc.). This website is an attempt to create a proper, unified, center to share resources.")}
                </Box>
            </div>
        </div>
        </>
    )
}