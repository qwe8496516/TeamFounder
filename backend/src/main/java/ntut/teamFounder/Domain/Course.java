package ntut.teamFounder.Domain;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter

public class Course {
    private Long id;
    private String courseName;
    private Long professorId;
    private int academicYear;
    private int semester;
    private String description;

    public Course(Long id, String courseName, Long professorId, int academicYear, int semester, String description) {
        this.id = id;
        this.courseName = courseName;
        this.professorId = professorId;
        this.academicYear = academicYear;
        this.semester = semester;
        this.description = description;
    }

}
