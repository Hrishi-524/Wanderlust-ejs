//express and router
const express = require("express")
const router = express.Router({ mergeParams: true })

//model
const User = require("../models/user.js")

//wrap async
const wrapAsync = require("../utils/wrapAsync")

//passport
const passport = require("passport")
const { isLoggedIn, saveRedirectUrl } = require("../middleware.js")

const userController = require("../controllers/user.js")

router.route("/signup")
.get(userController.renderSignUpForm)
.post(wrapAsync(userController.signup))

router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl, passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}), wrapAsync(userController.login))

router.route("/logout").
get(userController.logout)

module.exports = router