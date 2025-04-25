package ntut.teamFounder.Domain;

import lombok.Getter;
import lombok.Setter;
import ntut.teamFounder.DAO.UserDAO;
import org.springframework.stereotype.Service;

import java.util.List;

@Getter
@Setter
@Service
public class UserList {

    private final UserDAO userDAO;

    private List<User> users;

    public UserList(UserDAO userDAO) {
        this.userDAO = userDAO;
        this.users = userDAO.getAllUsers();
    }

    public User getUserById(String userId) {
        for (User user : users) {
            if (user.getUserId().equals(userId)) {
                return user;
            }
        }
        return null;
    }

}
