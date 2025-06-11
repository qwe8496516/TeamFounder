package ntut.teamFounder.Domain;

import org.junit.jupiter.api.Test;

import java.util.Date;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class ProfessorTest {

    @Test
    void testProfessorConstructorAndGetters() {
        Long id = 1L;
        String userId = "P001";
        String username = "DrSmith";
        String password = "securePass";
        String email = "dr.smith@example.com";
        Date createdAt = new Date();

        Professor professor = new Professor(id, userId, username, password, email, createdAt);

        assertEquals(id, professor.getId());
        assertEquals(userId, professor.getUserId());
        assertEquals(username, professor.getUsername());
        assertEquals(password, professor.getPassword());
        assertEquals(email, professor.getEmail());
        assertEquals(createdAt, professor.getCreatedAt());
    }

    @Test
    void testToMapMethod() {
        Professor professor = new Professor(
                1L,
                "P001",
                "DrJones",
                "pass123",
                "jones@example.com",
                new Date()
        );

        Map<String, Object> map = professor.toMap();

        assertEquals("P001", map.get("professorId"));
        assertEquals("DrJones", map.get("username"));
        assertEquals("jones@example.com", map.get("email"));
        assertEquals("professor", map.get("role")); // 假設 getRoleName() 回傳 "Professor"
    }
}
