package ntut.teamFounder.DAO;

import ntut.teamFounder.Domain.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
public class UserDAOTest {

    @Autowired
    private UserDAO userDAO;

    @Test
    public void getUserByIdTest () {
        User user = userDAO.getUserById("113598012");
        assertEquals("113598012", user.getUserId());
    }

}
