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
        // 假設資料庫已經有一筆 announcement 資料，courseCode = "CS301"
        List<Announcement> announcements = announcementDAO.getAnnouncements("CS301");
        assertNotNull(announcements);
        // 依你的資料庫狀況調整這些斷言
        assertFalse(announcements.isEmpty());
        Announcement first = announcements.get(0);
        assertEquals("CS301", first.getCourseCode());
        // 可依需求再加更多欄位斷言
    }

    @Test
    public void createAnnouncementTest() {
        String courseCode = "CS301";
        String title = "Test Title";
        String content = "Test Content";
        int importanceLevel = 2;

        int res = announcementDAO.createAnnouncement(courseCode, title, content, importanceLevel);
        assertEquals(1, res);

        // 驗證是否真的新增成功
        List<Announcement> announcements = announcementDAO.getAnnouncements(courseCode);
        boolean found = announcements.stream()
                .anyMatch(a -> a.getTitle().equals(title) && a.getContent().equals(content));
        assertTrue(found);
    }
}
