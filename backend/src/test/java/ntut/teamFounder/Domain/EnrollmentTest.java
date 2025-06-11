package ntut.teamFounder.Domain;

import org.junit.jupiter.api.Test;

import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

class EnrollmentTest {

    @Test
    void testEnrollmentConstructorAndGetters() {
        Long expectedUserId = 123L;
        String expectedCourseCode = "CS101";
        Date expectedEnrolledAt = new Date();

        Enrollment enrollment = new Enrollment(expectedUserId, expectedCourseCode, expectedEnrolledAt);

        assertEquals(expectedUserId, enrollment.getUserId());
        assertEquals(expectedCourseCode, enrollment.getCourseCode());
        assertEquals(expectedEnrolledAt, enrollment.getEnrolledAt());
    }

    @Test
    void testSetters() {
        Enrollment enrollment = new Enrollment(1L, "TEMP", new Date());

        Long newUserId = 999L;
        String newCourseCode = "MATH204";
        Date newDate = new Date(System.currentTimeMillis() - 10000);

        enrollment.setUserId(newUserId);
        enrollment.setCourseCode(newCourseCode);
        enrollment.setEnrolledAt(newDate);

        assertEquals(newUserId, enrollment.getUserId());
        assertEquals(newCourseCode, enrollment.getCourseCode());
        assertEquals(newDate, enrollment.getEnrolledAt());
    }
}
