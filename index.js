const express = require('express');
const path = require('path');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');

const multer = require('multer');
const upload = multer({ dest: 'public/uploads/' });

require('dotenv').config();

const database = require('./config/database');

const systemConfig = require('./config/system.js');

const routeAdmin = require('./routes/admin/index.route.js');
const route = require('./routes/client/index.route.js');

database.connect();


const app = express();
app.use(methodOverride('_method'))
const port = process.env.PORT;

app.use(bodyParser.urlencoded({ extended: false }));

app.set('views', `${__dirname}/views`);
app.set('view engine', 'pug');

// APP LOCALS VARIABLES


// FLASH MESSAGE
app.use(cookieParser('keyboard cat'));
app.use(session({cookie: { maxAge: 60000 }}));
app.use(flash());
// END FLASH MESSAGE

// socket.io
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
io.on('connection', (socket) => {
  console.log('a user connected', socket.id);
});
// end socket.io


app.locals.prefixAdmin = systemConfig.prefixAdmin;


app.use(express.static(`${__dirname}/public`));

// tiny mce
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

// Router
routeAdmin(app);
route(app);

// 404 handler - this should be the last route
app.use((req, res) => {
    res.status(404).render("client/pages/error/404", {
      pageTitle: "404 Not Found",
    });
});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
