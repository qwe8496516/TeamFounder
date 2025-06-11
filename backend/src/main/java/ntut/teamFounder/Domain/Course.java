package ntut.teamFounder.Domain;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
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
    private boolean teamStatus;
    private int courseStatus;
    @Getter
    private List<Team> teams;

    public Course(String courseCode, String name, String professorId, int academicYear, int semester,
                  String description, int courseStatus) {
        this.courseCode = courseCode;
        this.name = name;
        this.professorId = professorId;
        this.academicYear = academicYear;
        this.semester = semester;
        this.description = description;
        this.courseStatus = courseStatus;
        this.teams = new ArrayList<Team>();
    }

    public Map<String, Object> toMap() {
        Map<String, Object> map = new HashMap<>();
        map.put("courseCode", courseCode);
        map.put("name", name);
        map.put("professorId", professorId);
        map.put("academicYear", academicYear);
        map.put("semester", semester);
        map.put("description", description);
        map.put("courseStatus", courseStatus);
        return map;
    }

    public void addTeam(Team team) {
        teams.add(team);
    }

}
