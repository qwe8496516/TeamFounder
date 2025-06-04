package ntut.teamFounder.Handler;

import io.swagger.v3.oas.annotations.tags.Tag;
import ntut.teamFounder.DAO.ProfessorDAO;
import ntut.teamFounder.Domain.Professor;
import ntut.teamFounder.Domain.Skill;
import ntut.teamFounder.Domain.Student;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@Tag(name = "Professor API")
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/professor")
public class ProfessorHandler {

    private final ProfessorDAO professorDAO;

    public ProfessorHandler(ProfessorDAO professorDAO) {
        this.professorDAO = professorDAO;
    }

    @GetMapping("/profile/{professorId}")
    public ResponseEntity<?> getProfessorProfile(@PathVariable String professorId) {
        try {
            Professor professor = professorDAO.getProfessorByProfessorId(professorId);
            if (professorDAO.getProfessorByProfessorId(professorId).getPrivilege() == 0) {
                return ResponseEntity.badRequest().body("User is not a professor.");
            }
            Map<String, Object> res = professor.toMap();
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Student not found.");
        }
    }

}
