package ntut.teamFounder.DAO;

import ntut.teamFounder.Domain.TeamConfiguration;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;

import java.sql.Date;
import java.sql.ResultSet;
import java.sql.Timestamp;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class TeamConfigurationDAOTest {

    private JdbcTemplate jdbcTemplate;
    private TeamConfigurationDAO dao;

    @BeforeEach
    void setUp() {
        jdbcTemplate = mock(JdbcTemplate.class);
        dao = new TeamConfigurationDAO(jdbcTemplate);
    }

    @Test
    void getTeamConfigByCourseCode_shouldReturnConfig_whenExists() {
        TeamConfiguration expected = dummyConfig();

        when(jdbcTemplate.query(
                eq("SELECT * FROM teamConfiguration WHERE courseCode = ?"),
                ArgumentMatchers.<Object[]>any(),
                ArgumentMatchers.<RowMapper<TeamConfiguration>>any())
        ).thenReturn(List.of(expected));

        TeamConfiguration actual = dao.getTeamConfigByCourseCode("CS101");

        assertNotNull(actual);
        assertEquals(expected.getCourseCode(), actual.getCourseCode());
        assertEquals(expected.getTitle(), actual.getTitle());
    }

    @Test
    void getTeamConfigByCourseCode_shouldReturnNull_whenNotFound() {
        when(jdbcTemplate.query(
                eq("SELECT * FROM teamConfiguration WHERE courseCode = ?"),
                ArgumentMatchers.<Object[]>any(),
                ArgumentMatchers.<RowMapper<TeamConfiguration>>any())
        ).thenReturn(Collections.emptyList());

        TeamConfiguration result = dao.getTeamConfigByCourseCode("CS404");

        assertNull(result);
    }

    @Test
    void updateTeamConfigStatus_shouldReturnAffectedRowCount() {
        when(jdbcTemplate.update(anyString(), anyInt(), anyString())).thenReturn(1);

        int result = dao.updateTeamConfigStatus("CS101", 2);

        assertEquals(1, result);
    }

    @Test
    void createTeamConfiguration_shouldReturnAffectedRowCount() {
        when(jdbcTemplate.update(anyString(), any(), any(), any(), anyBoolean(), anyInt(), anyInt(), any(), any()))
                .thenReturn(1);

        int result = dao.createTeamConfiguration(
                "CS102", "Team Config", "Description", true, 1, 3, 5,
                new Date(System.currentTimeMillis()), new Date(System.currentTimeMillis())
        );

        assertEquals(0, result);
    }

    @Test
    void updateTeamConfiguration_shouldReturnAffectedRowCount() {
        when(jdbcTemplate.update(anyString(), any(), any(), anyBoolean(), anyInt(), anyInt(), anyInt(), any(), any(), any()))
                .thenReturn(1);

        int result = dao.updateTeamConfiguration(
                "CS102", "Updated Title", "Updated Desc", false, 2, 2, 4,
                new Date(System.currentTimeMillis()), new Date(System.currentTimeMillis()), 10L
        );

        assertEquals(1, result);
    }

    @Test
    void loadByCourseCode_shouldReturnConfig_whenFound() {
        TeamConfiguration expected = dummyConfig();

        when(jdbcTemplate.queryForObject(
                eq("SELECT * FROM teamConfiguration WHERE courseCode = ?"),
                ArgumentMatchers.<RowMapper<TeamConfiguration>>any(),
                eq("CS101"))
        ).thenReturn(expected);

        TeamConfiguration actual = dao.loadByCourseCode("CS101");

        assertNotNull(actual);
        assertEquals(expected.getConfigId(), actual.getConfigId());
    }

    @Test
    void mapRowToTeamConfiguration_shouldMapCorrectly() throws Exception {
        ResultSet rs = mock(ResultSet.class);
        Timestamp now = new Timestamp(System.currentTimeMillis());

        when(rs.getLong("configId")).thenReturn(1L);
        when(rs.getString("courseCode")).thenReturn("CS101");
        when(rs.getString("title")).thenReturn("Title");
        when(rs.getString("description")).thenReturn("Description");
        when(rs.getBoolean("formationType")).thenReturn(true);
        when(rs.getInt("status")).thenReturn(1);
        when(rs.getInt("minSize")).thenReturn(3);
        when(rs.getInt("maxSize")).thenReturn(5);
        when(rs.getTimestamp("startDate")).thenReturn(now);
        when(rs.getTimestamp("endDate")).thenReturn(now);

        // Access private method using reflection
        var method = TeamConfigurationDAO.class.getDeclaredMethod("mapRowToTeamConfiguration", ResultSet.class);
        method.setAccessible(true);
        TeamConfiguration config = (TeamConfiguration) method.invoke(dao, rs);

        assertNotNull(config);
        assertEquals("CS101", config.getCourseCode());
        assertEquals("Title", config.getTitle());
        assertEquals(1L, config.getConfigId());
    }

    private TeamConfiguration dummyConfig() {
        return new TeamConfiguration(
                1L, "CS101", "Project Title", "Project Description", true,
                1, 2, 4,
                new Date(System.currentTimeMillis()),
                new Date(System.currentTimeMillis())
        );
    }
}
