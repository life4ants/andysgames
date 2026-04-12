
let express = require('express')
const PORT = process.env.PORT || 5050
const app = express();

app.use(express.static('pages'))
app.use("/wemoexplorer", express.static("pages/wemo"));
app.get('/wemoexplorer', (req, res) => {
    res.sendFile(__dirname+'/pages/home.html');
    console.log("sent wemo page")
});
app.get('/', (req, res) => {
    res.sendFile(__dirname+'/pages/home.html');
});

app.get('/matchgame', (req, res) => {
    res.sendFile(__dirname+'/pages/matchgame/matchgame.html');
});

app.get('/errors', (req, res) => {
    res.sendFile(__dirname+'/pages/errors.html');
});

const gamesRouter = require('./routes/games');
const usersRouter = require('./routes/users');
const errorsRouter = require('./routes/errors');
app.use(express.json());               // Required for parsing JSON POST bodies

app.use('/api/users', usersRouter);
app.use('/api/games', gamesRouter);
app.use('/api/errors', errorsRouter);

app.listen(PORT, () => 
    console.log(`${new Date().toLocaleTimeString()}: Listening on ${ PORT }`)
    )