package ntut.teamFounder.DAO;

import ntut.teamFounder.Domain.Team;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Map;

@Repository
public class TeamDAO {
    private final JdbcTemplate jdbcTemplate;

    public TeamDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Long getTeamIdByUserAndCourse(Long userId, String courseCode) {
        String sql = "SELECT t.id " +
                "FROM team t " +
                "JOIN team_member tm ON t.id = tm.team_id " +
                "WHERE tm.user_id = ? AND t.course_code = ?";
        try {
            return jdbcTemplate.queryForObject(sql, new Object[]{userId, courseCode}, Long.class);
        } catch (Exception e) {
            return null;
        }
    }

    public Team getTeamById (Long teamId) {
        String sql = "SELECT * FROM team WHERE id = ?";
        return jdbcTemplate.queryForObject(sql, new Object[]{teamId}, (rs, rowNum) ->
            new Team(
                rs.getString("course_code"),
                rs.getLong("id"),
                rs.getBoolean("legit")
            )
        );
    }

    public List<Long> getTeamMembersById (Long teamId) {
        String sql = "SELECT * FROM team_member WHERE team_id = ?";
        return jdbcTemplate.query(sql, new Object[]{teamId}, (rs, rowNum) ->
                rs.getLong("user_id")
        );
    }

    public Long createTeam(String courseCode) {
        String sql = "INSERT INTO team (course_code) VALUES (?)";
        jdbcTemplate.update(sql, courseCode);

        String getIdSql = "SELECT LAST_INSERT_ID()";
        return jdbcTemplate.queryForObject(getIdSql, Long.class);
    }

    public int addUserToTeam(Long teamId, Long userId) {
        String sql = "INSERT INTO team_member (team_id, user_id) VALUES (?, ?)";
        return jdbcTemplate.update(sql, teamId, userId);
    }

    public boolean exists(Long teamId) {
        String sql = "SELECT COUNT(*) FROM team WHERE id = ?";
        Integer count = jdbcTemplate.queryForObject(sql, new Object[]{teamId}, Integer.class);
        return count != null && count > 0;
    }

    public void setUserReady(int teamId, int userId) {
        String sql = "UPDATE team_member SET ready = 1 WHERE team_id = ? AND user_id = ?";
        jdbcTemplate.update(sql, teamId, userId);
    }

    public boolean areAllMembersReady(int teamId) {
        String sql = "SELECT COUNT(*) FROM team_member WHERE team_id = ? AND ready = 0";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, teamId);
        return count != null && count == 0;
    }

    public Team loadTeam(int teamId) {
        String teamSql = "SELECT id, course_code FROM team WHERE id = ?";
        Map<String, Object> teamRow = jdbcTemplate.queryForMap(teamSql, teamId);

        String courseCode = (String) teamRow.get("course_code");
        Long id = ((Long) teamRow.get("id"));

        String memberSql = "SELECT user_id FROM team_member WHERE team_id = ?";
        List<Long> memberIds = jdbcTemplate.query(memberSql, (rs, rowNum) -> rs.getLong("user_id"), teamId);

        Team team = new Team(courseCode, id, false);

        for (Long userId : memberIds) {
            team.addMember(userId);
        }

        return team;
    }

    public void setTeamLegit(Team team) {
        String sql = "UPDATE team SET legit = TRUE, updatedAt = CURRENT_TIMESTAMP WHERE id = ?";
        jdbcTemplate.update(sql, team.getTeamId());
    }

}
