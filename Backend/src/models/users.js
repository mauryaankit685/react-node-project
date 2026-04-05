const mongoose = require("mongoose");
const validator = require("validator")
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    emailId: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid Email")
            }
        }
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        lowercase: true,
        validate(value) {
            if (!["male", "female", "other"].includes(value)) {
                throw new error("Gender is not valid");
            }
        }
    },
    about: {
        type: String,
        default: "this is default value"
    },
    skills: {
        type: [String]
    }
}, { timestamps: true })

// const UserModel = mongoose.model('User', userSchema);
// module.exports = UserModel;

module.exports = mongoose.model('User', userSchema);

//Mongoose automatically: Converts name to lowercase , Converts to plural. model->User then collection -> users
