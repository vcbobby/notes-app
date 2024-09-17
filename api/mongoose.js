const mongoose = require('mongoose')

const { MONGO_DB_URI, MONGO_DB_URI_TEST, NODE_ENV } = process.env
//conexion a mongoDB
const connectionString = NODE_ENV === 'test' ? MONGO_DB_URI_TEST : MONGO_DB_URI

mongoose
    .connect(connectionString)
    .then(() => {
        console.log('todo ok')
    })
    .catch((error) => {
        console.error(error)
    })
