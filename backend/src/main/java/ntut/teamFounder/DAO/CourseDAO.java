package ntut.teamFounder.DAO;

import ntut.teamFounder.Domain.Course;
import ntut.teamFounder.Domain.Team;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class CourseDAO {

    private final JdbcTemplate jdbcTemplate;

    public CourseDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<String> getCourseByStudentId(Long id) {
        String sql = "SELECT * FROM enrollment WHERE userId = ?";
        return jdbcTemplate.query(sql, new Object[]{id}, (rs, rowNum) ->
            rs.getString("courseCode")
        );
    }

    public Course getCourseByCourseCode(String courseCode) {
        String sql = "SELECT * FROM course WHERE courseCode = ?";
        return jdbcTemplate.queryForObject(sql, new Object[]{courseCode}, (rs, rowNum) ->
            new Course(
                rs.getString("courseCode"),
                rs.getString("name"),
                rs.getString("professorId"),
                rs.getInt("academicYear"),
                rs.getInt("semester"),
                rs.getString("description"),
                rs.getInt("courseStatus")
            )
        );
    }

    public List<Long> getStudentsInCourse(String courseCode) {
        String sql = "SELECT userId FROM enrollment WHERE courseCode = ?";
        return jdbcTemplate.query(sql, new Object[]{courseCode}, (rs, rowNum) ->
                rs.getLong("userId")
        );
    }

    public List<Long> getStudentsInMatch(String courseCode, Long matcherId) {
        String sql = "SELECT e.userId\n" +
                "FROM enrollment e\n" +
                "WHERE e.courseCode = ?\n" +
                "  AND e.userId NOT IN (\n" +
                "    SELECT \n" +
                "      CASE \n" +
                "        WHEN i.senderId = ? THEN i.receiverId\n" +
                "        WHEN i.receiverId = ? THEN i.senderId\n" +
                "      END\n" +
                "    FROM invitation i\n" +
                "    WHERE i.senderId = ? OR i.receiverId = ?\n" +
                "  )\n";
        return jdbcTemplate.query(sql, new Object[]{courseCode, matcherId, matcherId, matcherId, matcherId}, (rs, rowNum) ->
                rs.getLong("userId")
        );
    }

    public String getProfessorId(String courseCode) {
        String sql = "SELECT professorId FROM course WHERE courseCode = ?";
        return jdbcTemplate.queryForObject(sql, new Object[]{courseCode}, String.class);
    }

    public List<Course> getCoursesByProfessorId(String professorId) {
        String sql = "SELECT * FROM course WHERE professorId = ?";
        return jdbcTemplate.query(sql, new Object[]{professorId}, (rs, rowNum) ->
            new Course(
                rs.getString("courseCode"),
                rs.getString("name"),
                rs.getString("professorId"),
                rs.getInt("academicYear"),
                rs.getInt("semester"),
                rs.getString("description"),
                rs.getInt("courseStatus")
            )
        );
    }

    public int getTotalMembersCountInLegitTeams(String courseCode) {
        String sql = """
        SELECT COUNT(*) AS total_users
        FROM team_member tm
        JOIN team t ON tm.team_id = t.id
        WHERE t.courseCode = ? AND t.legit = TRUE
    """;

        return jdbcTemplate.queryForObject(sql, Integer.class, courseCode);
    }
    public String getContentType(String fileType) {
        return switch (fileType.toLowerCase()) {
            case "pdf" -> "application/pdf";
            case "excel" -> "text/csv";
            default -> "text/html";
        };
    }

    public String getFileExtension(String fileType) {
        return switch (fileType.toLowerCase()) {
            case "pdf" -> ".pdf";
            case "excel" -> ".csv";
            default -> ".html";
        };
    }

    public List<Team> getTeamsByCourseCode(String courseCode) {
        // First get all teams for the course
        String teamSql = "SELECT * FROM team WHERE courseCode = ?";
        List<Team> teams = jdbcTemplate.query(teamSql, (rs, rowNum) ->
                new Team(
                        rs.getString("courseCode"),
                        rs.getLong("id"),
                        rs.getBoolean("legit")
                ), courseCode);

        // Then populate members for each team
        for (Team team : teams) {
            String memberSql = "SELECT user_id FROM team_member WHERE team_id = ?";
            List<Long> memberIds = jdbcTemplate.queryForList(memberSql, Long.class, team.getTeamId());
            team.setMembers(memberIds);
        }

        return teams;
    }

}
