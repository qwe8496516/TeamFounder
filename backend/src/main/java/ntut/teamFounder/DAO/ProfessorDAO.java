package ntut.teamFounder.DAO;

import ntut.teamFounder.Domain.Professor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ProfessorDAO {

    private final JdbcTemplate jdbcTemplate;

    public ProfessorDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Professor getProfessorByProfessorId(String professorId) {
        String sql = "SELECT * FROM users WHERE userId = ? AND privilege = 1";
        List<Professor> professors = jdbcTemplate.query(sql, new Object[]{professorId}, (rs, rowNum) ->
                new Professor(
                        rs.getLong("id"),
                        rs.getString("userId"),
                        rs.getString("username"),
                        rs.getString("password"),
                        rs.getString("email"),
                        rs.getDate("createdAt")
                )
        );
        return professors.isEmpty() ? null : professors.get(0);
    }

}
