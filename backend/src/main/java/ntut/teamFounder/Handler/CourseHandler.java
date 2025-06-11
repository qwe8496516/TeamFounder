package ntut.teamFounder.Handler;

import io.swagger.v3.oas.annotations.tags.Tag;
import ntut.teamFounder.DAO.CourseDAO;
import ntut.teamFounder.DAO.StudentDAO;
import ntut.teamFounder.Domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
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
            List<Map<String, Object>> coursesMap = new ArrayList<>();
            for (String courseCode : courseCodes) {
                Course course = courseDAO.getCourseByCourseCode(courseCode);
                int studentNum = studentDAO.getStudentCount(course.getCourseCode());
                Map<String, Object> courseMap = course.toMap();
                courseMap.put("students", studentNum);
                coursesMap.add(courseMap);
            }
            return ResponseEntity.ok(coursesMap);
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
            List<Long> studentIds = courseDAO.getStudentsInMatch(courseCode, userId);
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

    @GetMapping("/professor/{professorId}")
    public ResponseEntity<?> getCoursesByProfessorId(@PathVariable String professorId) {
        try {
            List<Course> courses = courseDAO.getCoursesByProfessorId(professorId);
            List<Map<String, Object>> coursesMap = new ArrayList<>();
            for (Course course : courses) {
                int studentNum = studentDAO.getStudentCount(course.getCourseCode());
                Map<String, Object> courseMap = course.toMap();
                courseMap.put("students", studentNum);
                coursesMap.add(courseMap);
            }
            return ResponseEntity.ok(coursesMap);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to retrieve course: " + e.getMessage());
        }
    }

    // In your CourseHandler
    @GetMapping("/{courseCode}/export")
    public ResponseEntity<byte[]> exportTeamList(
            @PathVariable String courseCode,
            @RequestParam(defaultValue = "pdf") String fileType) {

        try {
            List<Team> teams = courseDAO.getTeamsByCourseCode(courseCode);
            List<Map<String, Object>> result = new ArrayList<>();
            for (Team team : teams) {
                Map<String, Object> teamMap = new HashMap<>();
                teamMap.put("teamId", team.getTeamId());
                teamMap.put("courseCode", team.getCourseCode());

                // Get member details
                List<Map<String, Object>> membersList = new ArrayList<>();
                for (Long memberId : team.getMembers()) {
                    Student student = studentDAO.getStudentById(memberId);
                    if (student != null) {
                        membersList.add(student.toMap());
                    }
                }
                teamMap.put("members", membersList);

                result.add(teamMap);
            }
            TeamExportFile exportFile = new TeamExportFile();
            byte[] fileContent = exportFile.generateExport(result, fileType);

            return ResponseEntity.ok()
                    .header("Content-Type", fileType.equalsIgnoreCase("pdf") ? "application/pdf" : "text/csv")
                    .header("Content-Disposition", "attachment; filename=teams_" + courseCode + (fileType.equalsIgnoreCase("pdf") ? ".pdf" : ".csv"))
                    .body(fileContent);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(("Export failed: " + e.getMessage()).getBytes());
        }
    }


    @GetMapping("/{courseCode}/teams")
    public ResponseEntity<?> getTeamsInCourse(@PathVariable String courseCode) {
        try {
            List<Team> teams = courseDAO.getTeamsByCourseCode(courseCode);
            List<Map<String, Object>> result = new ArrayList<>();

            for (Team team : teams) {
                Map<String, Object> teamMap = new HashMap<>();
                teamMap.put("teamId", team.getTeamId());
                teamMap.put("courseCode", team.getCourseCode());
                teamMap.put("formed", team.isFormed());

                // Get member details
                List<Map<String, Object>> membersList = new ArrayList<>();
                for (Long memberId : team.getMembers()) {
                    Student student = studentDAO.getStudentById(memberId);
                    if (student != null) {
                        membersList.add(student.toMap());
                    }
                }
                teamMap.put("members", membersList);

                result.add(teamMap);
            }

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to retrieve team list: " + e.getMessage());
        }
    }



}
