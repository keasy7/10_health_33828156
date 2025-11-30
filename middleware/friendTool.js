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

const acceptFriendRequest = (userId, friendId) => {
    let sqlquery = `UPDATE friends SET status = 'accepted' WHERE user_id = ? AND friend_id = ?`;

    db.query(sqlquery, [userId, friendId], (err, results) => {
        if (err) {
            // Try swapping the userId and friendId if the first update fails
            db.query(sqlquery, [friendId, userId], (err2, results2) => {
                if (err2) {
                    console.error('Error accepting friend request:', err2);
                    return;
                } else {
                    console.log('Friend request accepted successfully (swapped IDs)');
                }
            });
        } else {
            console.log('Friend request accepted successfully');
        }
    });
};

module.exports = { addFriend, removeFriend, acceptFriendRequest };