const express = require("express");
const { promisify } = require('util');
const request = promisify(require('request'));
const app = express();
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: false }));
app.get('/', function (req, res) {
    res.sendFile('/views/index.html', { root: __dirname });
});
app.post("/post", async (req, res) => {
    const name = req.body.name;
    const response_key = req.body["g-recaptcha-response"];
    const secret_key = "6LcND8wiAAAAAJhbeYXn95IgauLHxCeUTtCPuwkR";
    const options = {
        url: `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${response_key}`,
        headers: { "Content-Type": "application/x-www-form-urlencoded", 'json': true },
    };
    try {
        const re = await request(options);
        console.log(options);
        if (!JSON.parse(re.body)['success']) {
            return res.send({ response: "Failed" });
        }
        return res.send({ response: "Successful" });
    } catch (error) {
        return res.send({ response: "Failed" });
    }
});
const PORT = 3000;
app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`))