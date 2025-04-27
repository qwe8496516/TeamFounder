package ntut.teamFounder.Domain;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;

@Getter
@Setter
public class User {
    private Long id;
    private String userId;
    private String username;
    private String password;
    private String email;
    private int privilege; // 0: student, 1: professor
    private Date createdAt;

    public User(Long id, String userId, String username, String password, String email, int privilege, Date createdAt) {
        this.id = id;
        this.userId = userId;
        this.username = username;
        this.password = password;
        this.email = email;
        this.privilege = privilege;
        this.createdAt = createdAt;
    }

    public boolean isValid(String password) {
        return this.password.equals(password);
    }

    public boolean isProfessor() {
        return this.privilege == 1;
    }

    public boolean isStudent() {
        return this.privilege == 0;
    }

} 