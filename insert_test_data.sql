USE health_tracker;

INSERT INTO users (username, password) VALUES ('gold', 'smiths'), ('firstFriend', 'password');

INSERT INTO achievements (user_id, title, description, target_value, metric_type) VALUES (NULL, "First 5K Run", "Complete a 5 kilometer run", 5, "km"), (1, "100 Push-Ups", "Complete 100 push-ups in total", 100, "reps"), (NULL, "7 Day Streak", "Complete 7 days of exercise in a row!", 7, "days");

INSERT INTO workouts (user_id, type, duration, distance, reps, sets) VALUES (1, "running", 30, 5.00, NULL, NULL), (1, "weightlifting", 30, NULL, 10, 3);

INSERT INTO user_preferences (user_id, show_distance, show_reps, show_sets) VALUES (1, TRUE, TRUE, TRUE);