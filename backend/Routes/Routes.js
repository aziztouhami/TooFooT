const express = require('express');
const {checkEmail,checkUsername,addUser,

  signIn,
 
  getAllPlayers,getPlayerById,addPlayer, deletePlayer, updatePlayerAttribute,

  getAllUsers, deleteUser, updateUserRole,

  getUsersRanking, getOtherUserProfile, getUserUsername, getUserProfile, updateUserProfile ,

  handleFailure,handleVictory,startAttempt,searchPlayers

 
} = require('../Controllers/Controller');
const upload = require("../Configuration/Upload")
const isAuth = require("../Middleware/isAuth")
const isAutho=require('../Middleware/isAutho')

const router = express.Router();

router.post('/check-email', checkEmail);
router.post('/check-username', checkUsername);
router.post('/users', addUser);

router.post('/signin',signIn)


router.post("/player", isAuth, isAutho(["admin"]), upload.fields([ { name: "imageCache", maxCount: 1 }, { name: "image", maxCount: 1 },       ]),addPlayer);
router.delete("/player/:id", isAuth, isAutho(["admin"]), deletePlayer);
router.patch("/player/:id", isAuth, isAutho(["admin"]), upload.fields([{ name: 'image' }, { name: 'imageCache' }]), updatePlayerAttribute);
router.get("/player/:id", isAuth, isAutho(["admin"]), getPlayerById);
router.get("/players", isAuth, isAutho(["admin"]), getAllPlayers);


router.get("/search",isAuth, isAutho(["user", "admin"]), searchPlayers);


router.get('/users/all',isAuth, isAutho(["admin"]), getAllUsers); 
router.delete('/user/:id',isAuth, isAutho(["admin"]), deleteUser);
router.put('/user/role/:id', isAuth, isAutho(["admin"]),updateUserRole);



router.get("/ranking", isAuth, isAutho(["user", "admin"]), getUsersRanking);
router.get("/user/profile/:id", isAuth, isAutho(["user", "admin"]), getOtherUserProfile);
router.get("/username", isAuth, isAutho(["user", "admin"]), getUserUsername);
router.get("/profile", isAuth, isAutho(["user", "admin"]), getUserProfile);
router.put("/profile", isAuth, isAutho(["user", "admin"]), updateUserProfile);



router.post('/game/startattempt',isAuth, isAutho(["user", "admin"]), startAttempt); 
router.post('/game/failure',isAuth, isAutho(["user", "admin"]), handleFailure); 
router.post('/game/victory',isAuth, isAutho(["user", "admin"]), handleVictory); 

module.exports = router;
