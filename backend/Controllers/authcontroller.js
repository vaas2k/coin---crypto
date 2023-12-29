const password_pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;


const User = require('../models/user');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const userdto = require('../DTO/userdto');
const JWTService = require('../services/jwtservices')
const Token = require('../models/token')


const users = {
    async register(req, res, next) {

        const schema = Joi.object({
            username: Joi.string().alphanum().max(25).required(),
            name: Joi.string().max(25).required(),
            email: Joi.string().email().required(),
            password: Joi.string().pattern(password_pattern).required(),
            confirm_password: Joi.ref('password')
        })

        const { error } = schema.validate(req.body);
        if (error) {
            return next(error);
        }

        const { email, name, username, password } = req.body;

        try {
            const emailcheck = await User.exists({ email });
            const usercheck = await User.exists({ username: username });
            if (emailcheck) {
                const error = {
                    status: 400,
                    message: 'Email Already registered'
                }
                return next(error);
            }
            if (usercheck) {
                const error = {
                    status: 400,
                    message: 'Username Already Taken'
                }
                return next(error);
            }
        } catch (error) {
            return next(error);
        }

        const hash_password = await bcrypt.hash(password, 11);
        let newuser;
        let accesstoken;
        let refreshtoken;
        try {
            newuser = new User({
                name,
                username,
                email,
                password: hash_password
            })

            accesstoken = JWTService.signAccessToken({ id: newuser._id }, "30min");
            refreshtoken = JWTService.signRefreshToken({ id: newuser._id }, "60min");

            await newuser.save();
        } catch (error) {
            return next(error);
        }

        await JWTService.saveRefreshToken(refreshtoken, newuser);

        res.cookie("accesstoken", accesstoken, {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true
        })
        res.cookie("refreshtoken", refreshtoken, {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true
        })

        const user = new userdto(newuser);
        return res.status(200).json({ user });

    },
    async login(req, res, next) {
        // validate schema data
        const schemacheck = Joi.object({
            username: Joi.string().required(),
            password: Joi.string().pattern(password_pattern).required()
        })
        const { error } = schemacheck.validate(req.body);
        if (error) {
            return next(error);
        }

        // check and match user from DB
        const { username, password } = req.body;
        let accesstoken, refreshtoken, user;
        try {
            user = await User.findOne({ username: username });
            if (user) {
                const pass_check = bcrypt.compare(password, user.password);
                if (!pass_check) {
                    return next({
                        status: 401,
                        message: 'Invalid Password!'
                    })
                }
            } else {
                return next({
                    status: 401,
                    message: 'Invalid Username'
                })
            }

        } catch (error) {
            return next(error);
        }

        // generate new tokens and update them in db
        accesstoken = JWTService.signAccessToken({ id: user._id }, "30min");
        refreshtoken = JWTService.signRefreshToken({ id: user._id }, "60min");

        try {
            await Token.updateOne(
                { token: refreshtoken },
                { upsert: true }
            );

            res.cookie("accesstoken", accesstoken, {
                maxAge: 1000 * 60 * 60 * 24,
                httpOnly: true
            })
            res.cookie("refreshtoken", refreshtoken, {
                maxAge: 1000 * 60 * 60 * 24,
                httpOnly: true
            })
        } catch (error) {
            return next(error);
        }
        const newuser = new userdto(user);
        // send responce
        return res.status(200).json({ newuser});

    },
    async logout(req, res, next) {
        // delete refresh cookie from DB;
        const { refreshtoken } = req.cookies;
        try {
            await Token.deleteOne({ token: refreshtoken });
        } catch (error) {
            return next(error);
        }

        res.clearCookie("accesstoken");
        res.clearCookie("refreshtoken");

        return res.status(200).json({ user: null, auth: false });
    },
    async refresh(req, res, next) {
        const originalrefreshtoken = req.cookies.refreshtoken;
        let id;
        try {
            id = JWTService.verifyRefreshToken(originalrefreshtoken).id;
        } catch (error) {
            return next(error);
        }

        try {
            const match = Token.findOne({
                token : originalrefreshtoken,
                id : id
            })
            if(!match){
                const error = {
                    status : 401,
                    message : 'Unauthorized'
                }
                return next(error);
            }
        }catch(error) {
            return next(error);
        }
        
        try {
            const accesstoken = JWTService.signAccessToken({id : id},'30min');
            const refreshtoken = JWTService.signRefreshToken({id : id},'60min');

            await Token.updateOne(
                {id : id} ,
                {
                token : refreshtoken
            })


            res.cookie('accesstoken',accesstoken,{
                maxAge : 1000 * 60 * 60 * 24,
                httpOnly : true,
            })

            res.cookie('refreshtoken',refreshtoken,{
                maxAge : 1000 * 60 * 60 * 24,
                httpOnly : true,
            })

        }catch(error){
            return next(error);
        }

        const user = await User.findOne({_id : id});
        const newuser = new userdto(user);
        return res.status(200).json({
            newuser
        });
    }

}

module.exports = users;