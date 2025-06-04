package ntut.teamFounder.Domain;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Getter
@Setter
public class Professor extends User{

    public Professor(Long id, String userId, String username, String password, String email, Date createdAt) {
        super(id, userId, username, password, email, 1, createdAt);
    }

    @Override
    public Map<String, Object> toMap() {
        Map<String, Object> res = new HashMap<>();
        res.put("professorId", getUserId());
        res.put("username", getUsername());
        res.put("email", getEmail());
        res.put("role", getRoleName());
        return res;
    }
}
