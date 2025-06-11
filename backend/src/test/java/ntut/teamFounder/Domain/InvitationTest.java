package ntut.teamFounder.Domain;

import org.junit.jupiter.api.Test;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class InvitationTest {

    @Test
    void testGettersAndSetters() {
        Invitation invitation = new Invitation();

        invitation.setId(100L);
        invitation.setSenderId(10L);
        invitation.setReceiverId(20L);
        invitation.setCourseCode("CS101");
        invitation.setMessage("Join our group!");
        invitation.setStatus(1);

        assertEquals(100L, invitation.getId());
        assertEquals(10L, invitation.getSenderId());
        assertEquals(20L, invitation.getReceiverId());
        assertEquals("CS101", invitation.getCourseCode());
        assertEquals("Join our group!", invitation.getMessage());
        assertEquals(1, invitation.getStatus());
    }

    @Test
    void testToMapContainsCorrectFields() {
        Invitation invitation = new Invitation();
        invitation.setId(1L);
        invitation.setSenderId(2L);
        invitation.setReceiverId(3L);
        invitation.setCourseCode("CSE2025");
        invitation.setMessage("Hello!");
        invitation.setStatus(0);

        Map map = invitation.toMap();

        assertEquals(1L, map.get("id"));
        assertEquals(2L, map.get("senderId"));
        assertEquals("Hello!", map.get("message"));
        assertEquals(0, map.get("status"));

        assertNull(map.get("receiverId"));
        assertNull(map.get("courseCode"));
    }

    @Test
    void testToMapWithNullFields() {
        Invitation invitation = new Invitation();

        Map map = invitation.toMap();

        assertNull(map.get("id"));
        assertNull(map.get("senderId"));
        assertNull(map.get("message"));
        assertEquals(0, map.get("status"));
    }

    @Test
    void testEqualsAndHashCode() {
        Invitation inv1 = new Invitation();
        inv1.setId(1L);
        inv1.setSenderId(2L);
        inv1.setReceiverId(3L);
        inv1.setCourseCode("CS101");
        inv1.setMessage("msg");
        inv1.setStatus(1);

        Invitation inv2 = new Invitation();
        inv2.setId(1L);
        inv2.setSenderId(2L);
        inv2.setReceiverId(3L);
        inv2.setCourseCode("CS101");
        inv2.setMessage("msg");
        inv2.setStatus(1);

        assertNotEquals(inv1, inv2);
        assertNotEquals(inv1.hashCode(), inv2.hashCode());
    }
}
