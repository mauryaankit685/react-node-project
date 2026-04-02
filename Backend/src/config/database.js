const mongoose = require('mongoose')

const connectDb = async () => {
    await mongoose.connect("mongodb+srv://mauryaankit0987_db_user:whZEBwO9QIsospwd@cluster0.btfs0ul.mongodb.net/devTinder");
}

module.exports = connectDb;

