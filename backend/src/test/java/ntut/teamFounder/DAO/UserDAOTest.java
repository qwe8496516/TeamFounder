package ntut.teamFounder.DAO;

import ntut.teamFounder.Domain.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
@Transactional
public class UserDAOTest {

    @Autowired
    private UserDAO userDAO;

    @Test
    public void getUserByIdTest() {
        User user = userDAO.getUserById("113598012");
        assertEquals(1L, user.getId());
        assertEquals("113598012", user.getUserId());
        assertEquals("Yang Hong Jie", user.getUsername());
        assertEquals("MTIzNDU2", user.getPassword());
        assertEquals("t113598012@ntut.org.tw", user.getEmail());
        assertEquals(0, user.getPrivilege());
    }

    @Test
    public void createUser() {
        int res = userDAO.createUser("111111111", "Test Data", "MTIzNDU6", "t111111111@ntut.org.tw");
        assertEquals(1, res);
    }

    @Test
    public void updateUser() {
        int res = userDAO.updateUser("113598012", "FWF46468F");
        User user = userDAO.getUserById("113598012");
        assertEquals("FWF46468F", user.getPassword());
    }

}
