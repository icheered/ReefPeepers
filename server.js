import express from 'express';
import multer from 'multer';

const upload = multer({ dest: '/home/tjbakker/Caddy/FILES' });

const app = express();

app.post('/uploads/*', upload.single('file'), (req, res) => {
	// req.file is the `file` file
	// req.body will hold the text fields, if there were any
	console.log(`Received upload: ${req.file.originalname}`);
	res.sendStatus(200);
});

app.get('/uploads/*', (req, res) => {
	// req.file is the `file` file
	// req.body will hold the text fields, if there were any
	console.log('Received get request');
	res.sendStatus(200);
});

app.listen(8080, () => {
	console.log('Server listening on port 8080');
});
