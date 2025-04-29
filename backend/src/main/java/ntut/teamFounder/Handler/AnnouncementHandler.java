package ntut.teamFounder.Handler;

import io.swagger.v3.oas.annotations.tags.Tag;
import ntut.teamFounder.DAO.AnnouncementDAO;
import ntut.teamFounder.DAO.CourseDAO;
import ntut.teamFounder.Domain.Announcement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@Tag(name = "Announcement API")
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/announcements")
public class AnnouncementHandler {

    private final AnnouncementDAO announcementDAO;
    private final CourseDAO courseDAO;

    @Autowired
    public AnnouncementHandler(AnnouncementDAO announcementDAO, CourseDAO courseDAO) {
        this.courseDAO = courseDAO;
        this.announcementDAO = announcementDAO;
    }

    @GetMapping
    public ResponseEntity<?> getAnnouncements(@RequestParam String courseCode) {
        try {
            List<Announcement> announcements = announcementDAO.getAnnouncements(courseCode);

            if (courseCode == null) {
                throw new IllegalArgumentException("Course ID cannot be null");
            }

            return ResponseEntity.ok(announcements);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to retrieve announcements: " + e.getMessage());
        }
    }
//    @RequestParam Date createdAt,
    @PostMapping
    public ResponseEntity<?> createAnnouncement(@RequestParam String courseCode, @RequestParam Long professorId, @RequestParam String title, @RequestParam String content, @RequestParam int importanceLevel) {
        Long actualProfessorId = courseDAO.getProfessorId(courseCode);
        if(!professorId.equals(actualProfessorId)) {
            return new ResponseEntity<>("Professor does not match course", HttpStatus.BAD_REQUEST);
        }
        Announcement announcement = new Announcement(1L,"",content,new Date(), "",0); //Tue Apr 29 06:59:48 GMT 2025
        boolean isClean = announcement.verifyAnnouncement();
        if(isClean) {
            announcementDAO.createAnnouncement(courseCode, title, content, importanceLevel);
        }
        getAnnouncements(courseCode);
        return ResponseEntity.ok().build();
    }
}
