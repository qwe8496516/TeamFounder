package ntut.teamFounder.DAO;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;

@Repository
public class TeamDAO {
    private final JdbcTemplate jdbcTemplate;

    public TeamDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // 1. 查詢 user 在某課程的 teamId
    public Long getTeamIdByUserAndCourse(Long userId, String courseCode) {
        String sql = "SELECT t.id " +
                "FROM team t " +
                "JOIN team_member tm ON t.id = tm.team_id " +
                "WHERE tm.user_id = ? AND t.course_code = ?";
        try {
            return jdbcTemplate.queryForObject(sql, new Object[]{userId, courseCode}, Long.class);
        } catch (Exception e) {
            // 查無資料時回傳 null
            return null;
        }
    }

    // 2. 建立新 team，回傳 team id
    public Long createTeam(String courseCode) {
        String sql = "INSERT INTO team (course_code) VALUES (?)";
        jdbcTemplate.update(sql, courseCode);

        // 取得剛剛插入的 team id (假設 id 為自動遞增)
        String getIdSql = "SELECT LAST_INSERT_ID()";
        return jdbcTemplate.queryForObject(getIdSql, Long.class);
    }

    // 3. 將 user 加入 team
    public int addUserToTeam(Long teamId, Long userId) {
        String sql = "INSERT INTO team_member (team_id, user_id) VALUES (?, ?)";
        return jdbcTemplate.update(sql, teamId, userId);
    }

    // (可選) 查詢 team 是否存在
    public boolean exists(Long teamId) {
        String sql = "SELECT COUNT(*) FROM team WHERE id = ?";
        Integer count = jdbcTemplate.queryForObject(sql, new Object[]{teamId}, Integer.class);
        return count != null && count > 0;
    }
}
