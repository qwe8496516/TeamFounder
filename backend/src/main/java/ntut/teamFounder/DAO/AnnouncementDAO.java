package ntut.teamFounder.DAO;

import ntut.teamFounder.Domain.Announcement;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public class AnnouncementDAO {

    private final JdbcTemplate jdbcTemplate;

    public AnnouncementDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Announcement> getAnnouncements(String courseCode) {
        String sql = "SELECT * FROM announcement WHERE courseCode = ? ORDER BY importanceLevel DESC";
        return jdbcTemplate.query(sql, new Object[]{courseCode}, (rs, rowNum) ->
                new Announcement(
                        rs.getLong("id"),
                        rs.getString("title"),
                        rs.getString("content"),
//                        rs.getDate("createdAt"),
                        rs.getString("courseCode"),
                        rs.getInt("importanceLevel")
                )
        );
    }

    public int createAnnouncement(String courseCode, String title, String content, int importanceLevel) {
        String sql = "INSERT INTO announcement (courseCode, title, content, importanceLevel) VALUES (?, ?, ?, ?)";
        return jdbcTemplate.update(sql, courseCode, title, content, importanceLevel );
    }
}
