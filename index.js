const express = require("express");
const dotenv = require("dotenv");
const routesClient = require("./routes/client/index.route.js");
const routesAdmin = require("./routes/admin/index.route.js");
const database = require("./config/database.js");
const methodOverride = require("method-override");
const configSystem = require("./config/system.js");
const bodyParser = require("body-parser");
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');

dotenv.config();

database.connect();
const app = express();
const port = process.env.PORT;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

app.use(methodOverride('_method'))

app.set("views", "./views");
app.set("view engine", "pug");

app.locals.prefixAdmin = configSystem.prefixAdmin;

app.use(express.static("public"));

// flash
app.use(cookieParser('KJJSLKASASASA'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());
// End flash

//nhúng từ file route admin
routesAdmin(app);

//nhúng từ file route client
routesClient(app);
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
