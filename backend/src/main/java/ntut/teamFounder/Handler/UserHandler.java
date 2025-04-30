package ntut.teamFounder.Handler;

import io.swagger.v3.oas.annotations.tags.Tag;
import ntut.teamFounder.DAO.UserDAO;
import ntut.teamFounder.Domain.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
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

            User loginUser = new User(0L, userId, "", password, "", 0, new Date());
            loginUser.encodeBase64();
            String encodePassword = loginUser.getPassword();

            User user = userDAO.getUserById(userId);
            if (user == null || !user.isPasswordValid(encodePassword)) {
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
    public ResponseEntity<?> register(@RequestBody Map<String, String> registerData) {
        try {
            String username = registerData.get("username");
            String userId = registerData.get("userId");
            String password = registerData.get("password");
            String confirmPassword = registerData.get("confirmPassword");
            String email = registerData.get("email");

            if (!password.equals(confirmPassword)) {
                return ResponseEntity.badRequest().body("Passwords do not match");
            }
            if (userDAO.getUserById(userId) != null) {
                return ResponseEntity.badRequest().body("User ID already exists");
            }

            User user = new User(0L, userId, username, password, email, 0, new Date());
            user.encodeBase64();
            String encodePassword = user.getPassword();
            int affected = userDAO.createUser(userId, username, encodePassword, email);

            if (affected == 0) {
                return ResponseEntity.badRequest().body("Registration failed");
            }
            return ResponseEntity.ok("Registration successful");
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

            User user = new User(0L, userId, "", password, "", 0, new Date());
            user.encodeBase64();
            String encodePassword = user.getPassword();

            if (!password.equals(confirmPassword)) {
                return ResponseEntity.badRequest().body("Passwords do not match");
            }

            int updated = userDAO.updateUser(userId, encodePassword);

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