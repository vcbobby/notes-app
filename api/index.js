const app = require('./app')
const PORT = process.env.PORT || 3025

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

module.exports = (req, res) => {
    app(req, res)
}
