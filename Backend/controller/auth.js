const User = require('../models/user');
const {errorHandler} = require('../helpers/dberrorhandler');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

exports.signup = (req,res,next) => {
    console.log('req.body',req.body);
    const user = new User(req.body);
    user.save((err,user) => {
        if(err){
            return res.status(400).json({
                err: errorHandler(err)
            });
        }
        user.salt = undefined;
        user.hashed_password = undefined;
        res.json({
            user
        });
        next();
    });
};


exports.signin = (req,res) => {
const {email,password} = req.body;
User.findOne({email},(err,user) => {
    if(err||!user){
        return res.status(400).json({
            error: 'User with that email does not exist. Consider signing up'
        });
    }
    //if user is found, verify email and password match
    //create authenticate method
    if(!user.authenticate(password)) {
        return res.status(401).json({
            error: 'Email and password do not match'
        });
    }
    //generate a signed token with user id and secret
    const token = jwt.sign({_id: user._id},process.env.JWT_SECRET);
    //persist thet token as t in cookie with expiration date
    res.cookie('t',token,{expire: new Date() +9999})
    //return res with usear and token to frontend

    const{_id,name,email,role} = user;
    return res.json({token,user:{_id,email,name,role}});
});
};

exports.signout = (req,res) => {
    res.clearCookie('t');
    res.json({message: 'Signout Successful'});
};

exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    userProperty: "auth"
});

exports.isAuth = (req,res,next) => {
    let user = req.profile && req.auth && req.profile._id == req.auth._id;
    if(!user) return res.status(403).json({
        error: "Access Denied"
    });
    next();
};

exports.isAdmin = (req,res,next) => {
    if(req.profile.role === 0) return res.status(403).json({
        error: "Admin resource! Access Denied"
    });

    next();
};


exports.test = (req,res) => {
    res.json({message:"hello there"});
};