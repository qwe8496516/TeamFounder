package ntut.teamFounder.DAO;

import ntut.teamFounder.Domain.User;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class UserDAO {

    private final JdbcTemplate jdbcTemplate;

    public UserDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<User> getAllUsers() {
        String sql = "select * from users";
        return jdbcTemplate.query(sql, (rs, rowNum) ->
            new User(
                rs.getLong("id"),
                rs.getString("userId"),
                rs.getString("username"),
                rs.getString("password"),
                rs.getString("email"),
                rs.getInt("privilege"),
                rs.getDate("createdAt"))
        );
    }

    public User getUserById(String userId) {
        String sql = "SELECT * FROM users WHERE userid = ?";
        return jdbcTemplate.queryForObject(sql, new Object[]{userId}, (rs, rowNum) ->
                new User(
                        rs.getLong("id"),
                        rs.getString("userId"),
                        rs.getString("username"),
                        rs.getString("password"),
                        rs.getString("email"),
                        rs.getInt("privilege"),
                        rs.getDate("createdAt")
                )
        );
    }

    public int createUser(String userId, String username, String password, String email) {
        String sql = "INSERT INTO users (userId, username, password, email, privilege) VALUES (?, ?, ?, ?, ?)";
        return jdbcTemplate.update(sql, userId, username, password, email, 0);
    }

    public int addSkillToUser(Long userId, Long skillId) {
        String sql = "INSERT INTO profile (userId, skillId) VALUES (?, ?)";
        return jdbcTemplate.update(sql, userId, skillId);
    }

    public List<Long> getSkillsByUserId(Long userId) {
        String sql = "SELECT skillId FROM profile WHERE userId = ?";
        return jdbcTemplate.query(sql, new Object[]{userId}, (rs, rowNum) ->
                rs.getLong("skillId")
        );
    }

    public int enrollInCourse(Long userId, String courseCode) {
        String sql = "INSERT INTO enrollment (userId, course_code) VALUES (?, ?)";
        return jdbcTemplate.update(sql, userId, courseCode);
    }

    public List<String> getCoursesByUserId(Long userId) {
        String sql = "SELECT c.course_code FROM course c " +
                "JOIN enrollment e ON c.course_code = e.course_code " +
                "WHERE e.userId = ?";
        return jdbcTemplate.query(sql, new Object[]{userId}, (rs, rowNum) ->
                rs.getString("course_code")
        );
    }

}
