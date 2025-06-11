package ntut.teamFounder.Domain;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Getter
@Setter
public class Team {
    private List<Long> members;
    private boolean formed;
    private Long teamId;
    private String courseCode;

    public Team(String courseCode, Long teamId, boolean formed) {
        this.members = new ArrayList<>();
        this.courseCode = courseCode;
        this.teamId = teamId;
        this.formed = formed;
    }

    public void addMember(Long userId) {
        members.add(userId);
    }

    public void removeMember(Long userId) {
        members.remove(userId);
    }

    public Map<String, Object> toMap () {
        Map<String, Object> map = new HashMap<>();
        map.put("teamId", teamId);
        map.put("members", members);
        map.put("formed", formed);
        return map;
    }
}
