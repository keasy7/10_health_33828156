const express = require("express")
const router = express.Router()
const { redirectLogin } = require('../middleware/auth');
const { validate, hashPassword } = require('../middleware/inputVal');
const { query, validationResult } = require('express-validator');
const { addFriend, removeFriend, acceptFriendRequest } = require('../middleware/friendTool');



router.post('/add', redirectLogin, function (req, res, next) {
    const userId = req.session.userId;
    const friendId = req.body.friendId;

    addFriend(userId, friendId);
    res.redirect(`/users/profile/${req.body.friendUsername}`);
});

router.post('/remove', redirectLogin, function (req, res, next) {
    const userId = req.session.userId;
    const friendId = req.body.friendId;

    removeFriend(userId, friendId);
    res.redirect(`/users/profile/${req.body.friendUsername}`);
}
);

router.post('/accept', redirectLogin, function (req, res, next) {
    const userId = req.session.userId;
    const friendId = req.body.friendId;

    acceptFriendRequest(userId, friendId);
    res.redirect(`/users/profile/${req.body.friendUsername}`);
}
);
module.exports = router