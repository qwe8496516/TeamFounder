package ntut.teamFounder.DAO;

import ntut.teamFounder.Domain.Skill;
import org.mockito.Mockito;
import org.springframework.jdbc.core.JdbcTemplate;
import ntut.teamFounder.Domain.Student;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class StudentDAOTest {

    @Autowired
    private StudentDAO studentDAO;
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Test
    public void testUpdateStudent() {
        Date date = new Date();
        Student student = studentDAO.getStudentById(1L);
        Student updatedStudent = new Student(1L, "113598012", "123", "123", "t111111111@ntut.org.tw" , date);
        studentDAO.updateStudent(updatedStudent);

        assertEquals(student.getId(), studentDAO.getStudentById(1L).getId());
        assertEquals(student.getUserId(), studentDAO.getStudentById(1L).getUserId());
        assertNotEquals(student.getUsername(), studentDAO.getStudentById(1L).getUsername());
        assertNotEquals(student.getPassword(), studentDAO.getStudentById(1L).getPassword());
        assertNotEquals(student.getEmail(), studentDAO.getStudentById(1L).getEmail());
    }

    @Test
    public void testDeleteStudent() {
        assertNotNull(studentDAO.getStudentByStudentId("113598012"));
        studentDAO.deleteStudent("113598012");
        assertNull(studentDAO.getStudentById(1L));
    }

    @Test
    public void testGetStudentById() {
        Student student = studentDAO.getStudentById(1L);
        assertNotNull(student);
    }

    @Test
    public void testGetStudentByStudentId() {
        Student student = studentDAO.getStudentByStudentId("113598012");
        assertNotNull(student);
    }

    @Test
    public void testGetStudentCount() {
        int expectedCount = 4;
        int result = studentDAO.getStudentCount("CS301");
        assertEquals(expectedCount, result);
    }

    @Test
    public void testGetSkill() {
        List<Long> expectedSkillIds = new ArrayList<>();
        expectedSkillIds.add(2L);
        expectedSkillIds.add(6L);
        expectedSkillIds.add(7L);
        List<Long> skills = studentDAO.getSkillsById(1L);
        assertEquals(expectedSkillIds, skills);
    }

    @Test
    public void testAddSkill() {
        List<Long> expectedSkillIds = new ArrayList<>();
        expectedSkillIds.add(2L);
        expectedSkillIds.add(3L);
        expectedSkillIds.add(6L);
        expectedSkillIds.add(7L);
        studentDAO.addSkillToStudent(1L, 3L);
        assertEquals(expectedSkillIds, studentDAO.getSkillsById(1L));
    }

    @Test
    public void testDeleteSkill() {
        List<Long> expectedSkillIds = new ArrayList<>();
        expectedSkillIds.add(2L);
        expectedSkillIds.add(6L);
        studentDAO.deleteSkillFromStudent(1L, 7L);
        assertEquals(expectedSkillIds, studentDAO.getSkillsById(1L));
    }

    @Test
    @Transactional
    public void testEnrollInCourse() {
        Student student = new Student(100L, "111111111", "John", "123", "t111111111@ntut.org.tw", new Date());

        jdbcTemplate.update(
                "INSERT INTO users (id, userId, username, password, email, privilege) VALUES (?, ?, ?, ?, ?, ?)",
                100L, "TEST001", "Test User", "testpass", "test@ntut.org.tw", 0
        );

        // Create test course
        jdbcTemplate.update(
                "INSERT INTO course (courseCode, name, professorId, academicYear, semester, description) VALUES (?, ?, ?, ?, ?, ?)",
                "T101", "Test Course", "p_test", 113, 1, "A test course"
        );

        // 3. Execute enrollment
        int result = studentDAO.enrollInCourse(100L, "T101");
        assertEquals(1, result);

        Integer count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM enrollment WHERE userId = ? AND courseCode = ?",
                Integer.class,
                100L,
                "T101"
        );
        assertEquals(1, count);
    }

    @Test
    public void testGetCoursesById() {
        List<String> courses = studentDAO.getCoursesById(1L);

        assertEquals(2, courses.size());
        assertEquals("CS205", courses.get(0));
        assertEquals("CS301", courses.get(1));
    }

    @Test
    public void testGetAllSkills() {
        List<Skill> skills = studentDAO.getAllSkills();
        assertEquals(13, skills.size());
    }

    @Test
    public void testGetSkillById() {
        Skill skill = studentDAO.getSkillById(1L);
        assertNotNull(skill);
    }
}
