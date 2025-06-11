package ntut.teamFounder.DAO;

import ntut.teamFounder.Domain.Team;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(org.mockito.junit.jupiter.MockitoExtension.class)
class TeamDAOTest {

    @Mock
    private JdbcTemplate jdbcTemplate;

    private TeamDAO teamDAO;

    @BeforeEach
    void setUp() {
        teamDAO = new TeamDAO(jdbcTemplate);
    }

    @Test
    void getTeamIdByUserAndCourse_shouldReturnTeamId_whenFound() {
        Long expectedTeamId = 123L;
        when(jdbcTemplate.queryForObject(anyString(), any(Object[].class), eq(Long.class)))
                .thenReturn(expectedTeamId);

        Long result = teamDAO.getTeamIdByUserAndCourse(1L, "CS101");
        assertEquals(expectedTeamId, result);
    }

    @Test
    void getTeamIdByUserAndCourse_shouldReturnNull_whenNotFound() {
        when(jdbcTemplate.queryForObject(anyString(), any(Object[].class), eq(Long.class)))
                .thenThrow(EmptyResultDataAccessException.class);

        Long result = teamDAO.getTeamIdByUserAndCourse(1L, "CS999");
        assertNull(result);
    }

    @Test
    void getTeamById_shouldReturnTeam() throws Exception {
        Long teamId = 1L;
        String courseCode = "CS101";
        Boolean legit = true;

        when(jdbcTemplate.queryForObject(eq("SELECT * FROM team WHERE id = ?"),
                any(Object[].class), any(RowMapper.class)))
                .thenAnswer(invocation -> {
                    RowMapper<Team> mapper = invocation.getArgument(2);
                    ResultSet rs = mock(ResultSet.class);
                    when(rs.getString("courseCode")).thenReturn(courseCode);
                    when(rs.getLong("id")).thenReturn(teamId);
                    when(rs.getBoolean("legit")).thenReturn(legit);
                    return mapper.mapRow(rs, 0);
                });

        Team result = teamDAO.getTeamById(teamId);
        assertEquals(courseCode, result.getCourseCode());
        assertEquals(teamId, result.getTeamId());
    }

    @Test
    void getTeamMembersById_shouldReturnUserIds() {
        when(jdbcTemplate.query(anyString(), any(Object[].class), any(RowMapper.class)))
                .thenReturn(List.of(1L, 2L, 3L));

        List<Long> members = teamDAO.getTeamMembersById(1L);
        assertEquals(3, members.size());
        assertTrue(members.contains(2L));
    }

    @Test
    void createTeam_shouldInsertAndReturnId() {
        when(jdbcTemplate.update(anyString(), eq("CS101"))).thenReturn(1);
        when(jdbcTemplate.queryForObject(eq("SELECT LAST_INSERT_ID()"), eq(Long.class)))
                .thenReturn(10L);

        Long id = teamDAO.createTeam("CS101");
        assertEquals(10L, id);
    }

    @Test
    void addUserToTeam_shouldReturnUpdateCount() {
        when(jdbcTemplate.update(anyString(), eq(1L), eq(2L))).thenReturn(1);
        int result = teamDAO.addUserToTeam(1L, 2L);
        assertEquals(1, result);
    }

    @Test
    void exists_shouldReturnTrueWhenCountGreaterThanZero() {
        when(jdbcTemplate.queryForObject(anyString(), any(Object[].class), eq(Integer.class)))
                .thenReturn(1);
        assertTrue(teamDAO.exists(1L));
    }

    @Test
    void exists_shouldReturnFalseWhenCountIsZero() {
        when(jdbcTemplate.queryForObject(anyString(), any(Object[].class), eq(Integer.class)))
                .thenReturn(0);
        assertFalse(teamDAO.exists(999L));
    }

    @Test
    void setUserReady_shouldUpdateReadyFlag() {
        when(jdbcTemplate.update(anyString(), eq(1), eq(2))).thenReturn(1);
        assertDoesNotThrow(() -> teamDAO.setUserReady(1, 2));
    }

    @Test
    void areAllMembersReady_shouldReturnTrueIfCountIsZero() {
        when(jdbcTemplate.queryForObject(anyString(), eq(Integer.class), eq(1)))
                .thenReturn(0);
        assertTrue(teamDAO.areAllMembersReady(1));
    }

    @Test
    void areAllMembersReady_shouldReturnFalseIfSomeNotReady() {
        when(jdbcTemplate.queryForObject(anyString(), eq(Integer.class), eq(1)))
                .thenReturn(2);
        assertFalse(teamDAO.areAllMembersReady(1));
    }

    @Test
    void loadTeam_shouldLoadTeamAndMembers() {
        Map<String, Object> teamMap = Map.of("id", 1L, "courseCode", "CS101");
        List<Long> userIds = List.of(1L, 2L);

        when(jdbcTemplate.queryForMap(anyString(), eq(1))).thenReturn(teamMap);
        when(jdbcTemplate.query(anyString(), any(RowMapper.class), eq(1)))
                .thenReturn(userIds);

        Team team = teamDAO.loadTeam(1);
        assertEquals("CS101", team.getCourseCode());
        assertEquals(2, team.getMembers().size());
        assertTrue(team.getMembers().contains(1L));
    }

    @Test
    void setTeamLegit_shouldUpdateLegitFlag() {
        Team team = new Team("CS101", 1L, false);
        when(jdbcTemplate.update(anyString(), eq(1L))).thenReturn(1);
        assertDoesNotThrow(() -> teamDAO.setTeamLegit(team));
    }
}
