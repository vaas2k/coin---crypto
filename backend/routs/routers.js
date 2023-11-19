const express = require('express');
const users1 = require('../controllers/authcontrollers');
const blogs1 = require('../controllers/blogscontrollers');
const comm1 =  require('../controllers/commentcontrollers');
const router = express.Router();
const auth = require('../middlewares/cookieauth');

router.get('/',(req,res)=>{
    console.log(req.method);
    res.json({msg : 'noice!'});
})

// for user authentication
router.post('/register',users1.register);
router.post('/login',users1.login);
router.post('/logout',auth,users1.logout);
router.post('/refresh',users1.refresh);

// for blogs
router.post('/createblog',auth,blogs1.create);
router.get('/showblogbyid/:id',auth,blogs1.showbyid);
router.get('/showall',blogs1.getall);
router.put('/updateblog',auth,blogs1.updateBlog);
router.delete('/deleteblog/:id',auth,blogs1.deleteBlog);

//for comments
router.post('/comment',auth,comm1.createComment);
router.delete('/deletecomment/:id',auth,comm1.deleteComment);
router.get('/showcommentbyid/:id',comm1.getbyid);

module.exports = router;