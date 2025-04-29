package ntut.teamFounder.Handler;

import io.swagger.v3.oas.annotations.tags.Tag;
import ntut.teamFounder.DAO.CourseDAO;
import ntut.teamFounder.DAO.StudentDAO;
import ntut.teamFounder.Domain.Course;
import ntut.teamFounder.Domain.Enrollment;
import ntut.teamFounder.Domain.Student;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@Tag(name = "Course API")
@CrossOrigin(origins = "localhost:5173")
@RequestMapping("/api/course")
public class CourseHandler {

    private final CourseDAO courseDAO;
    private final StudentDAO studentDAO;

    public CourseHandler(CourseDAO courseDAO, StudentDAO studentDAO) {
        this.courseDAO = courseDAO;
        this.studentDAO = studentDAO;
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<?> getCoursesByStudentId(@PathVariable Long studentId) {
        try {
            List<String> courseCodes = courseDAO.getCourseByStudentId(studentId);
            List<Course> courses = new ArrayList<>();
            for (String courseCode : courseCodes) {
                Course course = courseDAO.getCourseByCourseCode(courseCode);
                courses.add(course);
            }
            return ResponseEntity.ok(courses);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to retrieve course: " + e.getMessage());
        }
    }

    @GetMapping("/{courseCode}/students")
    public ResponseEntity<?> getCourseStudents(@PathVariable String courseCode) {
        try {
            List<Long> enrollments = courseDAO.getCourseStudents(courseCode);
            List<Map<String, Object>> students = new ArrayList<>();
            for (Long enrollment : enrollments) {
                Student student = studentDAO.getStudentById(enrollment);
                students.add(student.toMap());
            }
            return ResponseEntity.ok(students);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to retrieve course: " + e.getMessage());
        }
    }

}
