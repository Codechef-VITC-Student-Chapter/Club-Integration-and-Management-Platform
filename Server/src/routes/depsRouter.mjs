import express from 'express';
import {
    addDepartment, 
    removeDepartment, 
    getDepartmentById, 
    addSubDepartment, 
    removeSubDepartment,
    addLeadToDepartment,
    removeLeadFromDepartment
} 
from '../utils/depsUtils.mjs'

const depsRouter = express.Router();


depsRouter.post('/add', async (req, res) => {
    try {
        const depsData = req.body;
        const newDep = await addDepartment(depsData);
        res.status(201).json(newDep);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
});


depsRouter.delete('/delete/:id', async (req, res) => {
    try {
        const depId = req.params.id;
        const deletedDepartment = await removeDepartment(depId);
        res.status(200).json(deletedDepartment);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});


depsRouter.get('/get/:id', async (req, res) => {
    try {
        const depId = req.params.id;
        const department = await getDepartmentById(depId);
        res.status(200).json(department);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});


depsRouter.post('/add-sub-department', async (req, res) => {
    try {
        const { depId, subDepId } = req.body;
        const updatedDepartment = await addSubDepartment(depId, subDepId);
        res.status(200).json(updatedDepartment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


depsRouter.post('/remove-sub-department', async (req, res) => {
    try {
        const { depId, subDepId } = req.body;
        const updatedDepartment = await removeSubDepartment(depId, subDepId);
        res.status(200).json(updatedDepartment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
depsRouter.post('/add-lead', async (req, res) => {
    try {
        const { depId, userId } = req.body;
        const updatedDepartment = await addLeadToDepartment(depId, userId);
        res.status(200).json(updatedDepartment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

depsRouter.post('/remove-lead', async (req, res) => {
    try {
        const { depId, userId } = req.body;
        const updatedDepartment = await removeLeadFromDepartment(depId, userId);
        res.status(200).json(updatedDepartment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


export default depsRouter;
