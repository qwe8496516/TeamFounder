package ntut.teamFounder.Handler;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ntut.teamFounder.Domain.Task;
import ntut.teamFounder.Domain.TaskList;

import java.util.List;

@RestController
@Tag(name = "Task API")
@CrossOrigin(origins = "localhost:5173")
@RequestMapping("/api/tasks")
public class TaskHandler {

    private final TaskList taskList;

    public TaskHandler(TaskList taskList) {
        this.taskList = taskList;
    }

    @GetMapping
    public List<Task> getTasks() {
        return taskList.getTasks();
    }

}
