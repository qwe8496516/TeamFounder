package ntut.teamFounder.Handler;

import io.swagger.v3.oas.annotations.tags.Tag;
import ntut.teamFounder.DAO.TeamConfigurationDAO;
import ntut.teamFounder.Domain.Student;
import ntut.teamFounder.Domain.TeamConfiguration;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@RestController
@Tag(name = "Team Configuration API")
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/teamConfig")
public class TeamConfigurationHandler {

    private final TeamConfigurationDAO teamConfigurationDAO;

    public TeamConfigurationHandler(TeamConfigurationDAO teamConfigurationDAO) {
        this.teamConfigurationDAO = teamConfigurationDAO;
    }

    @GetMapping("/{courseCode}")
    public ResponseEntity<?> getTeamConfigByCourseCode(@PathVariable String courseCode) {
        try {
            TeamConfiguration teamConfiguration = teamConfigurationDAO.getTeamConfigByCourseCode(courseCode);
            Map<String, Object> teamConfigMap = teamConfiguration.toMap();
            return ResponseEntity.ok(teamConfigMap);
        } catch (Exception e) {
            return ResponseEntity.ok("No Team Config Found." + e.getMessage());
        }
    }

    @PostMapping("/{courseCode}/status")
    public ResponseEntity<?> updateTeamConfigStatus(@PathVariable String courseCode) {
        try {
            boolean status = true;
            int updated = teamConfigurationDAO.updateTeamConfigStatus(courseCode, status);
            if (updated > 0) {
                Map<String, String> map = new HashMap<>();
                map.put("message", "Team Configuration Updated");
                return ResponseEntity.ok(map);
            } else {
                return ResponseEntity.badRequest().body("Update failed.");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating team config : " + e.getMessage() + ".");
        }
    }

}
