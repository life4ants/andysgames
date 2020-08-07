
let express = require('express')
const PORT = process.env.PORT || 5000
const app = express();

app.use(express.static('pages'))

app.get('/', function (req, res) {
    res.sendFile(__dirname+'/pages/home/index.html');
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log(ip + " requested home page")
});

app.get('/matchgame', function (req, res) {
    res.sendFile(__dirname+'/pages/matchgame/index.html');
    console.log("someone requested matchgame");
});


app.listen(PORT, () => console.log(`Listening on ${ PORT }`))