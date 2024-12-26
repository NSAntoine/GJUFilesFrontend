import { Card, Typography, Stack, Chip } from '@mui/material';
import { Course, getFacultyShortName } from './Models';

export default function CourseCard({ course }: { course: Course }) {
  return (
    <a 
      key={course.course_id} 
      href={`/course/${course.course_id}`}
      style={{ textDecoration: 'none' }}
    >
      <Card sx={{
        background: 'rgba(60, 65, 90, 0.75)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.2)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        transition: 'all 0.2s ease-in-out',
        height: '130px',
        '&:hover': {
          transform: 'translateY(-5px)',
          background: 'rgba(70, 75, 100, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
        }
      }}>
        <Typography variant="h5" component="div" sx={{ 
          color: 'white',
          marginBottom: {
            xs: '4px',
            sm: '10px'
          },
          fontWeight: '500',
          fontSize: {
            xs: '1.25rem',
            sm: '1.25rem'
          },
          lineHeight: {
            xs: 1.2,
            sm: 1.5
          }
        }}>
          {course.course_name}
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="body1" sx={{ 
            color: 'rgba(255, 255, 255, 0.7)'
          }}>
            {course.course_id}
          </Typography>
          <Chip 
            label={`${getFacultyShortName(course.course_faculty)}`}
            sx={{
              background: 'rgba(255, 255, 255, 0.15)',
              color: 'white',
              '&:hover': { background: 'rgba(255, 255, 255, 0.25)' }
            }}
          />
        </Stack>
      </Card>
    </a>
  );
}
