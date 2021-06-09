import express from 'express';
import cors from 'cors';
import 'colors';
import morgan from 'morgan';

import Post from './models/post.js';

import connectDB from './config/db.js';

import { PORT } from './config/index.js';

const app = express();

const port = PORT || 5000;

// config
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// get posts
app.get('/posts', async (req, res) => {
	await Post.find().then((posts) => res.status(200).json(posts));
});

// create posts
app.post('/create', async (req, res) => {
	const { title, text } = req.body;

	try {
		if (!title.trim() || !text.trim()) {
			return res.status(422).json({ message: 'Error, все поля обязательны' });
		}

		const newPost = await new Post({ ...req.body });

		await newPost.save();

		res.status(200).json(newPost);
	} catch (err) {
		console.error(err);
	}
});

// edit post
app.put('/post-update', async (req, res) => {
	await Post.findByIdAndUpdate(
		{ _id: req.body.postId },
		{
			$set: { ...req.body },
		},
		{
			new: true,
		},

		(err, results) => {
			if (err) {
				return res.status(422).json({ message: `Нет такой статьи ${err.message}` });
			}

			return res.status(200).json(results);
		}
	);
});

// delete post
app.delete('/post-delete/:id', async (req, res) => {
	try {
		await Post.findOne({ _id: req.params.id }).exec((err, result) => {
			if (err) return res.status(422).json({ message: `Нет такой статьи ${id}` });
			result
				.remove()
				.then(() => res.status(200).json({ message: 'Success' }))
				.catch((err) => console.error(err));
		});
	} catch (e) {
		console.error(e);
	}
});

connectDB().then(() =>
	app.listen(5000, () => console.log(`Backend start on port: http://localhost:${port}`.bgMagenta))
);
