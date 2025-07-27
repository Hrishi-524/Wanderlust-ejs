//env
if(process.env.NODE_ENV != "production") {
  require('dotenv').config()
}

//express
const express = require("express");
const app = express();
const port = 8080;
app.listen(port, () => {
  console.log(`app is litening to port ${port}`);
});

//models
const Listing = require("./models/listing.js"); //model - Listing
const Review = require("./models/review.js"); //model - Review
const User = require("./models/user.js"); //model - User

//mongoose
const mongoose = require("mongoose");
const dbUrl = process.env.NODE_ENV == "production" ? process.env.ATLAS_URL : "mongodb://localhost:27017/";
async function main() {
  await mongoose.connect(dbUrl);
}
main()
.then(() => {
  console.log("connected to db");
}).catch((err) => {
  console.log(err);
});

//express-session
const session = require("express-session");
const MongoStore = require('connect-mongo');
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET
  },
  touchAfter: 24 * 3600,
})
const sessionOptions = {
  store: store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie : {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, //1 week expiry
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true
  }
}
app.use(session(sessionOptions));
store.on('error', ()=> {console.log("error on mongo session store")})

//passport using passport-local stratergy
const passport = require("passport");
const LocalStratergy = require("passport-local");

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStratergy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//connect-flash
const flash = require("connect-flash");
app.use(flash());
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
})

//public
app.use(express.static("public"));

//boolerplate - express-ejs-layouts
const expressLayouts = require("express-ejs-layouts");
app.use(expressLayouts);
app.set("layout", "layouts/boilerplate.ejs"); // Default layout
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  console.log(req.method, req.path, req.hostname);
  next();
});

//view engine
const path = require("path");
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");


//method override
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

//router
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

//joi
const { listingSchema, reviewSchema } = require("./schema.js");

//express error and wrapasync
const ExpressError = require("./utils/ExpressError.js");
const wrapAsync = require("./utils/wrapAsync.js");

// //ROOT PATH
// app.get("/", (req, res) => {
//   res.send("root is working");
// });

app.get("/demouser", async (req, res) => {
  const fakeUser = new User({
    email: "abc@gmail.com",
    username: "abc",
  });
  let registeredUser = await User.register(fakeUser, "abcpassword");
  res.send(registeredUser);
})

//PATHS STARTING WITH "/" for authentictaion {user model}
app.use("/", userRouter);

//PATHS STARTING WITH "/listing" {listing model}
app.use("/listing", listingRouter);

//PATHS STARTING WITH "/listing/:id/reviews" {review model}
app.use("/listing/:id/reviews",reviewRouter);


//ERROR HANDLING
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
})

app.use((err, req, res, next) => {
  let {statusCode=500, message="Something went wrong!"} = err;
  res.status(statusCode).render("error.ejs", {message});
})
