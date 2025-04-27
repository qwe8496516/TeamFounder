package ntut.teamFounder.Handler;

import io.swagger.v3.oas.annotations.tags.Tag;
import ntut.teamFounder.Domain.Announcement;
import ntut.teamFounder.Domain.AnnouncementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Tag(name = "Announcement API")
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/announcements")
public class AnnouncementHandler {

    private final AnnouncementService announcementService;

    @Autowired
    public AnnouncementHandler(AnnouncementService announcementService) {
        this.announcementService = announcementService;
    }

    @GetMapping
    public ResponseEntity<?> getAnnouncements(@RequestParam Long courseId,
                                              @RequestParam(required = false) String order) {
        try {
            List<Announcement> announcements = announcementService.getAnnouncements(courseId);

            if (!announcements.isEmpty() && order != null) {
                announcements = announcementService.sortByImportanceLevel(announcements, order);
            }

            return ResponseEntity.ok(announcements);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to retrieve announcements: " + e.getMessage());
        }
    }
}
