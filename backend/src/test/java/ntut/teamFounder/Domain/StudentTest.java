package ntut.teamFounder.Domain;

import org.junit.jupiter.api.Test;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;

public class StudentTest {

    @Test
    void testConstructor() {
        Date now = new Date();
        Student student = new Student(1L, "113456789", "Alice", "pw123", "t113456789@ntut.org.tw", now);
        assertEquals(1L, student.getId());
        assertEquals("113456789", student.getUserId());
        assertEquals("Alice", student.getUsername());
        assertEquals("pw123", student.getPassword());
        assertEquals("t113456789@ntut.org.tw", student.getEmail());
        assertEquals(0, student.getPrivilege());
        assertEquals(now, student.getCreatedAt());
        assertTrue(student.getSkills().isEmpty());
        assertTrue(student.getCourses().isEmpty());
    }

    @Test
    public void testAddSkill() {
        Date now = new Date();
        Student student = new Student(1L, "113456789", "Alice", "pw123", "t113456789@ntut.org.tw", now);
        List<Long> skills = new ArrayList<>();
        skills.add(0, 1L);
        skills.add(1, 2L);
        student.setSkills(skills);
        assertEquals(2, student.getSkills().size());
    }

    @Test
    void testCalculateFitness() {
        Student student = new Student(1L, "u1", "Alice", "pass", "a@x.com", new Date());
        assertEquals(50, student.calculateFitness(new ArrayList<>()));

        student.getSkills().addAll(Arrays.asList(1L, 2L, 3L));
        List<Long> matcherSkills = Arrays.asList(2L, 3L, 4L, 5L);
        double fitness = student.calculateFitness(matcherSkills);
        double expected = (2 * 100 / 4) * 0.1 + 90;
        expected = Math.floor(expected);
        assertEquals(expected, fitness);

        matcherSkills = Arrays.asList(6L, 7L);
        fitness = student.calculateFitness(matcherSkills);
        expected = (0 * 100 / 2) * 0.1 + 90;
        expected = Math.floor(expected);
        assertEquals(expected, fitness);

        matcherSkills = Arrays.asList(2L, 3L);
        fitness = student.calculateFitness(matcherSkills);
        expected = (2 * 100 / 2) * 0.1 + 90;
        expected = Math.floor(expected);
        assertEquals(expected, fitness);
    }

    @Test
    void testCalculateWeight() {
        Student student = new Student(1L, "u1", "Alice", "pass", "a@x.com", new Date());
        double result = student.calculateWeight(2, 4);
        assertEquals(95, result);
    }

    @Test
    void testFitnessToInteger() {
        Student student = new Student(1L, "u1", "Alice", "pass", "a@x.com", new Date());
        assertEquals(10, student.fitnessToInteger(10.9));
        assertEquals(-9, student.fitnessToInteger(-9.1));
        assertEquals(0, student.fitnessToInteger(0));
    }

    @Test
    void testToMap() {
        Student student = new Student(1L, "u1", "Alice", "pass", "a@x.com", new Date());
        Map<String, Object> map = student.toMap();
        assertEquals(1L, map.get("id"));
        assertEquals("u1", map.get("userId"));
        assertEquals("Alice", map.get("username"));
        assertEquals("a@x.com", map.get("email"));
    }
}
