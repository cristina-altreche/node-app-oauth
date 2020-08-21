const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const exphbs = require("express-handlebars");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session); //stores the login
const morgan = require("morgan"); //For login

// Load Config
dotenv.config({ path: "./config/config.env" }); //Global var

// Passport Config
require("./config/passport")(passport);

connectDB(); //connects to mongoDB. Using db.js in config file.

const app = express();

// Body parser - allows us to GET the data (req.body)
app.use(express.urlencoded({extended: false}))
app.use(express.json())

// Logging
//this allows us to use morgan to display login attempts inside the console.
//Only in Development
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}


// Handlebars Helpers - must be above handlebars
const { formatDate } = require('./helpers/hbs')

// Handlebars
app.engine(".hbs", exphbs({ helpers: {formatDate}, defaultLayout: "main", extname: ".hbs" }));
app.set("view engine", ".hbs");

// Sessions (make sure above passport middleware)
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }), //to test this login go to dashboard. When you refresh page you shouldn't logout but instead persist. You can also see in your Mongo Database there is now a sessions storage
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Static Folder
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/stories", require("./routes/stories"));

// PORT
const PORT = process.env.PORT || 3000;
app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
); //will display either production or dev depending on which one your on
//npm run dev - will run in dev
//npm start - will run production
//see package.json. Declared inside config
