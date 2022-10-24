const express = require('express');
const app = express();


app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.static('node_modules'));
app.get('/', (req, res) => {
    res.render('main', { title: 'Hey', message: 'Hello there!' });
});

app.get('/faq', (req, res) => {
    res.render('faq', { title: 'Hey', message: 'Hello there!' });
});

app.get('/service', (req, res) => {
    res.render('service', { title: 'Hey', message: 'Hello there!' });
});


app.listen(process.env.PORT || 5000, () => {
    console.log('Example app listening on port 3000!')
})