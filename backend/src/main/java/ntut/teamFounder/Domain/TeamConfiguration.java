package ntut.teamFounder.Domain;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Getter
@Setter
public class TeamConfiguration {

    private Long configId;
    private String courseCode;
    private String title;
    private String description;
    private Boolean formationType;
    private Boolean status;
    private int minSize;
    private int maxSize;
    private Date startDate;
    private Date endDate;

    public TeamConfiguration (Long config, String courseCode, String title, String description, Boolean formationType, Boolean status, int minSize, int maxSize, Date startDate, Date endDate) {
        this.configId = config;
        this.courseCode = courseCode;
        this.title = title;
        this.description = description;
        this.formationType = formationType;
        this.status = status;
        this.minSize = minSize;
        this.maxSize = maxSize;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    public boolean checkConstraints() {
        return sizeValid() && dateValid() && statusValid();
    }

    public boolean statusValid() {
        return !status;
    }

    public boolean sizeValid() {
        return minSize <= maxSize;
    }

    public boolean dateValid() {
//        return startDate != null && endDate != null && startDate.before(endDate);
        return startDate != null && endDate != null;
    }

    public Map<String, Object> toMap() {
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("configId", configId);
        map.put("description", description);
        map.put("formationType", formationType);
        map.put("status", status);
        map.put("minSize", minSize);
        map.put("maxSize", maxSize);
        map.put("startDate", startDate);
        map.put("endDate", endDate);
        return map;
    }

    public boolean validateLegit(Team team) {
        int teamSize = team.getMembers().size();
        // return teamSize >= this.minSize && teamSize <= this.maxSize;

        // Check status is ongoing
        if (!(this.status)) {
            return false;
        }

        // Check size constraints
        if (teamSize < this.minSize || teamSize > this.maxSize) {
            return false;
        }

        // Check time window
//        Date now = new Date();
//        if (now.before(this.startDate) || now.after(this.endDate)) {
//            return false;
//        }

        // Check course code matches
//        if (!this.courseCode.equals(team.getCourseCode())) {
//            return false;
//        }

        // All checks passed
        return true;
    }

}
