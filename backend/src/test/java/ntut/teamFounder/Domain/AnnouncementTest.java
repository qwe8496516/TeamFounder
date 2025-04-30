package ntut.teamFounder.Domain;

import org.junit.jupiter.api.Test;

import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

public class AnnouncementTest {

    @Test
    public void importLevelIsValid() {
        Announcement a1 = new Announcement(1L, "t", "c", new Date(), "CS101", 0);
        Announcement a2 = new Announcement(2L, "t", "c", new Date(), "CS101", 4);
        Announcement a3 = new Announcement(3L, "t", "c", new Date(), "CS101", -1);
        Announcement a4 = new Announcement(4L, "t", "c", new Date(), "CS101", 5);

        assertTrue(a1.importLevelIsValid());
        assertTrue(a2.importLevelIsValid());
        assertFalse(a3.importLevelIsValid());
        assertFalse(a4.importLevelIsValid());
    }

    @Test
    public void hasWordInContent() {
        Announcement a = new Announcement(1L, "t", "This is a test content with damn.", new Date(), "CS101", 2);

        assertTrue(a.hasWordInContent("damn"));
        assertTrue(a.hasWordInContent("DAMN"));
        assertFalse(a.hasWordInContent("bitch"));
        assertFalse(a.hasWordInContent("hello"));
    }

    @Test
    public void hasBadWordsInContent() {
        Announcement a1 = new Announcement(1L, "t", "This is clean.", new Date(), "CS101", 2);
        Announcement a2 = new Announcement(2L, "t", "Contains fuck.", new Date(), "CS101", 2);
        Announcement a3 = new Announcement(3L, "t", "Contains bitch.", new Date(), "CS101", 2);
        Announcement a4 = new Announcement(4L, "t", "Contains DAMN.", new Date(), "CS101", 2);

        assertFalse(a1.hasBadWordsInContent());
        assertTrue(a2.hasBadWordsInContent());
        assertTrue(a3.hasBadWordsInContent());
        assertTrue(a4.hasBadWordsInContent());
    }

    @Test
    public void hasWordInTitle() {
        Announcement a = new Announcement(1L, "This is a bitch title", "c", new Date(), "CS101", 2);

        assertTrue(a.hasWordInTitle("bitch"));
        assertTrue(a.hasWordInTitle("BITCH"));
        assertFalse(a.hasWordInTitle("fuck"));
        assertFalse(a.hasWordInTitle("hello"));
    }

    @Test
    public void hasBadWordsInTitle() {
        Announcement a1 = new Announcement(1L, "Clean title", "c", new Date(), "CS101", 2);
        Announcement a2 = new Announcement(2L, "fuck in title", "c", new Date(), "CS101", 2);
        Announcement a3 = new Announcement(3L, "bitch in title", "c", new Date(), "CS101", 2);
        Announcement a4 = new Announcement(4L, "DAMN in title", "c", new Date(), "CS101", 2);

        assertFalse(a1.hasBadWordsInTitle());
        assertTrue(a2.hasBadWordsInTitle());
        assertTrue(a3.hasBadWordsInTitle());
        assertTrue(a4.hasBadWordsInTitle());
    }

    @Test
    public void verifyAnnouncement() {
        Announcement valid = new Announcement(1L, "Good title", "Clean content", new Date(), "CS101", 2);
        assertTrue(valid.verifyAnnouncement());

        Announcement badContent = new Announcement(2L, "Good title", "This contains fuck.", new Date(), "CS101", 2);
        assertFalse(badContent.verifyAnnouncement());

        Announcement badTitle = new Announcement(3L, "bitch in title", "Clean content", new Date(), "CS101", 2);
        assertFalse(badTitle.verifyAnnouncement());

        Announcement badLevel = new Announcement(4L, "Good title", "Clean content", new Date(), "CS101", 10);
        assertFalse(badLevel.verifyAnnouncement());

        Announcement bothBad = new Announcement(5L, "fuck", "damn", new Date(), "CS101", -1);
        assertFalse(bothBad.verifyAnnouncement());
    }
}
