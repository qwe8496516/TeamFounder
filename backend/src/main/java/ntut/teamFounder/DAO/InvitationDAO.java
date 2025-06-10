package ntut.teamFounder.DAO;

import ntut.teamFounder.Domain.Invitation;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;

@Repository
public class InvitationDAO {
    private final JdbcTemplate jdbcTemplate;

    public InvitationDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public int createInvitation(int senderId, int receiverId, String courseCode, String message, int status) {
        String sql = "INSERT INTO invitation (`senderId`, `receiverId`, `courseCode`, `message`, `status`) VALUES (?, ?, ?, ?, ?)";
        return jdbcTemplate.update(sql, senderId, receiverId, courseCode, message, status);
    }

    public int updateInvitationStatus(long invitationId, int status) {
        String sql = "UPDATE invitation SET status = ? WHERE id = ?";
        return jdbcTemplate.update(sql, status, invitationId);
    }

    public Invitation getInvitationById(Long id) {
        String sql = "SELECT * FROM invitation WHERE id = ?";
        return jdbcTemplate.queryForObject(sql, new Object[]{id}, new InvitationRowMapper());
    }

    private static class InvitationRowMapper implements RowMapper<Invitation> {
        @Override
        public Invitation mapRow(ResultSet rs, int rowNum) throws SQLException {
            Invitation invitation = new Invitation();
            invitation.setId(rs.getLong("id"));
            invitation.setSenderId(rs.getLong("senderId"));
            invitation.setReceiverId(rs.getLong("receiverId"));
            invitation.setCourseCode(rs.getString("courseCode"));
            invitation.setMessage(rs.getString("message"));
            invitation.setStatus(rs.getInt("status"));
            return invitation;
        }
    }
}
