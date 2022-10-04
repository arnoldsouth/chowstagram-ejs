// express is used to build out our API
const express = require("express");
const app = express();
// helps us talk to our mongodb db
const mongoose = require("mongoose");
// for authentication; uses different strategies for different types of logins (fb, twitter, google, etc)
const passport = require("passport");
// allows users to stay logged in as they move across our app. uses cookies, stored on our client. sees who is logged in, allowing us to build out our pages
const session = require("express-session");
// stores our actual session in mongodb, keeps us logged in when we leave the app
// connect-mongo = method; session is argument
const MongoStore = require("connect-mongo")(session);
// browser only goes GET and POST, so we use this to override those methods to PUT and DELETE
const methodOverride = require("method-override");
// for notifications (wrong password, etc)
const flash = require("express-flash");
// shows our logs in terminal
const logger = require("morgan");
const connectDB = require("./config/database");

const mainRoutes = require("./routes/main");
const postRoutes = require("./routes/posts");
const commentRoutes = require("./routes/comments");

const PORT = process.env.PORT || 2121;

//Use .env file in config folder
require("dotenv").config({ path: "./config/.env" });

// Passport config
require("./config/passport")(passport);

//Connect To Database
connectDB();

//Using EJS for views
app.set("view engine", "ejs");

//Static Folder
app.use(express.static("public"));

//Body Parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Logging
app.use(logger("dev"));

//Use forms for put / delete
app.use(methodOverride("_method"));

// Setup Sessions - stored in MongoDB
app.use(
  session({
    secret: "chowchow",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Use flash messages for errors, info, ect...
app.use(flash());

// Setup Routes For Which The Server Is Listening
app.use("/", mainRoutes);
app.use("/post", postRoutes);
app.use("/comment", commentRoutes);

// Server Running
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
