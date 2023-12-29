const mongodbIdPattern = /^[0-9a-fA-F]{24}$/;

const Joi = require("joi");
const fs = require('fs');
const Blog = require('../models/blog');
const { v4: uuidv4 } = require('uuid');
const BLOGDTO = require('../DTO/blogdto');
const Comment = require('../models/comment');
const { writeFile } = require("fs");


const blogs = {

    async create_blog(req, res, next) {
        // validate incoming data;

        const datacheck = Joi.object({
            title: Joi.string().max(25).required(),
            content: Joi.string().max(1000).required(),
            author: Joi.string().regex(mongodbIdPattern).required(),
            photo: Joi.string().required()
        })

        const { error } = datacheck.validate(req.body);

        if (error) {
            return next(error);
        }
        // save photo in storage or cloud and save its path in DB
        const {title , photo , content , author } = req.body;

        const buffer = Buffer.from(
            photo.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""), "base64"
        );

        const uniquePath = `${uuidv4()}.jpg`;
        const imagePath = `../frontend/src/images/${uniquePath}`;
        const imagePath2 = `../frontend/public/images/${uniquePath}`;

        try{
            await fs.promises.writeFile(imagePath,buffer);
            await fs.promises.writeFile(imagePath2,buffer);
        }catch(error){
            return next(error);
        }
        let blog;
        try {
            blog = new Blog({
                title,
                author,
                content,
                photoPath: imagePath
            })

            await blog.save();
        } catch (error) {
            return next(error);
        }
        
        const newBlog = new BLOGDTO(blog);
        return res.status(200).json({ newBlog });
    },
    async update_blog(req, res, next) {

        const schemaCheck = Joi.object({
            blog_id: Joi.string().regex(mongodbIdPattern).required(),
            title: Joi.string().max(25).required(),
            content: Joi.string().max(1000).required(),
            author: Joi.string().regex(mongodbIdPattern).required(),
            photo: Joi.string()
        })
        const { error } = schemaCheck.validate(req.body);
        if (error) {
            return next(error);
        }
        const { author, title, content, blog_id, photo } = req.body;
        let blog;
        try {
            blog = await Blog.findOne({ _id: blog_id });
            if (!blog) {
                return next({
                    status: 404,
                    message: 'Blog Not Found'
                })
            }
        }
        catch (error) {
            return next(error);
        }
        
        console.log(req.body);
        if (photo) {
            const buffer = Buffer.from(
                photo.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""), "base64"
                );
                
                const uniquePath = `${uuidv4()}.png`;
                const imagePath = `storage/${uniquePath}`;
                
                try {
                    await fs.promises.writeFile(imagePath, buffer);
                } catch (error) { return next(error); }

            try{
                await Blog.updateOne(
                    {_id: blog_id,},
                    {
                    title,
                    content, 
                    author,
                    photoPath : imagePath
                })
            }catch(error){
                return next(error);
            }
        }else{
            try{
                await Blog.updateOne(
                    {_id: blog_id},
                    {
                    title,
                    content,
                    author,
                });        
            }catch(error){
                return next(error);
            }
        }
        return res.status(200).json({message : 'Blog updated Successfully'});
    },
    async delete_blog(req, res, next) {
        // validate incoming data;

        const datacheck = Joi.object({
            id : Joi.string().regex(mongodbIdPattern).required()
        })

        const { error } = datacheck.validate(req.params);

        if (error) {
            return next(error);
        }
        const { id } = req.params;
        try{
            const blog = await Blog.findOne({_id : id});
            if(!blog){
                return next({
                    status : 404, 
                    message : 'Blog Not Found'
                })
            }

            await Blog.deleteOne({_id : id});
            await Comment.deleteMany({blog : id});
        }
        catch(error){return next(error)}
        
        return res.status(200).json({message : 'Blog Deleted Successfully'})
    },
    async getallblogs(req, res, next){
        let blog;
        try{
         blog = await Blog.find();
        }catch(error){return next(error);}

        const blogs = [];

        for(let i = 0; i < blog.length ;i++){
            const dto = new BLOGDTO(blog[i]);
            blogs.push(dto);
        }

        return res.status(200).json({BLOGS : blogs});
    },
    async getbyid(req, res, next){

        const idcheck = Joi.object({
            id : Joi.string().regex(mongodbIdPattern).required()
        })
        const {error} = idcheck.validate(req.params);
        if(error){
            return next(error);
        }

        const {id} = req.params;
        let blog;
        try{
            blog = await Blog.findOne({_id : id});
            if(!blog){
                return next({
                    status : 404,
                    message : 'Blog Not Found'
                })
            }

        }catch(error){
            return next(error);
        }
        let blogdto = new BLOGDTO(blog);
        return res.status(200).json({Blog : blogdto});
    }

}

module.exports = blogs;