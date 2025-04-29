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

    public int updateUser(String userId, String password) {
        String sql = "UPDATE users SET password=? WHERE userId=?";
        return jdbcTemplate.update(sql, password, userId);
    }

}
