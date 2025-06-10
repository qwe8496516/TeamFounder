package ntut.teamFounder.Handler;

import io.swagger.v3.oas.annotations.tags.Tag;
import ntut.teamFounder.DAO.InvitationDAO;
import ntut.teamFounder.DAO.TeamDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@Tag(name = "Team API")
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/teams")
public class TeamHandler {
    private final TeamDAO teamDAO;

    @Autowired
    public TeamHandler(TeamDAO teamDAO) {
        this.teamDAO = teamDAO;
    }

//    @PutMapping("/{teamId}/{userId}/RegisterTeam")
//    public ResponseEntity<?> registerTeam(@PathVariable int teamId, @PathVariable int userId) {
//        teamDAO.updateToReady(teamId, userId);
//    }
}
