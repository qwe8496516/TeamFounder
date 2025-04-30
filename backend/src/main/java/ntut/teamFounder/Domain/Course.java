package ntut.teamFounder.Domain;

import lombok.Getter;
import lombok.Setter;

import java.util.HashMap;
import java.util.Map;

@Getter
@Setter

public class Course {
    private String courseCode;
    private String name;
    private String professorId;
    private int academicYear;
    private int semester;
    private String description;

    public Course(String courseCode, String name, String professorId, int academicYear, int semester, String description) {
        this.courseCode = courseCode;
        this.name = name;
        this.professorId = professorId;
        this.academicYear = academicYear;
        this.semester = semester;
        this.description = description;
    }

    public Map<String, Object> toMap() {
        Map<String, Object> map = new HashMap<>();
        map.put("courseCode", this.getCourseCode());
        map.put("name", this.getName());
        map.put("professorId", this.getProfessorId());
        map.put("academicYear", this.getAcademicYear());
        map.put("semester", this.getSemester());
        map.put("description", this.getDescription());
        return map;
    }

}
