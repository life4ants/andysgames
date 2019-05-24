
let express = require('express')
const PORT = process.env.PORT || 5000
const app = express();

app.use(express.static('pages'))

app.get('/', function (req, res) {
    res.sendFile(__dirname+'/pages/index.html');
});
app.get('/aletterfromtheking', function (req, res) {
    res.sendFile(__dirname+'/pages/aletterfromtheking/index.html');
});
app.get('/matchgame', function (req, res) {
    res.sendFile(__dirname+'/pages/matchgame/index.html');
});


app.listen(PORT, () => console.log(`Listening on ${ PORT }`))