const users = require('./users.json');
const fs = require('fs').promises;
const axios = require('axios');

const exists = async (url = "") => {
    if (url && url.startsWith('/UserUploadedFiles')) {
        try {
            const result = await axios.default.head('https://s3.tv-92.com/uploads' + url);

            return Promise.resolve(result.status == 200);

        } catch (error) {
            return Promise.resolve(false);
        }
    }

    if (url && url.startsWith('http') && !url.includes('static')) {
        try {
            const result = await axios.default.head(url);

            return Promise.resolve(result.status == 200);

        } catch (error) {
            return Promise.resolve(false);
        }
    }

    return Promise.resolve(true);
}

const fetchAllUsers = async () => {
    let output = [];

    for (var user of users) {
        if (await exists(user.image) == false) {
            output.push(user);
            console.log(`User ${user.id} profile image is missing`);
            save(output);
        } else {
            console.log(`User ${user.id} profile image is ok`);
        }
    }

    return output;
}

const save = (value = []) => {
    return fs.writeFile('users404.json', JSON.stringify(value, null, 2))
}

fetchAllUsers().then((value) => {
    return save(value)
}).then(() => {
    console.log('Done');
});