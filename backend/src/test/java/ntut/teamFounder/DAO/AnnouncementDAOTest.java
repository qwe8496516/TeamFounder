package ntut.teamFounder.DAO;

import ntut.teamFounder.Domain.Announcement;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;

import java.sql.Date;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class AnnouncementDAOTest {

    @Mock
    private JdbcTemplate jdbcTemplate;

    @InjectMocks
    private AnnouncementDAO announcementDAO;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getAnnouncements_returnsListOfAnnouncements() {
        // Arrange
        String courseCode = "CS101";
        Announcement announcement = new Announcement(
                1L,
                "Exam",
                "Exam at 9am",
                new Date(System.currentTimeMillis()),
                courseCode,
                2
        );
        List<Announcement> expected = List.of(announcement);

        // Mock jdbcTemplate.query to return our expected list
        when(jdbcTemplate.query(
                eq("SELECT * FROM announcement WHERE courseCode = ? ORDER BY importanceLevel DESC"),
                eq(new Object[]{courseCode}),
                any(RowMapper.class))
        ).thenReturn(expected);

        // Act
        List<Announcement> actual = announcementDAO.getAnnouncements(courseCode);

        // Assert
        assertEquals(expected, actual);
        verify(jdbcTemplate, times(1)).query(
                eq("SELECT * FROM announcement WHERE courseCode = ? ORDER BY importanceLevel DESC"),
                eq(new Object[]{courseCode}),
                any(RowMapper.class)
        );
    }

    @Test
    void getAnnouncements_returnsEmptyListWhenNoResults() {
        // Arrange
        String courseCode = "CS999";
        when(jdbcTemplate.query(anyString(), any(Object[].class), any(RowMapper.class)))
                .thenReturn(Collections.emptyList());

        // Act
        List<Announcement> result = announcementDAO.getAnnouncements(courseCode);

        // Assert
        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    void createAnnouncement_returnsUpdateCount() {
        // Arrange
        String courseCode = "CS101";
        String title = "New Announcement";
        String content = "Details here";
        int importanceLevel = 3;

        when(jdbcTemplate.update(
                eq("INSERT INTO announcement (courseCode, title, content, importanceLevel) VALUES (?, ?, ?, ?)"),
                eq(courseCode), eq(title), eq(content), eq(importanceLevel)
        )).thenReturn(1);

        // Act
        int result = announcementDAO.createAnnouncement(courseCode, title, content, importanceLevel);

        // Assert
        assertEquals(1, result);
        verify(jdbcTemplate, times(1)).update(
                eq("INSERT INTO announcement (courseCode, title, content, importanceLevel) VALUES (?, ?, ?, ?)"),
                eq(courseCode), eq(title), eq(content), eq(importanceLevel)
        );
    }

}