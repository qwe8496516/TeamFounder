package ntut.teamFounder.Domain;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Getter
@Setter
public class TeamConfiguration {

    private String configId;
    private String description;
    private Boolean formationType;
    private Boolean status;
    private int minSize;
    private int maxSize;
    private Date startDate;
    private Date endDate;

    public TeamConfiguration (String config, String description, Boolean formationType, Boolean status, int minSize, int maxSize, Date startDate, Date endDate) {
        this.configId = config;
        this.description = description;
        this.formationType = formationType;
        this.status = status;
        this.minSize = minSize;
        this.maxSize = maxSize;
        this.startDate = startDate;
        this.endDate = endDate;
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

}
