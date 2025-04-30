package ntut.teamFounder.Handler;

import ntut.teamFounder.DAO.StudentDAO;
import ntut.teamFounder.DAO.UserDAO;
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
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class StudentHandlerTest {

    @Mock
    private StudentDAO studentDAO;

    @Mock
    private UserDAO userDAO;

    @InjectMocks
    private StudentHandler studentHandler;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getProfile_WithValidStudentId_ShouldReturnSuccess() {
        String studentId = "testStudent";
        Student mockStudent = new Student(1L, studentId, "Test Student", "password", "test@example.com", new Date());
        List<Long> mockSkills = Arrays.asList(1L, 2L);
        Skill mockSkill1 = new Skill(1L, "Programming", "Java");
        Skill mockSkill2 = new Skill(2L, "Programming", "Python");

        when(studentDAO.getStudentByStudentId(studentId)).thenReturn(mockStudent);
        when(studentDAO.getSkillsById(1L)).thenReturn(mockSkills);
        when(studentDAO.getSkillById(1L)).thenReturn(mockSkill1);
        when(studentDAO.getSkillById(2L)).thenReturn(mockSkill2);

        ResponseEntity<?> response = studentHandler.getProfile(studentId);

        assertTrue(response.getStatusCode().is2xxSuccessful());
        Map<String, Object> responseBody = (Map<String, Object>) response.getBody();
        assertNotNull(responseBody);
        assertEquals(studentId, responseBody.get("studentId"));
        assertEquals("Test Student", responseBody.get("username"));
        assertEquals("test@example.com", responseBody.get("email"));
        assertEquals("student", responseBody.get("role"));
        List<Skill> skills = (List<Skill>) responseBody.get("skills");
        assertEquals(2, skills.size());
    }

    @Test
    void getProfile_WithInvalidStudentId_ShouldReturnBadRequest() {
        String studentId = "invalidStudent";
        when(studentDAO.getStudentByStudentId(studentId)).thenReturn(null);

        ResponseEntity<?> response = studentHandler.getProfile(studentId);

        assertTrue(response.getStatusCode().is4xxClientError());
        assertEquals("Student not found.", response.getBody());
    }

    @Test
    void editProfile_WithValidData_ShouldReturnSuccess() {
        String userId = "testStudent";
        String username = "Updated Name";
        String password = "newPassword";
        String email = "updated@example.com";

        Student mockStudent = new Student(1L, userId, username, password, email, new Date());
        when(studentDAO.updateStudent(any(Student.class))).thenReturn(1);

        ResponseEntity<?> response = studentHandler.editProfile(userId, username, password, email);

        assertTrue(response.getStatusCode().is2xxSuccessful());
        Map<String, String> responseBody = (Map<String, String>) response.getBody();
        assertNotNull(responseBody);
        assertEquals("Profile updated successfully.", responseBody.get("message"));
    }

    @Test
    void editProfile_WithInvalidEmail_ShouldReturnBadRequest() {
        String userId = "testStudent";
        String username = "Test Student";
        String password = "password";
        String email = "invalid-email";

        ResponseEntity<?> response = studentHandler.editProfile(userId, username, password, email);

        assertTrue(response.getStatusCode().is4xxClientError());
        assertEquals("Invalid email format.", response.getBody());
    }

    @Test
    void deleteProfile_WithValidStudentId_ShouldReturnSuccess() {
        String studentId = "testStudent";
        when(studentDAO.deleteStudent(studentId)).thenReturn(1);

        ResponseEntity<?> response = studentHandler.deleteProfile(studentId);

        assertTrue(response.getStatusCode().is2xxSuccessful());
        assertEquals("Profile deleted successfully.", response.getBody());
    }

    @Test
    void deleteProfile_WithInvalidStudentId_ShouldReturnBadRequest() {
        String studentId = "invalidStudent";
        when(studentDAO.deleteStudent(studentId)).thenReturn(0);

        ResponseEntity<?> response = studentHandler.deleteProfile(studentId);

        assertTrue(response.getStatusCode().is4xxClientError());
        assertEquals("Delete failed.", response.getBody());
    }

    @Test
    void addSkillToProfile_WithValidData_ShouldReturnSuccess() {
        Long userId = 1L;
        Long skillId = 1L;
        when(studentDAO.addSkillToStudent(userId, skillId)).thenReturn(1);

        ResponseEntity<?> response = studentHandler.addSkillToProfile(userId, skillId);

        assertTrue(response.getStatusCode().is2xxSuccessful());
        assertEquals("Skill added successfully.", response.getBody());
    }

    @Test
    void deleteSkillFromProfile_WithValidData_ShouldReturnSuccess() {
        Long userId = 1L;
        Long skillId = 1L;
        when(studentDAO.deleteSkillFromStudent(userId, skillId)).thenReturn(1);

        ResponseEntity<?> response = studentHandler.deleteSkillFromProfile(userId, skillId);

        assertTrue(response.getStatusCode().is2xxSuccessful());
        assertEquals("Skill removed successfully.", response.getBody());
    }

    @Test
    void enrollInCourse_WithValidData_ShouldReturnSuccess() {
        Long userId = 1L;
        String courseCode = "CS101";
        when(studentDAO.enrollInCourse(userId, courseCode)).thenReturn(1);

        ResponseEntity<?> response = studentHandler.enrollInCourse(userId, courseCode);

        assertTrue(response.getStatusCode().is2xxSuccessful());
        assertEquals("Enrolled in course successfully.", response.getBody());
    }

    @Test
    void getEnrolledCourses_WithValidUserId_ShouldReturnSuccess() {
        Long userId = 1L;
        List<String> mockCourses = Arrays.asList("CS101", "CS102");
        when(studentDAO.getCoursesById(userId)).thenReturn(mockCourses);

        ResponseEntity<List<String>> response = studentHandler.getEnrolledCourses(userId);

        assertTrue(response.getStatusCode().is2xxSuccessful());
        List<String> courses = response.getBody();
        assertNotNull(courses);
        assertEquals(2, courses.size());
        assertEquals("CS101", courses.get(0));
        assertEquals("CS102", courses.get(1));
    }

    @Test
    void getAllSkills_ShouldReturnSuccess() {
        List<Skill> mockSkills = Arrays.asList(
            new Skill(1L, "Programming", "Java"),
            new Skill(2L, "Programming", "Python")
        );
        when(studentDAO.getAllSkills()).thenReturn(mockSkills);

        ResponseEntity<?> response = studentHandler.getAllSkills();

        assertTrue(response.getStatusCode().is2xxSuccessful());
        List<Skill> skills = (List<Skill>) response.getBody();
        assertNotNull(skills);
        assertEquals(2, skills.size());
    }

    @Test
    void getProfileSkills_WithValidUserId_ShouldReturnSuccess() {
        Long userId = 1L;
        List<Long> mockSkillIds = Arrays.asList(1L, 2L);
        Skill mockSkill1 = new Skill(1L, "Programming", "Java");
        Skill mockSkill2 = new Skill(2L, "Programming", "Python");

        when(studentDAO.getSkillsById(userId)).thenReturn(mockSkillIds);
        when(studentDAO.getSkillById(1L)).thenReturn(mockSkill1);
        when(studentDAO.getSkillById(2L)).thenReturn(mockSkill2);

        ResponseEntity<?> response = studentHandler.getProfileSkills(userId);

        assertTrue(response.getStatusCode().is2xxSuccessful());
        List<Skill> skills = (List<Skill>) response.getBody();
        assertNotNull(skills);
        assertEquals(2, skills.size());
    }
} 