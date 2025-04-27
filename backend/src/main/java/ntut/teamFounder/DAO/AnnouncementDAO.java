package ntut.teamFounder.DAO;

import ntut.teamFounder.Domain.Announcement;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class AnnouncementDAO {

    private final JdbcTemplate jdbcTemplate;

    public AnnouncementDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Announcement> getAnnouncements(Long courseId) {
        String sql = "SELECT * FROM announcements WHERE course_id = ?";
        return jdbcTemplate.query(sql, new Object[]{courseId}, (rs, rowNum) ->
                new Announcement(
                        rs.getLong("id"),
                        rs.getString("title"),
                        rs.getString("content"),
                        rs.getDate("created_at"),
                        rs.getLong("course_id")
                )
        );
    }
}
