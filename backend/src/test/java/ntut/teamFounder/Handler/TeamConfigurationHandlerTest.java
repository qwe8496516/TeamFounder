package ntut.teamFounder.Handler;

import ntut.teamFounder.Handler.TeamConfigurationHandler;
import ntut.teamFounder.DAO.TeamConfigurationDAO;
import ntut.teamFounder.Domain.TeamConfiguration;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MockMvc;
import java.util.*;

import static org.mockito.ArgumentMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TeamConfigurationHandler.class)
public class TeamConfigurationHandlerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TeamConfigurationDAO teamConfigurationDAO;

    @Test
    void testGetTeamConfigByCourseCode_Success() throws Exception {
        TeamConfiguration config = Mockito.mock(TeamConfiguration.class);
        Map<String, Object> configMap = new HashMap<>();
        configMap.put("courseCode", "CS101");
        configMap.put("title", "Team Project");

        Mockito.when(teamConfigurationDAO.getTeamConfigByCourseCode("CS101")).thenReturn(config);
        Mockito.when(config.toMap()).thenReturn(configMap);

        mockMvc.perform(get("/api/teamConfig/CS101"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.courseCode").value("CS101"))
                .andExpect(jsonPath("$.title").value("Team Project"));
    }

    @Test
    void testGetTeamConfigByCourseCode_NotFound() throws Exception {
        Mockito.when(teamConfigurationDAO.getTeamConfigByCourseCode("CS404"))
                .thenThrow(new RuntimeException("Config not found"));

        mockMvc.perform(get("/api/teamConfig/CS404"))
                .andExpect(status().isOk())
                .andExpect(content().string(org.hamcrest.Matchers.containsString("No Team Config Found.")));
    }

    @Test
    void testUpdateTeamConfigStatus_POST() throws Exception {
        TeamConfiguration config = Mockito.mock(TeamConfiguration.class);
        Mockito.when(teamConfigurationDAO.getTeamConfigByCourseCode("CS101")).thenReturn(config);
        Mockito.when(teamConfigurationDAO.updateTeamConfigStatus("CS101", 2)).thenReturn(1);

        mockMvc.perform(post("/api/teamConfig/CS101/status/POST"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Team Configuration Updated"));
    }

    @Test
    void testUpdateTeamConfigStatus_MID() throws Exception {
        TeamConfiguration config = Mockito.mock(TeamConfiguration.class);
        Mockito.when(teamConfigurationDAO.getTeamConfigByCourseCode("CS101")).thenReturn(config);
        Mockito.when(teamConfigurationDAO.updateTeamConfigStatus("CS101", 1)).thenReturn(1);

        mockMvc.perform(post("/api/teamConfig/CS101/status/MID"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Team Configuration Updated"));
    }

    @Test
    void testUpdateTeamConfigStatus_ConfigNotFound() throws Exception {
        Mockito.when(teamConfigurationDAO.getTeamConfigByCourseCode("CS404")).thenReturn(null);

        mockMvc.perform(post("/api/teamConfig/CS404/status/POST"))
                .andExpect(status().isOk())
                .andExpect(content().string("No Team Config Found"));
    }

    @Test
    void testUpdateTeamConfigStatus_UpdateFailed() throws Exception {
        TeamConfiguration config = Mockito.mock(TeamConfiguration.class);
        Mockito.when(teamConfigurationDAO.getTeamConfigByCourseCode("CS101")).thenReturn(config);
        Mockito.when(teamConfigurationDAO.updateTeamConfigStatus("CS101", 2)).thenReturn(0);

        mockMvc.perform(post("/api/teamConfig/CS101/status/POST"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Update failed."));
    }

    @Test
    void testUpdateTeamConfiguration_Success() throws Exception {
        TeamConfiguration existingConfig = Mockito.mock(TeamConfiguration.class);
        Mockito.when(teamConfigurationDAO.getTeamConfigByCourseCode("CS101")).thenReturn(existingConfig);
        Mockito.when(existingConfig.getConfigId()).thenReturn(1L);

        Mockito.when(teamConfigurationDAO.updateTeamConfiguration(
                eq("CS101"), eq("New Title"), eq("New Desc"),
                eq(true), eq(1), eq(2), eq(5),
                any(), any(), eq(1L)
        )).thenReturn(1);

        mockMvc.perform(put("/api/teamConfig/update")
                        .param("courseCode", "CS101")
                        .param("title", "New Title")
                        .param("description", "New Desc")
                        .param("formationType", "true")
                        .param("status", "1")
                        .param("minSize", "2")
                        .param("maxSize", "5")
                        .param("sDate", "2025-06-01")
                        .param("eDate", "2025-06-30"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Team Configuration updated successfully."));
    }

    @Test
    void testUpdateTeamConfiguration_ConstraintsFail() throws Exception {
        TeamConfiguration existingConfig = Mockito.mock(TeamConfiguration.class);
        Mockito.when(teamConfigurationDAO.getTeamConfigByCourseCode("CS101")).thenReturn(existingConfig);

        mockMvc.perform(put("/api/teamConfig/update")
                        .param("courseCode", "CS101")
                        .param("title", "Title")
                        .param("description", "Desc")
                        .param("formationType", "true")
                        .param("status", "1")
                        .param("minSize", "10")  // Invalid: minSize > maxSize
                        .param("maxSize", "5")
                        .param("sDate", "2025-06-01")
                        .param("eDate", "2025-06-30"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Please check your limitation and try again."));
    }

    @Test
    void testUpdateTeamConfiguration_ConfigNotFound() throws Exception {
        Mockito.when(teamConfigurationDAO.getTeamConfigByCourseCode("CS404")).thenReturn(null);

        mockMvc.perform(put("/api/teamConfig/update")
                        .param("courseCode", "CS404")
                        .param("title", "Title")
                        .param("description", "Desc")
                        .param("formationType", "true")
                        .param("status", "1")
                        .param("minSize", "2")
                        .param("maxSize", "5")
                        .param("sDate", "2025-06-01")
                        .param("eDate", "2025-06-30"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("No Team Config Found"));
    }

    @Test
    void testCreateTeamConfig_Success() throws Exception {
        Mockito.when(teamConfigurationDAO.createTeamConfiguration(
                eq("CS101"), eq("New Course"), eq("Description"),
                eq(false), eq(0), eq(2), eq(5),
                any(), any()
        )).thenReturn(1);

        mockMvc.perform(post("/api/teamConfig/create")
                        .param("courseCode", "CS101")
                        .param("title", "New Course")
                        .param("description", "Description")
                        .param("minSize", "2")
                        .param("maxSize", "5")
                        .param("sDate", "2025-06-01 00:00:00")
                        .param("eDate", "2025-06-30 00:00:00"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.description").value("Description"))
                .andExpect(jsonPath("$.minSize").value(2))
                .andExpect(jsonPath("$.maxSize").value(5));
    }


    @Test
    void testCreateTeamConfig_ConstraintsFail() throws Exception {
        mockMvc.perform(post("/api/teamConfig/create")
                        .param("courseCode", "CS101")
                        .param("title", "Course")
                        .param("description", "Desc")
                        .param("minSize", "10")  // Invalid: minSize > maxSize
                        .param("maxSize", "5")
                        .param("sDate", "2025-06-01 00:00:00")
                        .param("eDate", "2025-06-30 00:00:00"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Please check your limitation and try again."));
    }

    @Test
    void testCreateTeamConfig_InvalidDateFormat() throws Exception {
        mockMvc.perform(post("/api/teamConfig/create")
                        .param("courseCode", "CS101")
                        .param("title", "Course")
                        .param("description", "Desc")
                        .param("minSize", "2")
                        .param("maxSize", "5")
                        .param("sDate", "invalid-date")
                        .param("eDate", "2025-06-30 00:00:00"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string(org.hamcrest.Matchers.containsString("Error Creating Team Config")));
    }

    @Test
    void testUpdateTeamConfiguration_InvalidDateFormat() throws Exception {
        mockMvc.perform(put("/api/teamConfig/update")
                        .param("courseCode", "CS101")
                        .param("title", "Title")
                        .param("description", "Desc")
                        .param("formationType", "true")
                        .param("status", "1")
                        .param("minSize", "2")
                        .param("maxSize", "5")
                        .param("sDate", "invalid-date")
                        .param("eDate", "2025-06-30"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string(org.hamcrest.Matchers.containsString("Error updating team config")));
    }
}
