type Course = {
    course_id: string;
    course_name: string;
    course_faculty: number;
};
  
type CourseAPIResponse = {
    courses: Course[];
    total_courses: number;
};

type LinkInfoAPIResponse = {
    title: string,
    url: string
}

type CourseDetailsAPIResponse = {
    metadata: Course,
    resources: ResourceInfoAPIResponse[],
    links: LinkInfoAPIResponse[]
};

type InsertCourseAPIRequest = {
    title: string,
    subtitle: string | null,
    course_id: string,
    resource_type: number,
    semester: string,
    academic_year: number,
    issolved: boolean,
}

export type ResourceInfo = { 
    title: string,
    subtitle: string | null,
    resource_id: string,
    resource_type: number,
    dateuploaded: Date,
    semester: string,
    academic_year: number,
    issolved: boolean
}

export type FileResourceInfo = { 
    file_id: string,
    file_name: string,
    file_url: string,
}

export type ResourceInfoAPIResponse = {
    resource_info: ResourceInfo,
    files: FileResourceInfo[]
}

export type InsertCourseLinkAPIRequest = {
    title: string,
    url: string
}

var facultyCompleteNameMap: { [key: number]: string } = {
    0: "Business School",
    // 1: "Graduate School of Business",
    2: "School of Basic Sciences and Humanities",
    3: "School of Applied Medical Sciences",
    4: "School of Applied Technical Sciences",
    5: "School of Architecture and Built Environment",
    6: "School of Electrical Engineering and Information Technology",
    7: "German Language Center",
    8: "School of Natural Resources Engineering and Management",
    9: "School of Nursing"
};

var facultyShortNameMap: { [key: number]: string } = {
    0: "BS",
    1: "GSBA",
    2: "SBSH",
    3: "SAMS",
    4: "SATS",
    5: "SABE",
    6: "SEEIT",
    7: "GLC",
    8: "SNREM",
    9: "SN"
}

function getFacultyShortName(faculty_id: number) {
    return facultyShortNameMap[faculty_id];
}

export type { Course, CourseAPIResponse, CourseDetailsAPIResponse, InsertCourseAPIRequest };
export { facultyCompleteNameMap, facultyShortNameMap, getFacultyShortName };
