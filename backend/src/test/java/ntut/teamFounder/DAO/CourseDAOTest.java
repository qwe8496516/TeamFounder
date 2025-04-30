package ntut.teamFounder.DAO;

import ntut.teamFounder.Domain.Course;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class CourseDAOTest {

    @Mock
    private JdbcTemplate jdbcTemplate;

    @InjectMocks
    private CourseDAO courseDAO;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getCourseByStudentId_returnsListOfCourseCodes() {
        Long studentId = 1L;
        List<String> expected = List.of("CS101", "CS102");

        when(jdbcTemplate.query(
                eq("SELECT * FROM enrollment WHERE id = ?"),
                eq(new Object[]{studentId}),
                any(RowMapper.class))
        ).thenReturn(expected);

        List<String> result = courseDAO.getCourseByStudentId(studentId);

        assertEquals(expected, result);
        verify(jdbcTemplate, times(1)).query(
                eq("SELECT * FROM enrollment WHERE id = ?"),
                eq(new Object[]{studentId}),
                any(RowMapper.class)
        );
    }

    @Test
    void getCourseByCourseCode_returnsCourse() {
        String courseCode = "CS101";
        Course expected = new Course(
                courseCode, "Intro to CS", 123L, 2025, 2, "desc"
        );

        when(jdbcTemplate.queryForObject(
                eq("SELECT * FROM course WHERE courseCode = ?"),
                eq(new Object[]{courseCode}),
                any(RowMapper.class))
        ).thenReturn(expected);

        Course result = courseDAO.getCourseByCourseCode(courseCode);

        assertEquals(expected, result);
        verify(jdbcTemplate, times(1)).queryForObject(
                eq("SELECT * FROM course WHERE courseCode = ?"),
                eq(new Object[]{courseCode}),
                any(RowMapper.class)
        );
    }

    @Test
    void getStudentsInCourse_returnsListOfUserIds() {
        String courseCode = "CS101";
        List<Long> expected = List.of(10L, 20L);

        when(jdbcTemplate.query(
                eq("SELECT userId FROM enrollment WHERE courseCode = ?"),
                eq(new Object[]{courseCode}),
                any(RowMapper.class))
        ).thenReturn(expected);

        List<Long> result = courseDAO.getStudentsInCourse(courseCode);

        assertEquals(expected, result);
        verify(jdbcTemplate, times(1)).query(
                eq("SELECT userId FROM enrollment WHERE courseCode = ?"),
                eq(new Object[]{courseCode}),
                any(RowMapper.class)
        );
    }

    @Test
    void getProfessorId_returnsProfessorId() {
        String courseCode = "CS101";
        String expected = "123";

        when(jdbcTemplate.queryForObject(
                eq("SELECT professorId FROM course WHERE courseCode = ?"),
                eq(new Object[]{courseCode}),
                eq(String.class))
        ).thenReturn(expected);

        String result = courseDAO.getProfessorId(courseCode);

        assertEquals(expected, result);
        verify(jdbcTemplate, times(1)).queryForObject(
                eq("SELECT professorId FROM course WHERE courseCode = ?"),
                eq(new Object[]{courseCode}),
                eq(String.class)
        );
    }
}
