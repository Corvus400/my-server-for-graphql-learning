const express = require('express')

const app = express()

app.listen(4000, () => {
    console.log('Listening for request on my awesome port 4000');
})