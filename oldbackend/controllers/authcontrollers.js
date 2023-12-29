const password_pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;
const mongodbIdPattern = /^[0-9a-fA-F]{24}$/;

const Joi = require('joi');
const USER = require('../modules/user');
const bcrypt = require('bcryptjs');
const JWTService = require('../services/jwtservices');
const TOKEN =  require('../modules/token');
const userDto = require('../Dto/user');

const users1 = {
    async register (req,res,next) {
        //set constraints for user input data
        const uservalidate = Joi.object({
            username : Joi.string().min(5).max(15).required(),
            name : Joi.string().max(15).required(),
            email : Joi.string().email().required(),
            password : Joi.string().pattern(password_pattern).required(),
            confirm_password : Joi.ref('password')
        })

        //check if the user data is valid that will come from req body
        const {error} = uservalidate.validate(req.body);
        if(error){
            return next(error);
        }

        //check if the email and username already registered ?
        const { username , name , email , password } = req.body;

        try{
            // check email && username in DataBase 
            const email_in_use = await USER.exists({email});
            const user_in_use = await USER.exists({username});

            if(email_in_use){
                const error = {
                    status : 409,
                    msg : 'email already in use'
                }
                return next(error);
            }

            if(user_in_use){
                const error = {
                    status : 409,
                    msg : 'username already in use'
                }
                return next(error);
            }
        }
        catch(error){
            return next(error);
        }

        // at this point if we are still inside the function
        // we hash the password

        const hash_password = await bcrypt.hash(password,10);

        //store the user in database

        let accessToken ;
        let refreshToken ;
        let user ; 
        try{
            
            const new_entry = new USER ({
                username,
                name,
                email,
                password : hash_password
            })
    
            user = await new_entry.save();

            accessToken = JWTService.signAccessToken({ _id : user._id },'30min');
            refreshToken = JWTService.signRefreshToken({ _id : user._id},'60min');


        }catch(error){
            return next(error);
        }
        // save the token
        await JWTService.saveToken(refreshToken,user);

        // send cookie with responce that contain our tokens
        res.cookie('accesstoken', accessToken, {
            maxAge : 1000 * 60 * 60 * 24,
            httpOnly : true
        })

        res.cookie('refreshtoken', refreshToken, {
            maxAge : 1000 * 60 * 60 * 24,
            httpOnly : true
        })

        return res.status(201).json({user});
    },
    async login(req,res,next){

        // make a validation form for incoming data
        const validcheck = Joi.object({
            username : Joi.string().required(),
            password : Joi.string().pattern(password_pattern).required()
        })

        // validate the incoming data
        const { error } = validcheck.validate(req.body);
        // if error return error
        if(error){
            return next(error);
        }

        const { username , password } = req.body;

        let user ;
        try{
            // find the incoming username in database
            user = await USER.findOne({username : username});
            
            //if user doesnt exist -> return error
            if(!user){
                const error = {
                    status : 401,
                    message : 'User not found!'
                }
                return next(error);
            }
            // if user exist then match the incoming password and password of user in DB
            const match = await bcrypt.compare(password,user.password);
            if(!match){
                const error = {
                    status : 401,
                    message : 'Invalid Password'
                }
                return next(error);
            }

        }catch(error){
            return next(error);
        }
        const accesstoken = JWTService.signAccessToken({ _id : user._id} , '30min');
        const refreshtoken = JWTService.signRefreshToken({ _id : user._id} , '60min');
        try{
            await TOKEN.updateOne({
                id : user._id
            },
            {
                token : refreshtoken
            }
            ,{
                upsert : true
            })
        }catch(error){
            return next(error);
        }

        res.cookie('accesstoken',accesstoken,{
            maxAge : 1000 * 60 * 60 * 24,
            httpOnly : true
        })

        res.cookie('refreshtoken',refreshtoken,{
            maxAge : 1000 * 60 * 60 * 24,
            httpOnly : true
        })

        const userinfo = new userDto(user);
        return res.status(200).json({userinfo , auth : true});
    },
    async logout(req,res,next){
        // delete refresh cookie from Db
        const { refreshtoken } = req.cookies;
        try{
            await TOKEN.deleteOne({ token : refreshtoken });
        }catch(error){
            return next(error);
        }
        // clear current cookies
        res.clearCookie('accesstoken');
        res.clearCookie('refreshtoken');

        // send responce
        res.status(200).json({user : null , auth : false});
    },
    async refresh(req,res,next){
        // getting the refresh token form req body
        const originalRefreshToken = req.cookies.refreshtoken;

        // verifying the token
        let id;
        try{
            id = JWTService.verifyRefreshToken(originalRefreshToken).id;
        }catch(error){
            return next(error);
        }

        // checking if it exists in our DB
        try{
            const match = TOKEN.findOne({
                id : id,
                token : originalRefreshToken
            })

            if(!match){
                const error = {
                    status : 401,
                    message : 'Unauthorized'
                }

                return next(error);
            }
        }
        catch(error){return next(error);}

        // generating new tokens and updating refresh token
        try{
            const accesstoken = JWTService.signAccessToken({id : id},"30min");
            const refreshtoken = JWTService.signRefreshToken({id : id},"60min");

            await TOKEN.updateOne({
                id : id,
                token : refreshtoken
            });

            res.cookie("accesstoken",accesstoken,{
                maxAge : 1000 * 60 * 60 * 24,
                httpOnly : true
            })

            res.cookie("refreshtoken",refreshtoken,{
                maxAge : 1000 * 60 * 60 * 24,
                httpOnly : true
            })

        }catch(error){return next(error);}

        const user = await USER.findOne({id : id});
        const userdto1 = new userDto(user);

        return res.status(200).json({userdto1, auth : true});
    }
}

module.exports = users1;