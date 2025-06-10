package ntut.teamFounder.DAO;

import ntut.teamFounder.Domain.TeamConfiguration;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class TeamConfigurationDAO {

    private final JdbcTemplate jdbcTemplate;

    public TeamConfigurationDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public TeamConfiguration getTeamConfigByCourseCode(String courseCode) {
        String sql = "select * from teamConfiguration where courseCode = ?";
        return jdbcTemplate.queryForObject(sql, new Object[]{courseCode}, (rs, rowNum) ->
            new TeamConfiguration(
                rs.getString("configId"),
                rs.getString("description"),
                rs.getBoolean("formationType"),
                rs.getBoolean("status"),
                rs.getInt("minSize"),
                rs.getInt("maxSize"),
                rs.getDate("startDate"),
                rs.getDate("endDate")
            )
        );
    }

    public int updateTeamConfigStatus(String courseCode, boolean status) {
        String sql = "update teamConfiguration set status = ? where courseCode = ?";
        return jdbcTemplate.update(sql, status, courseCode);
    }
}
