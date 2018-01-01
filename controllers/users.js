const JWT = require('jsonwebtoken');
const User = require('../models/user')
const { JWT_SECRET } = require('../configurations/index');

signToken = user => {
    return JWT.sign({
        iss: 'cis4',
        sub: user.id,
        iat: new Date().getDate(), // Current time
        exp: new Date().setDate(new Date().getDate() + 1) // Expire date
    }, JWT_SECRET);
}

module.exports = {
    signUp: async(req, res, next) => {
        const { email, password } = req.value.body;

        // Check if email already exist
        const foundUser = await User.findOne({ 'local.email': email });
        if(foundUser) {
            return res.status(403).json({
                error: "Email already exist"
            });
        }

        // Create new user
        const newUser = new User({ 
            method: 'local',
            local: {
                email: email, 
                password: password 
            }
        });
        await newUser.save();

        // Generate the token
        const token = signToken(newUser);

        //Response with token
        res.status(200).json({ token });
    },

    signIn: async(req, res, next) => {
        // Generate token
        const token = signToken(req.user);
        res.status(200).json({ token });
    },

    googleOAuth: async(req, res, next) => {
        // Generate token
        const token = signToken(req.user);
        res.status(200).json({ token });
    },

    facebookOAuth: async(req, res, next) => {
        // Generate token
        const token = signToken(req.user);
        res.status(200).json({ token });
    },


    secret: async(req, res, next) => {
        console.log('UserController.secret called!');
        res.json({ secret: "resource" });
    },
}