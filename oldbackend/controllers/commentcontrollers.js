const mongodbIdPattern = /^[0-9a-fA-F]{24}$/;

const COMMENT = require('../modules/comments');
const commentDto = require('../Dto/commendto');

const Joi = require('joi');
const comm1 = {
    async createComment(req, res, next){

        // validation of incomming data
        const datacheck = Joi.object({
            content : Joi.string().required(),
            author : Joi.string().regex(mongodbIdPattern).required(),
            blog : Joi.string().regex(mongodbIdPattern).required()
        })

        const { error } = datacheck.validate(req.body);
        if(error){
            return next(error);
        }
        const {content , author , blog } = req.body;
        let comment;
        try{

            comment = new COMMENT({
                content,
                author, 
                blog
            })

            await comment.save();
        }catch(error){return next(error);}

        return res.status(200).json({comment : content});
    },
    async getbyid(req, res, next){

        const idcheck = Joi.object({
            id: Joi.string().regex(mongodbIdPattern).required()
        });
    
        const { error } = idcheck.validate(req.params);
        if (error) {
            return next(error);
        }
    
        const { id } = req.params;
        let comments;
        try {
            // Find comments for a specific blog ID and populate the 'author' field with user information
            comments = await COMMENT.find({ blog: id }).populate('author');
        } catch (error) {
            return next(error);
        }
    
        const coms = [];
        for (let i = 0; i < comments.length; i++) {
            const dto = new commentDto(comments[i]);
            coms.push(dto);
        }
    
        return res.status(200).json({ comments: coms });
    },
    async deleteComment(req, res, next){
        const idcheck = Joi.object({
            id : Joi.string().regex(mongodbIdPattern).required()
        })
        const {error} = idcheck.validate(req.params);
        if(error){
            return next(error);
        }
        const {id} = req.params
        try{
            const check = await COMMENT.findOneAndDelete({_id : id})
            if(!check){
                return next({
                    stats : 404,
                    message : 'Comment not found'
                })
            }
        }catch(error){
            return next(error);
        }

        return res.status(200).json({
            message : 'Comment Successfully deleted'
        });
    }
}

module.exports = comm1;