const path = require('path');
const express = require('express');

const app = express()
const port = 3000


var staticPath = path.join(__dirname, '/dist/');
app.use(express.static(staticPath));

app.get('/info', (_, res) =>
    res.send('Hello World!')
)

function getEvents() {
    console.log("getEvents")
}

app.listen(port, () => console.log(`React-aton listening on port ${port}!`))

module.exports = {
    app: app,
    getEvents: getEvents
}