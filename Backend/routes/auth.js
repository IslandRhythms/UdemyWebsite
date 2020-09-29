const express = require('express');
const router = express.Router();
const {signup,signin,signout,requireSignin,test} = require('../controller/auth');
const {userSignupValidator} = require('../validator');

//Create Route Method
router.post("/signup",userSignupValidator,signup);

router.post("/signin",signin);

router.get("/signout",signout);


router.get("/test",test);

module.exports = router;