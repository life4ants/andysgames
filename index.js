
let express = require('express')
const PORT = process.env.PORT || 5050
const app = express();

app.use(express.static('pages'))

app.get('/wemoexplorer', function (req, res) {
    res.sendFile(__dirname+'/pages/wemo/wemo.html');
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log(ip+" requested wemo");
});

app.get('/', function (req, res) {
    res.sendFile(__dirname+'/pages/home.html');
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log(ip+" requested home page");
});

app.get('/matchgame', function (req, res) {
    res.sendFile(__dirname+'/pages/matchgame/matchgame.html');
	let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log(ip+" requested matchgame");
});


app.listen(PORT, () => console.log(`${new Date().toLocaleTimeString()}: Listening on ${ PORT }`))