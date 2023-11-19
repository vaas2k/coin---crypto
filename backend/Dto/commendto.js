
class commentDto{
    constructor (comments){
        this._id = comments._id;
        this.username = comments.author.username;
        this.content = comments.content;
        this.created_at = comments.createdAt;
    }
}

module.exports = commentDto;