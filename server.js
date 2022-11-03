const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const cors = require('cors');
const io = require('socket.io')(server, {
	cors: {
		origin: '*',
		methods: ['GET', 'POST'],
	},
});

app.use(cors());

const PORT = process.env.PORT || 5100;
app.get('/', (req, res) => {
	res.send('Server is running...');
});

io.on('connection', (socket) => {
	socket.emit('me', socket.id);
	socket.on('disconnect', () => {
		socket.broadcast.emit('callEnded');
	});
	socket.on('calluser', (data) => {
		io.to(data.userToCall).emit('callUser', {
			signal: data.signalData,
			from: data.from,
			name: data.name,
		});
	});

	socket.on('answercall', (data) =>
		io.to(data.to).emit('callaccepted', data.signal)
	);
});

server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
