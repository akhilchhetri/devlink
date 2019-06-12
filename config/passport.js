const User=require('../model/User');
const keys= require('../config/keys');
const passport= require('passport');
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const jwtOptions = {};

jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = keys.secret;

module.exports= passport =>{
    passport.use(new JwtStrategy(jwtOptions, (jwt_payload, done)=> {
        // checking with jwt_payload user Id in Model User
        User.findOne({_id: jwt_payload.id}, (err, user) =>{
            if (err) {
                return done(err, false);
            }
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
                // or you could create a new account
            }
        });
    }));
};
