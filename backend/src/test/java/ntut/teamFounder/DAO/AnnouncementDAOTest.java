package ntut.teamFounder.DAO;

import ntut.teamFounder.Domain.Announcement;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class AnnouncementDAOTest {

    @Autowired
    private AnnouncementDAO announcementDAO;

    @Test
    public void getAnnouncementsTest() {
        List<Announcement> announcements = announcementDAO.getAnnouncements("CS301");
        assertNotNull(announcements);
        assertFalse(announcements.isEmpty());
        Announcement first = announcements.get(0);
        assertEquals("CS301", first.getCourseCode());
    }

    @Test
    public void createAnnouncementTest() {
        String courseCode = "CS301";
        String title = "Test Title";
        String content = "Test Content";
        int importanceLevel = 2;

        int res = announcementDAO.createAnnouncement(courseCode, title, content, importanceLevel);
        assertEquals(1, res);

        List<Announcement> announcements = announcementDAO.getAnnouncements(courseCode);
        boolean found = announcements.stream()
                .anyMatch(a -> a.getTitle().equals(title) && a.getContent().equals(content));
        assertTrue(found);
    }
}
