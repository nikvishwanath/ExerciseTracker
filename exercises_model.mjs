import mongoose from 'mongoose';
import 'dotenv/config';
import { query } from 'express';

mongoose.connect(
    process.env.MONGODB_CONNECT_STRING,
    { useNewUrlParser: true }
);


// Connect to to the database
const db = mongoose.connection;
// The open event is called when the database connection successfully opens
db.once("open", () => {
    console.log("Successfully connected to MongoDB using Mongoose!");
});

/**
 * Define the schema
 */

const exerciseSchema = mongoose.Schema({
    name: { type: String, required: true },
    reps: { type: Number, required: true },
    weight: { type: String, required: true },
    unit: {type: String, required: true},
    date: {type: String, required: true}
});

/**
 * Compile the model from the schema. This must be done after defining the schema.
 */
const Exercise = mongoose.model("Exercise", exerciseSchema);

const createExercise = async (name, reps, weight, unit, date) => {
    const exercise = new Exercise({name: name, reps: reps, weight: weight, unit: unit, date: date});
    return exercise.save();
}

const findExerciseById = async(_id) => {
    const query = Exercise.findById(_id);
    return query.exec();
}

const findExercises = async() => {
    const result = Exercise.find();
    return result.exec();
}

const updateExercise = async(filter, update) => {
    const updated = await Exercise.updateOne(filter, update);
    return updated.modifiedCount;
}

const deleteExercise = async(filter) => {
    const deleted = await Exercise.deleteOne(filter);
    return deleted.deletedCount;
}

export {createExercise, findExerciseById, findExercises, updateExercise, deleteExercise};