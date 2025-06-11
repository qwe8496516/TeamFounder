package ntut.teamFounder.Domain;

import java.io.ByteArrayOutputStream;
import java.util.List;

public class TeamExportFile {

    public byte[] generateExport(List<Team> teams, String fileType) throws Exception {
        if (fileType.equalsIgnoreCase("pdf")) {
            return generatePdfExport(teams);
        } else {
            return generateCsvExport(teams);
        }
    }

    private byte[] generatePdfExport(List<Team> teams) throws Exception {
        StringBuilder pdfContent = new StringBuilder();

        // PDF Header
        pdfContent.append("%PDF-1.7\n\n");

        // Catalog
        pdfContent.append("1 0 obj\n")
                .append("<< /Type /Catalog /Pages 2 0 R >>\n")
                .append("endobj\n\n");

        // Pages
        pdfContent.append("2 0 obj\n")
                .append("<< /Type /Pages /Kids [3 0 R] /Count 1 >>\n")
                .append("endobj\n\n");

        // Page
        String pageContent = buildPdfPageContent(teams);
        ByteArrayOutputStream contentStream = new ByteArrayOutputStream();
        contentStream.write(pageContent.getBytes());
        String streamLength = String.valueOf(contentStream.size());

        pdfContent.append("3 0 obj\n")
                .append("<< /Type /Page /Parent 2 0 R /Contents 4 0 R ")
                .append("/MediaBox [0 0 612 792] >>\n")
                .append("endobj\n\n");

        // Content Stream
        pdfContent.append("4 0 obj\n")
                .append("<< /Length ").append(streamLength).append(" >>\n")
                .append("stream\n")
                .append(pageContent)
                .append("\nendstream\n")
                .append("endobj\n\n");

        // Cross-reference and trailer
        pdfContent.append("xref\n")
                .append("0 5\n")
                .append("0000000000 65535 f \n")
                .append("0000000018 00000 n \n")
                .append("0000000070 00000 n \n")
                .append("0000000200 00000 n \n")
                .append("0000000300 00000 n \n")
                .append("trailer\n")
                .append("<< /Size 5 /Root 1 0 R >>\n")
                .append("startxref\n")
                .append(pdfContent.length())
                .append("\n%%EOF");

        return pdfContent.toString().getBytes();
    }

    private String buildPdfPageContent(List<Team> teams) {
        StringBuilder content = new StringBuilder();
        content.append("BT\n/F1 12 Tf\n");

        int yPosition = 700;
        content.append(String.format("100 %d Td\n(Team Export Report)Tj\nET\n", yPosition));
        yPosition -= 30;

        // Table headers
        content.append(String.format("100 %d Td\n(Team ID)Tj\n", yPosition));
        content.append(String.format("200 %d Td\n(Course Code)Tj\n", yPosition));
        content.append(String.format("300 %d Td\n(Members)Tj\n", yPosition));
        content.append(String.format("400 %d Td\n(Status)Tj\n", yPosition));
        yPosition -= 20;

        // Table rows
        for (Team team : teams) {
            content.append(String.format("100 %d Td\n(%s)Tj\n", yPosition, team.getTeamId()));
            content.append(String.format("200 %d Td\n(%s)Tj\n", yPosition,
                    team.getCourseCode() != null ? team.getCourseCode() : "N/A"));
            content.append(String.format("300 %d Td\n(%s)Tj\n", yPosition,
                    String.join(", ", (CharSequence) team.getMembers())));
            content.append(String.format("400 %d Td\n(%s)Tj\n", yPosition,
                    team.isFormed() ? "Formed" : "Not Formed"));
            yPosition -= 15;
        }

        return content.toString();
    }

    private byte[] generateCsvExport(List<Team> teams) {
        StringBuilder csv = new StringBuilder();
        csv.append("Team ID,Course Code,Members,Status\n");

        for (Team team : teams) {
            csv.append(team.getTeamId()).append(",")
                    .append(team.getCourseCode() != null ? team.getCourseCode() : "N/A").append(",")
                    .append("\"").append(String.join(",", (CharSequence) team.getMembers())).append("\",")
                    .append(team.isFormed() ? "Formed" : "Not Formed")
                    .append("\n");
        }

        return csv.toString().getBytes();
    }
}
