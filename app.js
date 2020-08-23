const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const exphbs = require("express-handlebars");
const methodOverride = require("method-override");
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
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Method Override - allows to make additonal request without front end js
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

// Logging
//this allows us to use morgan to display login attempts inside the console.
//Only in Development
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Handlebars Helpers - must be above handlebars
const {
  formatDate,
  stripTags,
  truncate,
  editIcon,
  select,
} = require("./helpers/hbs");

// Handlebars
app.engine(
  ".hbs",
  exphbs({
    helpers: { formatDate, stripTags, truncate, editIcon, select },
    defaultLayout: "main",
    extname: ".hbs",
  })
);
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

// Set Global Var - allows us to use User inside file index.hbs
app.use(function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});

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
