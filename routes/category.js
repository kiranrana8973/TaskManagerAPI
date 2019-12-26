const express = require('express');
const Category = require('../models/category');
const auth = require('../auth');

const router = express.Router();

router.route('/')
    .get((req, res, next) => {
        Category.find({})
            .then((categories) => {
                res.json(categories);
            })
            .catch(next);
    })
    .post((req, res, next) => {
        Category.create(req.body)
            .then((category) => {
                res.statusCode = 201;
                res.json(category);
            })
            .catch(next);
    })
    .put((req, res) => {
        res.statusCode = 405;
        res.json({ message: "Method not allowed" });
    })
    .delete(auth.verifyAdmin, (req, res, next) => {
        Category.deleteMany({})
            .then((reply) => {
                res.json(reply);
            })
            .catch(next)
    });

router.route('/:id')
    .get((req, res, next) => {
        Category.findById(req.params.id)
            .populate({
                path: 'tasks',
                select: 'name'
            })
            .then((category) => {
                res.json(category);
            }).catch(next);
    })
    .post()
    .put()
    .delete();

module.exports = router;