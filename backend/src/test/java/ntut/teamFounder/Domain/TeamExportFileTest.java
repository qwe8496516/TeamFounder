package ntut.teamFounder.Domain;
import org.junit.jupiter.api.Test;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;

class TeamExportFileTest {

    private List<Map<String, Object>> sampleTeams() {
        Map<String, Object> member1 = new HashMap<>();
        member1.put("userId", 1L);
        member1.put("username", "alice");
        member1.put("email", "alice@example.com");

        Map<String, Object> member2 = new HashMap<>();
        member2.put("userId", 2L);
        member2.put("username", "bob");
        member2.put("email", "bob@example.com");

        Map<String, Object> team = new HashMap<>();
        team.put("teamId", 101L);
        team.put("courseCode", "CS101");
        team.put("members", Arrays.asList(member1, member2));

        return List.of(team);
    }

    @Test
    void testGenerateCsvExport() throws Exception {
        TeamExportFile exportFile = new TeamExportFile();
        byte[] csvBytes = exportFile.generateExport(sampleTeams(), "csv");
        String csv = new String(csvBytes);

        assertTrue(csv.contains("Team ID,Course Code,User ID,Username,Email"));
        assertTrue(csv.contains("101,CS101,1,\"alice\",alice@example.com"));
        assertTrue(csv.contains("101,CS101,2,\"bob\",bob@example.com"));
    }

    @Test
    void testGeneratePdfExport() throws Exception {
        TeamExportFile exportFile = new TeamExportFile();
        byte[] pdfBytes = exportFile.generateExport(sampleTeams(), "pdf");

        assertNotNull(pdfBytes);
        assertTrue(pdfBytes.length > 0);
        String pdfHeader = new String(pdfBytes, 0, 4);
        assertEquals("%PDF", pdfHeader);
    }

    @Test
    void testGenerateExportInvalidTypeDefaultsToCsv() throws Exception {
        TeamExportFile exportFile = new TeamExportFile();
        byte[] result = exportFile.generateExport(sampleTeams(), "unknown");
        String csv = new String(result);
        assertTrue(csv.contains("Team ID,Course Code,User ID,Username,Email"));
    }
}
