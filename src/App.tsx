import { useState, useEffect } from 'react'
import { API_COURSES_URL } from './APIDefines';
import './App.css'

import CourseCard from './CourseCard';
import { Course, CourseAPIResponse, facultyCompleteNameMap, getFacultyShortName } from './Models';
import { Pagination, Fade, Select, MenuItem, FormControl, InputLabel, Divider } from '@mui/material';
import SearchAppBar from './SearchAppBar';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import Box from '@mui/material/Box';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: '20px',
  backgroundColor: 'rgba(255, 255, 255, 0.15)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    border: '1px solid rgba(255, 255, 255, 0.4)',
  },
  width: '100%',
  maxWidth: '800px',
  margin: '0',
  display: 'flex',
  alignItems: 'center',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: alpha(theme.palette.common.white, 0.7),
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    fontSize: '0.95rem',
    width: '100%',
    '&::placeholder': {
      color: alpha(theme.palette.common.white, 0.7),
      opacity: 0.7,
    },
    '&:focus': {
      '&::placeholder': {
        opacity: 0.9,
      },
    },
  },
}));

function numberOfPages(total_courses: number): number {
  return Math.ceil(total_courses / 12);
}

function makeAPIURL(page: number, search: string, faculty: number): string {
  var base = `${API_COURSES_URL}?page=${page}&search=${search}`;
  if (faculty != -1) {
    base += `&faculty=${faculty}`;
  }
  return base;
}

function App() {
  const [courseResponse, setCourseResponse] = useState<CourseAPIResponse | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentFaculty, setCurrentFaculty] = useState(-1);

  const handleFacultyClick = (facultyId: number) => {
    setCurrentPage(1);
    setCurrentFaculty(facultyId);
    fetchCourses(1, searchQuery, facultyId);
  };

  const facultyFilters = (
    <Box sx={{ 
      maxWidth: {
        xs: '350px',
        sm: '800px'
      },
      margin: '0 auto 16px',
      padding: {
        xs: '0 16px',
        sm: '0 30px'
      }
    }}>
      <FormControl 
        fullWidth 
        size="small"
        sx={{
          '& .MuiOutlinedInput-root': {
            color: 'white',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.23)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.4)',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'primary.main',
            },
          },
          '& .MuiSelect-icon': {
            color: 'rgba(255, 255, 255, 0.7)',
          },
          '& .MuiInputLabel-root': {
            color: 'rgba(255, 255, 255, 0.7)',
            '&.Mui-focused': {
              color: 'primary.main',
            },
          },
        }}
      >
        <InputLabel id="faculty-select-label">Faculty</InputLabel>
        <Select
          labelId="faculty-select-label"
          value={currentFaculty}
          label="Faculty"
          onChange={(e) => handleFacultyClick(e.target.value as number)}
          MenuProps={{
            PaperProps: {
              sx: {
                bgcolor: 'rgba(45, 45, 45, 0.96)',
                backdropFilter: 'blur(8px)',
                '& .MuiMenuItem-root': {
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                  '&.Mui-selected': {
                    bgcolor: 'rgba(255, 255, 255, 0.15)',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                    }
                  }
                }
              }
            }
          }}
        >
          <MenuItem value={-1}>All Faculties</MenuItem>
          {Object.entries(facultyCompleteNameMap).map(([id, name]) => (
            <MenuItem key={id} value={id} sx={{
              whiteSpace: 'wrap',
              textOverflow: 'ellipsis',
            }}>
              {`${name} (${ getFacultyShortName(parseInt(id)) })`}
            </MenuItem>
          ))
          }
        </Select>
      </FormControl>
    </Box>
  );

  const fetchCourses = async (page: number, search: string, faculty?: number) => {
    setIsLoading(true);
    try {
      const activeFaculty = faculty !== undefined ? faculty : currentFaculty;
      const response = await fetch(makeAPIURL(page, search, activeFaculty));
      const data = await response.json();
      setCourseResponse(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
      fetchCourses(currentPage, searchQuery);
  }, [searchQuery, currentPage]);

  return (
    <>
      <title>GJUFiles Home</title>
      <SearchAppBar></SearchAppBar>

      <div style={{ 
        paddingTop: '140px',
        paddingBottom: '30px',
        paddingLeft: '30px',
        paddingRight: '30px',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search courses..."
            inputProps={{ 'aria-label': 'search courses' }}
            value={searchQuery}
            onChange={(e) => {
              setCurrentPage(1)
              setSearchQuery(e.target.value)
            }}
          />
        </Search>
      </div>

      {facultyFilters}

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',             // 1 column on mobile
            md: 'repeat(3, 1fr)'   // 3 columns on desktop
          },
          gap: '20px',
          px: '30px' 
        }}
      >
        {courseResponse && courseResponse.courses.map((course: Course) => (
          <Fade in={!isLoading} timeout={200} key={course.course_id}>
            <div>
              <CourseCard 
                course={course} 
              />
            </div>
          </Fade>
        ))}
      </Box>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        padding: '40px 0'
      }}>
        {courseResponse && (
          <Pagination 
            count={numberOfPages(courseResponse.total_courses)}
            page={currentPage}
            onChange={(event, page) => setCurrentPage(page)}
            color="primary"
            sx={{
              '& .MuiPaginationItem-root': {
                color: 'white',
                borderColor: 'rgba(255, 255, 255, 0.3)',
              }
            }}
          />
        )}
      </div>
    </>
  )
}

export default App