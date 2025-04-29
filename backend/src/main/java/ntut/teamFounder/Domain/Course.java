package ntut.teamFounder.Domain;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Course {

    private String courseCode;
    private String name;
    private String professorId;
    private String description;
    private String academicYear;
    private String semester;

    public Course(String courseCode, String name, String professorId, String academicYear, String semester, String description) {
        this.courseCode = courseCode;
        this.name = name;
        this.professorId = professorId;
        this.description = description;
        this.academicYear = academicYear;
        this.semester = semester;
    }

}
