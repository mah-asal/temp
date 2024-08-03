const { Client } = require('@elastic/elasticsearch');

const client = new Client({
    node: 'https://elastic.tv-92.com',
    auth: {
        username: "elastic",
        password: "W1nd0wS@#",
    }
});

module.exports = {
    index(index = '') {
        return {
            search({ page, limit }) {
                return client.search({
                    index: index,
                    size: limit,
                    from: (page - 1) * limit,
                });
            },
            async one(id) {
                try {
                    const result = await client.search({
                        index: index,
                        size: 1,
                        "query": {
                            "bool": {
                                "must": [
                                    {
                                        "match": {
                                            "data.id": id,
                                        }
                                    }
                                ]
                            }
                        }
                    });

                    return result.hits.hits[0] ? result.hits.hits[0]._source : null;
                } catch (error) {
                    return null;
                }
            },
            set(id, document) {
                return client.index({
                    index,
                    id,
                    document,
                });
            },
            bulk(documents = []) {
                let data = documents.flatMap(doc => [{ index: { _index: index, _id: doc.id } }, doc]);
                return client.bulk({ refresh: true, operations: data });
            }
        }
    },

}