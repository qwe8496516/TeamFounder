package ntut.teamFounder.Handler;

import io.swagger.v3.oas.annotations.tags.Tag;
import ntut.teamFounder.Domain.Skill;
import ntut.teamFounder.Domain.Student;
import ntut.teamFounder.DAO.StudentDAO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@Tag(name = "Student API")
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/student")
public class StudentHandler {
    private final StudentDAO studentDAO;

    public StudentHandler(StudentDAO studentDAO) {
        this.studentDAO = studentDAO;
    }

    @GetMapping("/profile/{studentId}")
    public ResponseEntity<?> getProfile(@PathVariable String studentId) {
        try {
            Student student = studentDAO.getStudentByStudentId(studentId);
            if (studentDAO.getStudentByStudentId(studentId).getPrivilege() == 1) {
                return ResponseEntity.badRequest().body("User is not a student.");
            }
            List<Long> skills = studentDAO.getSkillsById(student.getId());
            List<Skill> skillList = new ArrayList<>();
            for (Long skill : skills) {
                Skill s = studentDAO.getSkillById(skill);
                skillList.add(s);
            }
            Map<String, Object> res = new HashMap<>();
            res.put("studentId", student.getUserId());
            res.put("username", student.getUsername());
            res.put("email", student.getEmail());
            res.put("skills", skillList);
            res.put("role", student.getRoleName());
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Student not found.");
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<?> editProfile(
            @RequestParam String userId,
            @RequestParam String username,
            @RequestParam String password,
            @RequestParam String email
    ) {
        if (username == null || password == null || email == null) {
            return ResponseEntity.badRequest().body("Required fields are missing.");
        }
        if (!email.contains("@")) {
            return ResponseEntity.badRequest().body("Invalid email format.");
        }

        try {
            Student student = new Student(null, userId, username, password, email, new Date() );

            int updated = studentDAO.updateStudent(student);
            if (updated > 0) {
                Map<String, String> resp = new HashMap<>();
                resp.put("message", "Profile updated successfully.");
                return ResponseEntity.ok(resp);
            } else {
                return ResponseEntity.badRequest().body("Update failed.");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating profile: " + e.getMessage() + ".");
        }
    }

    @DeleteMapping("/profile/{studentId}")
    public ResponseEntity<?> deleteProfile(@PathVariable String studentId) {
        int deleted = studentDAO.deleteStudent(studentId);
        if (deleted > 0) {
            return ResponseEntity.ok("Profile deleted successfully.");
        } else {
            return ResponseEntity.badRequest().body("Delete failed.");
        }
    }

    @PutMapping("/profile/{userId}/skills")
    public ResponseEntity<?> addSkillToProfile(
            @PathVariable Long userId,
            @RequestParam Long skillId
    ) {
        try {
            studentDAO.addSkillToStudent(userId, skillId);
            return ResponseEntity.ok("Skill added successfully.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to add skill: " + e.getMessage() + ".");
        }
    }

    @DeleteMapping("/profile/{userId}/skills/{skillId}")
    public ResponseEntity<?> deleteSkillFromProfile(
            @PathVariable Long userId,
            @PathVariable Long skillId
    ) {
        try {
            int deleted = studentDAO.deleteSkillFromStudent(userId, skillId);
            if (deleted > 0) {
                return ResponseEntity.ok("Skill removed successfully.");
            } else {
                return ResponseEntity.badRequest().body("Skill not found or already removed.");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to remove skill: " + e.getMessage() + ".");
        }
    }

    @PostMapping("/profile/{userId}/courses")
    public ResponseEntity<?> enrollInCourse(
            @PathVariable Long userId,
            @RequestParam String courseCode
    ) {
        try {
            studentDAO.enrollInCourse(userId, courseCode);
            return ResponseEntity.ok("Enrolled in course successfully.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Enrollment failed: " + e.getMessage() + ".");
        }
    }

    @GetMapping("/profile/{userId}/courses")
    public ResponseEntity<List<String>> getEnrolledCourses(@PathVariable Long userId) {
        List<String> courses = studentDAO.getCoursesById(userId);
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/profile/skills")
    public ResponseEntity<?> getAllSkills() {
        try {
            List<Skill> skills = studentDAO.getAllSkills();
            return ResponseEntity.ok(skills);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to retrieve skills: " + e.getMessage() + ".");
        }
    }

    @GetMapping("/profile/{userId}/skills")
    public ResponseEntity<?> getProfileSkills(@PathVariable Long userId) {
        try {
            List<Long> skills = studentDAO.getSkillsById(userId);
            List<Skill> skillList = new ArrayList<>();
            for (Long skill : skills) {
                Skill s = studentDAO.getSkillById(skill);
                skillList.add(s);
            }
            return ResponseEntity.ok(skillList);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to retrieve skills: " + e.getMessage() + ".");
        }
    }

}
