const addWorkout = (userId, type, duration, distance, reps, sets) => {
    let sqlquery = `INSERT INTO workouts (user_id, type, duration, distance, reps, sets) VALUES (?, ?, ?, ?, ?, ?)`;
    
    db.query(sqlquery, [userId, type, duration, distance, reps, sets], (err, results) => {
        if (err) {
            console.error('Error adding workout:', err);
            return;
        } else {
            console.log('Workout added successfully');
        }
    });
};

const removeWorkout = (userId, workoutId) => {
    let sqlquery = `DELETE FROM workouts WHERE user_id = ? AND id = ?`;
    
    db.query(sqlquery, [userId, workoutId], (err, results) => {
        if (err) {
            console.error('Error removing workout:', err);
            return;
        } else {
            console.log('Workout removed successfully');
        }
    });
};

module.exports = { addWorkout, removeWorkout };