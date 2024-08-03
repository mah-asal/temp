const users = require('./users404.json');

const axios = require('axios');
const path = require('path');
const fs = require('fs');

const download = (url = "") => {
    const filename = path.basename(url);

    if (url.startsWith('/UserUploadedFiles')) {
        url = 'https://api.tv-92.com' + url;
    } else {
        url = url.replace('cdn.s06.ir', 's3.tv-92.com').replace('iran-cdn.bzr01.ir', 's3.tv-92.com').replace('cdn.bzr01.ir', 's3.tv-92.com');
    }


    return axios({
        method: "get",
        url: url,
        responseType: "stream"
    }).then((response) => {
        return response.data.pipe(fs.createWriteStream("uploads/" + filename));
    });
}

(async() => {
	for (var user of users) {
    		await download(user.image);
		console.log(user.image);
	}
})();
