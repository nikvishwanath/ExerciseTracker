import 'dotenv/config';
import * as exercises from './exercises_model.mjs';
import express from 'express';

const PORT = process.env.PORT;

const app = express();

app.use(express.json());

/**
 * Create a new exercise with the name, reps, weight, unit, and date provided in the body
 */
app.post('/exercises', (req, res) => {
    const format = /^\d\d-\d\d-\d\d$/;
    if (
        req.body.name.length > 0 && req.body.reps > 0 && req.body.weight > 0 && (req.body.unit === 'lbs' || 
        req.body.unit === 'kgs') && format.test(req.body.date)
    ){
        exercises.createExercise(req.body.name, req.body.reps, req.body.weight, req.body.unit, req.body.date).then(exercises => {
            res.status(201).json(exercises);
        })
        .catch(error => {
            console.error(error);
            res.status(400).json({Error: 'Request Failed'});
        })
    }else{
        res.status(400).json({Error: 'Invalid Request'})
    }
    
});

/**
 * Retrive the exercise corresponding to the ID provided in the URL.
 */
app.get('/exercises/:_id', (req, res) => {
    const exerciseId = req.params._id;
    exercises.findExerciseById(exerciseId)
    .then(exercise => {
        if (exercise !== null){
            res.json(exercise)
        } else{
            res.status(404).json({Error: 'Resource not found'})
        }
    })
    .catch(error => {
        console.error(error);
        res.status(400).json({Error: 'Request failed'});
    })
});

/**
 * Retrieve exercises. 
 */
app.get('/exercises', (req, res) => {
    exercises.findExercises()
        .then(exercises => {
            res.json(exercises);
        })
        .catch(error => {
            console.error(error);
            res.status(400).json({Error: 'Request failed'})
        })
});

/**
 * Update the exercise whose id is provided in the path parameter and set
 * its name, reps, weight, unit, and date to the values provided in the body.
 */
app.put('/exercises/:_id', (req, res) => {
    const updateParams = {};
    if (req.body.name !== undefined){
        updateParams.name = req.body.name
    };
    if (req.body.reps !== undefined){
        updateParams.reps = req.body.reps
    };
    if (req.body.weight !== undefined){
        updateParams.weight = req.body.weight
    };
    if (req.body.unit !== undefined){
        updateParams.unit = req.body.unit
    };
    if (req.body.date !== undefined){
        updateParams.date = req.body.date
    };
    const format = /^\d\d-\d\d-\d\d$/;
    if (
        req.body.name.length > 0 && req.body.reps > 0 && req.body.weight > 0 && (req.body.unit === 'lbs' || 
        req.body.unit === 'kgs') && format.test(req.body.date)
    ){
    exercises.updateExercise({_id: req.params._id}, updateParams)
        .then(exercises => {
            if (exercises === 1){
                res.json({_id: req.params._id, name: req.body.name, reps: req.body.reps, weight: req.body.weight,
                unit: req.body.unit, date: req.body.date})
            } else{
                res.status(404).json({Error: 'Not found'})
            }
        })
        .catch(error => {
            console.error(error);
            res.status(400).json({Error: 'Request failed'})
        })}
        else{
            res.status(400).json({Error: 'Invalid Request'})
        }
});

/**
 * Delete the exercise whose id is provided in the query parameters
 */
app.delete('/exercises/:_id', (req, res) => {
    const deleteExerciseId = req.params._id;
    exercises.deleteExercise({_id: deleteExerciseId})
        .then(deleteCount => {
            if (deleteCount === 1){
                res.status(204).send()
            }
        })
        .catch(error => {
            console.error(error);
            res.status(404).json({Error: 'Resource not found'})
        })
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});