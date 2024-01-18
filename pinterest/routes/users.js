const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
mongoose.connect("mongodb://localhost:27017/pinterest");

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  profileimg: String,
  boards: {
    type: Array,
    default: []
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post"
    }
  
  ]
});
userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("user", userSchema);