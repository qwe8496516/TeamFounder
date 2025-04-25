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

}
