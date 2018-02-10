
let express = require('express')
const app = express()
const PORT = process.env.PORT || 5000

app.use(express.static("pages"))

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))