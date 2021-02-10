const express = require('express');
const router = express.Router();
const postData = require('../data/posts');
const animalData = require('../data/animals');

//const postData = data.;

router.get('/:id', async(req, res) => {
    try {
        if (typeof(req.params.id) != "string") throw "Please enter correct id"

        const post = await postData.getPostById(req.params.id);
        res.json(post);
        res.sendStatus(200);
    } catch (e) {
        res.status(404).json({ error: 'Post not found' });
    }
});

// router.get('/tag/:tag', async(req, res) => {
//     const postList = await postData.getPostsByTag(req.params.tag);
//     res.json(postList);
// });

router.get('/', async(req, res) => {
    try {
        const postList = await postData.getAllPosts();
        console.log(postList);
        const aniList = await animalData.getAllanimals();

        const myData = []

        // for(var i=0; i<postList.length(); i++){
        //     myData[i] = {
        //         "_id": postList[i]._id,
        //         "title": postList[i].title,
        //         "author": {
        //             "_id": postList[i].author,
        //             "name": aniList[i].name
        //         },
        //         "content":

        //     }
        // }
        res.json(postList);
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

router.post('/', async(req, res) => {
    const blogPostData = req.body;
    try {
        const { title, author, content } = blogPostData;
        if ((typeof(blogPostData.title) != 'string') || (!blogPostData.title)) throw "Please enter correct id"
        if ((typeof(blogPostData.author) != "string") || (!blogPostData.author)) throw "Please enter correct author"
        if ((typeof(blogPostData.content) != "string") || (!blogPostData)) throw "Please enter correct contect"
        const newPost = await postData.addPost(blogPostData.title, blogPostData.author, blogPostData.content);

        res.json(newPost);
        res.sendStatus(200);
    } catch (e) {
        res.status(400).json({ error: 'Post not found' });
    }
});

router.put('/:id', async(req, res) => {
    const updatedData = req.body;
    try {
        if (typeof(req.params.id) != "string") throw "Please enter correct id"
        await postData.getPostById(req.params.id);
    } catch (e) {
        res.status(404).json({ error: 'Post not found' });
        return;
    }

    try {
        const updatedPost = await postData.updatePost(req.params.id, updatedData);
        res.json(updatedPost);
    } catch (e) {
        res.status(404).json({ error: 'Post not found' });
    }
});

router.delete('/:id', async(req, res) => {
    try {
        if (typeof(req.params.id) != "string") throw "Please enter correct id"
        const d = await postData.getPostById(req.params.id);
        // console.log('e')


        // console.log('qwerte...' + d)
    } catch (e) {

        res.status(404).json({ error: 'Post not found!!!' });
        return;
    }
    try {
        const f = await postData.removePost(req.params.id);
        //console.log(f)
        // res.sendStatus(200);
    } catch (e) {
        res.status(404).json({ error: 'Post not found' });
    }
});

module.exports = router;