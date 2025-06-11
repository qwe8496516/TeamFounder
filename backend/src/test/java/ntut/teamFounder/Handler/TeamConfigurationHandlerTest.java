package ntut.teamFounder.Handler;

import ntut.teamFounder.Handler.TeamConfigurationHandler;
import ntut.teamFounder.DAO.TeamConfigurationDAO;
import ntut.teamFounder.Domain.TeamConfiguration;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import java.text.SimpleDateFormat;
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
    void testGetTeamConfigByCourseCode_found() throws Exception {
        TeamConfiguration config = Mockito.mock(TeamConfiguration.class);
        Map<String, Object> configMap = new HashMap<>();
        configMap.put("courseCode", "CS101");
        Mockito.when(teamConfigurationDAO.getTeamConfigByCourseCode("CS101")).thenReturn(config);
        Mockito.when(config.toMap()).thenReturn(configMap);

        mockMvc.perform(get("/api/teamConfig/CS101"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.courseCode").value("CS101"));
    }

    @Test
    void testGetTeamConfigByCourseCode_notFound() throws Exception {
        Mockito.when(teamConfigurationDAO.getTeamConfigByCourseCode("CS404")).thenThrow(new RuntimeException("not found"));

        mockMvc.perform(get("/api/teamConfig/CS404"))
                .andExpect(status().isOk())
                .andExpect(content().string(org.hamcrest.Matchers.containsString("No Team Config Found.")));
    }

    @Test
    void testUpdateTeamConfigStatus_success() throws Exception {
        TeamConfiguration config = Mockito.mock(TeamConfiguration.class);
        Mockito.when(teamConfigurationDAO.getTeamConfigByCourseCode("CS101")).thenReturn(config);
        Mockito.when(teamConfigurationDAO.updateTeamConfigStatus(eq("CS101"), eq(1))).thenReturn(1);

        mockMvc.perform(post("/api/teamConfig/CS101/status/Ongoing"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Team Configuration Updated"));
    }

    @Test
    void testUpdateTeamConfigStatus_notFound() throws Exception {
        Mockito.when(teamConfigurationDAO.getTeamConfigByCourseCode("CS404")).thenReturn(null);

        mockMvc.perform(post("/api/teamConfig/CS404/status/Ongoing"))
                .andExpect(status().isOk())
                .andExpect(content().string("No Team Config Found"));
    }

    @Test
    void testUpdateTeamConfigStatus_updateFailed() throws Exception {
        TeamConfiguration config = Mockito.mock(TeamConfiguration.class);
        Mockito.when(teamConfigurationDAO.getTeamConfigByCourseCode("CS101")).thenReturn(config);
        Mockito.when(teamConfigurationDAO.updateTeamConfigStatus(eq("CS101"), eq(0))).thenReturn(0);

        mockMvc.perform(post("/api/teamConfig/CS101/status/Closed"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Update failed."));
    }

    // In TeamConfigurationHandlerTest.java
    @Test
    void testCreateTeamConfig_success() throws Exception {
        TeamConfiguration mockConfig = Mockito.mock(TeamConfiguration.class);
        Mockito.when(mockConfig.getCourseCode()).thenReturn("CS101");
        Mockito.when(mockConfig.toMap()).thenReturn(Map.of("courseCode", "CS101"));

        // Fix mocking syntax
        Mockito.doReturn(mockConfig)
                .when(teamConfigurationDAO)
                .createTeamConfiguration(
                        eq("CS101"), anyString(), anyString(),
                        anyBoolean(), anyInt(),
                        anyInt(), anyInt(),
                        any(Date.class), any(Date.class)
                );

        mockMvc.perform(post("/api/teamConfig/create")
                        .param("courseCode", "CS101")
                        .param("sDate", "2025-06-01 00:00:00") // Match controller's format
                        .param("eDate", "2025-06-30 00:00:00"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.courseCode").value("CS101"));
    }

    @Test
    void testUpdateTeamConfiguration_checkConstraintsFail() throws Exception {
        TeamConfiguration config = Mockito.mock(TeamConfiguration.class);
        Mockito.when(teamConfigurationDAO.getTeamConfigByCourseCode("CS101")).thenReturn(config);
        Mockito.when(config.getConfigId()).thenReturn(1L);

        // Simulate checkConstraints returns false
        Mockito.when(config.checkConstraints()).thenReturn(false);

        mockMvc.perform(put("/api/teamConfig/update")
                        .param("courseCode", "CS101")
                        .param("title", "New Title")
                        .param("description", "Desc")
                        .param("formationType", "true")
                        .param("status", "true")
                        .param("minSize", "2")
                        .param("maxSize", "5")
                        .param("sDate", "2025-06-01")
                        .param("eDate", "2025-06-30"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Please check your limitation and try again."));
    }

    @Test
    void testCreateTeamConfig_checkConstraintsFail() throws Exception {
        // Force constraints failure through parameters
        mockMvc.perform(post("/api/teamConfig/create")
                        .param("courseCode", "CS101")
                        .param("minSize", "5")  // Violates minSize < maxSize
                        .param("maxSize", "2")
                        .param("sDate", "2025-06-01")
                        .param("eDate", "2025-06-30"))
                .andExpect(status().isBadRequest());
    }

}

