var settings = require("./Settings");
var hbshelper = require("./hbsHelpers");
const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const device = require('express-device');
const nodemailer = require('nodemailer');
var cookieParser = require('cookie-parser');

const app = express();
app.set('views', path.join(__dirname + '/views/'));
app.engine(settings.hbsextension, exphbs({
    helpers: hbshelper,
    extname: settings.hbsextension,
    defaultLayout: 'mainLayout',
    layoutsDir: __dirname + '/views/Layouts/',
    partialsDir: __dirname + "/views/Partials"
}));
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

app.post("/submit-form", async function (req, res) {
    const { fullname,
        email,
        phone,
        prefs,
        datetime,
        datetime2,
        duration,
        topic,
        concerns,
        payment,
        agreement,
        anything } = req.body;

    // E-posta gönderme ayarları
    const transporter = nodemailer.createTransport({
        host: 'smtp.hostinger.com', // SMTP sunucusu
        port: 465,  // SSL için 465, TLS için 587
        secure: true, // SSL için true, TLS için false
        auth: {
            user: 'admin@smbeautybroker.co.uk',
            pass: 'Smbeauty123.'
        }
    });

    const mailOptions = {
        from: 'admin@smbeautybroker.co.uk',
        to: 'admin@smbeautybroker.co.uk',
        subject: 'Booking Form Submission',
        html: `
            <h3>Booking Form</h3>
        <p><strong>Full Name:</strong> ${fullname}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Preferred Contact Methods:</strong> ${prefs}</p>
        <hr>
         <p><strong>Consultation Date & Time (Option 1):</strong> ${datetime}</p>
        <p><strong>Consultation Date & Time (Option 2):</strong> ${datetime2}</p>
        <p><strong>Consultation Duration:</strong> ${duration}</p>
        <p><strong>Topic of Consultation:</strong> ${topic}</p>
        <hr>
        <p><strong>Medical Concerns:</strong> ${concerns}</p>
        <hr>
        <p><strong>Preferred Payment Method:</strong> ${payment}</p>
        <hr>
        <p><strong>Privacy Agreement:</strong> ${agreement}</p>
        <hr>
        <p><strong>Additional Comments:</strong> ${anything}</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).send("E-posta başarıyla gönderildi.");
    } catch (error) {
        console.error("Mail gönderim hatası:", error);
        res.status(500).send("E-posta gönderilemedi.");
    }
});

app.listen(settings._Port, function (err, data) {
    if (!err) {
        console.log("server started in " + settings._Port + " port");
    }
});
