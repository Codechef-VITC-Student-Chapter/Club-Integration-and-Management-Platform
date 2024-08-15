import express from 'express';

import {addUser, removeUser, getUserById} from '../utils/userUtils.mjs'

const userRouter = express.Router();


userRouter.post('/add', async (req, res) => {
    try{
        let userAdded = await addUser(req.body);
        res.status(201).json(userAdded);
        
    }catch(error){
        res.status(500).json({"error": error.message});
    }
    
});

userRouter.delete('/delete/:userId', async (req, res) => {
    try{
        let userDeleted = await removeUser(req.params.userId);
        res.status(200).json(userDeleted);
    }catch(error){
        res.status(500).json({"error": error.message});
    }
});

userRouter.get('/get/:userId', async (req, res) => {
    try{
        let user = await getUserById(req.params.userId);
        res.status(200).json(user);
    }catch(error){
        res.status(500).json({"error": error.message});
    }
});

export default userRouter;
