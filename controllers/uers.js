const User=require("../models/user");

module.exports.renderRegister=(req,res)=>{
    res.render("users/register")
}

module.exports.createUser=async(req,res)=>{
    try{
        const{email,username,password}=req.body;
        const user = new User({email,username});
        const registeredUser=await User.register(user,password);
        req.login(registeredUser,err=>{
            if(err)return next(err);
        req.flash("success","Welcome to campground !");
        res.redirect("/campgrounds")
    })
    }catch(e){
        req.flash("error",e.message);
        res.redirect("register");
    }
}
module.exports.userLogin=(req,res)=>{
    req.flash("success","Welcome back");
    const returnUrl=req.session.returnTo ||"/campgrounds"
    res.redirect(returnUrl);
}
module.exports.renderLogin=(req,res)=>{
    res.render("users/login");
}
module.exports.logout=(req,res)=>{
    req.logout();
    req.flash("success","Goodbye");
    res.redirect("/campgrounds");
}