package ntut.teamFounder.DAO;

import ntut.teamFounder.Domain.Course;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
@Transactional
public class CourseDAOTest {

    @Autowired
    private CourseDAO courseDAO;

    @Test
    public void getCourseByStudentId() {
        Long studentId = 1L;
        List<String> courses = courseDAO.getCourseByStudentId(studentId);
        assertEquals(2, courses.size());
        assertEquals("CS205", courses.get(0));
        assertEquals("CS301", courses.get(1));
    }

    @Test
    public void getCourseByCourseCode() {
        Course course = courseDAO.getCourseByCourseCode("CS205");
        assertNotNull(course);
        assertEquals("CS205", course.getCourseCode());
        assertEquals("Web Development", course.getName());
        assertEquals("113598056", course.getProfessorId());
        assertEquals(113, course.getAcademicYear());
        assertEquals(1, course.getSemester());
        assertEquals("A course focusing on web technologies including HTML, CSS, JavaScript, and frameworks.", course.getDescription());
    }

    @Test
    public void getStudentsInCourseTest() {
        String courseCode = "CS205";
        List<Long> studentIds = courseDAO.getStudentsInCourse(courseCode);

        assertNotNull(studentIds);
        assertEquals(4, studentIds.size());
        assertEquals(1L, studentIds.get(0));
        assertEquals(3L, studentIds.get(1));
        assertEquals(4L, studentIds.get(2));
        assertEquals(5L, studentIds.get(3));
    }

    @Test
    public void getProfessorIdTest() {
        String courseCode = "CS205";
        String professorId = courseDAO.getProfessorId(courseCode);

        assertNotNull(professorId);
        assertEquals("113598056", professorId); // 假設 CS205 的授課教授為 113598056
    }
}
