package ntut.teamFounder.Domain;

import lombok.Getter;
import lombok.Setter;

import java.util.HashMap;
import java.util.Map;

@Getter
@Setter
public class Invitation {
    // Getters and Setters
    private Long id;
    private Long senderId;
    private Long receiverId;
    private String courseCode;
    private String message;
    private int status;
    
    public Map<String, Object> toMap() {
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("id", id);
        map.put("senderId", senderId);
        map.put("message", message);
        map.put("status", status);
        return map;
    }
}
