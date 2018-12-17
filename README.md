#Test from SOFTINDEX to create expressjs API server for votes 

Using technologies : Express, MySQL, Squel

#####Script for database:

```CREATE USER 'softindex'@'localhost' IDENTIFIED BY 'softindex';

CREATE DATABASE voting;

GRANT ALL PRIVILEGES ON voting.* TO 'softindex'@'localhost';

FLUSH PRIVILEGES;

CREATE TABLE themes (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(1024) NOT NULL
);

CREATE TABLE options (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(20)
);

CREATE TABLE votes (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    theme_id INT NOT NULL,
    option_id INT NOT NULL
);

INSERT INTO options (name) VALUES ('yes');
INSERT INTO options (name) VALUES ('no'); ``` 

#####Install:
``` npm install ```