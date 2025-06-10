package ntut.teamFounder.Handler;


import io.swagger.v3.oas.annotations.tags.Tag;
import ntut.teamFounder.DAO.InvitationDAO;
import ntut.teamFounder.DAO.TeamDAO;
import ntut.teamFounder.Domain.Invitation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@Tag(name = "Invitation API")
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/invitations")
public class InvitationHandler {
    private final InvitationDAO invitationDAO;
    private final TeamDAO teamDAO;

    @Autowired
    public InvitationHandler(InvitationDAO invitationDAO, TeamDAO teamDAO) {
        this.invitationDAO = invitationDAO;
        this.teamDAO = teamDAO;
    }

    @PutMapping("/{invitationId}/reject")
    public ResponseEntity<?> rejectInvitation(@PathVariable Long invitationId) {
        try {
            int updatedRows = invitationDAO.updateInvitationStatus(invitationId, 2);  // 2 = REJECTED
            if (updatedRows == 0) {
                return ResponseEntity.badRequest().body("Invitation not found or already handled.");
            }
            return ResponseEntity.ok("Invitation rejected successfully.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to reject invitation: " + e.getMessage());
        }
    }

    @PutMapping("/{invitationId}/accept")
    public ResponseEntity<?> acceptInvitation(@PathVariable Long invitationId) {
        try {
            // Step 1: Fetch the invitation
            Invitation invitation = invitationDAO.getInvitationById(invitationId);
            if (invitation == null) {
                return ResponseEntity.badRequest().body("Invitation not found.");
            }

            Long senderId = invitation.getSenderId();
            Long receiverId = invitation.getReceiverId();
            String courseCode = invitation.getCourseCode();

            // Step 2: Check if receiver is already in a team for the course
            Long receiverTeamId = teamDAO.getTeamIdByUserAndCourse(receiverId, courseCode);
            if (receiverTeamId != null) {
                return ResponseEntity.badRequest().body("Receiver is already in a team for this course.");
            }

            // Step 3: Check if sender is in a team
            Long senderTeamId = teamDAO.getTeamIdByUserAndCourse(senderId, courseCode);

            if (senderTeamId != null) {
                // Add receiver to sender's existing team
                teamDAO.addUserToTeam(senderTeamId, receiverId);    //remember to add User to the same chatroom too
            } else {
                // Create a new team and add both users
                Long newTeamId = teamDAO.createTeam(courseCode);
                teamDAO.addUserToTeam(newTeamId, senderId);     //remember to add User to the same chatroom too
                teamDAO.addUserToTeam(newTeamId, receiverId);   //remember to add User to the same chatroom too
            }

            // Step 4: Update invitation status to 'ACCEPTED'
            invitationDAO.updateInvitationStatus(invitationId, 1);

            return ResponseEntity.ok("Invitation accepted and team updated successfully.");

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to accept invitation: " + e.getMessage());
        }
    }





    @PostMapping("")
    public ResponseEntity<?> sendInvitation(
            @RequestParam int senderId,
            @RequestParam int receiverId,
            @RequestParam String courseCode,
            @RequestParam String message,
            @RequestParam(required = false, defaultValue = "0") int status) {
        if (senderId == receiverId) {
            return ResponseEntity.badRequest().body("Sender and Receiver are the same.");
        }
        try {
            invitationDAO.createInvitation(senderId, receiverId, courseCode, message, status);
            return ResponseEntity.ok().body("Invitation created successfully.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to create invitation: " + e.getMessage());
        }
    }
}
