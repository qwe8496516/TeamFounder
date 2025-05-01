package ntut.teamFounder.Handler;

import ntut.teamFounder.DAO.CourseDAO;
import ntut.teamFounder.DAO.StudentDAO;
import ntut.teamFounder.Domain.Course;
import ntut.teamFounder.Domain.Skill;
import ntut.teamFounder.Domain.Student;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class CourseHandlerTest {

    @Mock
    private CourseDAO courseDAO;

    @Mock
    private StudentDAO studentDAO;

    @InjectMocks
    private CourseHandler courseHandler;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getCourseByCourseCode_WithValidCode_ShouldReturnSuccess() {
        String courseCode = "CS101";
        Course mockCourse = new Course(courseCode, "Computer Science 101", "prof1", 2024, 1, "Introduction to CS");
        when(courseDAO.getCourseByCourseCode(courseCode)).thenReturn(mockCourse);
        when(studentDAO.getStudentCount(courseCode)).thenReturn(30);

        ResponseEntity<?> response = courseHandler.getCourseByCourseCode(courseCode);

        assertTrue(response.getStatusCode().is2xxSuccessful());
        Map<String, Object> responseBody = (Map<String, Object>) response.getBody();
        assertNotNull(responseBody);
        assertEquals(courseCode, responseBody.get("courseCode"));
        assertEquals("Computer Science 101", responseBody.get("name"));
        assertEquals("prof1", responseBody.get("professorId"));
        assertEquals(2024, responseBody.get("academicYear"));
        assertEquals(1, responseBody.get("semester"));
        assertEquals("Introduction to CS", responseBody.get("description"));
        assertEquals(30, responseBody.get("students"));
    }

    @Test
    void getCourseByCourseCode_WithInvalidCode_ShouldReturnBadRequest() {
        String courseCode = "INVALID";
        when(courseDAO.getCourseByCourseCode(courseCode)).thenThrow(new RuntimeException("Course not found"));

        ResponseEntity<?> response = courseHandler.getCourseByCourseCode(courseCode);

        assertTrue(response.getStatusCode().is4xxClientError());
        assertTrue(response.getBody().toString().contains("Failed to retrieve course"));
    }

    @Test
    void getCoursesByStudentId_WithValidId_ShouldReturnSuccess() {
        Long studentId = 1L;
        List<String> courseCodes = Arrays.asList("CS101", "CS102");
        Course mockCourse1 = new Course("CS101", "Computer Science 101", "prof1", 2024, 1, "Introduction to CS");
        Course mockCourse2 = new Course("CS102", "Computer Science 102", "prof1", 2024, 1, "Advanced CS");

        when(courseDAO.getCourseByStudentId(studentId)).thenReturn(courseCodes);
        when(courseDAO.getCourseByCourseCode("CS101")).thenReturn(mockCourse1);
        when(courseDAO.getCourseByCourseCode("CS102")).thenReturn(mockCourse2);

        ResponseEntity<?> response = courseHandler.getCoursesByStudentId(studentId);

        assertTrue(response.getStatusCode().is2xxSuccessful());
        List<Course> courses = (List<Course>) response.getBody();
        assertNotNull(courses);
        assertEquals(2, courses.size());
        assertEquals("CS101", courses.get(0).getCourseCode());
        assertEquals("CS102", courses.get(1).getCourseCode());
    }

    @Test
    void getStudentInCourse_WithValidCode_ShouldReturnSuccess() {
        String courseCode = "CS101";
        List<Long> studentIds = Arrays.asList(1L, 2L);
        Student mockStudent1 = new Student(1L, "student1", "Student One", "pass1", "student1@example.com", new Date());
        Student mockStudent2 = new Student(2L, "student2", "Student Two", "pass2", "student2@example.com", new Date());

        when(courseDAO.getStudentsInCourse(courseCode)).thenReturn(studentIds);
        when(studentDAO.getStudentById(1L)).thenReturn(mockStudent1);
        when(studentDAO.getStudentById(2L)).thenReturn(mockStudent2);

        ResponseEntity<?> response = courseHandler.getStudentInCourse(courseCode);

        assertTrue(response.getStatusCode().is2xxSuccessful());
        List<Map<String, Object>> students = (List<Map<String, Object>>) response.getBody();
        assertNotNull(students);
        assertEquals(2, students.size());
        assertEquals("student1", students.get(0).get("userId"));
        assertEquals("student2", students.get(1).get("userId"));
    }

    @Test
    void getCompatibleStudents_WithValidData_ShouldReturnSuccess() {
        String courseCode = "CS101";
        Long userId = 1L;
        List<Long> studentIds = Arrays.asList(2L, 3L);
        
        Student matcher = new Student(userId, "student1", "Student One", "pass1", "student1@example.com", new Date());
        List<Long> matcherSkills = Arrays.asList(1L, 2L);
        matcher.setSkills(matcherSkills);
        
        Student student2 = new Student(2L, "student2", "Student Two", "pass2", "student2@example.com", new Date());
        List<Long> student2Skills = Arrays.asList(1L, 2L, 3L);
        student2.setSkills(student2Skills);
        
        Student student3 = new Student(3L, "student3", "Student Three", "pass3", "student3@example.com", new Date());
        List<Long> student3Skills = Arrays.asList(4L, 5L);
        student3.setSkills(student3Skills);
        
        Skill skill1 = new Skill(1L, "Programming", "Java");
        Skill skill2 = new Skill(2L, "Programming", "Python");
        Skill skill3 = new Skill(3L, "Programming", "C++");
        Skill skill4 = new Skill(4L, "Design", "UI/UX");
        Skill skill5 = new Skill(5L, "Design", "Figma");

        when(courseDAO.getStudentsInCourse(courseCode)).thenReturn(studentIds);
        when(studentDAO.getStudentById(userId)).thenReturn(matcher);
        when(studentDAO.getStudentById(2L)).thenReturn(student2);
        when(studentDAO.getStudentById(3L)).thenReturn(student3);
        when(studentDAO.getSkillsById(userId)).thenReturn(matcherSkills);
        when(studentDAO.getSkillsById(2L)).thenReturn(student2Skills);
        when(studentDAO.getSkillsById(3L)).thenReturn(student3Skills);
        when(studentDAO.getSkillById(1L)).thenReturn(skill1);
        when(studentDAO.getSkillById(2L)).thenReturn(skill2);
        when(studentDAO.getSkillById(3L)).thenReturn(skill3);
        when(studentDAO.getSkillById(4L)).thenReturn(skill4);
        when(studentDAO.getSkillById(5L)).thenReturn(skill5);

        ResponseEntity<?> response = courseHandler.getCompatibleStudents(courseCode, userId);

        assertTrue(response.getStatusCode().is2xxSuccessful());
        List<Map<String, Object>> students = (List<Map<String, Object>>) response.getBody();
        assertNotNull(students);
        assertEquals(2, students.size());
        
        Map<String, Object> student2Data = students.get(0);
        assertEquals("student2", student2Data.get("userId"));
        assertEquals("Student Two", student2Data.get("username"));
        assertEquals("student2@example.com", student2Data.get("email"));
        assertTrue((int) student2Data.get("Fitness") > 90);
        List<Skill> student2SkillsList = (List<Skill>) student2Data.get("skills");
        assertEquals(3, student2SkillsList.size());
        
        Map<String, Object> student3Data = students.get(1);
        assertEquals("student3", student3Data.get("userId"));
        assertEquals("Student Three", student3Data.get("username"));
        assertEquals("student3@example.com", student3Data.get("email"));
        assertTrue((int) student3Data.get("Fitness") <= 90);
        List<Skill> student3SkillsList = (List<Skill>) student3Data.get("skills");
        assertEquals(2, student3SkillsList.size());
    }
} 