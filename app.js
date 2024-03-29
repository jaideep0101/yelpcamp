if(process.env.NODE_ENV !=="production"){
  require("dotenv").config();
}


const express=require("express");
const mongoose=require("mongoose");
const ExpressError=require("./utils/expressError")
const path=require("path");
const ejsMate=require("ejs-mate");
const methodOverride=require("method-override");
const  session = require('express-session');
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');
const helmet=require("helmet");


const campgrounds=require("./routers/campgrounds");

const reviews=require("./routers/reviews");

const users=require("./routers/user");



 const dbUrl=process.env.DB_URL ||'mongodb://127.0.0.1:27017/yelpCamp';

mongoose.connect(dbUrl)
.then(()=>{
console.log("Data base is connected !!");
})


const app=express();
app.engine("ejs",ejsMate);
app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"public")));
app.use(mongoSanitize());

const secret=process.env.SECRET ||"this is  a secret";

const store= MongoStore.create({ 
  mongoUrl:dbUrl,
  secret,
touchAfter:24*60*60
});

store.on("error",function(e){
console.log("SESSION STORE ERROR",e)
})

const sess={
  store,
  name:"session",
    secret,
    resave: false,
  saveUninitialized: true,
  cookie:{
    httpOnly:true,
  //  secure:true,
      expires:Date.now()+1000*60*60*24*7
  }
}
app.use(session(sess));
app.use(flash());
app.use(helmet({contentSecurityPolicy:false,crossOriginEmbedderPolicy:false}));


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.currentUser=req.user;
    res.locals.message=req.flash("success");
    res.locals.error=req.flash("error");
    next();
})



app.use("/campgrounds",campgrounds);
app.use("/campgrounds/:id/reviews",reviews);
app.use("/",users);

app.get("/",(req,res)=>{
res.render("home");
})



app.all("*",(req,res,next)=>{
next(new ExpressError("Pagae not found",404));
})

app.use((err,req, res, next) =>{
    const {statusCode=500,message="Something went wrong"}=err;
    if(!err.message) err.message="Oh No, something went wrong !"
    res.status(statusCode).render("error",{err});
  });

const port=process.env.PORT ||3000;
console.log(port);
app.listen(port,()=>{
    console.log(`Serving on port ${port}`);
})

