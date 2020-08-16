
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
	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log(ip + " requested matchgame");
});

app.get('/wemoexplorer', function (req, res) {
    res.sendFile(__dirname+'/pages/wemo/wemo.html');
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log(ip+" requested wemo");
});



app.listen(PORT, () => console.log(`${new Date().toLocaleTimeString()}: Listening on ${ PORT }`))