const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
    let listings = await Listing.find({});
    console.log(req.user)
    res.render("listing/index.ejs", { listings });
}

module.exports.renderNewForm = (req, res) => {
    res.render("listing/new.ejs");
}

module.exports.createListing = async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const newCard = new Listing(req.body.listing);
    newCard.owner = req.user._id;
    newCard.image = {url, filename};
    console.log(newCard)
    console.log("image --> ", newCard.image);
    await newCard.save();
    req.flash("success", "Great! Your Place is Successfully Added!");
    res.redirect("/listing");
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    let card = await Listing.findById(id).populate({path : "reviews", populate: {path: "author"} }).populate("owner"); //populate method
    console.log(card);
    res.render("listing/show.ejs", { card });
}

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_50,w_250")
    res.render("listing/edit.ejs", { listing , originalImageUrl});
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    const updatedData = req.body.listing;
    const updatedListing = await Listing.findByIdAndUpdate(id, updatedData, {new: true});
    if(typeof req.file !== "undefined") {//typeof operator
        let url = req.file.path;
        let filename = req.file.filename;
        updatedListing.image = {url, filename};
        updatedListing.save();
    }
    console.log(updatedListing);
    res.redirect(`/listing/${id}`);
}
module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    const deletedData = await Listing.findByIdAndDelete(id);
    console.log(deletedData);
    res.redirect("/listing");
}