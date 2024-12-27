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

const formSchema = z.object({
    title: z.string().min(2, {
      message: "Title must be at least 2 characters.",
    }),
    description: z.string().optional(),
    linkURL: z.string()
      .optional()
      .superRefine((val, ctx) => {
        // if (ctx.parent.resourceType === 2 && (!val || val.trim() === '')) {
        //   ctx.addIssue({
        //     code: z.ZodIssueCode.custom,
        //     message: "Link URL is required for link resources"
        //   });
        // }
      }),
    resourceType: z.number({
      required_error: "Please select a resource type first.",
    }),
    year: z.number({
      required_error: "Please select a year.",
      invalid_type_error: "Year must be a number.",
    }).int({
      message: "Year must be a whole number.",
    }).min(2000, {
      message: "Year must be 2000 or later.",
    }).max(new Date().getFullYear() + 1, {
      message: "Year cannot be in the future.",
    }),
    semester: z.string({
      required_error: "Please select a semester.",
    }).min(1, {
      message: "Please select a semester.",
    }),
  })


function formatBytes(bytes: number, decimals: number) {
    if(bytes == 0) return '0 Bytes';
    var k = 1000,
    dm = decimals || 2,
    sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function resourceTypeSubtitle(resourceType: number) {
    const style = { color: 'white' };
    
    switch (resourceType) {
      case 0:
        return <span style={style}>i.e., Slides, Student Notes, etc.</span>;
      case 1:
        return <span style={style}>i.e., Final, Midterm, Quiz 1/2... etc.</span>;
      case 2:
        return <span style={style}>i.e., Dr's Recorded Lectures (YouTube, etc.).</span>;
      default:
        return <span style={style}>Please select a resource type first.</span>;
    }
  }
  
  export function UploadButton({ selectedTab, courseId }: { selectedTab: number, courseId: string }) {
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [selectedResourceType, setSelectedResourceType] = useState<number>(-1);
    const [isLoading, setIsLoading] = useState(false);
  
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        title: "",
        description: "",
        linkURL: "",
        resourceType: -1,
        year: new Date().getFullYear(),
        semester: "",
      },
    })
  
    const handleUploadClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setMenuAnchorEl(event.currentTarget);
    };
  
    const handleMenuClose = () => {
      setMenuAnchorEl(null);
    };
  
    const handleResourceTypeSelect = (type: number) => {
      setSelectedResourceType(type);
      form.setValue("resourceType", type);
      handleMenuClose();
      setIsUploadOpen(true);
    };
  
    useEffect(() => {
      form.reset({
        title: "",
        description: "",
        linkURL: "",
        resourceType: -1,
        year: new Date().getFullYear(),
        semester: "",
      });
    }, [selectedTab]);
  
    async function onSubmit(values: z.infer<typeof formSchema>) {
      setIsLoading(true);
      try {
        if (values.resourceType === 2) {
          if (!values.linkURL) {
            return;
          }
  
          const req: InsertCourseLinkAPIRequest = {
            title: values.title,
            url: values.linkURL,
          };
  
          const response = await fetch(`${API_INSERT_COURSE_LINK_URL}/${courseId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(req),
          });
  
          if (!response.ok) {
            const errorData = await response.text();
            alert(`Error uploading link: ${errorData}`);
            return;
          }
  
          setIsUploadOpen(false);
          window.location.reload();
        } else {
          let req: InsertCourseAPIRequest = {
            title: values.title,
            subtitle: values.description ? values.description : null,
            course_id: courseId,
            resource_type: values.resourceType,
            semester: values.semester,
            academic_year: values.year,
            issolved: false,
          }
  
          const multipartFormData = new FormData();
          multipartFormData.append("metadata", JSON.stringify(req));
          selectedFiles.forEach(file => {
            multipartFormData.append("files", file);
          });
  
          const response = await fetch(`${API_INSERT_COURSE_URL}/${courseId}`, {
            method: 'POST',
            body: multipartFormData,
          });
  
          if (!response.ok) {
            const errorData = await response.text();
            alert(`Error uploading files: ${errorData}`);
            return;
          }
  
          setIsUploadOpen(false);
          window.location.reload();
        }
      } catch (error) {
        console.error('Error during submission:', error);
        alert(`An unexpected error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setIsLoading(false);
      }
    }
  
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      // add existing files
      files.push(...selectedFiles);
      setSelectedFiles(files);
    };
  
    const removeFile = (indexToRemove: number) => {
      const newFiles = selectedFiles.filter((_, index) => index !== indexToRemove);
      setSelectedFiles(newFiles);
    };
  
    return (
      <>
        <Button 
          variant="contained" 
          onClick={handleUploadClick}
          disabled={isLoading}
          sx={{ 
            width: isMobile ? '100%' : 'auto',
            marginLeft: 'auto',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            color: 'white',
            padding: '12px 24px',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.25)',
            },
            transition: 'all 0.2s ease-in-out',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '8px',
            textTransform: 'none',
            fontSize: '1.1rem'
          }}
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : '📤 Upload'}
        </Button>
  
        <Menu
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              background: 'rgba(25, 25, 25, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)',
              minWidth: '200px',
            }
          }}
        >
          <MenuItem 
            onClick={() => handleResourceTypeSelect(0)}
            sx={{ 
              color: 'white',
              padding: '12px 24px',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
            }}
          >
            📝 Notes
          </MenuItem>
          <MenuItem 
            onClick={() => handleResourceTypeSelect(1)}
            sx={{ 
              color: 'white',
              padding: '12px 24px',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
            }}
          >
            📚 Past Exam
          </MenuItem>
          <MenuItem 
            onClick={() => handleResourceTypeSelect(2)}
            sx={{ 
              color: 'white',
              padding: '12px 24px',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
            }}
          >
            🔗 Link
          </MenuItem>
        </Menu>
  
        <Dialog
          open={isUploadOpen}
          onClose={() => {
            setIsUploadOpen(false);
            setSelectedResourceType(-1);
            form.reset();
          }}
          fullScreen={false}
          PaperProps={{
            sx: {
              background: 'rgba(25, 25, 25, 0.85)',
              backdropFilter: 'blur(20px)',
              width: isMobile ? '100%' : '600px',
              height: isMobile ? 'auto' : 'auto',
              maxHeight: isMobile ? '90vh' : 'auto',
              position: isMobile ? 'fixed' : 'relative',
              bottom: isMobile ? 0 : 'auto',
              top: 'auto',
              m: isMobile ? 0 : 2,
              borderRadius: isMobile ? '24px 24px 0 0' : '24px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 4px 30px rgba(0, 0, 0, 0.2)',
            }
          }}
          sx={{
            '& .MuiDialog-container': {
              alignItems: isMobile ? 'flex-end' : 'center',
            },
            '& .MuiBackdrop-root': {
              backdropFilter: 'blur(10px)',
              backgroundColor: 'rgba(0, 0, 0, 0.5)'
            }
          }}
        >
          <DialogTitle sx={{ 
            color: 'white',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(255, 255, 255, 0.03)',
          }}>
            <span>
              {selectedResourceType === 0 && "Upload Notes"}
              {selectedResourceType === 1 && "Upload Past Exam"}
              {selectedResourceType === 2 && "Add Link"}
            </span>
            {isMobile && (
              <IconButton
                onClick={() => setIsUploadOpen(false)}
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&:hover': {
                    color: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                  transition: 'all 0.2s ease-in-out',
                  padding: '8px',
                }}
              >
                <CloseIcon />
              </IconButton>
            )}
          </DialogTitle>
          <DialogContent sx={{ padding: '24px' }}>
            <form 
              onSubmit={form.handleSubmit(onSubmit)} 
              className="space-y-6"
            >
              <FormControl fullWidth sx={{ mb: 1, paddingTop: '20px' }}>
                <FormLabel sx={{ color: 'white', mb: 1 }}>Title</FormLabel>
                <TextField
                  placeholder="Enter title..."
                  {...form.register("title")}
                  disabled={form.watch("resourceType") === -1 || isLoading}
                  error={!!form.formState.errors.title}
                  helperText={form.formState.errors.title?.message ? 
                    form.formState.errors.title?.message + " " + 
                    resourceTypeSubtitle(form.watch("resourceType")) : 
                    resourceTypeSubtitle(form.watch("resourceType"))}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      '&.Mui-disabled': {
                        color: 'white',
                        backgroundColor: 'rgba(255, 255, 255, 0.02)',
                      },
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'white',
                    },
                    '& .MuiFormHelperText-root': {
                      color: !!form.formState.errors.title ? '#f44336' : 'white',
                      fontSize: '17px',
                      marginTop: '4px',
                      marginBottom: 0,
                      marginLeft: '2px',
                      fontStyle: 'italic'
                    },
                  }}
                />
              </FormControl>
              
              {form.watch("resourceType") === 2 && (
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <FormLabel sx={{ color: 'white', mb: 1 }}>Link URL</FormLabel>
                  <TextField
                    placeholder="Enter link URL..."
                    {...form.register("linkURL")}
                    disabled={isLoading}
                    sx={{
                      color: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    }}
                  />
                </FormControl>
              )}
  
              
              {/*}
              <FormControl fullWidth sx={{ mb: 2 }}>
                <FormLabel sx={{ color: 'white', mb: 1 }}>Resource Type</FormLabel>
                <Select
                  {...form.register("resourceType")}
                  value={form.watch("resourceType")}
                  displayEmpty
                  renderValue={(value) => {
                    if (value === -1) return "Select type...";
                    if (value === 0) return "Notes";
                    if (value === 1) return "Past Exam";
                    if (value === 2) return "Link";
                  }}
                  sx={{
                    color: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                    },
                    '& .MuiSelect-icon': {
                      color: 'white',
                    },
                  }}
                >
                  <MenuItem value={1}>Past Exam</MenuItem>
                  <MenuItem value={0}>Notes</MenuItem>
                  <MenuItem value={2}>Link</MenuItem>
                </Select>
                <FormHelperText>
                  {form.formState.errors.resourceType?.message}
                </FormHelperText>
              </FormControl>
              */}
  
              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                <FormControl sx={{ flex: 1 }}>
                  <FormLabel sx={{ color: 'white', mb: 1 }}>Semester</FormLabel>
                  <Select
                    {...form.register("semester")}
                    value={form.watch("semester") || ""}
                    displayEmpty
                    error={!!form.formState.errors.semester}
                    renderValue={(value) => {
                      if (!value) return "Select semester...";
                      return value;
                    }}
                    sx={{
                      color: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                      },
                      '& .MuiSelect-icon': {
                        color: 'white',
                      },
                    }}
                    disabled={isLoading}
                  >
                    <MenuItem value="" disabled>Select semester...</MenuItem>
                    <MenuItem value="Fall">Fall</MenuItem>
                    <MenuItem value="Spring">Spring</MenuItem>
                    <MenuItem value="Summer">Summer</MenuItem>
                  </Select>
                  <FormHelperText error={!!form.formState.errors.semester}>
                    {form.formState.errors.semester?.message}
                  </FormHelperText>
                </FormControl>
  
                <FormControl sx={{ flex: 1 }}>
                  <FormLabel sx={{ color: 'white', mb: 1 }}>Year</FormLabel>
                  <TextField
                    type="number"
                    placeholder="Enter year..."
                    {...form.register("year", { valueAsNumber: true })}
                    error={!!form.formState.errors.year}
                    helperText={form.formState.errors.year?.message}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: 'white',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.1)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.2)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.2)',
                        },
                      },
                      '& .MuiFormHelperText-root': {
                        color: props => !!form.formState.errors.year ? '#f44336' : 'white',
                      },
                    }}
                    disabled={isLoading}
                  />
                </FormControl>
              </div>
  
              {/* Only show Files section if not a link resource */}
              {form.watch("resourceType") !== 2 && (
                <>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <FormLabel sx={{ color: 'white', mb: 1 }}>Files</FormLabel>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-white/5 border-white/10 hover:bg-white/[0.07] hover:border-white/20 transition-all backdrop-blur-sm">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg className="w-8 h-8 mb-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                          </svg>
                          <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                            <span style={{ fontWeight: 600 }}>Click to upload</span> or drag and drop
                          </Typography>
                          <Typography sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.875rem' }}>
                            Images, PDF, DOCX, PPTX etc.
                          </Typography>
                        </div>
                        <input
                          type="file"
                          multiple
                          className="hidden"
                          onChange={handleFileChange}
                          disabled={isLoading}
                        />
                      </label>
                    </div>
                  </FormControl>
  
                  {selectedFiles.length > 0 && (
                    <div style={{ marginTop: '16px' }}>
                      {selectedFiles.map((file, index) => (
                        <div 
                          key={index}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '12px',
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '8px',
                            marginBottom: '8px'
                          }}
                        >
                          <Typography sx={{ color: 'white' }}>{file.name}</Typography>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Typography sx={{ color: 'white' }}>{formatBytes(file.size, 2)}</Typography>
                            <IconButton
                              onClick={() => removeFile(index)}
                              size="small"
                              disabled={isLoading}
                              sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                            >
                              <CloseIcon fontSize="small" />
                            </IconButton>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
  
              { form.watch("resourceType") !== 2 && (
              <FormControl fullWidth sx={{ mb: 0 }}>
                <FormLabel sx={{ color: 'white', mb: 1 }}>Description (Optional)</FormLabel>
                <TextField
                  placeholder="Any additional information?"
                  {...form.register("description")}
                  multiline
                  rows={1}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                      },
                    },
                  }}
                  disabled={isLoading}
                />
                </FormControl>
              )}
  
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isLoading}
                onClick={() => console.log("🔘 Upload button clicked")}
                sx={{
                  marginTop: '24px',
                  padding: isMobile ? '24px' : '16px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  },
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.2)',
                  borderRadius: '16px',
                }}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Upload'
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </>
    );
  }