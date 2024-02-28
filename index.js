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
const path = require("path");
const http = require('http');
const { Server } = require("socket.io");

dotenv.config();

database.connect();
const app = express();
const port = process.env.PORT;
// SocketIO
const server = http.createServer(app);
const io = new Server(server);
global._io = io;

// End SocketIO

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

app.use(methodOverride('_method'))

app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

app.locals.prefixAdmin = configSystem.prefixAdmin;

app.use(express.static(`${__dirname}/public`));

/* New Route to the TinyMCE Node module */
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

// flash
app.use(cookieParser('KJJSLKASASASA'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());
// End flash

//nhúng từ file route admin
routesAdmin(app);

//nhúng từ file route client
routesClient(app);
server.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
