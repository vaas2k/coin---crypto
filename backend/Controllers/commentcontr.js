const mongodbIdPattern = /^[0-9a-fA-F]{24}$/;

const Comment = require('../models/comment');
const Joi = require('joi');
const commentdto = require('../DTO/commentdto');
const Blog = require('../models/blog');


const Comments = {
    async create_comment(req, res, next){

        const commCheck = Joi.object({
            content : Joi.string().required(),
            author : Joi.string().regex(mongodbIdPattern).required(),
            blog: Joi.string().regex(mongodbIdPattern).required()
        })

        const {error} = commCheck.validate(req.body);
        if(error){
            return next(error);
        }

        const {content , author , blog }  = req.body;
        let comm;
        try{
            comm = new Comment({
                content,
                author,
                blog
            })
            await comm.save();
        }catch(error){
            return next(error);
        }
        return res.status(200).json({Comment : content});
    },
    async getcomment(req, res, next){
        
        const idcheck = Joi.object({
            id : Joi.string().regex(mongodbIdPattern).required(),
        })

        const {error} = idcheck.validate(req.params);
        if(error){
            return next(error);
        }
        const {id} = req.params;
        try{
            const blog = await Blog.findOne({_id : id});
        }catch(error){
            return next(error);
        }
        let comments;
        const comms = [];
        try{
            comments = await Comment.find({blog : id}).populate('author');
            
            for(let i = 0; i < comments.length ;i++){
                const dto = new commentdto(comments[i]);
                comms.push(dto);
            }

        }catch(error){
            return next(error);
        }

        return res.status(200).json({comments : comms});
    }
}

module.exports = Comments;