package ntut.teamFounder.DAO;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import ntut.teamFounder.Domain.Task;

import java.util.List;

@Repository
public class TaskDAO {

    private final JdbcTemplate jdbcTemplate;

    public TaskDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Task> getTasks() {
        String sql = "select * from task";
        return jdbcTemplate.query(sql, (rs, rowNum) -> new Task( rs.getInt("task_id"), rs.getString("task_name")));
    }

}
