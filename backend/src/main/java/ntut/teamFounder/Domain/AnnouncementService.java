package ntut.teamFounder.Domain;

import ntut.teamFounder.DAO.AnnouncementDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
public class AnnouncementService {

    private final AnnouncementDAO announcementDAO;

    @Autowired
    public AnnouncementService(AnnouncementDAO announcementDAO) {
        this.announcementDAO = announcementDAO;
    }

    public List<Announcement> getAnnouncements(Long courseId) {
        if (courseId == null) {
            throw new IllegalArgumentException("Course ID cannot be null");
        }

        return announcementDAO.getAnnouncements(courseId);
    }

    public List<Announcement> sortByImportanceLevel(List<Announcement> announcements, String order) {
        if (order != null && order.equalsIgnoreCase("desc")) {
            announcements.sort(Comparator.comparing(Announcement::getImportanceLevel).reversed());
        } else {
            announcements.sort(Comparator.comparing(Announcement::getImportanceLevel));
        }
        return announcements;
    }
}
