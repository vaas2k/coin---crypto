const express = require('express');
const users = require('../Controllers/authcontroller');
const blogs  = require('../Controllers/blogcontroller');
const Comments = require('../Controllers/commentcontr');
const router = express.Router();
const auth = require('../middlewares/auth');
// for authentication ;

router.post('/register',users.register);
router.post('/login',users.login);
router.post('/logout',auth,users.logout);
router.get('/refresh',users.refresh);

// for posting / blogs

router.put('/update_blog',auth,blogs.update_blog);
router.delete('/delete_blog/:id',auth,blogs.delete_blog);
router.get('/getblog/:id',auth,blogs.getbyid);
// removed auth from api down below
router.post('/create_blog',auth,blogs.create_blog);
router.get('/getallblogs',auth,blogs.getallblogs);

// for comments

// removed auth from comments and getcomment
router.post('/comment',auth,Comments.create_comment);
router.get('/getcomment/:id',auth,Comments.getcomment);

module.exports = router;

