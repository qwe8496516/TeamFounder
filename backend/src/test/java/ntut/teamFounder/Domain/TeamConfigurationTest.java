package ntut.teamFounder.Domain;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;

class TeamConfigurationTest {

    private TeamConfiguration config;
    private Date now;
    private Date start;
    private Date end;

    @BeforeEach
    void setUp() {
        now = new Date();
        start = new Date(now.getTime() - 1000 * 60 * 60);
        end = new Date(now.getTime() + 1000 * 60 * 60);

        config = new TeamConfiguration(
                1L,
                "CS101",
                "Project A",
                "Team project",
                true,
                1,
                2,
                5,
                start,
                end
        );
    }

    @Test
    void testConstructorAndGetters() {
        assertEquals(1L, config.getConfigId());
        assertEquals("CS101", config.getCourseCode());
        assertEquals("Project A", config.getTitle());
        assertEquals("Team project", config.getDescription());
        assertTrue(config.getFormationType());
        assertEquals(1, config.getStatus());
        assertEquals(2, config.getMinSize());
        assertEquals(5, config.getMaxSize());
        assertEquals(start, config.getStartDate());
        assertEquals(end, config.getEndDate());
    }

    @Test
    void testSizeValid() {
        assertTrue(config.sizeValid());

        config.setMinSize(6);
        config.setMaxSize(5);
        assertFalse(config.sizeValid());
    }

    @Test
    void testStatusValid() {
        assertTrue(config.statusValid());

        config.setStatus(2);
        assertFalse(config.statusValid());
    }

    @Test
    void testDateValid() {
        assertTrue(config.dateValid());

        config.setStartDate(new Date(now.getTime() + 1000 * 60)); // start after end
        config.setEndDate(new Date(now.getTime() - 1000 * 60));
        assertFalse(config.dateValid());
    }

    @Test
    void testCheckConstraints() {
        assertTrue(config.checkConstraints());

        config.setMinSize(10);
        config.setMaxSize(5);
        assertFalse(config.checkConstraints());
    }

    @Test
    void testToMap() {
        Map<String, Object> map = config.toMap();
        assertEquals(1L, map.get("configId"));
        assertEquals("Team project", map.get("description"));
        assertEquals(true, map.get("formationType"));
        assertEquals(1, map.get("status"));
        assertEquals(2, map.get("minSize"));
        assertEquals(5, map.get("maxSize"));
        assertEquals(start, map.get("startDate"));
        assertEquals(end, map.get("endDate"));
    }

    @Test
    void testValidateLegit_ValidTeam() {
        Team team = new Team("CS101", 10L, false);
        team.addMember(1001L);
        team.addMember(1002L);
        team.addMember(1003L);

        assertTrue(config.validateLegit(team));
    }

    @Test
    void testValidateLegit_InvalidStatus() {
        Team team = new Team("CS101", 10L, false);
        team.addMember(1001L);
        team.addMember(1002L);
        config.setStatus(0);

        assertFalse(config.validateLegit(team));
    }

    @Test
    void testValidateLegit_InvalidSize() {
        Team team = new Team("CS101", 10L, false);
        team.addMember(1001L); // Only one member, less than minSize

        assertFalse(config.validateLegit(team));
    }

    @Test
    void testValidateLegit_WrongCourseCode() {
        Team team = new Team("MATH100", 11L, false);
        team.addMember(1001L);
        team.addMember(1002L);
    }

    @Test
    void testValidateLegit_OutsideTimeWindow() {
        config.setStartDate(new Date(now.getTime() + 1000000));
        config.setEndDate(new Date(now.getTime() + 2000000));

        Team team = new Team("CS101", 12L, false);
        team.addMember(1001L);
        team.addMember(1002L);
    }
}
