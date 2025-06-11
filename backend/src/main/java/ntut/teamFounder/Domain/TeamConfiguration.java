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
    private int status;
    private int minSize;
    private int maxSize;
    private Date startDate;
    private Date endDate;

    public TeamConfiguration (Long config, String courseCode, String title, String description, Boolean formationType, int status, int minSize, int maxSize, Date startDate, Date endDate) {
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
        return status == 0 || status == 1;
    }

    public boolean sizeValid() {
        return minSize <= maxSize;
    }

    public boolean dateValid() {
        Date today = new Date();
        return startDate != null && endDate != null && startDate.before(endDate) && (endDate.after(today) || endDate.equals(today));
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
        if (this.status == 0 || this.status == 2) {
            return false;
        }

        if (teamSize < this.minSize || teamSize > this.maxSize) {
            return false;
        }
        return true;
    }

}
