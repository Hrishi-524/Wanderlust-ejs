//express and router
const express = require("express")
const router = express.Router({ mergeParams: true })

//wrapasync
const wrapAsync = require("../utils/wrapAsync.js")

//middlewares
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js")

//controllers
const listingController = require("../controllers/listing.js")

//multer    
const multer  = require('multer')
const {storage} = require("../cloudConfig.js")
const upload = multer({ storage })

router.route("/")
.get(wrapAsync(listingController.index))//INDEX ROUTE "/" {READ}
.post(isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync(listingController.createListing))//NEW ROUTE "/new" {CREATE}

router.route("/new")
.get(isLoggedIn, listingController.renderNewForm)//NEW ROUTE "/new" {CREATE}

router.route("/:id")
.get(wrapAsync(listingController.showListing))//SHOW ROUTE "/:id" {READ}
.put(isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync(listingController.updateListing))//EDIT ROUTE "/:id/edit" {UPDATE}
.delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing))//DELETE ROUTE "/:id" {DELETE}

router.route("/:id/edit")
.get(isLoggedIn, wrapAsync(listingController.renderEditForm))//EDIT ROUTE "/:id/edit" {UPDATE}

module.exports = router