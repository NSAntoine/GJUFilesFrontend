import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { API_COURSE_DETAILS_URL, API_INSERT_COURSE_LINK_URL, API_INSERT_COURSE_URL } from './APIDefines'
import SearchAppBar from './SearchAppBar'
import { CourseDetailsAPIResponse, InsertCourseLinkAPIRequest } from './Models'
import { Typography, Chip, CircularProgress, Divider, Button, Dialog, DialogContent, DialogTitle, useMediaQuery, useTheme, IconButton, Select, MenuItem, TextField, FormControl, FormLabel, FormHelperText, Box, Fade, Menu } from '@mui/material'
import { getFacultyShortName } from './Models'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import CloseIcon from '@mui/icons-material/Close';
import { InsertCourseAPIRequest } from './Models'
import ResourceCard from './ResourceCard'
import { LinkIcon } from 'lucide-react'
import { UploadButton } from './UploadSheet'

export function errorPage(error: string) {
  if (error == "Load failed") {
    return <div style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold', color: 'rgba(255, 255, 255, 0.7)' }}>Failed to load Course details (Load Failed)</div>
  }
  return <div>Error: {error}</div>
}

function CourseDetailsView(courseDetails: CourseDetailsAPIResponse, selectedTab: number, setSelectedTab: (tab: number) => void) {
  function tabView(tab: number, emoji: string, text: string) {
    return <div 
      style={{
        background: selectedTab === tab ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.08)',
        borderRadius: '8px',
        padding: '12px 24px',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        border: selectedTab === tab ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
        width: '50%',
      }}
      onClick={() => { setSelectedTab(tab) }}
    >
      <Typography variant="h4" sx={{ color: 'white', textAlign: 'center' }}>
        {emoji}
      </Typography>

      <Typography variant="subtitle1" sx={{ color: 'white', textAlign: 'center' }}>
          {text}
        </Typography>
      </div>
    }

    function chipView(label: String) { 
      return <Chip 
        label={label}
        sx={{ 
          color: 'white',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        padding: '20px 10px',
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.25)',
        },
        transition: 'all 0.2s ease-in-out'
      }} 
    />
    }

    return (
      <>
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '16px',
          padding: '32px 32px 20px 32px',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(5px)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <Typography 
            variant="h3" 
            sx={{ 
              color: 'white',
              marginBottom: '20px',
              fontWeight: '500',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
              fontSize: {
                xs: '1.75rem',    
                sm: '2.5rem',     
                md: '3rem'        
              }
            }}
          >
            {courseDetails.metadata.course_name}
          </Typography>
          
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {chipView(courseDetails.metadata.course_id)}
            {chipView(getFacultyShortName(courseDetails.metadata.course_faculty))}
          </div>

          <div style={{ 
            marginTop: '15px', 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '10px',
            maxWidth: '600px'  // This ensures we don't get more than 2 columns
          }}>
            {courseDetails.links.map((link) => (
              <Box 
                sx={{ 
                  color: 'white', 
                  background: 'rgba(147, 112, 219, 0.1)',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  transition: 'background-color 0.2s ease-in-out',
                  width: '100%'
                }}
              >
                <a 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    fontSize: '1.1rem',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%'
                  }}
                > 
                  <span>{link.title}</span>
                  <LinkIcon size={18} />
                </a>
              </Box>
            ))}
          </div>
        </div>

        <div style={{ 
          display: 'flex', 
          gap: '16px',
          // justifyContent: 'center',
          // flexDirection: 'row',
          marginTop: '20px',
          width: '100%'
        }}>
          {tabView(0, "📝", "Notes (0)")}
          {tabView(1, "📚", "Exams (0)")}
        </div>

        <div style={{ marginTop: '20px', width: '100%' }}>
          <UploadButton selectedTab={selectedTab} courseId={courseDetails.metadata.course_id}/>
        </div>

        <Fade 
          key={selectedTab} 
          in={true} 
          timeout={300}
          unmountOnExit
        >
          <Box sx={{ 
            display: 'grid', 
            gap: '16px',
            gridTemplateColumns: {
              xs: '1fr',
              lg: 'repeat(3, 1fr)',
              md: 'repeat(2, 1fr)',
            },
            width: '100%',
            padding: '24px 0 24px 0',
            margin: 0,
            maxWidth: '100%',
            position: 'relative',
            left: 0,
            right: 0,
            boxSizing: 'border-box'
          }}>
            {courseDetails.resources.length > 0 ? (
              courseDetails.resources.map((resource) => (
                <ResourceCard key={resource.resource_info.resource_id} resource={resource} />
              ))
            ) : (
              <Box sx={{ 
                gridColumn: '1 / -1',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '200px',
              }}>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.7)',
                    textAlign: 'center',
                    fontWeight: 'bold',
                  }}
                >
                  No {selectedTab === 0 ? 'Notes' : 'Exams'} Available
                </Typography>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.5)',
                    textAlign: 'center',
                    mt: 0.60
                  }}
                >
                  You can upload one by clicking the <span style={{ color: '#9370DB' }}>Upload</span> button
                </Typography>
              </Box>
            )}
          </Box>
        </Fade>
      </>
    )
  }

export default function CoursePage() {
  const { courseId } = useParams()
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [displayedTab, setDisplayedTab] = useState(0);
  
  // Add cache state for both tabs
  const [cachedDetails, setCachedDetails] = useState<{
    [key: number]: CourseDetailsAPIResponse | null
  }>({
    0: null, // Notes
    1: null  // Exams
  });

  useEffect(() => {
    if (cachedDetails[selectedTab]) {
      setDisplayedTab(selectedTab);
      return;
    }

    fetch(`${API_COURSE_DETAILS_URL}${courseId}?resource_type=${selectedTab}`)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setCachedDetails(prev => ({
          ...prev,
          [selectedTab]: data
        }));
        setDisplayedTab(selectedTab);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching course details:', error);
        setError(error.message);
        setLoading(false);
      });
  }, [selectedTab, courseId]);

  return (
    <>
      <SearchAppBar />
      <div style={{ paddingTop: '140px', paddingLeft: '30px', paddingRight: '30px' }}>
        {error ? (
          errorPage(error)
        ) : cachedDetails[displayedTab] ? (
          CourseDetailsView(cachedDetails[displayedTab]!, selectedTab, setSelectedTab)
        ) : (
          <CircularProgress size={50} style={{ margin: 'auto', display: 'block' }} />
        )}
      </div>
    </>
  )
} 