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

//    public Course getCourse(Long courseId) {
//        String sql = "SELECT * FROM course WHERE course_id = ?";
//        return jdbcTemplate.queryForObject(sql, new Object[]{courseId}, (rs, rowNum) ->
//                new Course(
//                        rs.getLong("courseCode"),
//                        rs.getString("name"),
//                        rs.getLong("professorId"),
//                        rs.getInt("academicYear"),
//                        rs.getInt("semester"),
//                        rs.getString("description")
//                )
//        );
//    }

    public Long getProfessorId(String courseCode) {
        String sql = "SELECT professorId FROM course WHERE courseCode = ?";
        return jdbcTemplate.queryForObject(sql, new Object[]{courseCode}, Long.class);
    }
}
