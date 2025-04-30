package ntut.teamFounder.Domain;

import org.junit.jupiter.api.Test;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

public class CourseTest {

    @Test
    public void toMap() {
        Course course = new Course("CS101", "Intro to CS", 123L, 2025, 2, "Basic course");
        Map<String, Object> map = course.toMap();

        assertEquals(6, map.size());
        assertEquals("CS101", map.get("courseCode"));
        assertEquals("Intro to CS", map.get("name"));
        assertEquals(123L, map.get("professorId"));
        assertEquals(2025, map.get("academicYear"));
        assertEquals(2, map.get("semester"));
        assertEquals("Basic course", map.get("description"));
    }
}