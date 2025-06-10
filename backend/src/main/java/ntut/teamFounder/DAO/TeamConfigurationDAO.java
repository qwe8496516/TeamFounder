package ntut.teamFounder.DAO;

import ntut.teamFounder.Domain.TeamConfiguration;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public class TeamConfigurationDAO {

    private final JdbcTemplate jdbcTemplate;

    public TeamConfigurationDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public TeamConfiguration getTeamConfigByCourseCode(String courseCode) {
        String sql = "SELECT * FROM teamConfiguration WHERE courseCode = ?";
        List<TeamConfiguration> results = jdbcTemplate.query(sql, new Object[]{courseCode}, (rs, rowNum) ->
                new TeamConfiguration(
                        rs.getLong("configId"),
                        rs.getString("courseCode"),
                        rs.getString("title"),
                        rs.getString("description"),
                        rs.getBoolean("formationType"),
                        rs.getBoolean("status"),
                        rs.getInt("minSize"),
                        rs.getInt("maxSize"),
                        rs.getDate("startDate"),
                        rs.getDate("endDate")
                )
        );
        return results.isEmpty() ? null : results.get(0);
    }

    public int updateTeamConfigStatus(String courseCode, boolean status) {
        String sql = "UPDATE teamConfiguration SET status = ? where courseCode = ?";
        return jdbcTemplate.update(sql, status, courseCode);
    }

    public int createTeamConfiguration(String courseCode, String title, String description, boolean formationType, boolean status, int minSize, int maxSize, Date startDate, Date endDate) {
        String sql = "INSERT INTO teamConfiguration (courseCode, title, description, formationType, status, minSize, maxSize, startDate, endDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        return jdbcTemplate.update(
                sql, courseCode, title, description, formationType, status, minSize, maxSize, startDate, endDate
        );
    }

    public int updateTeamConfiguration(String courseCode, String title, String description, boolean formationType, boolean status, int minSize, int maxSize, Date startDate, Date endDate, Long configId) {
        String sql = "UPDATE teamConfiguration SET title=?, description=?, formationType=?, status=?, minsize=?, maxsize=?, startDate=?, endDate=? WHERE configId=?";
        return jdbcTemplate.update(
                sql, title, description, formationType, status, minSize, maxSize, startDate, endDate, configId
        );
    }
}