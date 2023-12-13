create database football_calendare;
use football_calendare;

create table season(
id int auto_increment primary key,
season_name text not null,
season_year varchar(255) 
);

create table teams(
id int auto_increment primary key,
team_name varchar(255) not null,
season_id int,
win_games int,
draw_games int,
lose_games int,
goals_scored INT,
goals_conceded INT,
goal_difference INT,
points INT,
matches_played INT,
foreign key (season_id) references season(id)
);



create table matches(
match_id int auto_increment primary key,
season_id int,
home_team_id INT,
away_team_id INT,
goals_scored_home INT,
goals_scored_away INT,
match_date DATE,
FOREIGN KEY (season_id) REFERENCES season(id),
FOREIGN KEY (home_team_id) REFERENCES teams(id),
FOREIGN KEY (away_team_id) REFERENCES teams(id));

INSERT INTO season (season_name, season_year) VALUES ('Spring', '2023');

INSERT INTO teams (team_name, season_id, win_games, draw_games, lose_games, goals_scored, goals_conceded, goal_difference, points, matches_played)
VALUES ('Team A', 1, 5, 3, 2, 15, 10, 5, 18, 10);

INSERT INTO teams (team_name, season_id, win_games, draw_games, lose_games, goals_scored, goals_conceded, goal_difference, points, matches_played)
VALUES ('Team B', 1, 4, 4, 2, 12, 8, 4, 16, 10);

INSERT INTO matches (season_id, home_team_id, away_team_id, goals_scored_home, goals_scored_away, match_date)
VALUES (1, 1, 2, 2, 1, '2023-03-01');

select * from season;

select * from teams;

select * from matches;