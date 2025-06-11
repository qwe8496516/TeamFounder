use teamfounder;
#Users
INSERT INTO users (userId, username, password, email, privilege) VALUES ('113598012', 'Yang Hong Jie', 'MTIzNDU2', 't113598012@ntut.org.tw', 0);
INSERT INTO users (userId, username, password, email, privilege) VALUES ('113598056', 'CK Yang', 'MTIzNDU2', 't113598056@ntut.org.tw', 1);
INSERT INTO users (userId, username, password, email, privilege) VALUES ('113598071', 'Shuang Yang', 'MTIzNDU2', 't113598071@ntut.org.tw', 0);
INSERT INTO users (userId, username, password, email, privilege) VALUES ('113598002', 'Shin Chou Lie', 'MTIzNDU2', 't113598002@ntut.org.tw', 0);
INSERT INTO users (userId, username, password, email, privilege) VALUES ('113598001', 'Shung Chung chen', 'MTIzNDU2', 't113598001@ntut.org.tw', 0);
INSERT INTO users (userId, username, password, email, privilege) VALUES ('113598003', 'Zhi Hong chen', 'MTIzNDU2', 't113598003@ntut.org.tw', 0);
INSERT INTO users (userId, username, password, email, privilege) VALUES ('113598004', 'John Smith', 'MTIzNDU2', 't113598004@ntut.org.tw', 0);
INSERT INTO users (userId, username, password, email, privilege) VALUES ('113598005', 'Emma Wilson', 'MTIzNDU2', 't113598005@ntut.org.tw', 0);
INSERT INTO users (userId, username, password, email, privilege) VALUES ('113598006', 'Michael Brown', 'MTIzNDU2', 't113598006@ntut.org.tw', 0);
INSERT INTO users (userId, username, password, email, privilege) VALUES ('p_islab', 'Jong Yih Kuo', 'MTIzNDU2', 'jykuo@ntut.org.tw', 1);
INSERT INTO users (userId, username, password, email, privilege) VALUES ('p_ooad', 'Woei Kae Chen', 'MTIzNDU2', 'woeikaechen@ntut.org.tw', 1);
INSERT INTO users (userId, username, password, email, privilege) VALUES ('Ready01', 'Ready01', 'MTIzNDU2', 'Ready01@ntut.org.tw', 0);
INSERT INTO users (userId, username, password, email, privilege) VALUES ('Ready02', 'Ready02', 'MTIzNDU2', 'Ready02@ntut.org.tw', 0);

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

INSERT INTO userSkill (userId, skillId) VALUES (4, 5);
INSERT INTO userSkill (userId, skillId) VALUES (4, 6);

# Course
INSERT INTO course (courseCode, name, professorId, academicYear, semester, description, courseStatus)
VALUES ('CS205', 'Web Development', '113598056', 113, 1, 'A course focusing on web technologies including HTML, CSS, JavaScript, and frameworks.', 0);

INSERT INTO course (courseCode, name, professorId, academicYear, semester, description, courseStatus)
VALUES ('CS301', 'Software Engineering', '113598056', 113, 1, 'A course about software development methodologies and teamwork.', 0);

INSERT INTO course (courseCode, name, professorId, academicYear, semester, description, courseStatus)
VALUES ('CS201', 'Object-Oriented Programming', '113598056', 113, 1, 'A course that introduces object-oriented design and programming in Java.', 0);

INSERT INTO course (courseCode, name, professorId, academicYear, semester, description, courseStatus)
VALUES ('CS302', 'Artificial Intelligence', '113598056', 113, 1, 'A course that introduces concepts and techniques in artificial intelligence.', 0);

#Announcement
INSERT INTO announcement (title, content, importanceLevel, courseCode)
VALUES ('Team Formation Announcement', 'Please form your project teams before the end of next week.', 1, 'CS301');

INSERT INTO announcement (title, content, importanceLevel, courseCode)
VALUES ('First Assignment Released', 'The first homework is about building a personal webpage.', 4, 'CS301');

INSERT INTO announcement (title, content, importanceLevel, courseCode)
VALUES ('Team Formation Announcement', 'Please form your project teams before the end of next week.', 2, 'CS205');

INSERT INTO announcement (title, content, importanceLevel, courseCode)
VALUES ('First Assignment Released', 'The first homework is about building a personal webpage.', 4, 'CS205');

INSERT INTO announceReceipt (userId, courseCode, announcementId) VALUES (1, 'CS205', 3);

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
INSERT INTO enrollment (userId, courseCode) VALUES (6, 'CS205');
INSERT INTO enrollment (userId, courseCode) VALUES (6, 'CS301');
INSERT INTO enrollment (userId, courseCode) VALUES (7, 'CS205');
INSERT INTO enrollment (userId, courseCode) VALUES (7, 'CS301');

INSERT INTO teamConfiguration (courseCode, title, description, formationType, status, minSize, maxSize, startDate, endDate)
VALUES ('CS205', 'Team Formation', '', 0, 1, 3, 5, '2025-06-05 00:00:00', '2025-06-20 23:59:59');

INSERT INTO teamConfiguration (courseCode, title, description, formationType, status, minSize, maxSize, startDate, endDate)
VALUES ('CS201', 'Team Formation', '', 1, 0, 3, 5, '2025-06-05 00:00:00', '2025-06-20 23:59:59');

INSERT INTO invitation (senderId, receiverId, courseCode, message, status)
VALUES (1, 5, 'CS301', 'Would you like to team up for the CS project?', 0),
       (5, 1, 'CS205', 'Would you like to team up for the CS project?', 0),
       (3, 1, 'CS205', 'I LOVE U!', 0),
       (5, 4, 'CS302', 'Hey, want to join my group?', 0);

# -- Team 1 (More than one not ready)
# INSERT INTO team (id, course_code, legit) VALUES (1, 'CS205', FALSE);
#
# -- Members: 2 ready, 2 not ready
# INSERT INTO team_member (team_id, user_id, ready) VALUES
#                                                       (1, 1, 1),
#                                                       (1, 2, 0),
#                                                       (1, 3, 1),
#                                                       (1, 4, 0);
#
# -- Team 2 (Only one not ready, but team too small)
# INSERT INTO team (id, course_code, legit) VALUES (2, 'CS205', FALSE);
#
# -- Members: 1 ready, 1 not ready
# INSERT INTO team_member (team_id, user_id, ready) VALUES
#                                                       (2, 5, 1),
#                                                       (2, 6, 0);
#
# -- Team 3 (Only one not ready, and team meets size)
# INSERT INTO team (id, course_code, legit) VALUES (3, 'CS205', FALSE);
#
# -- Members: 2 ready, 1 not ready
# INSERT INTO team_member (team_id, user_id, ready) VALUES
#                                                       (3, 7, 1),
#                                                       (3, 8, 1),
#                                                       (3, 9, 0);
#
# -- getTotalMembersCountInLegitTeams
# INSERT INTO team (id, course_code, legit) VALUES (4, 'CS301', TRUE);
#
# -- Add 3 members: all are ready (ready = 1)
# INSERT INTO team_member (team_id, user_id, ready) VALUES
#                                                       (4, 12, 1),
#                                                       (4, 13, 1);

