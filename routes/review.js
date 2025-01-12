//express and router
const express = require("express");
const router = express.Router({ mergeParams: true });

//wrapasync
const wrapAsync = require("../utils/wrapAsync.js");

//middleware
const { isLoggedIn, isAuthor, validateReview } = require("../middleware.js");

//controllers
const reviewController = require("../controllers/review.js");

router.route("/")
.post(isLoggedIn ,validateReview, wrapAsync(reviewController.createReview));//ADD REVIEW "/" {CREATE}

router.route("/:reviewId")
.delete(isLoggedIn,  isAuthor, reviewController.destroyReview);//DELETE REVIEW "/:reviewId" {DELETE}

module.exports = router;