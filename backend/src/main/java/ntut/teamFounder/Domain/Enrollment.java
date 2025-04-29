package ntut.teamFounder.Domain;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class Enrollment {

    private Long userId;
    private String courseCode;
    private Date enrolledAt;

    public Enrollment(Long userId, String courseCode, Date enrolledAt) {
        this.userId = userId;
        this.courseCode = courseCode;
        this.enrolledAt = enrolledAt;
    }

}
