package ntut.teamFounder.Domain;

import java.io.ByteArrayOutputStream;
import java.util.List;
import java.util.Map;
import org.apache.pdfbox.pdmodel.*;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;

public class TeamExportFile {

    public byte[] generateExport(List<Map<String, Object>> teams, String fileType) throws Exception {
        return fileType.equalsIgnoreCase("pdf") ?
                generatePdfExport(teams) :
                generateCsvExport(teams);
    }

    private byte[] generatePdfExport(List<Map<String, Object>> teams) throws Exception {
        try (PDDocument document = new PDDocument()) {
            PDPage page = new PDPage(PDRectangle.A4);
            document.addPage(page);

            PDPageContentStream contentStream = new PDPageContentStream(document, page);
            contentStream.setFont(PDType1Font.HELVETICA, 12);

            float y = page.getMediaBox().getHeight() - 50;
            float margin = 50;
            float leading = 18;

            contentStream.beginText();
            contentStream.newLineAtOffset(margin, y);
            contentStream.showText("Team Export Report");
            contentStream.newLineAtOffset(0, -leading);

            // Column header
            contentStream.showText("TeamID | CourseCode | UserID | Username | Email");
            contentStream.newLineAtOffset(0, -leading);

            // Team Data
            for (Map<String, Object> team : teams) {
                List<Map<String, Object>> members = (List<Map<String, Object>>) team.get("members");
                for (Map<String, Object> member : members) {
                    String line = String.format("%s | %s | %s | %s | %s",
                            team.get("teamId"),
                            team.get("courseCode"),
                            member.get("userId"),
                            member.get("username"),
                            member.get("email"));
                    contentStream.showText(line);
                    contentStream.newLineAtOffset(0, -leading);
                }
                contentStream.newLineAtOffset(0, -leading / 2); // Space between teams
            }

            contentStream.endText();
            contentStream.close();

            ByteArrayOutputStream output = new ByteArrayOutputStream();
            document.save(output);
            return output.toByteArray();
        }
    }

    private String buildPdfPageContent(List<Map<String, Object>> teams) {
        StringBuilder content = new StringBuilder();
        int startY = 750; // Start Y-position
        int lineHeight = 15;

        // Begin text object and font setup
        content.append("BT\n/F1 12 Tf\n");

        // Title
        content.append(String.format("1 0 0 1 50 %d Tm\n(Team Export Report) Tj\n", startY));
        startY -= lineHeight * 2;

        // Header row
        content.append(String.format("1 0 0 1 50 %d Tm\n(TeamID) Tj\n", startY));
        content.append(String.format("1 0 0 1 100 %d Tm\n(Course) Tj\n", startY));
        content.append(String.format("1 0 0 1 160 %d Tm\n(UserID) Tj\n", startY));
        content.append(String.format("1 0 0 1 250 %d Tm\n(Username) Tj\n", startY));
        content.append(String.format("1 0 0 1 400 %d Tm\n(Email) Tj\n", startY));
        startY -= lineHeight;

        // Rows
        for (Map<String, Object> team : teams) {
            List<Map<String, Object>> members = (List<Map<String, Object>>) team.get("members");
            String teamId = String.valueOf(team.get("teamId"));
            String courseCode = String.valueOf(team.get("courseCode"));

            for (Map<String, Object> member : members) {
                String userId = String.valueOf(member.get("userId"));
                String username = String.valueOf(member.get("username"));
                String email = String.valueOf(member.get("email"));

                // Print each column with fixed X position and current Y
                content.append(String.format("1 0 0 1 50 %d Tm\n(%s) Tj\n", startY, teamId));
                content.append(String.format("1 0 0 1 100 %d Tm\n(%s) Tj\n", startY, courseCode));
                content.append(String.format("1 0 0 1 160 %d Tm\n(%s) Tj\n", startY, userId));
                content.append(String.format("1 0 0 1 250 %d Tm\n(%s) Tj\n", startY, username));
                content.append(String.format("1 0 0 1 400 %d Tm\n(%s) Tj\n", startY, email));

                startY -= lineHeight;
            }

            startY -= 10; // Add extra space between teams
        }

        // End text object
        content.append("ET\n");

        return content.toString();
    }



    private byte[] generateCsvExport(List<Map<String, Object>> teams) {
        StringBuilder csv = new StringBuilder();
        // Header
        csv.append("Team ID,Course Code,User ID,Username,Email,Status\n");

        // Data Rows
        for (Map<String, Object> team : teams) {
            List<Map<String, Object>> members = (List<Map<String, Object>>) team.get("members");

            for (Map<String, Object> member : members) {
                csv.append(team.get("teamId")).append(",")
                        .append(team.get("courseCode")).append(",")
                        .append(member.get("userId")).append(",")
                        .append("\"").append(member.get("username")).append("\",")
                        .append("\"").append(member.get("email")).append("\",")
                        .append(team.get("formed"))
                        .append("\n");
            }
        }
        return csv.toString().getBytes();
    }
}
