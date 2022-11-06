const https = require('https');
const fs = require('fs');
const request = require('request');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));


const options = {
    headers: {
        'x-ig-app-id': "936619743392459",
    },
};

var download = function (uri, filename, callback) {
    request.head(uri, function (err, res, body) {
        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
};


function getPostWithFectch(res) {
    fetch('https://i.instagram.com/api/v1/users/web_profile_info/?username=soft.hubtr', {
        method: 'GET',
        headers: {
            'x-ig-app-id': "936619743392459",
        },
    })
        .then(async response => {
            try {
                if (response.status == 200) {
                    let data = { "data": "sessionid=1" };
                    let posts = [];
                    data = await response.json();
                    data.data.user.edge_owner_to_timeline_media.edges.forEach((item) => {
                        posts.push(item.node);
                    });
                    posts.forEach((item, index) => {
                        download(item.display_url, 'public/images/' + index + '.jpg', function () {
                        });
                    });

                    res.render('test', { posts: posts });
                }

            } catch (error) {

                console.log(error);

            }
        }).catch(error => {
            console.log(error);
        });


}



function getPosts(res) {
    https.get("https://i.instagram.com/api/v1/users/web_profile_info/?username=soft.hubtr", options, (resp) => {
        let data = '';
        let images = [];
        console.log(resp.statusCode);


        if (resp.statusCode == 200) {
            resp.on('data', (chunk) => {
                data += chunk;
            });


            resp.on('end', () => {
                try {
                    JSON.parse(data).data.user.edge_owner_to_timeline_media.edges.forEach((item) => {
                        images.push(item.node.display_url);
                    });
                    images.forEach((item, index) => {
                        download(item, 'public/images/' + index + '.jpg', function () {
                        });
                    });

                } catch (error) {
                    console.log(error);
                }
            });
        } else {
            console.log("Error");
        }

    }
    ).on("error", (err) => {
        console.log("Error: " + err.message);
    });
}

module.exports = getPostWithFectch;
