package ntut.teamFounder.Domain;

import lombok.Getter;
import lombok.Setter;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Getter
@Setter
public class TeamExportFile {
    private List<Team> teams;
    private ExportType exportType;

    public enum ExportType {
        PDF,
        EXCEL
    }

    // Default constructor
    public TeamExportFile() {
    }

    // Constructor with teams and export type
    public TeamExportFile(List<Team> teams, ExportType exportType) {
        this.teams = teams;
        this.exportType = exportType;
    }

    // Export method - returns the file as byte array
    public byte[] export() {
        switch (exportType) {
            case PDF:
                return exportToPdf();
            case EXCEL:
                return exportToExcel();
            default:
                throw new IllegalArgumentException("Unsupported export type: " + exportType);
        }
    }

    // Export to PDF (HTML-based approach that can be converted to PDF)
    private byte[] exportToPdf() {
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            OutputStreamWriter writer = new OutputStreamWriter(baos, StandardCharsets.UTF_8);

            // Generate HTML content that can be easily converted to PDF
            StringBuilder html = new StringBuilder();
            html.append("<!DOCTYPE html>");
            html.append("<html><head>");
            html.append("<meta charset='UTF-8'>");
            html.append("<title>Team Export Report</title>");
            html.append("<style>");
            html.append("body { font-family: Arial, sans-serif; margin: 40px; }");
            html.append("h1 { text-align: center; color: #333; }");
            html.append("table { width: 100%; border-collapse: collapse; margin: 20px 0; }");
            html.append("th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }");
            html.append("th { background-color: #f2f2f2; font-weight: bold; }");
            html.append("tr:nth-child(even) { background-color: #f9f9f9; }");
            html.append(".summary { margin-top: 30px; padding: 20px; background-color: #f0f8ff; border-radius: 5px; }");
            html.append(".status-formed { color: green; font-weight: bold; }");
            html.append(".status-not-formed { color: red; }");
            html.append("</style>");
            html.append("</head><body>");

            // Title
            html.append("<h1>Team Export Report</h1>");

            // Table
            html.append("<table>");
            html.append("<thead>");
            html.append("<tr>");
            html.append("<th>Team ID</th>");
            html.append("<th>Course Code</th>");
            html.append("<th>Members</th>");
            html.append("<th>Member Count</th>");
            html.append("<th>Status</th>");
            html.append("</tr>");
            html.append("</thead>");
            html.append("<tbody>");

            // Team data
            for (Team team : teams) {
                html.append("<tr>");
                html.append("<td>").append(team.getTeamId()).append("</td>");
                html.append("<td>").append(team.getCourseCode() != null ? team.getCourseCode() : "N/A").append("</td>");

                // Format members
                String membersStr = "No members";
                if (team.getMembers() != null && !team.getMembers().isEmpty()) {
                    membersStr = team.getMembers().toString().replace("[", "").replace("]", "");
                }
                html.append("<td>").append(membersStr).append("</td>");
                html.append("<td>").append(team.getMembers() != null ? team.getMembers().size() : 0).append("</td>");

                // Status with styling
                String statusClass = team.isFormed() ? "status-formed" : "status-not-formed";
                String statusText = team.isFormed() ? "Formed" : "Not Formed";
                html.append("<td class='").append(statusClass).append("'>").append(statusText).append("</td>");
                html.append("</tr>");
            }

            html.append("</tbody>");
            html.append("</table>");

            // Summary
            long formedTeams = teams.stream().mapToLong(team -> team.isFormed() ? 1 : 0).sum();
            html.append("<div class='summary'>");
            html.append("<h3>Summary</h3>");
            html.append("<p><strong>Total Teams:</strong> ").append(teams.size()).append("</p>");
            html.append("<p><strong>Formed Teams:</strong> ").append(formedTeams).append("</p>");
            html.append("<p><strong>Unformed Teams:</strong> ").append(teams.size() - formedTeams).append("</p>");
            html.append("</div>");

            html.append("</body></html>");

            writer.write(html.toString());
            writer.flush();
            writer.close();

            return baos.toByteArray();

        } catch (IOException e) {
            throw new RuntimeException("Error generating PDF content: " + e.getMessage(), e);
        }
    }

    // Export to Excel (CSV format that Excel can open)
    private byte[] exportToExcel() {
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            OutputStreamWriter writer = new OutputStreamWriter(baos, StandardCharsets.UTF_8);

            // CSV Header
            writer.write("Team ID,Course Code,Members,Member Count,Status\n");

            // Team data
            for (Team team : teams) {
                StringBuilder line = new StringBuilder();

                // Team ID
                line.append(team.getTeamId()).append(",");

                // Course Code
                String courseCode = team.getCourseCode() != null ? team.getCourseCode() : "N/A";
                line.append("\"").append(courseCode).append("\",");

                // Members (quoted to handle commas in the list)
                String membersStr = "No members";
                if (team.getMembers() != null && !team.getMembers().isEmpty()) {
                    membersStr = team.getMembers().toString().replace("[", "").replace("]", "");
                }
                line.append("\"").append(membersStr).append("\",");

                // Member Count
                int memberCount = team.getMembers() != null ? team.getMembers().size() : 0;
                line.append(memberCount).append(",");

                // Status
                String status = team.isFormed() ? "Formed" : "Not Formed";
                line.append("\"").append(status).append("\"");

                line.append("\n");
                writer.write(line.toString());
            }

            // Add summary section
            writer.write("\n");
            writer.write("SUMMARY\n");
            writer.write("Metric,Count\n");

            long formedTeams = teams.stream().mapToLong(team -> team.isFormed() ? 1 : 0).sum();
            writer.write("\"Total Teams\"," + teams.size() + "\n");
            writer.write("\"Formed Teams\"," + formedTeams + "\n");
            writer.write("\"Unformed Teams\"," + (teams.size() - formedTeams) + "\n");

            writer.flush();
            writer.close();

            return baos.toByteArray();

        } catch (IOException e) {
            throw new RuntimeException("Error generating Excel file: " + e.getMessage(), e);
        }
    }

    // Helper method to get file extension based on export type
    public String getFileExtension() {
        switch (exportType) {
            case PDF:
                return ".html"; // HTML that can be converted to PDF
            case EXCEL:
                return ".csv"; // CSV that Excel can open
            default:
                return "";
        }
    }

    // Helper method to get MIME type based on export type
    public String getMimeType() {
        switch (exportType) {
            case PDF:
                return "text/html"; // HTML content
            case EXCEL:
                return "text/csv"; // CSV content
            default:
                return "application/octet-stream";
        }
    }

    // Validation method
    public boolean isValid() {
        return teams != null && !teams.isEmpty() && exportType != null;
    }
}