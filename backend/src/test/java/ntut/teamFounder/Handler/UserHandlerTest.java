package ntut.teamFounder.Handler;

import ntut.teamFounder.DAO.UserDAO;
import ntut.teamFounder.Domain.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class UserHandlerTest {

    @Mock
    private UserDAO userDAO;

    @InjectMocks
    private UserHandler userHandler;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void login_WithValidCredentials_ShouldReturnSuccess() {
        Map<String, String> credentials = new HashMap<>();
        credentials.put("userId", "testUser");
        credentials.put("password", "testPass");

        User mockUser = new User(1L, "testUser", "Test User", "dGVzdFBhc3M=", "test@example.com", 0, new Date());
        when(userDAO.getUserById("testUser")).thenReturn(mockUser);

        ResponseEntity<?> response = userHandler.login(credentials);

        assertTrue(response.getStatusCode().is2xxSuccessful());
        Map<String, String> responseBody = (Map<String, String>) response.getBody();
        assertNotNull(responseBody);
        assertEquals("testUser", responseBody.get("userId"));
        assertEquals("student", responseBody.get("role"));
    }

    @Test
    void login_WithInvalidCredentials_ShouldReturnBadRequest() {
        Map<String, String> credentials = new HashMap<>();
        credentials.put("userId", "testUser");
        credentials.put("password", "wrongPass");

        when(userDAO.getUserById("testUser")).thenReturn(null);

        ResponseEntity<?> response = userHandler.login(credentials);

        assertTrue(response.getStatusCode().is4xxClientError());
        assertEquals("Invalid credentials", response.getBody());
    }

    @Test
    void register_WithValidData_ShouldReturnSuccess() {
        Map<String, String> registerData = new HashMap<>();
        registerData.put("username", "Test User");
        registerData.put("userId", "testUser");
        registerData.put("password", "testPass");
        registerData.put("confirmPassword", "testPass");
        registerData.put("email", "test@example.com");

        when(userDAO.getUserById("testUser")).thenReturn(null);
        when(userDAO.createUser(any(), any(), any(), any())).thenReturn(1);

        ResponseEntity<?> response = userHandler.register(registerData);

        assertTrue(response.getStatusCode().is2xxSuccessful());
        assertEquals("Registration successful", response.getBody());
    }

    @Test
    void register_WithExistingUserId_ShouldReturnBadRequest() {
        Map<String, String> registerData = new HashMap<>();
        registerData.put("username", "Test User");
        registerData.put("userId", "existingUser");
        registerData.put("password", "testPass");
        registerData.put("confirmPassword", "testPass");
        registerData.put("email", "test@example.com");

        User existingUser = new User(1L, "existingUser", "Existing User", "password", "existing@example.com", 0, new Date());
        when(userDAO.getUserById("existingUser")).thenReturn(existingUser);

        ResponseEntity<?> response = userHandler.register(registerData);

        assertTrue(response.getStatusCode().is4xxClientError());
        assertEquals("User ID already exists", response.getBody());
    }

    @Test
    void changePassword_WithValidData_ShouldReturnSuccess() {
        Map<String, String> credentials = new HashMap<>();
        credentials.put("userId", "testUser");
        credentials.put("password", "newPass");
        credentials.put("confirmPassword", "newPass");

        when(userDAO.updateUser(any(), any())).thenReturn(1);

        ResponseEntity<?> response = userHandler.changePassword(credentials);

        assertTrue(response.getStatusCode().is2xxSuccessful());
        Map<String, String> responseBody = (Map<String, String>) response.getBody();
        assertNotNull(responseBody);
        assertEquals("Password updated successfully", responseBody.get("message"));
    }

    @Test
    void changePassword_WithMismatchedPasswords_ShouldReturnBadRequest() {
        Map<String, String> credentials = new HashMap<>();
        credentials.put("userId", "testUser");
        credentials.put("password", "newPass");
        credentials.put("confirmPassword", "differentPass");

        ResponseEntity<?> response = userHandler.changePassword(credentials);

        assertTrue(response.getStatusCode().is4xxClientError());
        assertEquals("Passwords do not match", response.getBody());
    }
}
