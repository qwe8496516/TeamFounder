package ntut.teamFounder.Handler;

import ntut.teamFounder.DAO.UserDAO;
import ntut.teamFounder.Domain.Student;
import ntut.teamFounder.DAO.StudentDAO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/student")
public class StudentHandler {
    private final StudentDAO studentDAO;
    private final UserDAO userDAO;

    public StudentHandler(StudentDAO studentDAO, UserDAO userDAO) {
        this.studentDAO = studentDAO;
        this.userDAO = userDAO;
    }

    @GetMapping("/profile/{studentId}")
    public ResponseEntity<?> getProfile(@PathVariable String studentId) {
        try {
            Student student = studentDAO.getStudentById(studentId);
            return ResponseEntity.ok(student);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Student not found");
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            @RequestParam String userId,
            @RequestParam String username,
            @RequestParam String password,
            @RequestParam String email
    ) {
        // Validate required fields
        if (username == null || password == null || email == null) {
            return ResponseEntity.badRequest().body("Required fields are missing");
        }
        if (!email.contains("@")) {
            return ResponseEntity.badRequest().body("Invalid email format");
        }

        try {
            Student student = new Student(
                    null, // id is auto-generated
                    userId,
                    username,
                    password,
                    email,
                    new Date()
            );

            int updated = studentDAO.updateStudent(student);
            if (updated > 0) {
                Map<String, String> resp = new HashMap<>();
                resp.put("message", "Profile updated successfully");
                return ResponseEntity.ok(resp);
            } else {
                return ResponseEntity.badRequest().body("Update failed");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating profile: " + e.getMessage());
        }
    }

    @DeleteMapping("/profile/{studentId}")
    public ResponseEntity<?> deleteProfile(@PathVariable String studentId) {
        int deleted = studentDAO.deleteStudent(studentId);
        if (deleted > 0) {
            return ResponseEntity.ok("Profile deleted successfully");
        } else {
            return ResponseEntity.badRequest().body("Delete failed");
        }
    }

    @PutMapping("/profile/{userId}/skills")
    public ResponseEntity<?> addSkillToProfile(
            @PathVariable Long userId,
            @RequestParam Long skillId
    ) {
        try {
            studentDAO.addSkillToStudent(userId, skillId);
            return ResponseEntity.ok("Skill added successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to add skill: " + e.getMessage());
        }
    }

    @GetMapping("/profile/{userId}/skills")
    public ResponseEntity<List<Long>> getProfileSkills(@PathVariable Long userId) {
        List<Long> skills = studentDAO.getSkillsByStudentId(userId);
        return ResponseEntity.ok(skills);
    }

    @PostMapping("/profile/{userId}/courses")
    public ResponseEntity<?> enrollInCourse(
            @PathVariable Long userId,
            @RequestParam String courseCode
    ) {
        try {
            int result = studentDAO.enrollInCourse(userId, courseCode);
            return ResponseEntity.ok("Enrolled in course successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Enrollment failed: " + e.getMessage());
        }
    }

    @GetMapping("/profile/{userId}/courses")
    public ResponseEntity<List<String>> getEnrolledCourses(@PathVariable Long userId) {
        List<String> courses = studentDAO.getCoursesByStudentId(userId);
        return ResponseEntity.ok(courses);
    }
}
