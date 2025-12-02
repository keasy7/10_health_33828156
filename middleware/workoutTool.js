const addWorkout = (userId, type, duration, distance, reps, sets, done) => {
    console.log('Adding workout:', { userId, type, duration, distance, reps, sets });

    let sqlquery = `INSERT INTO workouts (user_id, type, duration, distance, reps, sets) VALUES (?, ?, ?, ?, ?, ?)`;

    // --- SANITIZATION STEP ---
    // html forms submit empty fields as strings so this converts them to nulls
    const valDuration = duration || null;
    const valDistance = distance || null;
    const valReps = reps || null;
    const valSets = sets || null;

    db.query(sqlquery, [userId, type, valDuration, valDistance, valReps, valSets], (err, results) => {
        if (err) {
            console.error('Error adding workout:', err);
            // Signal error to router
            if (done) return done(err);
            return;
        } 
        console.log('Workout added successfully');
        // Signal success to router
        if (done) return done(null);
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