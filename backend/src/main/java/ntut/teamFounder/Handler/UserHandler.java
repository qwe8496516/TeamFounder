package ntut.teamFounder.Handler;

import io.swagger.v3.oas.annotations.tags.Tag;
import ntut.teamFounder.DAO.UserDAO;
import ntut.teamFounder.Domain.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@Tag(name = "Auth API")
@CrossOrigin(origins = "localhost:5173")
@RequestMapping("/api/auth")
public class UserHandler {

    private final UserDAO userDAO;

    public UserHandler(UserDAO userDAO) {
        this.userDAO = userDAO;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        try {
            String userId = credentials.get("userId");
            String password = credentials.get("password");

            User user = userDAO.getUserById(userId);
            if (user == null || !user.isPasswordValid(password)) {
                return ResponseEntity.badRequest().body("Invalid credentials");
            }

            String token = "jwt-token";
            Map<String, String> res = new HashMap<>();
            res.put("id", user.getId().toString());
            res.put("token", token);
            res.put("userId", user.getUserId());
            res.put("role", user.getRoleName());
            res.put("redirect", "/" + user.getRoleName());
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid credentials");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestParam String username, @RequestParam String userId, @RequestParam String email, @RequestParam String password, @RequestParam String confirmPassword) {
        try {
            if (!password.equals(confirmPassword)) {
                return ResponseEntity.badRequest().body("Passwords do not match");
            }
            if (userDAO.getUserById(userId) != null) {
                return ResponseEntity.badRequest().body("User ID already exists");
            }
            int affected = userDAO.createUser(userId, username, password, email);

            if (affected == 0) {
                return ResponseEntity.badRequest().body("Registration failed");
            }
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Registration successful");
            response.put("userId", userId);
            response.put("username", username);
            response.put("email", email);

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
             return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
             return ResponseEntity.internalServerError().body("An error occurred during registration" + e.getMessage() + ".");
        }
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> credentials) {
        try {
            String userId = credentials.get("userId");
            String password = credentials.get("password");
            String confirmPassword = credentials.get("confirmPassword");

            if (!password.equals(confirmPassword)) {
                return ResponseEntity.badRequest().body("Passwords do not match");
            }

            int updated = userDAO.updateUser(userId, password);

            if (updated > 0) {
                Map<String, String> res = new HashMap<>();
                res.put("message", "Password updated successfully");
                return ResponseEntity.ok(res);
            } else {
                return ResponseEntity.badRequest().body("Update failed");
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("An error occurred during registration");
        }
    }
} 