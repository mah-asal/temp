const axios = require('axios').default;
const elastic = require('./elastic');

const fs = require('fs');

let limit = 5;

const search = async (page = 1) => {
    try {
        const result = await axios.get(`https://edge.tv-92.com/api/v1/call/api.v1.profile.search?page=${page}&limit=${limit}`);

        return result.data;
    } catch (error) {
        console.error(error);
        return {
            code: 500
        }
    }
}

const one = async (id = '') => {
    try {
        const result = await axios.get(`https://edge.tv-92.com/api/v1/call/api.v1.profile.one?id=${id}&detailed=1`);

        return result.data;
    } catch (error) {
        return {
            code: 500
        }
    }
}

const format = (data = {}) => {
    return {
        id: data['id'],
        schema: 'profile',
        site: 'mahasal',
        url: `https://edge.tv-92.com/api/v1/call/api.v1.profile.one?id=${data['id']}&detailed=1`,
        data: data,
        version: '1',
        createdAt: Date.now(),
        updatedAt: Date.now(),
    }
}

const process = async (id = '') => {
    const data = await one(id);

    if (data.data && data.data.profile) {
        const output = format(data.data.profile);

        await elastic.index('profile').set(id, output);

        console.log(`Indexed profile id ${id}`);
    }
}

(async () => {
    let page = null;

    if (fs.existsSync('./search.txt')) {
        let lastPage = fs.readFileSync('./search.txt');
        try {
            page = parseInt(lastPage);
        } catch (e) {
            //
        }
    }

    while (true) {
        const result = await search(page ?? 1);

        await Promise.all(result.data.map((item) => process(item.id)));

        if (page == null) {
            page = result.meta.last;
        }

        if (page - 1 <= 0) {
            break;
        } else {
            page--;
            fs.writeFileSync('./search.txt', page.toString());
        }
    }
})();