package ntut.teamFounder.Domain;

import org.junit.jupiter.api.Test;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class CourseTest {

    @Test
    void testConstructorAndGetters() {
        Course course = new Course(
                "CS101",
                "Intro to CS",
                "prof123",
                2025,
                2,
                "A basic CS course",
                1
        );

        assertEquals("CS101", course.getCourseCode());
        assertEquals("Intro to CS", course.getName());
        assertEquals("prof123", course.getProfessorId());
        assertEquals(2025, course.getAcademicYear());
        assertEquals(2, course.getSemester());
        assertEquals("A basic CS course", course.getDescription());
        assertEquals(1, course.getCourseStatus());
        assertNotNull(course.getTeams());
        assertTrue(course.getTeams().isEmpty());
    }

    @Test
    void testSetters() {
        Course course = new Course("CS101", "Intro", "prof"
                , 2025, 1, "desc", 1);

        course.setCourseCode("CS102");
        course.setName("Data Structures");
        course.setProfessorId("prof456");
        course.setAcademicYear(2024);
        course.setSemester(1);
        course.setDescription("DS course");
        course.setCourseStatus(2);

        assertEquals("CS102", course.getCourseCode());
        assertEquals("Data Structures", course.getName());
        assertEquals("prof456", course.getProfessorId());
        assertEquals(2024, course.getAcademicYear());
        assertEquals(1, course.getSemester());
        assertEquals("DS course", course.getDescription());
        assertEquals(2, course.getCourseStatus());
    }

    @Test
    void testAddTeam() {
        Course course = new Course("CS101", "Intro", "prof"
                , 2025, 1, "desc", 1);
        Team team1 = new Team("CS101", 1L, false);
        Team team2 = new Team("CS101", 2L, true);

        course.addTeam(team1);
        course.addTeam(team2);

        assertEquals(2, course.getTeams().size());
        assertTrue(course.getTeams().contains(team1));
        assertTrue(course.getTeams().contains(team2));
    }

    @Test
    void testToMap() {
        Course course = new Course(
                "CS101",
                "Intro to CS",
                "prof123",
                2025,
                2,
                "A basic CS course",
                1
        );
        Map map = course.toMap();

        assertEquals("CS101", map.get("courseCode"));
        assertEquals("Intro to CS", map.get("name"));
        assertEquals("prof123", map.get("professorId"));
        assertEquals(2025, map.get("academicYear"));
        assertEquals(2, map.get("semester"));
        assertEquals("A basic CS course", map.get("description"));
        assertEquals(1, map.get("courseStatus"));
    }
}
