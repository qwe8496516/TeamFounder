package ntut.teamFounder.Domain;

import lombok.Getter;
import lombok.Setter;

import java.util.*;

@Getter
@Setter
public class Student extends User {
    private List<Long> skills = new ArrayList<>();
    private List<String> courses = new ArrayList<>();

    public Student(Long id, String userId, String username, String password,
                   String email, Date createdAt) {
        super(id, userId, username, password, email, 0, createdAt); // Privilege 0 = student
    }

    public Map<String, Object> toMap() {
        Map<String, Object> map = new HashMap<>();
        map.put("userId", this.getUserId());
        map.put("username", this.getUsername());
        map.put("email", this.getEmail());
        return map;
    }

    private String encodeBase64(String value) {
        return value == null ? null : Base64.getEncoder().encodeToString(value.getBytes());
    }
}
