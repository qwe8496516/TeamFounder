#Users
INSERT INTO users (userId, username, password, email, privilege) VALUES ('113598012', 'Yang Hong Jie', '123456', 't113598012@ntut.org.tw', 0);
INSERT INTO users (userId, username, password, email, privilege) VALUES ('113598056', 'CK Yang', '123456', 't113598056@ntut.org.tw', 1);
INSERT INTO users (userId, username, password, email, privilege) VALUES ('113598071', 'Shuang Yang', '123456', 't113598071@ntut.org.tw', 0);
INSERT INTO users (userId, username, password, email, privilege) VALUES ('113598002', 'Shung Chou Lie', '123456', 't113598002@ntut.org.tw', 0);

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
# INSERT INTO skill (type, name) VALUES ('Nationality','Japan');
# INSERT INTO skill (type, name) VALUES ('Nationality','Taiwan');
# INSERT INTO skill (type, name) VALUES ('Nationality','China');
# INSERT INTO skill (type, name) VALUES ('Nationality','America');
# INSERT INTO skill (type, name) VALUES ('Nationality','Germany');

# Profile
INSERT INTO userSkill (userId, skillId) VALUES (1, 2);
INSERT INTO userSkill (userId, skillId) VALUES (1, 6);
INSERT INTO userSkill (userId, skillId) VALUES (1, 7);

INSERT INTO userSkill (userId, skillId) VALUES (3, 3);
INSERT INTO userSkill (userId, skillId) VALUES (3, 5);
INSERT INTO userSkill (userId, skillId) VALUES (3, 6);

# Course
INSERT INTO course (courseCode, name, professorId, academicYear, semester, description)
VALUES ('CS205', 'Web Development', '113598056', 2, 1, 'A course focusing on web technologies including HTML, CSS, JavaScript, and frameworks.');

INSERT INTO course (courseCode, name, professorId, academicYear, semester, description)
VALUES ('CS301', 'Software Engineering', '113598056', 3, 2, 'A course about software development methodologies and teamwork.');

#Announcement
INSERT INTO announcement (title, content, importanceLevel, courseCode)
VALUES ('Team Formation Announcement', 'Please form your project teams before the end of next week.', 2, 'CS301');

INSERT INTO announcement (title, content, importanceLevel, courseCode)
VALUES ('First Assignment Released', 'The first homework is about building a personal webpage.', 4, 'CS205');

#Enroll Courses
INSERT INTO enrollment (userId, courseCode) VALUES (1, 'CS205');
INSERT INTO enrollment (userId, courseCode) VALUES (1, 'CS301');
INSERT INTO enrollment (userId, courseCode) VALUES (3, 'CS205');
INSERT INTO enrollment (userId, courseCode) VALUES (3, 'CS301');
INSERT INTO enrollment (userId, courseCode) VALUES (4, 'CS205');
INSERT INTO enrollment (userId, courseCode) VALUES (4, 'CS301');