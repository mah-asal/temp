const fs = require('fs').promises;
const axios = require('axios');

const endpoint = 'https://api.tv-92.com';
const limit = 100;
const max = 50;

const fetchPosts = async (page = 0) => {
    try {
        const response = await axios.default.get(
            `${endpoint}/Search?pageIndex=${page}&pageSize=${limit}&HasImage=1`,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Api-Request": "True",
                },
            }
        );

        if (response.data && response.data.returnData) {
            const { totalPages, items } = response.data.returnData;

            return {
                data: items.map(format),
                lastPage: totalPages,
            };
        }

        return {
            data: [],
            lastPage: 1,
        };
    } catch (error) {
        console.error(error)
        return {
            data: [],
            lastPage: 1,
        };
    }
};

const fetchAllUsers = async () => {
    let output = [];
    let page = 0;

    if (page != 0) {
        const data = await fs.readFile('users.json');

        if (data) {
            output = JSON.parse(data.toString());
        }
    }

    while (true) {
        const { data, lastPage } = await fetchPosts(page);
        output = output.concat(data);

        save(output);

        if (page >= lastPage || page >= max) {
            break;
        }

        console.log(`Fetched page ${page + 1}/${lastPage}`);
        page++;
    }

    return output;
};


const format = (data) => ({
    id: data['id'],
    image: data['userImagesURL']
});

const save = (data = []) => {
    return fs.writeFile('users.json', JSON.stringify(data, null, 2))

}

fetchAllUsers().then((value) => {
    return save(value)
}).then(() => {
    console.log('Done');
});
