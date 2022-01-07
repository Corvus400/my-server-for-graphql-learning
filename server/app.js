const express = require('express')
const graphqlHTTP = require('express-graphql').graphqlHTTP 

const schema = require('./schema/schema')

const app = express()

// Use the endpoint URL of your own MongoDB.
const endpointUrl = require('./endpoint_url')
const { MongoClient } = require('mongodb');
const client = new MongoClient(endpointUrl, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  console.log('Yes! We are connected!')
});

app.use('/graphql', graphqlHTTP({
    graphiql: true,
    schema: schema
}))

app.listen(4000, () => {
    console.log('Listening for request on my awesome port 4000');
})