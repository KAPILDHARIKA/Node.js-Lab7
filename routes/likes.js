const express = require('express');
const router = express.Router();
const postData = require('../data/posts');
const animaldata = require('../data/animals');
const likedata = require('../data/likes');


router.post('/:animalId', async(req, res) => {
    console.log(req.query)
    console.log(req.params)
    let userInfo1 = req.params.animalId;
    let userInfo2 = req.query.postId;
    console.log(userInfo1)

    // if(var i === "postId"){

    // } else {
    //     throw ""
    // }


    if ((typeof(userInfo1) != "string") || (!userInfo1)) throw "Please enter correct animalid"
    if ((typeof(userInfo2) != "string") || (!userInfo2)) throw "Please enter correct postid"
    try {
        const post = await postData.getPostById(userInfo2);
        res.json(post);
    } catch (e) {
        res.status(404).json({ error: 'Post not found' });
    }
    try {
        const post = await animaldata.getAnimalById(userInfo1);
        res.json(post);
    } catch (e) {
        res.status(404).json({ error: 'Post not found' });
    }

    try {
        const v = await likedata.addlikePosttoAnimal(userInfo1, userInfo2);
        console.log(v)
        res.sendStatus(200);
    } catch (e) {
        res.sendStatus(404).json({ error: 'posts not added' });
    }

});

router.delete('/:animalId?postId=/:postId', async(req, res) => {
    let userInfo1 = req.params.animalId;
    let userInfo2 = req.params.postId;
    if ((typeof(userInfo1) != "string") || (!userInfo1)) throw "Please enter correct animalid"
    if ((typeof(userInfo2) != "string") || (!userInfo2)) throw "Please enter correct postid"
    try {
        const post1 = await postData.getPostById(userInfo2);
        res.json(post1);
    } catch (e) {
        res.status(404).json({ error: 'Post not found' });
    }
    try {
        const post2 = await animaldata.getAnimalById(userInfo1);
        res.json(post2);
    } catch (e) {
        res.status(404).json({ error: 'Post not found' });
    }
    try {
        await likedata.removelikePostFromAnimal(post1.author, userInfo2);
        //return true;
        res.sendStatus(200)
    } catch (e) {
        res.status(404).json({ error: 'User not found' });
        return;
    }
});





module.exports = router;