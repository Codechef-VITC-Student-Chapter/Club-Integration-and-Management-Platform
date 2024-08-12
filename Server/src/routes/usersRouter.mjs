import express from 'express';

const userRouter = express.Router();


userRouter.post('/add', (req, res) => {
    res.send('Add user data');
});

userRouter.delete('/delete/:userId', (req, res) => {
    res.send('Remove user data');
});

userRouter.get('/get/:userId', (req, res) => {
    res.send('Get user info by ID');
});

export default userRouter;
