//package ntut.teamFounder.Handler;
//
//import ntut.teamFounder.DAO.InvitationDAO;
//import ntut.teamFounder.DAO.StudentDAO;
//import ntut.teamFounder.DAO.TeamDAO;
//import ntut.teamFounder.Domain.Invitation;
//import ntut.teamFounder.Domain.Student;
//import ntut.teamFounder.Domain.Skill;
//import org.junit.jupiter.api.Test;
//import org.mockito.Mockito;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
//import org.springframework.boot.test.mock.mockito.MockBean;
//import org.springframework.test.web.servlet.MockMvc;
//import java.util.*;
//
//import static org.mockito.ArgumentMatchers.*;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
//
//@WebMvcTest(InvitationHandler.class)
//public class InvitationHandlerTest {
//
//    @Autowired
//    private MockMvc mockMvc;
//
//    @MockBean
//    private InvitationDAO invitationDAO;
//
//    @MockBean
//    private StudentDAO studentDAO;
//
//    @MockBean
//    private TeamDAO teamDAO;
//
//    @Test
//    void testRejectInvitation_Success() throws Exception {
//        Mockito.when(invitationDAO.updateInvitationStatus(1L, 2)).thenReturn(1);
//
//        mockMvc.perform(put("/api/invitations/1/reject"))
//                .andExpect(status().isOk())
//                .andExpect(content().string("Invitation rejected successfully."));
//    }
//
//    @Test
//    void testRejectInvitation_NotFound() throws Exception {
//        Mockito.when(invitationDAO.updateInvitationStatus(999L, 2)).thenReturn(0);
//
//        mockMvc.perform(put("/api/invitations/999/reject"))
//                .andExpect(status().isBadRequest())
//                .andExpect(content().string("Invitation not found or already handled."));
//    }
//
//    @Test
//    void testRejectInvitation_Exception() throws Exception {
//        Mockito.when(invitationDAO.updateInvitationStatus(1L, 2))
//                .thenThrow(new RuntimeException("Database error"));
//
//        mockMvc.perform(put("/api/invitations/1/reject"))
//                .andExpect(status().isBadRequest())
//                .andExpect(content().string(org.hamcrest.Matchers.containsString("Failed to reject invitation")));
//    }
//
//    @Test
//    void testAcceptInvitation_Success_SenderHasTeam() throws Exception {
//        Invitation invitation = new Invitation();
//        Mockito.when(invitationDAO.getInvitationById(1L)).thenReturn(invitation);
//        Mockito.when(teamDAO.getTeamIdByUserAndCourse(200L, "CS101")).thenReturn(null); // Receiver not in team
//        Mockito.when(teamDAO.getTeamIdByUserAndCourse(100L, "CS101")).thenReturn(5L); // Sender has team
//        Mockito.when(teamDAO.addUserToTeam(5L, 200L)).thenReturn(1);
//        Mockito.when(invitationDAO.updateInvitationStatus(1L, 1)).thenReturn(1);
//
//        mockMvc.perform(put("/api/invitations/1/accept"))
//                .andExpect(status().isOk())
//                .andExpect(content().string("Invitation accepted and team updated successfully."));
//    }
//
//    @Test
//    void testAcceptInvitation_Success_CreateNewTeam() throws Exception {
//        Invitation invitation = new Invitation();
//        Mockito.when(invitationDAO.getInvitationById(1L)).thenReturn(invitation);
//        Mockito.when(teamDAO.getTeamIdByUserAndCourse(200L, "CS101")).thenReturn(null); // Receiver not in team
//        Mockito.when(teamDAO.getTeamIdByUserAndCourse(100L, "CS101")).thenReturn(null); // Sender not in team
//        Mockito.when(teamDAO.createTeam("CS101")).thenReturn(10L);
//        Mockito.when(teamDAO.addUserToTeam(10L, 100L)).thenReturn(1);
//        Mockito.when(teamDAO.addUserToTeam(10L, 200L)).thenReturn(1);
//        Mockito.when(invitationDAO.updateInvitationStatus(1L, 1)).thenReturn(1);
//
//        mockMvc.perform(put("/api/invitations/1/accept"))
//                .andExpect(status().isOk())
//                .andExpect(content().string("Invitation accepted and team updated successfully."));
//    }
//
//    @Test
//    void testAcceptInvitation_InvitationNotFound() throws Exception {
//        Mockito.when(invitationDAO.getInvitationById(999L)).thenReturn(null);
//
//        mockMvc.perform(put("/api/invitations/999/accept"))
//                .andExpect(status().isBadRequest())
//                .andExpect(content().string("Invitation not found."));
//    }
//
//    @Test
//    void testAcceptInvitation_ReceiverAlreadyInTeam() throws Exception {
//        Invitation invitation = new Invitation(1L, 100L, 200L, "CS101", "Join my team", 0);
//        Mockito.when(invitationDAO.getInvitationById(1L)).thenReturn(invitation);
//        Mockito.when(teamDAO.getTeamIdByUserAndCourse(200L, "CS101")).thenReturn(3L); // Receiver already in team
//
//        mockMvc.perform(put("/api/invitations/1/accept"))
//                .andExpect(status().isBadRequest())
//                .andExpect(content().string("Receiver is already in a team for this course."));
//    }
//
//    @Test
//    void testGetInvitations_Success() throws Exception {
//        Invitation invitation1 = new Invitation(1L, 100L, 200L, "CS101", "Join team", 0);
//        Invitation invitation2 = new Invitation(2L, 101L, 200L, "CS101", "Another invite", 0);
//        List<Invitation> invitations = Arrays.asList(invitation1, invitation2);
//
//        Student student1 = new Student(100L, "alice");
//        Student student2 = new Student(101L, "bob");
//        student1.setSkills(Arrays.asList(1L, 2L));
//        student2.setSkills(Arrays.asList(2L, 3L));
//
//        Skill skill1 = new Skill(1L, "Java");
//        Skill skill2 = new Skill(2L, "Python");
//        Skill skill3 = new Skill(3L, "React");
//
//        Mockito.when(invitationDAO.getInvitations("CS101", 200L)).thenReturn(invitations);
//        Mockito.when(studentDAO.getStudentById(100L)).thenReturn(student1);
//        Mockito.when(studentDAO.getStudentById(101L)).thenReturn(student2);
//        Mockito.when(studentDAO.getSkillsById(100L)).thenReturn(Arrays.asList(1L, 2L));
//        Mockito.when(studentDAO.getSkillsById(101L)).thenReturn(Arrays.asList(2L, 3L));
//        Mockito.when(studentDAO.getSkillById(1L)).thenReturn(skill1);
//        Mockito.when(studentDAO.getSkillById(2L)).thenReturn(skill2);
//        Mockito.when(studentDAO.getSkillById(3L)).thenReturn(skill3);
//
//        mockMvc.perform(get("/api/invitations/CS101/invitations/200"))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.length()").value(2))
//                .andExpect(jsonPath("$[0].senderId").value(100))
//                .andExpect(jsonPath("$[1].senderId").value(101));
//    }
//
//    @Test
//    void testGetInvitations_Exception() throws Exception {
//        Mockito.when(invitationDAO.getInvitations("CS101", 200L))
//                .thenThrow(new RuntimeException("Database error"));
//
//        mockMvc.perform(get("/api/invitations/CS101/invitations/200"))
//                .andExpect(status().isBadRequest())
//                .andExpect(content().string(org.hamcrest.Matchers.containsString("Failed to get invitations")));
//    }
//
//    @Test
//    void testSendInvitation_Success() throws Exception {
//        Mockito.doNothing().when(invitationDAO).createInvitation(100, 200, "CS101", "Join my team", 0);
//
//        mockMvc.perform(post("/api/invitations")
//                        .param("senderId", "100")
//                        .param("receiverId", "200")
//                        .param("courseCode", "CS101")
//                        .param("message", "Join my team"))
//                .andExpect(status().isOk())
//                .andExpect(content().string("Invitation created successfully."));
//    }
//
//    @Test
//    void testSendInvitation_SameUser() throws Exception {
//        mockMvc.perform(post("/api/invitations")
//                        .param("senderId", "100")
//                        .param("receiverId", "100")
//                        .param("courseCode", "CS101")
//                        .param("message", "Join my team"))
//                .andExpect(status().isBadRequest())
//                .andExpect(content().string("Sender and Receiver are the same."));
//    }
//
//    @Test
//    void testSendInvitation_Exception() throws Exception {
//        Mockito.doThrow(new RuntimeException("Database error"))
//                .when(invitationDAO).createInvitation(100, 200, "CS101", "Join my team", 0);
//
//        mockMvc.perform(post("/api/invitations")
//                        .param("senderId", "100")
//                        .param("receiverId", "200")
//                        .param("courseCode", "CS101")
//                        .param("message", "Join my team"))
//                .andExpect(status().isBadRequest())
//                .andExpect(content().string(org.hamcrest.Matchers.containsString("Failed to create invitation")));
//    }
//
//    @Test
//    void testSendInvitation_WithCustomStatus() throws Exception {
//        Mockito.doNothing().when(invitationDAO).createInvitation(100, 200, "CS101", "Join my team", 1);
//
//        mockMvc.perform(post("/api/invitations")
//                        .param("senderId", "100")
//                        .param("receiverId", "200")
//                        .param("courseCode", "CS101")
//                        .param("message", "Join my team")
//                        .param("status", "1"))
//                .andExpect(status().isOk())
//                .andExpect(content().string("Invitation created successfully."));
//    }
//}