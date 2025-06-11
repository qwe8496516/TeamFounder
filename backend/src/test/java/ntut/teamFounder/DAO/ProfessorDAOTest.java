package ntut.teamFounder.DAO;

import ntut.teamFounder.Domain.Professor;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;

import java.sql.Date;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ProfessorDAOTest {

    private JdbcTemplate jdbcTemplate;
    private ProfessorDAO professorDAO;

    @BeforeEach
    void setUp() {
        jdbcTemplate = mock(JdbcTemplate.class);
        professorDAO = new ProfessorDAO(jdbcTemplate);
    }

    @Test
    void getProfessorByProfessorId_shouldReturnProfessor_whenProfessorExists() {
        // Arrange
        Professor expectedProfessor = new Professor(
                1L,
                "p001",
                "professor1",
                "password123",
                "prof1@example.com",
                Date.valueOf("2023-01-01")
        );

        when(jdbcTemplate.query(
                eq("SELECT * FROM users WHERE userId = ? AND privilege = 1"),
                ArgumentMatchers.<Object[]>any(),
                ArgumentMatchers.<RowMapper<Professor>>any())
        ).thenReturn(List.of(expectedProfessor));

        // Act
        Professor actualProfessor = professorDAO.getProfessorByProfessorId("p001");

        // Assert
        assertNotNull(actualProfessor);
        assertEquals(expectedProfessor.getUserId(), actualProfessor.getUserId());
        assertEquals(expectedProfessor.getUsername(), actualProfessor.getUsername());
    }

    @Test
    void getProfessorByProfessorId_shouldReturnNull_whenProfessorDoesNotExist() {
        // Arrange
        when(jdbcTemplate.query(
                eq("SELECT * FROM users WHERE userId = ? AND privilege = 1"),
                ArgumentMatchers.<Object[]>any(),
                ArgumentMatchers.<RowMapper<Professor>>any())
        ).thenReturn(Collections.emptyList());

        // Act
        Professor result = professorDAO.getProfessorByProfessorId("nonExistent");

        // Assert
        assertNull(result);
    }

    @Test
    void getProfessorByProfessorId_shouldHandleNullId() {
        // Arrange
        when(jdbcTemplate.query(
                anyString(),
                ArgumentMatchers.<Object[]>any(),
                ArgumentMatchers.<RowMapper<Professor>>any())
        ).thenReturn(Collections.emptyList());

        // Act
        Professor result = professorDAO.getProfessorByProfessorId(null);

        // Assert
        assertNull(result);
    }
}
