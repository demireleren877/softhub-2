const express = require('express');
const app = express();
const path = require('path');
const validator = require('email-validator');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const { promisify } = require('util');
const request = promisify(require('request'));
const getDataFirestore = require('./firebase');
const getPosts = require('./scraper');

app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.static('node_modules'));
app.use(express.json());

app.get('/', (req, res) => {
    res.render('main');
    // getPosts(res);
});



app.post("/faq", async (req, res) => {
    console.log(req.body);
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'softhub.iletisim1@gmail.com',
            pass: 'vnrbhdxoqbcnlzvn'
        }
    });

    const handlebarOptions = {
        viewEngine: {
            extName: '.html',
            partialsDir: path.resolve('./views'),
            defaultLayout: false,
        },
        viewPath: path.resolve('./views'),
        extName: '.handlebars',
    };

    transporter.use('compile', hbs(handlebarOptions));

    const mailOptions = {
        template: "email",
        context: {
            email: req.body.email,
            name: req.body.name,
            subject: req.body.subject,
            message: req.body.message
        },
        from: req.body.email,
        to: "demireleren877@gmail.com",
        subject: 'New Message From softhub.com',
    };
    const response_key = req.body["g-recaptcha-response"];
    const secret_key = "6LcND8wiAAAAAJhbeYXn95IgauLHxCeUTtCPuwkR";
    const options = {
        url: `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${response_key}`,
        headers: { "Content-Type": "application/x-www-form-urlencoded", 'json': true },
    };


    if (req.body.name && req.body.email && req.body.subject && req.body.message) {
        if (validator.validate(req.body.email)) {
            try {
                const re = await request(options);
                console.log(options);
                if (JSON.parse(re.body)['success']) {
                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error);
                            res.send('error');
                        } else {
                            console.log('Email sent: ' + info.response);
                            res.send('success');
                        }
                    });
                    return res.redirect('/');
                }

            } catch (error) {
                return res.send({ response: "Failed" });
            }


        }
    } else {

    }


});

app.get('/faq', (req, res) => {
    getDataFirestore(res);
});

app.get('/service', (req, res) => {
    res.render('service', { title: 'Hey', message: 'Hello there!' });
});
app.get('/how_work_with_us', (req, res) => {
    res.render('how_work_with_us', { title: 'Hey', message: 'Hello there!' });
});

app.get('/about', (req, res) => {
    res.render('about', { title: 'Hey', message: 'Hello there!' });
});

app.get('/contact', (req, res) => {
    res.render('contact', { title: 'Hey', message: 'Hello there!' });
});



app.listen(process.env.PORT || 5000, () => {
    console.log('Example app listening on port 3000!')
})