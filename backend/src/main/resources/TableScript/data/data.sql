#Users
INSERT INTO users (userId, username, password, email, privilege) VALUES ('113598012', 'Yang Hong Jie', 123, 't113598012@ntut.org.tw', '1');
INSERT INTO users (userId, username, password, email, privilege) VALUES ('113598056', 'CK Yang', 123, 't113598056@ntut.org.tw', '2');
INSERT INTO users (userId, username, password, email, privilege) VALUES ('113598071', 'Shuang Yang', 123, 't113598071@ntut.org.tw', '1');

#Skills
INSERT INTO skill (type, name) VALUES ('Programming','HTML/CSS');
INSERT INTO skill (type, name) VALUES ('Programming','Java');
INSERT INTO skill (type, name) VALUES ('Programming','C++');
INSERT INTO skill (type, name) VALUES ('Programming','C');
INSERT INTO skill (type, name) VALUES ('Framework','React');
INSERT INTO skill (type, name) VALUES ('Framework','Spring Boot');
INSERT INTO skill (type, name) VALUES ('Tool','MySQL');
INSERT INTO skill (type, name) VALUES ('Tool','Git');
INSERT INTO skill (type, name) VALUES ('Tool','AWS');
INSERT INTO skill (type, name) VALUES ('Tool','Docker');
INSERT INTO skill (type, name) VALUES ('Language','English');
INSERT INTO skill (type, name) VALUES ('Language','Mandarin');
INSERT INTO skill (type, name) VALUES ('Language','Japanese');
INSERT INTO skill (type, name) VALUES ('Nationality','Japan');
INSERT INTO skill (type, name) VALUES ('Nationality','Taiwan');
INSERT INTO skill (type, name) VALUES ('Nationality','China');
INSERT INTO skill (type, name) VALUES ('Nationality','America');
INSERT INTO skill (type, name) VALUES ('Nationality','Germany');

# Profile
INSERT INTO profile (userId, skillId) VALUES (1, 2);
INSERT INTO profile (userId, skillId) VALUES (1, 6);
INSERT INTO profile (userId, skillId) VALUES (1, 7);

INSERT INTO profile (userId, skillId) VALUES (2, 3);
INSERT INTO profile (userId, skillId) VALUES (2, 5);
INSERT INTO profile (userId, skillId) VALUES (2, 8);

# Course
INSERT INTO course (course_code, name, professor_id, academic, semester, description)
VALUES ('CS205', 'Web Development', '113598056', 2, '1', 'A course focusing on web technologies including HTML, CSS, JavaScript, and frameworks.');

INSERT INTO course (course_code, name, professor_id, academic, semester, description)
VALUES ('CS301', 'Software Engineering', '113598056', 3, '2', 'A course about software development methodologies and teamwork.');

#Announcement
INSERT INTO announcement (title, description, importanceLevel, course_code)
VALUES ('Team Formation Announcement', 'Please form your project teams before the end of next week.', '2', 'CS301');

INSERT INTO announcement (title, description, importanceLevel, course_code)
VALUES ('First Assignment Released', 'The first homework is about building a personal webpage.', '4', 'CS205');
