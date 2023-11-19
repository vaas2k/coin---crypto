const jwt = require('jsonwebtoken')
const TOKEN = require('../modules/token');

const Access_secret = 'bcb4fb3144ed5db0c6b165e492b76a4ca2b2b0ce0c6c00640b3309fe1fb5f9b884663f70b607ce07f35ad02cbca56d7424607b1c4886fc680c2a145c1ca69b97'
const Refresh_secret = 'f7be7b159614273713d20cf8ec8080c1c12745169cfc7ce8a71f53a7a3fa40917e5584c369239628833d0e875840a468a5066bebc2397e795e3de04759ac0f07'


class JWTService {

    // sign token will only be used at registration time
    //sign access token
    static signAccessToken(payload,expiryTime){
        return jwt.sign(payload,Access_secret,{expiresIn : expiryTime});
    }
    //sign refresh token
    static signRefreshToken(payload,expiryTime){
        return jwt.sign(payload,Refresh_secret,{expiresIn : expiryTime});
    }

    // verification is done when a user is trying to login with its token
    //verify access
    static verifyAccessToken(token){
        return jwt.verify(token, Access_secret);
    }
    // verify refresh
    static verifyRefreshToken(token){
        return jwt.verify(token,Refresh_secret);
    }

    // save token in Database 
    static async saveToken(token,user){
        try{
        const newToken = new TOKEN ( {
            token : token,
            id : user.id
        })
        await newToken.save();
       }
       catch(error){
        console.log(error);
    }
        
    }
}

module.exports = JWTService ;