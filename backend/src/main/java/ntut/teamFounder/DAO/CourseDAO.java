package ntut.teamFounder.DAO;

import ntut.teamFounder.Domain.Announcement;
import ntut.teamFounder.Domain.Course;
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
        String sql = "SELECT * FROM enrollment WHERE id = ?";
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
                rs.getLong("professorId"),
                rs.getInt("academicYear"),
                rs.getInt("semester"),
                rs.getString("description")
            )
        );
    }

    public List<Long> getStudentsInCourse(String courseCode) {
        String sql = "SELECT userId FROM enrollment WHERE courseCode = ?";
        return jdbcTemplate.query(sql, new Object[]{courseCode}, (rs, rowNum) ->
                rs.getLong("userId")
        );
    }

    public Long getProfessorId(String courseCode) {
        String sql = "SELECT professorId FROM course WHERE courseCode = ?";
        return jdbcTemplate.queryForObject(sql, new Object[]{courseCode}, Long.class);
    }
}
