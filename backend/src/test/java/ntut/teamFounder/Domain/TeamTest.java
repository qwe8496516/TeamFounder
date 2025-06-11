package ntut.teamFounder.Domain;
import org.junit.jupiter.api.Test;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class TeamTest {

    @Test
    void testConstructorAndGetters() {
        Team team = new Team("CS101", 1L, false);
        assertEquals("CS101", team.getCourseCode());
        assertEquals(1L, team.getTeamId());
        assertFalse(team.isFormed());
        assertNotNull(team.getMembers());
        assertTrue(team.getMembers().isEmpty());
    }

    @Test
    void testAddMember() {
        Team team = new Team("CS101", 1L, false);
        team.addMember(100L);
        assertEquals(1, team.getMembers().size());
        assertTrue(team.getMembers().contains(100L));
    }

    @Test
    void testRemoveMember() {
        Team team = new Team("CS101", 1L, false);
        team.addMember(100L);
        team.addMember(200L);
        team.removeMember(100L);
        assertEquals(1, team.getMembers().size());
        assertFalse(team.getMembers().contains(100L));
        assertTrue(team.getMembers().contains(200L));
    }

    @Test
    void testToMap() {
        Team team = new Team("CS101", 1L, true);
        team.addMember(100L);
        Map map = team.toMap();
        assertEquals(1L, map.get("teamId"));
        assertEquals(List.of(100L), map.get("members"));
        assertEquals(true, map.get("formed"));
    }
}
