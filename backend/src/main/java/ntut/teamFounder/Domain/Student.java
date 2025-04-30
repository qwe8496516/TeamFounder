package ntut.teamFounder.Domain;

import lombok.Getter;
import lombok.Setter;

import java.util.*;

@Getter
@Setter
public class Student extends User {
    private List<Long> skills = new ArrayList<>();
    private List<String> courses = new ArrayList<>();

    public Student(Long id, String userId, String username, String password,
                   String email, Date createdAt) {
        super(id, userId, username, password, email, 0, createdAt);
    }

    public double calculateFitness(List<Long> matcherSkills) {
        double fitness = 0;
        int weight = matcherSkills.size();
        if (skills.isEmpty() || matcherSkills.isEmpty()) {
            return 50;
        }
        for (Long skillId : matcherSkills) {
            if (this.skills.contains(skillId)) {
                fitness++;
            }
        }
        fitness = calculateWeight(fitness, weight);
        fitness = fitnessToInteger(fitness);
        return fitness;
    }

    public double calculateWeight(double fitness, int weight) {
        fitness = (fitness * 100 / weight) * 0.1 + 90;
        return fitness;
    }

    public double fitnessToInteger(double fitness) {
        if (fitness >= 0) {
            return Math.floor(fitness);
        } else {
            return Math.ceil(fitness);
        }
    }

    public Map<String, Object> toMap() {
        Map<String, Object> map = new HashMap<>();
        map.put("id", this.getId());
        map.put("userId", this.getUserId());
        map.put("username", this.getUsername());
        map.put("email", this.getEmail());
        return map;
    }

}
