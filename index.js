const express = require('express');
const app = express();
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { join } = require('path');
const port = process.env.PORT || 5000;

const allowOrigin = [
    'http://localhost:5173'
]
const corsOptions = {
    origin: allowOrigin, // Your React client's URL
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], // Best for REST APIs
    optionsSuccessStatus: 200, // For legacy browser support
    // credentials: true
};

const expressServer = createServer(app);

const io = new Server(expressServer, {
    cors: {
        origin: allowOrigin, // Your frontend URL
        methods: ["GET", "POST"], // Only these are needed
        // credentials: true // If using cookies/auth
    }
})


app.use(express.json())
app.use(cors(corsOptions));



app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'))
})

io.on('connection', (socket) => {
    console.log('new user join.')

    socket.on('send_message', (data) => {
        console.log(data)
        socket.broadcast.emit('recieved_message', data)
    })

    socket.on('disconnect', () => {
        console.log('user disconnected')
    })
})




expressServer.listen(port, () => {
    console.log(`Server open in ${port} port`)
})