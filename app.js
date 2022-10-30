const express = require('express');
const app = express();
const validator = require('email-validator');
const nodemailer = require('nodemailer');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.static('node_modules'));
app.use(express.json());

app.get('/', (req, res) => {
    res.render('main', { title: 'Hey', message: 'Hello there!' });
});

app.post("/", (req, res) => {
    console.log(req.body);
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'demireleren1903@gmail.com',
            pass: 'tumzbzyvjmfvtfao'
        }
    });

    const mailOptions = {
        from: req.body.email,
        to: "demireleren877@gmail.com",
        subject: 'New Message From' + req.body.email + ': ' + req.body.subject,
        text: req.body.message
    };

    if (req.body.name && req.body.email && req.body.subject && req.body.message) {
        if (validator.validate(req.body.email)) {
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                    res.send('error');
                } else {
                    console.log('Email sent: ' + info.response);
                    res.send('success');
                }
            });
        }
    }


});

app.get('/faq', (req, res) => {
    res.render('faq', { title: 'Hey', message: 'Hello there!' });
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

app.listen(process.env.PORT || 5000, () => {
    console.log('Example app listening on port 3000!')
})