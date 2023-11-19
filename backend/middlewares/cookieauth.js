
const JWTService = require('../services/jwtservices')
const USER = require('../modules/user')
const userDto = require('../Dto/user')

const auth = async (req, res, next) => {
    try{
    const { refreshtoken , accesstoken } = req.cookies;
    
    if(!refreshtoken || !accesstoken){
        const error = {
            status : 401,
            message : 'Unauthorized'
        }
        return next(error);
    }

    let id ;
    try{
         id = JWTService.verifyAccessToken(accesstoken).id;
        
    }catch(error){
        return next(error);
    }
    let user ;
    try{
        user = await USER.findOne({id : id });
    }
    catch(error){
        return next(error);
    }

    const userdto = new userDto(user);

    req.user = userdto;

    next();
   }catch(error){
    return next(error);
   }

}


module.exports = auth;