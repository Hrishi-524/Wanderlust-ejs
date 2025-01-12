const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.createReview = async (req, res) => {
    let { id } = req.params;
    console.log(id);
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    console.log("new review saved");
    console.log(newReview);
    
    await newReview.save();
    await listing.save();
    res.redirect(`/listing/${id}`);
}

module.exports.destroyReview = async (req, res) => {
    let {id, reviewId} = req.params;
    console.log(`deleting review ${reviewId}`);
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listing/${id}`);
}