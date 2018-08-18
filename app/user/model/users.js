const mongoose = require('mongoose');
const bcrypt   = require('bcrypt-nodejs');

const userSchema = mongoose.Schema({
	email    : { type: String },
	password : { type: String },
	name     : { type: String },
	address  : { type: String },
	phone    : { type: String }
});

userSchema.methods.generateHash = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

userSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);