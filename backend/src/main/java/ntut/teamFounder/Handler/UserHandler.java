package ntut.teamFounder.Handler;

import io.swagger.v3.oas.annotations.tags.Tag;
import ntut.teamFounder.Domain.User;
import ntut.teamFounder.Domain.UserList;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@Tag(name = "Auth API")
@CrossOrigin(origins = "localhost:5173")
@RequestMapping("/api/auth")
public class UserHandler {

    private final UserList userList;

    public UserHandler(UserList userList) {
        this.userList = userList;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String userId = credentials.get("userId");
        String password = credentials.get("password");

        String token = "token"; // jwt token

        User user = userList.getUserById(userId);
        if (user == null || !user.isValid(password)) {
            return ResponseEntity.badRequest().body("Invalid credentials");
        } else {
            if (user.isProfessor()) {
                Map<String, String> response = new HashMap<>();
                response.put("token", token);
                response.put("redirect", "/professor");
                response.put("userId", userId);
                return ResponseEntity.ok(response);
            } else if (user.isStudent()) {
                Map<String, String> response = new HashMap<>();
                response.put("token", token);
                response.put("redirect", "/student");
                response.put("userId", userId);
                return ResponseEntity.ok(response);
            }
            return ResponseEntity.badRequest().body("Invalid credentials");
        }
    }

//    @PostMapping("/register")
//    public ResponseEntity<?> register(@RequestBody Map<String, String> userData) {
//        try {
//            String username = userData.get("username");
//            String password = userData.get("password");
//            String email = userData.get("email");
//
//            User user = authService.registerUser(username, password, email);
//            return ResponseEntity.ok(user);
//        } catch (RuntimeException e) {
//            return ResponseEntity.badRequest().body(e.getMessage());
//        }
//    }
} 