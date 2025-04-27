package ntut.teamFounder.DAO;

import ntut.teamFounder.Domain.Student;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public class StudentDAO {
    private final JdbcTemplate jdbcTemplate;

    public StudentDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Student> getAllStudents() {
        String sql = "SELECT * FROM users";
        return jdbcTemplate.query(sql, (rs, rowNum) ->
                new Student(
                        rs.getLong("id"),
                        rs.getString("userId"),
                        rs.getString("username"),
                        rs.getString("password"),
                        rs.getString("email"),
                        rs.getDate("createdAt")
                )
        );
    }

    public int updateStudent(Student student) {
        String sql = "UPDATE users SET username=?, password=?, email=? WHERE userId=?";
        return jdbcTemplate.update(sql,
                student.getUsername(),
                student.getPassword(),
                student.getEmail(),
                student.getUserId()
        );
    }

    public int deleteStudent(String studentId) {
        String sql = "DELETE FROM users WHERE userId=?";
        return jdbcTemplate.update(sql, studentId);
    }

    public Student getStudentById(String studentId) {
        String sql = "SELECT * FROM users WHERE userId=?";
        return jdbcTemplate.queryForObject(sql, new Object[]{studentId}, (rs, rowNum) ->
                new Student(
                        rs.getLong("id"),
                        rs.getString("userId"),
                        rs.getString("username"),
                        rs.getString("password"),
                        rs.getString("email"),
                        rs.getDate("createdAt")
                )
        );
    }
}
