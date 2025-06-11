package ntut.teamFounder.Handler;

import io.swagger.v3.oas.annotations.tags.Tag;
import ntut.teamFounder.DAO.InvitationDAO;
import ntut.teamFounder.DAO.TeamConfigurationDAO;
import ntut.teamFounder.DAO.TeamDAO;
import ntut.teamFounder.Domain.Team;
import ntut.teamFounder.Domain.TeamConfiguration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@Tag(name = "Team API")
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/teams")
public class TeamHandler {
    private final TeamDAO teamDAO;
    private final TeamConfigurationDAO teamConfigurationDAO;


    @Autowired
    public TeamHandler(TeamDAO teamDAO, TeamConfigurationDAO teamConfigurationDAO) {
        this.teamDAO = teamDAO;
        this.teamConfigurationDAO = teamConfigurationDAO;
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
}
