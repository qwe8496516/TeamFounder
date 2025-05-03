#Users
INSERT INTO users (userId, username, password, email, privilege) VALUES ('113598012', 'Yang Hong Jie', 'MTIzNDU2', 't113598012@ntut.org.tw', 0);
INSERT INTO users (userId, username, password, email, privilege) VALUES ('113598056', 'CK Yang', 'MTIzNDU2', 't113598056@ntut.org.tw', 1);
INSERT INTO users (userId, username, password, email, privilege) VALUES ('113598071', 'Shuang Yang', 'MTIzNDU2', 't113598071@ntut.org.tw', 0);
INSERT INTO users (userId, username, password, email, privilege) VALUES ('113598002', 'Shin Chou Lie', 'MTIzNDU2', 't113598002@ntut.org.tw', 0);
INSERT INTO users (userId, username, password, email, privilege) VALUES ('113598001', 'Shung Chung chen', 'MTIzNDU2', 't113598001@ntut.org.tw', 0);
INSERT INTO users (userId, username, password, email, privilege) VALUES ('113598003', 'Zhi Hong chen', 'MTIzNDU2', 't113598003@ntut.org.tw', 0);
INSERT INTO users (userId, username, password, email, privilege) VALUES ('p_islab', 'Jong Yih Kuo', 'MTIzNDU2', 'jykuo@ntut.org.tw', 1);
INSERT INTO users (userId, username, password, email, privilege) VALUES ('p_ooad', 'Woei Kae Chen', 'MTIzNDU2', 'woeikaechen@ntut.org.tw', 1);


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
VALUES ('CS205', 'Web Development', '113598056', 113, 1, 'A course focusing on web technologies including HTML, CSS, JavaScript, and frameworks.');

INSERT INTO course (courseCode, name, professorId, academicYear, semester, description)
VALUES ('CS301', 'Software Engineering', '113598056', 113, 1, 'A course about software development methodologies and teamwork.');

INSERT INTO course (courseCode, name, professorId, academicYear, semester, description)
VALUES ('CS201', 'Object-Oriented Programming', '113598056', 113, 1, 'A course that introduces object-oriented design and programming in Java.');

INSERT INTO course (courseCode, name, professorId, academicYear, semester, description)
VALUES ('CS302', 'Artificial Intelligence', '113598056', 113, 1, 'A course that introduces concepts and techniques in artificial intelligence.');


#Announcement
INSERT INTO announcement (title, content, importanceLevel, courseCode)
VALUES ('Team Formation Announcement', 'Please form your project teams before the end of next week.', 2, 'CS301');

INSERT INTO announcement (title, content, importanceLevel, courseCode)
VALUES ('First Assignment Released', 'The first homework is about building a personal webpage.', 4, 'CS301');

INSERT INTO announcement (title, content, importanceLevel, courseCode)
VALUES ('Team Formation Announcement', 'Please form your project teams before the end of next week.', 2, 'CS205');

INSERT INTO announcement (title, content, importanceLevel, courseCode)
VALUES ('First Assignment Released', 'The first homework is about building a personal webpage.', 4, 'CS205');

#Enroll Courses
INSERT INTO enrollment (userId, courseCode) VALUES (1, 'CS201');
INSERT INTO enrollment (userId, courseCode) VALUES (1, 'CS205');
INSERT INTO enrollment (userId, courseCode) VALUES (1, 'CS301');
INSERT INTO enrollment (userId, courseCode) VALUES (1, 'CS302');
INSERT INTO enrollment (userId, courseCode) VALUES (3, 'CS205');
INSERT INTO enrollment (userId, courseCode) VALUES (3, 'CS301');
INSERT INTO enrollment (userId, courseCode) VALUES (3, 'CS302');
INSERT INTO enrollment (userId, courseCode) VALUES (4, 'CS205');
INSERT INTO enrollment (userId, courseCode) VALUES (4, 'CS301');
INSERT INTO enrollment (userId, courseCode) VALUES (5, 'CS205');
INSERT INTO enrollment (userId, courseCode) VALUES (5, 'CS301');
