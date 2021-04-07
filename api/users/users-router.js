const express = require('express');
const Users = require('./users-model')
const mw = require('../middleware/middleware.js')
const Post = require('../posts/posts-model')
// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required

const router = express.Router();

router.get('/', (req, res) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  Users.get(req.query)
    .then(users => {
      res.status(200).json(users);
    })
    .catch(error => {
      // log error to server
      console.log(error);
      res.status(500).json(error.message);
    });
});

router.get('/:id', mw.validateUserId, (req, res) => {
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
  res.status(200).json(req.user)
});

router.post('/', mw.validateUser, (req, res) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
  Users.insert(req.body)
    .then(
      user => {
        res.status(201).json(user)
      }
    ).catch(err => {
      console.log(err)
      res.status(500).json(err.message);
    })
});

router.put('/:id', mw.validateUser, mw.validateUserId, (req, res) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  const { id } = req.params;
  Users.update(id, req.body)
    .then(user => {
      res.status(200).json(user)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json(err.message)
    })
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
});

router.delete('/:id', mw.validateUserId, (req, res) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
  const { id } = req.params;
  Users.remove(id)
    .then(user => {
      res.status(200).json(user)
    })
    .catch(err => {
      res.status(500).json(err.message)
    })
});

router.get('/:id/posts', mw.validateUserId, (req, res) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
  const { id } = req.params;
  Users.getUserPosts(id)
    .then(posts => {
      res.status(200).json(posts)
    }).catch(err => {
      res.status(500).json(err.message)
    })

});

router.post('/:id/posts', mw.validateUserId, mw.validatePost, (req, res) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  const body = req.body;
  Post.insert(body)
    .then(posts => {
      res.status(200).json(posts)
    }).catch(err => {
      res.status(500).json(err.message)
    })
});

// do not forget to export the router
module.exports = router