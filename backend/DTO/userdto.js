class userdto {
    constructor (user){
        this.name = user.name;
        this.username = user.username;
        this.email = user.email;
        this._id = user._id;
        this.auth = true;
    }
}

module.exports = userdto;