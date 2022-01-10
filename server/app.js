const express = require('express')
const graphqlHTTP = require('express-graphql').graphqlHTTP 
const schema = require('./schema/schema')
const cors = require('cors')
const mongoose = require('mongoose')

const port = process.env.PORT || 4000

const app = express()

// Use the endpoint URL of your own MongoDB.
const endpointUrl = require('./endpoint_url')
mongoose.connect(endpointUrl,
{ useNewUrlParser: true });
mongoose.connection.once('open', () => {
    console.log('Yes!  We are connected!')
});

app.use(cors({ origin: true, credentials: true }))

app.use('/graphql', graphqlHTTP({
    graphiql: true,
    schema: schema
}))

app.listen(port, () => {
    console.log('Listening for request on my awesome port 4000')
})