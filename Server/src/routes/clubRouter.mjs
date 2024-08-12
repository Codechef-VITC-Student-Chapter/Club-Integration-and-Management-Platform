import express from 'express';

const clubRouter = express.Router();

clubRouter.post('/add', (req, res) => {
    res.send('Add club data');
});


clubRouter.delete('/delete/:id', (req, res) => {
    res.send('Remove club data');
});

clubRouter.get('/get/:id', (req, res) => {
    res.send('Get club info by ID');
});

export default clubRouter;
