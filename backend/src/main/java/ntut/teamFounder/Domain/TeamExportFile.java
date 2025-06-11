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

    private byte[] generateCsvExport(List<Map<String, Object>> teams) {
        StringBuilder csv = new StringBuilder();
        // Header
        csv.append("Team ID,Course Code,User ID,Username,Email\n");

        // Data Rows
        for (Map<String, Object> team : teams) {
            List<Map<String, Object>> members = (List<Map<String, Object>>) team.get("members");

            for (Map<String, Object> member : members) {
                csv.append(team.get("teamId")).append(",")
                        .append(team.get("courseCode")).append(",")
                        .append(member.get("userId")).append(",")
                        .append("\"").append(member.get("username")).append("\",")
                        .append(member.get("email"))
                        .append("\n");
            }
        }
        return csv.toString().getBytes();
    }
}
