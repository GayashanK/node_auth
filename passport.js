const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const GooglePlausTokenStrategy = require('passport-google-plus-token');
const { JWT_SECRET } = require('./configurations/index');
const User = require('./models/user');

// JSON web tocan strategy
passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: JWT_SECRET
}, async (payload, done) => {
    try{
        // Find the user specifed in token
        const user = await User.findById(payload.sub);

        // If the user dosent exist, handle it
        if(!user) {
            return done(null, false);
        }

        // Otherwise, return the user
        done(null, user);

    } catch(error) {
        done(error, false);
    }
}));

// Google OAuth strategy
passport.use('googleToken',new GooglePlausTokenStrategy({
    clientID: '1001513663331-np4fa5g30gipf8fph1v0i1p9l3c1skof.apps.googleusercontent.com',
    clientSecret: 'IMaOyrwAabP2fW-QAOUqftld'
}, async(accessToken, refreshToken, profile, done) => {
    try {
        // Check whether current user exist in our DB
        const existingUser = await User.findOne({ 'google.id': profile.id })
        if(existingUser){
            console.log('User already exist in our DB');
            return done(null, existingUser);
        }

        // If new account
        console.log('User doesn\'t exist in our DB, creating a new user');
        const newUser = new User({
            method: 'google',
            google: {
                id: profile.id,
                email: profile.emails[0].value
            }
        });

        await newUser.save();
        done(null, newUser);
    } catch (error) {
        done(error, false, error.message);
    }

    
}));

// Local strategy
passport.use(new LocalStrategy({
    usernameField: 'email'
}, async (email, password, done) =>{
    try {
        // Find the user given the email
        const user = await User.findOne({ 'local.email': email });
        // If user not exist, handle it
        if(!user) {
            return done(null, false);
        }
        //Check if the password is correct
        const isMatch = await user.isValidPassword(password);

        //If password not match, handle it
        if(!isMatch) {
            return done(null, false);
        }
        // Otherwise return the user
        return done(null, user);
    }catch(error) {
        done(error,false)
    }
}));
