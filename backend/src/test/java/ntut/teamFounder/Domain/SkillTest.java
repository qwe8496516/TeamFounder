package ntut.teamFounder.Domain;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class SkillTest {

    @Test
    void testConstructorAndGetters() {
        Skill skill = new Skill(1L, "Programming", "Java");

        assertEquals(1L, skill.getId());
        assertEquals("Programming", skill.getType());
        assertEquals("Java", skill.getName());
    }

    @Test
    void testSetters() {
        Skill skill = new Skill(0L, "", "");

        skill.setId(2L);
        skill.setType("Framework");
        skill.setName("React");

        assertEquals(2L, skill.getId());
        assertEquals("Framework", skill.getType());
        assertEquals("React", skill.getName());
    }
}
