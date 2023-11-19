
class BlogDto {
    constructor (blog) {
        this.id = blog.id;
        this.title  = blog.title;
        this.content = blog.content;
        this.photopath = blog.photopath;
    }
}

module.exports = BlogDto;