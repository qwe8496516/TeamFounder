package ntut.teamFounder.DAO;

import ntut.teamFounder.Domain.Invitation;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class InvitationDAOTest {

    @Mock
    private JdbcTemplate jdbcTemplate;

    @InjectMocks
    private InvitationDAO invitationDAO;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void createInvitation_ShouldExecuteInsert() {
        when(jdbcTemplate.update(anyString(), any(Object[].class))).thenReturn(1);

        int result = invitationDAO.createInvitation(123, 456, "CS101", "Join course", 0);

        assertEquals(1, result);
        verify(jdbcTemplate).update(
                "INSERT INTO invitation (`senderId`, `receiverId`, `courseCode`, `message`, `status`) VALUES (?, ?, ?, ?, ?)",
                123, 456, "CS101", "Join course", 0
        );
    }

    @Test
    void updateInvitationStatus_ShouldExecuteUpdate() {
        when(jdbcTemplate.update(anyString(), any(Object.class), anyLong())).thenReturn(1);

        int result = invitationDAO.updateInvitationStatus(1L, 2);

        assertEquals(1, result);
        verify(jdbcTemplate).update(
                "UPDATE invitation SET status = ? WHERE id = ?",
                2, 1L
        );
    }

    @Test
    void getInvitationById_ShouldReturnInvitation() throws SQLException {
        Invitation expected = new Invitation();
        expected.setId(1L);

        when(jdbcTemplate.queryForObject(anyString(), any(Object[].class), any(InvitationDAO.InvitationRowMapper.class)))
                .thenReturn(expected);

        Invitation result = invitationDAO.getInvitationById(1L);

        assertEquals(expected, result);
        verify(jdbcTemplate).queryForObject(
                eq("SELECT * FROM invitation WHERE id = ?"),
                eq(new Object[]{1L}),
                any(InvitationDAO.InvitationRowMapper.class)
        );
    }


    @Test
    void getInvitations_ShouldReturnList() {
        List<Invitation> expected = Collections.singletonList(new Invitation());

        when(jdbcTemplate.query(anyString(), any(Object[].class), any(RowMapper.class)))
                .thenReturn(expected);

        List<Invitation> result = invitationDAO.getInvitations("CS101", 456L);

        assertEquals(expected, result);
        verify(jdbcTemplate).query(
                eq("SELECT * FROM invitation WHERE courseCode = ? AND receiverId = ?"),
                eq(new Object[]{"CS101", 456L}),
                any(InvitationDAO.InvitationRowMapper.class)
        );
    }

    @Test
    void invitationRowMapper_ShouldMapResultSet() throws SQLException {
        ResultSet rs = mock(ResultSet.class);
        when(rs.getLong("id")).thenReturn(1L);
        when(rs.getLong("senderId")).thenReturn(123L);
        when(rs.getLong("receiverId")).thenReturn(456L);
        when(rs.getString("courseCode")).thenReturn("CS101");
        when(rs.getString("message")).thenReturn("Test message");
        when(rs.getInt("status")).thenReturn(1);

        InvitationDAO.InvitationRowMapper mapper = new InvitationDAO.InvitationRowMapper();
        Invitation invitation = mapper.mapRow(rs, 0);

        assertEquals(1L, invitation.getId());
        assertEquals(123L, invitation.getSenderId());
        assertEquals(456L, invitation.getReceiverId());
        assertEquals("CS101", invitation.getCourseCode());
        assertEquals("Test message", invitation.getMessage());
        assertEquals(1, invitation.getStatus());
    }
}
