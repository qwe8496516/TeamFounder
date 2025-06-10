package ntut.teamFounder.Domain;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class Team {
    private List<Long> members;
    private boolean formed;
    private int teamId;
    private String courseCode;

    public Team(String courseCode, int teamId) {
        this.members = new ArrayList<>();
        this.courseCode = courseCode;
        this.teamId = teamId;
        this.formed = false;
    }

    public void addMember(Long userId) {
        members.add(userId);
    }

    public void removeMember(Long userId) {
        members.remove(userId);
    }
}
