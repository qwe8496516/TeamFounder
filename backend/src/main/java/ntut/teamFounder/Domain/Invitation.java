package ntut.teamFounder.Domain;

import lombok.Getter;
import lombok.Setter;

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
}
