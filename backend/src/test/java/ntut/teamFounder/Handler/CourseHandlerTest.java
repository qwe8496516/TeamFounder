package ntut.teamFounder.Handler;

import ntut.teamFounder.DAO.CourseDAO;
import ntut.teamFounder.DAO.StudentDAO;
import ntut.teamFounder.Domain.*;
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
        Course mockCourse = new Course(courseCode, "Computer Science 101", "prof1", 2024, 1, "Introduction to CS",  0);
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
    void getCoursesByStudentId_WithValidStudentId_ShouldReturnSuccess() {
        Long studentId = 1L;
        List<String> courseCodes = Arrays.asList("CS101", "CS102");
        Course course1 = new Course("CS101", "Comp Sci 101", "prof1", 2024, 1, "Intro CS", 0);
        Course course2 = new Course("CS102", "Comp Sci 102", "prof1", 2024, 1, "Advanced CS", 0);

        when(courseDAO.getCourseByStudentId(studentId)).thenReturn(courseCodes);
        when(courseDAO.getCourseByCourseCode("CS101")).thenReturn(course1);
        when(studentDAO.getStudentCount("CS101")).thenReturn(30);
        when(courseDAO.getCourseByCourseCode("CS102")).thenReturn(course2);
        when(studentDAO.getStudentCount("CS102")).thenReturn(25);

        ResponseEntity<?> response = courseHandler.getCoursesByStudentId(studentId);

        assertTrue(response.getStatusCode().is2xxSuccessful());
        List<Map<String, Object>> courses = (List<Map<String, Object>>) response.getBody();
        assertEquals(2, courses.size());
        assertEquals("CS101", courses.get(0).get("courseCode"));
        assertEquals(30, courses.get(0).get("students"));
        assertEquals("CS102", courses.get(1).get("courseCode"));
        assertEquals(25, courses.get(1).get("students"));
    }

    @Test
    void getCoursesByStudentId_WithException_ShouldReturnBadRequest() {
        Long studentId = 1L;
        when(courseDAO.getCourseByStudentId(studentId)).thenThrow(new RuntimeException("DB error"));

        ResponseEntity<?> response = courseHandler.getCoursesByStudentId(studentId);

        assertTrue(response.getStatusCode().is4xxClientError());
        assertTrue(response.getBody().toString().contains("Failed to retrieve course"));
    }

    @Test
    void getCompatibleStudents_WithException_ShouldReturnBadRequest() {
        when(studentDAO.getStudentById(anyLong())).thenThrow(new RuntimeException("DB error"));

        ResponseEntity<?> response = courseHandler.getCompatibleStudents("CS101", 1L);

        assertTrue(response.getStatusCode().is4xxClientError());
        assertTrue(response.getBody().toString().contains("Failed to retrieve match list"));
    }

    @Test
    void getCoursesByProfessorId_ShouldReturnSuccess() {
        String professorId = "prof1";
        Course course1 = new Course("CS101", "CS101 Name", professorId, 2024, 1, "desc1", 0);
        Course course2 = new Course("CS102", "CS102 Name", professorId, 2024, 1, "desc2", 0);

        when(courseDAO.getCoursesByProfessorId(professorId)).thenReturn(Arrays.asList(course1, course2));
        when(studentDAO.getStudentCount("CS101")).thenReturn(20);
        when(studentDAO.getStudentCount("CS102")).thenReturn(15);

        ResponseEntity<?> response = courseHandler.getCoursesByProfessorId(professorId);

        assertTrue(response.getStatusCode().is2xxSuccessful());
        List<Map<String, Object>> courses = (List<Map<String, Object>>) response.getBody();
        assertEquals(2, courses.size());
        assertEquals("CS101", courses.get(0).get("courseCode"));
        assertEquals(20, courses.get(0).get("students"));
    }

    @Test
    void getCoursesByProfessorId_WithException_ShouldReturnBadRequest() {
        when(courseDAO.getCoursesByProfessorId(anyString())).thenThrow(new RuntimeException("DB error"));

        ResponseEntity<?> response = courseHandler.getCoursesByProfessorId("prof1");

        assertTrue(response.getStatusCode().is4xxClientError());
        assertTrue(response.getBody().toString().contains("Failed to retrieve course"));
    }

    @Test
    void getTotalMembersCountInLegitTeams_ShouldReturnCount() {
        String courseCode = "CS101";
        when(courseDAO.getTotalMembersCountInLegitTeams(courseCode)).thenReturn(10);

        int count = courseHandler.getTotalMembersCountInLegitTeams(courseCode);

        assertEquals(10, count);
    }

    @Test
    void exportTeamList_WithException_ShouldReturnInternalServerError() {
        String courseCode = "CS101";
        String fileType = "csv";

        when(courseDAO.getTeamsByCourseCode(courseCode)).thenThrow(new RuntimeException("DB error"));

        ResponseEntity<byte[]> response = courseHandler.exportTeamList(courseCode, fileType);

        assertTrue(response.getStatusCode().is5xxServerError());
        assertTrue(new String(response.getBody()).contains("Export failed"));
    }


    @Test
    void getTeamsInCourse_WithException_ShouldReturnBadRequest() {
        String courseCode = "CS101";
        when(courseDAO.getTeamsByCourseCode(courseCode)).thenThrow(new RuntimeException("DB error"));

        ResponseEntity<?> response = courseHandler.getTeamsInCourse(courseCode);

        assertTrue(response.getStatusCode().is4xxClientError());
        assertTrue(response.getBody().toString().contains("Failed to retrieve team list"));
    }


} 