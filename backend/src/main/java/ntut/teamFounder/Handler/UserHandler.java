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
        String userId = credentials.get("userId");
        String password = credentials.get("password");

        User user = userDAO.getUserById(userId);
        if (user == null || !user.isValid(password)) {
            return ResponseEntity.badRequest().body("Invalid credentials");
        }

        String token = "jwt-token"; // 模擬 token
        Map<String, String> res = new HashMap<>();
        res.put("token", token);
        res.put("userId", user.getUserId());
        res.put("role", user.getRoleName());
        res.put("redirect", user.getRedirectPath());
        return ResponseEntity.ok(res);
    }

   @PostMapping("/register")
   public ResponseEntity<?> register(@RequestBody Map<String, String> userData) {
       try {
           String userId = userData.get("userId");
           String username = userData.get("username");
           String password = userData.get("password");
           String confirmPassword = userData.get("confirmPassword");
           String email = userData.get("email");

           if (!password.equals(confirmPassword)) {
               return ResponseEntity.badRequest().body("Passwords do not match");
           }

           User user = userDAO.createUser(userId, username, password, email);

           Map<String, Object> response = new HashMap<>();
           response.put("message", "Registration successful");
           response.put("userId", user.getUserId());
           response.put("username", user.getUsername());
           response.put("email", user.getEmail());
           response.put("privilege", user.getPrivilege());

           return ResponseEntity.ok(response);
       } catch (IllegalArgumentException e) {
           return ResponseEntity.badRequest().body(e.getMessage());
       } catch (Exception e) {
           return ResponseEntity.internalServerError().body("An error occurred during registration");
       }
   }
} 