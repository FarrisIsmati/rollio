const mongoose = require('../mongoose/index');
const User = mongoose.model('User');

module.exports = {
    async findUserById(userId) {
        return User.findById(userId)
    }
}
