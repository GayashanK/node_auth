const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
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

// Local strategy

passport.use(new LocalStrategy({
    usernameField: 'email'
}, async (email, password, done) =>{
    try {
        // Find the user given the email
        const user = await User.findOne({ email });
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
