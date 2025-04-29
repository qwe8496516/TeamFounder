package ntut.teamFounder.Domain;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter

public class Course {
    private String courseCode;
    private String name;
    private Long professorId;
    private int academicYear;
    private int semester;
    private String description;

    public Course(String courseCode, String name, Long professorId, int academicYear, int semester, String description) {
        this.courseCode = courseCode;
        this.name = name;
        this.professorId = professorId;
        this.academicYear = academicYear;
        this.semester = semester;
        this.description = description;
    }

}
