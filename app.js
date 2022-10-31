import express from 'express'; // use import instead of require
import path from 'path';

const app = express();

const PORT = 8080;

// middlewares
app.use(express.static('public'));

app.get('/', (req, res) => {
	res.sendFile(path.resolve(__dirname, 'public/index.html'));
});

app.listen(PORT, () => {
	console.log(`start server on port ${PORT}`);
});
