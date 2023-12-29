
class BLOGDTO {
    constructor (blog){
        this.id = blog._id;
        this.title = blog.title;
        this.content = blog.content;
        this.author = blog.author;
        this.photo = blog.photoPath
    }
}

module.exports = BLOGDTO;