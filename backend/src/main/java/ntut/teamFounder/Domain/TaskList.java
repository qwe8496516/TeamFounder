package ntut.teamFounder.Domain;

import org.springframework.stereotype.Service;

import ntut.teamFounder.DAO.TaskDAO;

import java.util.List;

@Service
public class TaskList {

    private final TaskDAO taskDAO;

    public TaskList(TaskDAO taskDAO) {
        this.taskDAO = taskDAO;
    }

    public List<Task> getTasks() {
        return taskDAO.getTasks();
    }

}
