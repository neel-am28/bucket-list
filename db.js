const dotenv = require('dotenv')
dotenv.config()
const mongodb = require('mongodb')

mongodb.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, client) {
    module.exports = client
    const app = require('./server')
    app.listen(process.env.PORT, () => console.log(`Your app is listening on port ${process.env.PORT}!`))
})