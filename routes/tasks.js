const express = require('express');
const Task = require('../models/tasks');

const router = express.Router();

router.route('/')
    .get((req, res, next) => {
        Task.find({ author: req.user._id })
            .then((tasks) => {
                res.json(tasks);
            }).catch((err) => next(err));
    })
    .post((req, res, next) => {
        let task = new Task(req.body);
        task.author = req.user._id;
        task.save()
            .then((task) => {
                res.statusCode = 201;
                res.json(task);
            }).catch(next);
    })
    .put((req, res) => {
        res.statusCode = 405;
        res.json({ message: "Method not supported" });
    })
    .delete((req, res, next) => {
        Task.deleteMany({ author: req.user._id })
            .then((reply) => {
                res.json(reply);
            }).catch(next);
    });

router.route('/:id')
    .get((req, res, next) => {
        Task.findOne({ author: req.user._id, _id: req.params.id })
            .then((task) => {
                if (task == null) throw new Error("Task not found!")
                res.json(task);
            }).catch(next);
    })
    .post((req, res) => {
        res.statusCode = 405;
        res.json({ message: "Method not allowed" });
    })
    .put((req, res, next) => {
        Task.findOneAndUpdate({ author: req.user._id, _id: req.params.id }, { $set: req.body }, { new: true })
            .then((reply) => {
                if (reply == null) throw new Error("Task not found!");
                res.json(reply);
            }).catch(next);
    })
    .delete((req, res, next) => {
        Task.findOneAndDelete({ author: req.user._id, _id: req.params.id })
            .then((task) => {
                if (task == null) throw new Error("Task not found!");
                res.json(task);
            }).catch(next);
    });

router.route('/:id/notes')
    .get((req, res, next) => {
        Task.findById(req.params.id)
            .then((task) => {
                res.json(task.notes);
            })
            .catch(next);
    })
    .post((req, res, next) => {
        Task.findById(req.params.id)
            .then((task) => {
                task.notes.push(req.body);
                task.save()
                    .then((task) => {
                        res.json(task.notes);
                    })
                    .catch(next);
            })
            .catch(next);
    })
    .put((req, res) => {
        res.statusCode = 405;
        res.json({ message: "Method not allowed" });
    })
    .delete((req, res, next) => {
        Task.findById(req.params.id)
            .then((task) => {
                task.notes = [];
                task.save()
                    .then((task) => {
                        res.json(task.notes);
                    })
                    .catch(next);
            })
            .catch(next);
    });

router.route('/:id/notes/:nid')
    .get((req, res, next) => {
        Task.findById(req.params.id)
            .then((task) => {
                let note = task.notes.id(req.params.nid);
                res.json(note);
            })
            .catch(next);
    })
    .post((req, res) => {
        res.statusCode = 405;
        res.json({ message: "Method not allowed" });
    })
    .put((req, res, next) => {
        Task.findById(req.params.id)
            .then((task) => {
                let note = task.notes.id(req.params.nid);
                note.note = req.body.note;
                task.save()
                    .then(() => {
                        res.json(note);
                    })
                    .catch(next);
            })
            .catch(next);
    })
    .delete((req, res, next) => {
        Task.findById(req.params.id)
            .then((task) => {
                task.notes.pull(req.params.nid);
                task.save()
                    .then((task) => {
                        res.json(task.notes);
                    })
                    .catch(next);
            })
            .catch();
    });
module.exports = router;