const mongodbIdPattern = /^[0-9a-fA-F]{24}$/;

const Joi = require('joi');
const BLOG = require('../modules/blogs');
const BlogDto = require('../Dto/blogdto');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const { mongo } = require('mongoose');
const COMMENT = require('../modules/comments');

const blogs1 = {
    async create(req, res, next){

        // validate incoming data;

        const datacheck = Joi.object({
            title : Joi.string().max(25).required(),
            content : Joi.string().max(250).required(),
            author : Joi.string().regex(mongodbIdPattern).required(),
            photo : Joi.string().required()
        })

        const { error } = datacheck.validate(req.body);

        if(error){
            return next(error);
        }
        // save photo in storage or cloud and save its path in DB
        const {title , author , photo , content } = req.body;

        const buffer  = Buffer.from(
            photo.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),"base64"
        );

        const imagePath = `${Date.now()}- ${buffer}.png`;
        try{
            fs.writeFileSync(`storage/${imagePath}`,buffer);
        }catch(error){return next(error);}
        let blog;
        try{
             blog = new BLOG({
                title, 
                author,
                content,
                photoPath : `http://localhost:9090/createblog/photokaname`
             })

             await blog.save();
        }catch(error){
            return next(error);
        }

        const newBlog = new BlogDto(blog);
        return res.status(200).json({newBlog});

    },
    async showbyid(req, res, next){
        // validate id
        const idcheck = Joi.object({
            id : Joi.string().regex(mongodbIdPattern).required()
        })
        const { error } = idcheck.validate(req.params);
        if(error){
            return next(error);
        }

        const {id} = req.params;
        console.log(id);
        let blog;
        try{
            blog = await BLOG.findOne({_id : id});
            if(!blog){
                const error = {
                    status : 404,
                    message : 'Blog not found '
                }
                return next(error);
            }
        }catch(error){
            return next(error);
        }
        const bDto = new BlogDto(blog);
        return res.status(200).json({bDto});
    },
    async getall(req, res, next){
        try{
            const blog = await BLOG.find({});

            const blogs = [];
                for(let i = 0; i < blog.length ;i++){
                const dto = new BlogDto(blog[i]);
                blogs.push(dto);
            }

            return res.status(200).json({Blog : blogs});
         }catch(error){
            return next(error);
       }
    },
    async updateBlog(req, res, next){
        console.log(req.body);
        const datacheck = Joi.object({
            title : Joi.string().max(25).required(),
            content : Joi.string().max(250).required(),
            author : Joi.string().regex(mongodbIdPattern).required(),
            blogid : Joi.string().regex(mongodbIdPattern).required(),
            photo : Joi.string(),
        })

        const {error} = datacheck.validate(req.body);
        if(error){
            return next(error);
        }

        const {title , author , content , photo , blogid} = req.body;

        let blog ;
        try{
            blog = await BLOG.findOne({_id : blogid});

            if(photo){
                const buffer = Buffer.from(
                    photo.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),"base64"
                );
                const imagePath = `${Date.now()} - ${author}.png`;

                try{
                    fs.writeFileSync(`storage/${imagePath}`,buffer);
                }catch(error){return next(error);}

                blog = await BLOG.updateOne({
                    title,
                    author,
                    content,
                    photoPath : 'http://localhost:9090/createblog/photokaname1'
                })
            }
            else{
                await BLOG.updateOne({
                    title,
                    content
                })
            }
        }catch(error){return next(error)}

         res.status(200).json({message : "Blog successfully updated"});
    },
    async deleteBlog(req, res, next){
        const idcheck = Joi.object({
            id : Joi.string().required()
        })

        const {error} = idcheck.validate(req.params);
        if(error){
            return next(error);
        }
        const {id} = req.params;
        let blog;
        try{
            blog = await BLOG.findOne({_id : id});
            if(!blog){
                const error = {
                    status : 404,
                    message : 'Blog not found'
                }
                return next(error);
            }
            await BLOG.deleteOne({_id : id});
            await COMMENT.deleteMany({blog : id});
        }
        catch(error){
            return next(error);
        }
        return res.status(200).json({message : "Blog Deleted Successfully " , id : blog._id});
    }
}


module.exports = blogs1;