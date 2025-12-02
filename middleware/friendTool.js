const addFriend = (userId, friendId) => {
    let sqlquery = `INSERT INTO friends (user_id, friend_id) VALUES (?, ?)`;
    
    db.query(sqlquery, [userId, friendId], (err, results) => {
        if (err) {
            console.error('Error adding friend:', err);
            return;
        } else {
            console.log('Friend added successfully');
        }
    });
};

const removeFriend = (userId, friendId) => {
    let sqlquery = `DELETE FROM friends WHERE user_id = ? AND friend_id = ?`;
    
    db.query(sqlquery, [userId, friendId], (err, results) => {
        if (err) {
            console.error('Error removing friend:', err);
            return;
        } else {
            console.log('Friend removed successfully');
        }
    });
};

// const acceptFriendRequest = (userId, friendId) => {
//     let sqlquery = `UPDATE friends SET status = 'accepted' WHERE user_id = ? AND friend_id = ?`;

//     db.query(sqlquery, [userId, friendId], (err, results) => {
//         if (err) {
//             // Try swapping the userId and friendId if the first update fails
//             db.query(sqlquery, [friendId, userId], (err2, results2) => {
//                 if (err2) {
//                     console.error('Error accepting friend request:', err2);
//                     return;
//                 } else {
//                     console.log('Friend request accepted successfully (swapped IDs)');
//                 }
//             });
//         } else {
//             console.log('Friend request accepted successfully');
//         }
//     });
// };

const acceptFriendRequest = (userId, friendId, done) => {
    // UPDATED: Using raw input values instead of forcing parseInt
    console.log(`[DEBUG] Attempting to accept: User ${userId} -> Friend ${friendId}`);

    let sqlquery = `UPDATE friends SET status = 'accepted' WHERE user_id = ? AND friend_id = ?`;

    db.query(sqlquery, [userId, friendId], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            if (done) return done(err);
            return;
        }

        // Case 1: First try (User -> Friend)
        if (results.affectedRows === 0) {
            console.log('[DEBUG] Direct match not found. Swapping IDs...');
            
            // Case 2: Swapped try (Friend -> User)
            db.query(sqlquery, [friendId, userId], (err2, results2) => {
                if (err2) {
                    console.error('Error accepting friend request (swapped):', err2);
                    if (done) return done(err2);
                    return;
                } 
                
                if (results2.affectedRows === 0) {
                    console.log('[DEBUG] Failed: No friendship found in either direction.');
                } else {
                    console.log('[DEBUG] Success: Request accepted (Swapped IDs)');
                }

                // SIGNAL FINISH (Swapped path) - Only called once here
                if (done) return done(null);
            });
            // CRITICAL: Function stops here. It does NOT fall through.
        } else {
            console.log('[DEBUG] Success: Request accepted (Direct match)');
            // SIGNAL FINISH (Direct path)
            if (done) return done(null);
        }
    });
};

module.exports = { addFriend, removeFriend, acceptFriendRequest };