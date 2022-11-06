const https = require('https');
const fs = require('fs');
const request = require('request');

const options = {
    headers: {
        'x-ig-app-id': "936619743392459",
    },
};

var download = function (uri, filename, callback) {
    request.head(uri, function (err, res, body) {
        console.log('content-type:', res.headers['content-type']);
        console.log('content-length:', res.headers['content-length']);

        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
};



function getPosts(res) {
    https.get("https://i.instagram.com/api/v1/users/web_profile_info/?username=soft.hubtr", options, (resp) => {
        let data = '';
        let images = [];


        resp.on('data', (chunk) => {
            data += chunk;
        });

        resp.on('end', () => {
            JSON.parse(data).data.user.edge_owner_to_timeline_media.edges.forEach((item) => {
                images.push(item.node.display_url);
            });
            images.forEach((item, index) => {
                download(item, 'public/images/' + index + '.jpg', function () {
                });

            });
            res.render('main', { posts: images });
        });

    }
    ).on("error", (err) => {
        console.log("Error: " + err.message);
    });
}

module.exports = getPosts;
