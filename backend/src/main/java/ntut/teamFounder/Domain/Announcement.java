package ntut.teamFounder.Domain;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

@Getter
@Setter
public class Announcement {

    private static final List<String> badWords = Arrays.asList("fuck", "bitch", "damn");

    private Long id;
    private String title;
    private String content;
//    private Date createdAt;
    private String courseCode;
    private int importanceLevel;

//    public Announcement(Long id, String title, String content, Date createdAt, String courseCode, int importanceLevel) {
    public Announcement(Long id, String title, String content, String courseCode, int importanceLevel) {
        this.id = id;
        this.title = title;
        this.content = content;
//        this.createdAt = createdAt;
        this.courseCode = courseCode;
        this.importanceLevel = importanceLevel;
    }

//    public Announcement(String title, String content, Date timestamp, String professor, Course course) {
//        this.title = title;
//        this.content = content;
//        this.timestamp = timestamp;
//        this.professor = professor;
//        this.course = course;
//    }
//
//    public Announcement() {}

    public boolean verifyAnnouncement() {
        //in content looks for inproper words
        for (String badWord : badWords) {
            if (content.toLowerCase().contains(badWord.toLowerCase())) {
                return false;
            }
        }
        return true;
    }

}
