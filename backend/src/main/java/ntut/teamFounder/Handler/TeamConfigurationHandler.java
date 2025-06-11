package ntut.teamFounder.Handler;

import io.swagger.v3.oas.annotations.tags.Tag;
import ntut.teamFounder.DAO.TeamConfigurationDAO;
import ntut.teamFounder.Domain.TeamConfiguration;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;
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

    @PostMapping("/{courseCode}/status/{status}")
    public ResponseEntity<?> updateTeamConfigStatus(@PathVariable String courseCode, @PathVariable String status) {
        try {
            int configStatus = 0;
            if (status.equals("POST")) {
                configStatus = 2;
            } else if (status.equals("MID")) {
                configStatus = 1;
            }
            TeamConfiguration teamConfiguration = teamConfigurationDAO.getTeamConfigByCourseCode(courseCode);
            if (teamConfiguration == null) {
                return ResponseEntity.ok("No Team Config Found");
            }
            int updated = teamConfigurationDAO.updateTeamConfigStatus(courseCode, configStatus);
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

    @PutMapping("/update")
    public ResponseEntity<?> updateTeamConfiguration(@RequestParam String courseCode, @RequestParam String title, @RequestParam String description, @RequestParam boolean formationType,
                                                     @RequestParam int status, @RequestParam int minSize, @RequestParam int maxSize, @RequestParam String sDate, @RequestParam String eDate)
    {
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            Date startDate = sdf.parse(sDate);
            Date endDate = sdf.parse(eDate);
            TeamConfiguration teamConfiguration = teamConfigurationDAO.getTeamConfigByCourseCode(courseCode);
            TeamConfiguration newTeamConfiguration = new TeamConfiguration(0L, courseCode, title, description, formationType, status, minSize, maxSize, startDate, endDate);
            boolean isClean = newTeamConfiguration.checkConstraints();
            if (!isClean) {
                return ResponseEntity.badRequest().body("Please check your limitation and try again.");
            }
            if (teamConfiguration == null) {
//                teamConfigurationDAO.createTeamConfiguration(courseCode, title, description, false, false, minSize, maxSize, startDate, endDate);
                return ResponseEntity.badRequest().body("No Team Config Found");
            }
            int updated = teamConfigurationDAO.updateTeamConfiguration(courseCode, title, description, formationType, status, minSize, maxSize, startDate, endDate, teamConfiguration.getConfigId());
            if (updated > 0) {
                Map<String, String> resp = new HashMap<>();
                resp.put("message", "Team Configuration updated successfully.");
                return ResponseEntity.ok(resp);
            } else {
                return ResponseEntity.badRequest().body("Update failed.");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating team config : " + e.getMessage() + ".");
        }
    }

    @PostMapping("/create")
    public ResponseEntity<?> createTeamConfig(@RequestParam String courseCode, @RequestParam String title, @RequestParam String description,
                                              @RequestParam int minSize, @RequestParam int maxSize, @RequestParam String sDate, @RequestParam String eDate)
    {
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            Date startDate = sdf.parse(sDate);
            Date endDate = sdf.parse(eDate);
            TeamConfiguration teamConfiguration = new TeamConfiguration(0L, courseCode, title, description, false, 0, minSize, maxSize, startDate, endDate);
            boolean isClean = teamConfiguration.checkConstraints();
            if (!isClean) {
                return ResponseEntity.badRequest().body("Please check your limitation and try again.");
            }
            teamConfigurationDAO.createTeamConfiguration(courseCode, title, description, false, 0, minSize, maxSize, startDate, endDate);
            return ResponseEntity.ok(teamConfiguration.toMap());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error Creating Team Config : " + e.getMessage() + ".");
        }
    }

}
