const User = require("../models/user.js");

module.exports.renderSignUpForm = (req, res) => {
    res.render("user/signup.ejs");
}

module.exports.signup= async (req, res) => {
    try {
        let {username, email, password} = req.body;
        const newUser = new User({email, username});
        let registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if(err) {
                return next(err);
            }
            req.flash("success", "welcome to wanderlust");
            res.redirect("/listing");
        });
    } catch (error) {
        req.flash("error", "Username or Email is alredy registerd");
        res.redirect("/signup");
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render("user/login.ejs");
}

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust!");
    const redirectUrl = res.locals.redirectUrl || "/listing";
    console.log(redirectUrl);
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout((err) => {
        if(err) {
            return next(err);
        }
        req.flash("success", "You are successfully logged out!");
        res.redirect("/listing");
    })
}