
const jwt = require('jsonwebtoken');
const Token = require('../models/token')

const Access_secret = '68dc0f0ab0bcf57982c2f73f13d9c1b0fafebcd62fa0766cb2cdfb2e3be5b82f2e22a28b0baf6ebcf5981f62baa9518f8f0dfa3bb339264567f3e253a910b1c0'
const Refresh_secret = '9b5d48b226cc5e0a9d46ed5fd779af62043f74a5d391ff3dc796d2f243221d1e78105301fd75e345672ed46eb6f4bde633f23ce4b5c656271d9da56e0d216447'


class JWTService{

    // sign access token 
    static signAccessToken(payload,expiryTime){
        return jwt.sign(payload,Access_secret,{expiresIn : expiryTime});
    }
    // sign refresh token
    static signRefreshToken(payload,expiryTime){
        return jwt.sign(payload,Refresh_secret,{expiresIn : expiryTime});
    }
    // verify access token 
    static verifyAccessToken(token){
        return jwt.verify(token,Access_secret);
    }
    // verify refresh token
    static verifyRefreshToken(token){
        return jwt.verify(token,Refresh_secret);
    }
    // save refresh token
    static async saveRefreshToken(token,user){
        const newtoken = new Token({
            token : token,
            id : user._id
        })
        
        await newtoken.save();
    }
}

module.exports = JWTService;