package ntut.teamFounder.Domain;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Skill {
    private Long id;
    private String type;
    private String name;

    public Skill(long id, String type, String name) {
        this.id = id;
        this.type = type;
        this.name = name;
    }
}
