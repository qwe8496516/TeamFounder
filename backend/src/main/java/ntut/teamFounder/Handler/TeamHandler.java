package ntut.teamFounder.Handler;

import io.swagger.v3.oas.annotations.tags.Tag;
import ntut.teamFounder.DAO.TeamConfigurationDAO;
import ntut.teamFounder.DAO.TeamDAO;
import ntut.teamFounder.Domain.Team;
import ntut.teamFounder.Domain.TeamConfiguration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import ntut.teamFounder.DAO.StudentDAO;
import ntut.teamFounder.Domain.Student;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@Tag(name = "Team API")
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/team")
public class TeamHandler {

    private final TeamDAO teamDAO;
    private final TeamConfigurationDAO teamConfigurationDAO;
    private final StudentDAO studentDAO;

    @Autowired
    public TeamHandler(TeamDAO teamDAO, TeamConfigurationDAO teamConfigurationDAO, StudentDAO studentDAO) {
        this.teamDAO = teamDAO;
        this.teamConfigurationDAO = teamConfigurationDAO;
        this.studentDAO = studentDAO;
    }

    @PutMapping("/{teamId}/{userId}/RegisterTeam")
    public ResponseEntity<?> registerTeam(@PathVariable int teamId, @PathVariable int userId) {
        teamDAO.setUserReady(teamId, userId);

        boolean formed = false;

        if (teamDAO.areAllMembersReady(teamId)) {
            Team team = teamDAO.loadTeam(teamId);

            TeamConfiguration teamConfiguration = teamConfigurationDAO.loadByCourseCode(team.getCourseCode());
            if (teamConfiguration.validateLegit(team)) {
                team.setFormed(true);
                teamDAO.setTeamLegit(team);
                formed = true;
            }
        }
        Map<String, Object> response = new HashMap<>();
        response.put("teamId", teamId);
        response.put("userId", userId);
        response.put("teamFormed", formed);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{courseCode}/{userId}")
    public ResponseEntity<?> getTeamByCourseCodeAndId(@PathVariable String courseCode, @PathVariable Long userId) {
        try {
            Long teamId = teamDAO.getTeamIdByUserAndCourse(userId, courseCode);
            if (teamId == null) {
                return ResponseEntity.ok("Team not found");
            }
            Team team = teamDAO.getTeamById(teamId);
            team.setMembers(teamDAO.getTeamMembersById(teamId));

            List<Map<String, Object>> map = new ArrayList<>();
            map.add(team.toMap());
            for (Long memberId : team.getMembers()) {
                Student student = studentDAO.getStudentById(memberId);
                map.add(student.toMap());
            }
            return ResponseEntity.ok(map);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed With Message: " + e.getMessage());
        }
    }

}
