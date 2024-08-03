const users = require('./users404.json');

const { Client } = require('minio');
const mimeTypes = require('mime-types');
const path = require('path');
const fs = require('fs');

const client = new Client({
    port: 443,
    endPoint: "s3.tv-92.com",
    accessKey: "UKLODowg867OkaPh9f2r",
    secretKey: "638w0h4zruqEi5oHmSVZ0PUlTa1EwBOFxxDJaSvr",
});

const upload = (url = "") => {
    const filename = path.basename(url);
    const filepath = url.replace('https://s3.tv-92.com/uploads', '').replace('https://cdn.bzr01.ir/uploads', '').replace('https://iran-cdn.bzr01.ir/uploads', '');
    const mime = mimeTypes.lookup(filename)

    const metaData = {
        'Content-Type': mime,
    }

    console.log('Uploading ' + `uploads/${filename}`);

    if (fs.existsSync(`uploads/${filename}`))
        return client.fPutObject('uploads', filepath, `uploads/${filename}`, metaData);
    else
        return Promise.reject('file not exists');
}

(async () => {
    for (var user of users) {
        try {
            await upload(user.image);
            
        } catch (error) {
            console.error(error);
        }
    }
})();
