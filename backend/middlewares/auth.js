const JWTService = require('../services/jwtservices');
const User = require('../models/user');
const Token = require('../models/token');
const userdto = require('../DTO/userdto');

const auth = async (req, res, next) => {

    try {
        const { refreshtoken, accesstoken } = req.cookies;

        if (!refreshtoken || !accesstoken) {
            const error = {
                status: 401,
                message: 'Unauthorized'
            }
            return next(error);
        }

        let id;
        try {
            id = JWTService.verifyAccessToken(accesstoken).id;
        }
        catch (error) {
            return next(error);
        }

        let user;
        try {
            user = await User.findOne({ _id: id });
            if (!user) {
                return next({
                    status: 401,
                    message: 'Unauthorized'
                })
            }
        } catch (error) {
            return next(error);
        }

        const newuser = new userdto(user);
        req.user = newuser;
        next();
    } catch (error) {
        return next(error);
    }
}

module.exports = auth;

