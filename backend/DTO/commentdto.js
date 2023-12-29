
class commDTO {
    constructor (comment){
        this.id = comment._id;
        this.content = comment.content;
    }
}

module.exports = commDTO;