package ntut.teamFounder.Handler;

import ntut.teamFounder.DAO.AnnouncementDAO;
import ntut.teamFounder.DAO.CourseDAO;
import ntut.teamFounder.Domain.Announcement;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class AnnouncementHandlerTest {

    @Mock
    private AnnouncementDAO announcementDAO;

    @Mock
    private CourseDAO courseDAO;

    @InjectMocks
    private AnnouncementHandler announcementHandler;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getAnnouncements_WithValidCourseCode_ShouldReturnSuccess() {
        String courseCode = "CS101";
        List<Announcement> mockAnnouncements = Arrays.asList(
            new Announcement(1L, "Test Announcement 1", "Content 1", new Date(), courseCode, 1),
            new Announcement(2L, "Test Announcement 2", "Content 2", new Date(), courseCode, 2)
        );
        when(announcementDAO.getAnnouncements(courseCode)).thenReturn(mockAnnouncements);

        ResponseEntity<?> response = announcementHandler.getAnnouncements(courseCode);

        assertTrue(response.getStatusCode().is2xxSuccessful());
        List<Announcement> announcements = (List<Announcement>) response.getBody();
        assertNotNull(announcements);
        assertEquals(2, announcements.size());
        assertEquals("Test Announcement 1", announcements.get(0).getTitle());
        assertEquals("Test Announcement 2", announcements.get(1).getTitle());
    }

    @Test
    void getAnnouncements_WithNullCourseCode_ShouldReturnBadRequest() {
        String courseCode = null;

        ResponseEntity<?> response = announcementHandler.getAnnouncements(courseCode);

        assertTrue(response.getStatusCode().is4xxClientError());
        assertTrue(response.getBody().toString().contains("Course ID cannot be null"));
    }

    @Test
    void createAnnouncement_WithValidData_ShouldReturnSuccess() {
        String courseCode = "CS101";
        String professorId = "prof1";
        String title = "Test Announcement";
        String content = "Test Content";
        int importanceLevel = 1;

        when(courseDAO.getProfessorId(courseCode)).thenReturn(professorId);
        when(announcementDAO.createAnnouncement(courseCode, title, content, importanceLevel)).thenReturn(1);

        ResponseEntity<?> response = announcementHandler.createAnnouncement(courseCode, professorId, title, content, importanceLevel);

        assertTrue(response.getStatusCode().is2xxSuccessful());
        assertEquals("Announcement created successfully", response.getBody());
    }

    @Test
    void createAnnouncement_WithInvalidProfessor_ShouldReturnBadRequest() {
        String courseCode = "CS101";
        String professorId = "wrongProf";
        String title = "Test Announcement";
        String content = "Test Content";
        int importanceLevel = 1;

        when(courseDAO.getProfessorId(courseCode)).thenReturn("correctProf");

        ResponseEntity<?> response = announcementHandler.createAnnouncement(courseCode, professorId, title, content, importanceLevel);

        assertTrue(response.getStatusCode().is4xxClientError());
        assertEquals("Professor does not match course", response.getBody());
    }

    @Test
    void createAnnouncement_WithBadWords_ShouldReturnBadRequest() {
        String courseCode = "CS101";
        String professorId = "prof1";
        String title = "Test Announcement";
        String content = "This is a fuck test";
        int importanceLevel = 1;

        when(courseDAO.getProfessorId(courseCode)).thenReturn(professorId);

        ResponseEntity<?> response = announcementHandler.createAnnouncement(courseCode, professorId, title, content, importanceLevel);

        assertTrue(response.getStatusCode().is4xxClientError());
        assertEquals("Please check your title & content and try again.", response.getBody());
    }

    @Test
    void createAnnouncement_WithInvalidImportanceLevel_ShouldReturnBadRequest() {
        String courseCode = "CS101";
        String professorId = "prof1";
        String title = "Test Announcement";
        String content = "Test Content";
        int importanceLevel = 5;

        when(courseDAO.getProfessorId(courseCode)).thenReturn(professorId);

        ResponseEntity<?> response = announcementHandler.createAnnouncement(courseCode, professorId, title, content, importanceLevel);

        assertTrue(response.getStatusCode().is4xxClientError());
        assertEquals("Please check your title & content and try again.", response.getBody());
    }
} 