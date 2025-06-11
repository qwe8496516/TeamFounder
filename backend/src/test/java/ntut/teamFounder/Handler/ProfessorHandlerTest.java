package ntut.teamFounder.Handler;

import ntut.teamFounder.DAO.ProfessorDAO;
import ntut.teamFounder.Domain.Professor;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class ProfessorHandlerTest {

    @Mock
    private ProfessorDAO professorDAO;

    @InjectMocks
    private ProfessorHandler professorHandler;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getProfessorProfile_WithValidProfessor_ShouldReturnProfile() {
        String professorId = "prof123";

        Professor professor = mock(Professor.class);
        when(professorDAO.getProfessorByProfessorId(professorId)).thenReturn(professor);
        when(professor.getPrivilege()).thenReturn(1);
        Map<String, Object> professorMap = new HashMap<>();
        professorMap.put("id", professorId);
        professorMap.put("name", "Prof. John Doe");
        when(professor.toMap()).thenReturn(professorMap);

        ResponseEntity<?> response = professorHandler.getProfessorProfile(professorId);

        assertEquals(200, response.getStatusCode().value());
        assertEquals(professorMap, response.getBody());

        verify(professorDAO, times(2)).getProfessorByProfessorId(professorId);
        verify(professor, times(1)).toMap();
    }


    @Test
    void getProfessorProfile_WithNonProfessorPrivilege_ShouldReturnBadRequest() {
        String professorId = "prof456";

        Professor professor = mock(Professor.class);
        when(professorDAO.getProfessorByProfessorId(professorId)).thenReturn(professor);
        when(professor.getPrivilege()).thenReturn(0);  // Not a professor

        ResponseEntity<?> response = professorHandler.getProfessorProfile(professorId);

        assertEquals(400, response.getStatusCode().value());
        assertEquals("User is not a professor.", response.getBody());

        verify(professorDAO, times(2)).getProfessorByProfessorId(professorId);
        verify(professor, never()).toMap();
    }

    @Test
    void getProfessorProfile_WithException_ShouldReturnBadRequest() {
        String professorId = "prof789";

        when(professorDAO.getProfessorByProfessorId(professorId)).thenThrow(new RuntimeException("DB error"));

        ResponseEntity<?> response = professorHandler.getProfessorProfile(professorId);

        assertEquals(400, response.getStatusCode().value());
        assertEquals("Student not found.", response.getBody());

        verify(professorDAO, times(1)).getProfessorByProfessorId(professorId);
    }
}
