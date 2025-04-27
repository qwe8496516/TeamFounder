package ntut.teamFounder.Domain;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Date;

@Getter
@Setter
public class Announcement {
    private Long id;
    private String title;
    private String content;
    private LocalDateTime timestamp;
    private int importanceLevel;
    private Course course;

    public Announcement(Long id, String title, String content, Date createdAt, Long courseId) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.timestamp = createdAt.toInstant().atZone(java.time.ZoneId.systemDefault()).toLocalDateTime();

        this.course = new Course();
//        this.course.setId(courseId);

        this.importanceLevel = 0;
    }

    public Announcement(String title, String content, LocalDateTime timestamp, int importanceLevel, Course course) {
        this.title = title;
        this.content = content;
        this.timestamp = timestamp;
        this.importanceLevel = importanceLevel;
        this.course = course;
    }

    public Announcement() {}
}
