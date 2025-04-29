package ntut.teamFounder.DAO;

import ntut.teamFounder.Domain.Course;
import ntut.teamFounder.Domain.Enrollment;
import ntut.teamFounder.Domain.Student;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class CourseDAO {

    private final JdbcTemplate jdbcTemplate;

    public CourseDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Course getCourseByCourseCode(String courseCode) {
        String sql = "SELECT * FROM course WHERE courseCode = ?";
        return jdbcTemplate.queryForObject(sql, new Object[]{courseCode}, (rs, rowNum) ->
            new Course(
                rs.getString("courseCode"),
                rs.getString("name"),
                rs.getString("professorId"),
                rs.getString("academicYear"),
                rs.getString("semester"),
                rs.getString("description")
            )
        );
    }
    
    public List<String> getCourseByStudentId(Long studentId) {
        String sql = "SELECT courseCode FROM enrollment WHERE userId = ?";
        return jdbcTemplate.query(sql, new Object[]{studentId}, (rs, rowNum) ->
            rs.getString("courseCode")
        );
    }

    public List<Long> getCourseStudents(String courseCode) {
        String sql = "SELECT userId FROM enrollment WHERE courseCode = ?";
        return jdbcTemplate.query(sql, new Object[]{courseCode}, (rs, rowNum) ->
            rs.getLong("userId")
        );
    }

}
