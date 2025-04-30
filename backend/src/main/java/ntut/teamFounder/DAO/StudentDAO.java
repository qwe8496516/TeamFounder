package ntut.teamFounder.DAO;

import ntut.teamFounder.Domain.Skill;
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
        String findIdSql = "SELECT id FROM users WHERE userId=?";
        Long id = jdbcTemplate.queryForObject(findIdSql, new Object[]{studentId}, Long.class);

        jdbcTemplate.update("DELETE FROM enrollment WHERE userId=?", id);

        String sql = "DELETE FROM users WHERE userId=?";
        return jdbcTemplate.update(sql, studentId);
    }


    public Student getStudentById(Long id) {
        String sql = "SELECT * FROM users WHERE id=?";
        List<Student> student = jdbcTemplate.query(sql, new Object[]{id}, (rs, rowNum) ->
                new Student(
                        rs.getLong("id"),
                        rs.getString("userId"),
                        rs.getString("username"),
                        rs.getString("password"),
                        rs.getString("email"),
                        rs.getDate("createdAt")
                )
        );

        return student.isEmpty() ? null : student.get(0);
    }

    public Student getStudentByStudentId(String studentId) {
        String sql = "SELECT * FROM users WHERE userId = ? AND privilege = 0";
        List<Student> student = jdbcTemplate.query(sql, new Object[]{studentId}, (rs, rowNum) ->
                new Student(
                        rs.getLong("id"),
                        rs.getString("userId"),
                        rs.getString("username"),
                        rs.getString("password"),
                        rs.getString("email"),
                        rs.getDate("createdAt")
                )
        );
        return student.isEmpty() ? null : student.get(0);
    }

    public int getStudentCount(String courseCode) {
        String sql = "SELECT COUNT(*) FROM enrollment WHERE courseCode = ?";
        return jdbcTemplate.queryForObject(sql, new Object[]{courseCode}, Integer.class);
    }

    public int addSkillToStudent(Long userId, Long skillId) {
        String sql = "INSERT INTO userSkill (userId, skillId) VALUES (?, ?)";
        return jdbcTemplate.update(sql, userId, skillId);
    }

    public int deleteSkillFromStudent(Long userId, Long skillId) {
        String sql = "DELETE FROM userSkill WHERE userId = ? AND skillId = ?";
        return jdbcTemplate.update(sql, userId, skillId);
    }

    public List<Long> getSkillsById(Long userId) {
        String sql = "SELECT skillId FROM userSkill WHERE userId = ?";
        return jdbcTemplate.query(sql, new Object[]{userId}, (rs, rowNum) ->
                rs.getLong("skillId")
        );
    }

    public int enrollInCourse(Long userId, String courseCode) {
        String sql = "INSERT INTO enrollment (userId, courseCode) VALUES (?, ?)";
        return jdbcTemplate.update(sql, userId, courseCode);
    }

    public List<String> getCoursesById(Long userId) {
        String sql = "SELECT c.courseCode FROM course c " +
                "JOIN enrollment e ON c.courseCode = e.courseCode " +
                "WHERE e.userId = ?";
        return jdbcTemplate.query(sql, new Object[]{userId}, (rs, rowNum) ->
                rs.getString("courseCode")
        );
    }

    public List<Skill> getAllSkills() {
        String sql = "SELECT * FROM skill";
        return jdbcTemplate.query(sql, (rs, rowNum) ->
            new Skill(
                rs.getLong("id"),
                rs.getString("type"),
                rs.getString("name")
            )
        );
    }

    public Skill getSkillById(Long skillId) {
        String sql = "SELECT * FROM skill WHERE id = ?";
        return jdbcTemplate.queryForObject(sql, new Object[]{skillId}, (rs, rowNum) ->
            new Skill(
                rs.getLong("id"),
                rs.getString("type"),
                rs.getString("name")
            )
        );
    }
}
