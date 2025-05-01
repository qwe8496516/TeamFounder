package ntut.teamFounder.Handler;

import io.swagger.v3.oas.annotations.tags.Tag;
import ntut.teamFounder.DAO.CourseDAO;
import ntut.teamFounder.DAO.StudentDAO;
import ntut.teamFounder.Domain.Course;
import ntut.teamFounder.Domain.Skill;
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

    @GetMapping("/{courseCode}")
    public ResponseEntity<?> getCourseByCourseCode(@PathVariable String courseCode) {
        try {
            Course course = courseDAO.getCourseByCourseCode(courseCode);
            int studentNum = studentDAO.getStudentCount(courseCode);
            Map<String, Object> courseMap = course.toMap();
            courseMap.put("students", studentNum);
            return ResponseEntity.ok(courseMap);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to retrieve course: " + e.getMessage());
        }
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
    public ResponseEntity<?> getStudentInCourse(@PathVariable String courseCode) {
        try {
            List<Long> enrollments = courseDAO.getStudentsInCourse(courseCode);
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

    @GetMapping("/{courseCode}/student/{userId}/match")
    public ResponseEntity<?> getCompatibleStudents(@PathVariable String courseCode, @PathVariable Long userId) {
        try {
            Student matcher = studentDAO.getStudentById(userId);
            matcher.setSkills(studentDAO.getSkillsById(userId));
            List<Long> studentIds = courseDAO.getStudentsInCourse(courseCode);
            List<Map<String, Object>> students = new ArrayList<>();
            for (Long studentId : studentIds) {
                Student student = studentDAO.getStudentById(studentId);
                student.setSkills(studentDAO.getSkillsById(studentId));
                if (!student.getId().equals(userId)) {
                    List<Skill> skillList = new ArrayList<>();
                    for (Long skill : student.getSkills()) {
                        Skill s = studentDAO.getSkillById(skill);
                        skillList.add(s);
                    }
                    int fitness = student.calculateFitness(matcher.getSkills());
                    Map<String, Object> map = student.toMap();
                    map.put("Fitness", fitness);
                    map.put("skills", skillList);
                    students.add(map);
                }
            }
            return ResponseEntity.ok(students);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to retrieve match list: " + e.getMessage());
        }
    }

}
