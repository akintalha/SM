var settings = require("./Settings");
var hbshelper = require("./hbsHelpers");
const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const device = require('express-device');
var cookieParser = require('cookie-parser');



const app = express();
app.set('views', path.join(__dirname + '/views/'));
app.engine(settings.hbsextension, exphbs({ helpers: hbshelper, extname: settings.hbsextension, defaultLayout: 'mainLayout', layoutsDir: __dirname + '/views/Layouts/', partialsDir: __dirname + "/views/Partials" }));
app.set('view engine', settings.hbsextension);
app.use('/assets', express.static(__dirname + '/assets'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(device.capture());
app.use(cookieParser());
function renderParams(data, user, gridprop, layout = "mainLayout") {
    var renderedOBJ = {};
    if (data) {
        renderedOBJ.data = data;
        renderedOBJ.JSONdata = JSON.stringify(data);
    }
    if (user) {
        renderedOBJ.user = user;
        renderedOBJ.JSONuser = JSON.stringify(user);
    }
    if (gridprop) {
        renderedOBJ.gridprop = gridprop;
        renderedOBJ.JSONgridprop = JSON.stringify(gridprop);
    }
    renderedOBJ.layout = layout;
    renderedOBJ.settings = settings;
    return renderedOBJ;
}

app.get("/", function (req, res) {
        res.render("index", renderParams(null, null, null));
});
app.get("/content", function (req, res) {
    res.render("content", renderParams(null, null, null));
});
app.get("/bookingForm", function (req, res) {
    res.render("bookingForm", renderParams(null, null, null));
});
app.get("/clientIntakeForm", function (req, res) {
    res.render("clientIntakeForm", renderParams(null, null, null));
});
app.get("/aboutdetail", function (req, res) {
    res.render("aboutdetail", renderParams(null, null, null));
});
app.get("/termsandconditions", function (req, res) {
    res.render("termsandconditions", renderParams(null, null, null));
});
app.get("/privacystatement", function (req, res) {
    res.render("privacystatement", renderParams(null, null, null));
});

app.listen(settings._Port, function (err, data) {
    if (!err) {
        console.log("server started in " + settings._Port + " port");
    }
}),
3
