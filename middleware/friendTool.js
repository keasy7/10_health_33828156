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

module.exports = { addFriend, removeFriend };