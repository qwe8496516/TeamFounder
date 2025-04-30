package ntut.teamFounder.Domain;

import org.junit.jupiter.api.Test;
import java.util.Date;
import static org.junit.jupiter.api.Assertions.*;

public class UserTest {

    @Test
    public void testConstructor() {
        Date currentDate = new Date();
        User user = new User(10L, "113598999", "Mike Wang", "13579", "t113598999@ntut.org.tw", 0, currentDate);

        assertEquals(10L, user.getId());
        assertEquals("113598999", user.getUserId());
        assertEquals("Mike Wang", user.getUsername());
        assertEquals("13579", user.getPassword());
        assertEquals("t113598999@ntut.org.tw", user.getEmail());
        assertEquals(0, user.getPrivilege());
        assertEquals(currentDate, user.getCreatedAt());
    }

    @Test
    public void testIsPasswordValid() {
        Date currentDate = new Date();
        User user = new User(10L, "113598999", "Mike Wang", "13579", "t113598999@ntut.org.tw", 0, currentDate);

        assertFalse(user.isPasswordValid("02468"));
        assertTrue(user.isPasswordValid("13579"));
    }

    @Test
    public void testIsProfessor() {
        Date currentDate = new Date();
        User user = new User(10L, "113598999", "Mike Wang", "13579", "t113598999@ntut.org.tw", 1, currentDate);

        assertTrue(user.isProfessor());
    }

    @Test
    public void testIsStudent() {
        Date currentDate = new Date();
        User user = new User(10L, "113598999", "Mike Wang", "13579", "t113598999@ntut.org.tw", 0, currentDate);

        assertTrue(user.isStudent());
    }

    @Test
    public void testGetRoleName() {
        Date currentDate = new Date();
        User user1 = new User(10L, "113598999", "Mike Wang", "13579", "t113598999@ntut.org.tw", 1, currentDate);
        User user2 = new User(10L, "113598999", "Mike Wang", "13579", "t113598999@ntut.org.tw", 0, currentDate);

        assertEquals("professor", user1.getRoleName());
        assertEquals("student", user2.getRoleName());
    }

    @Test
    public void testEncodeBase64() {
        Date currentDate = new Date();
        User user = new User(10L, "113598999", "Mike Wang", "13579", "t113598999@ntut.org.tw", 1, currentDate);
        user.encodeBase64();

        assertEquals("MTM1Nzk=", user.getPassword());
    }

}
