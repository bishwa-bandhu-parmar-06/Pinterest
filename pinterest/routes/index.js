var express = require('express');
var router = express.Router();
const userModel = require("./users");
const postModel = require("./post");
const passport = require('passport');
const LocalStrategy = require('passport-local');

const upload = require("./multer");

passport.use(new LocalStrategy(userModel.authenticate()));


/* GET home page. */
router.get("/", function(req, res){
  res.render("index");
});

router.get("/register",function(req, res){
  res.render("register");
});

router.get("/profile", isLoggedIn ,function(req, res){
  res.render('profile');
});
router.get("/add",isLoggedIn, async function(req, res){
  const user = await userModel.findOne({username: req.session.passport.user});
  res.render("add", {user});
});

router.post("/createpost",isLoggedIn, upload.single("postimage"), async function(req, res){
  const user = await userModel
  .findOne({username: req.session.passport.user})
  .populate("posts");
  // console.log(user);
  const post = await postModel.create({
    user: user._id,
    title: req.body.title,
    description: req.body.description,
    image: req.file.filename
  });
  user.posts.push(post._id);
  await user.save();
  res.redirect("/profile");
});


router.post("/fileupload",isLoggedIn, upload.single("image") ,async function(req, res){
  const user = await userModel.findOne({username: req.session.passport.user});
  user.profileimg = req.file.filename;
  await user.save();
  res.redirect("/profile");
});


router.post("/register",function(req, res){
  const data = new userModel({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    // profileimg: req.body.profileimg
  });
  userModel.register(data, req.body.password)
  .then(function(){
    passport.authenticate("local")(req, res, function(){
      res.redirect("/profile");
    });
  });
});


router.post("/login",passport.authenticate("local", {
  failureRedirect: "/",
  successRedirect: "/profile"
}), function(req, res, next){
});

router.get("/logout", function(req, res, next){
  req.logout(function(err){
    if(err){
      return next(err);
    }
  });
  res.redirect("/");
});


function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/");
}

module.exports = router;
