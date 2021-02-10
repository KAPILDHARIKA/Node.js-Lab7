const express = require('express');
const router = express.Router();
const userdata = require('../data/animals');
//ObjectId = require('mongodb').ObjectID;
//const userData = data;
//const axios = require('axios');

router.get('/:id', async(req, res) => {
    try {
        //  console.log(typeof(req.params.id))
        if (typeof(req.params.id) != "string") throw "Please enter correct id"
            // console.log('b')
        let user = await userdata.getAnimalById(req.params.id);
        res.json(user);
    } catch (e) {
        res.status(404).json({ error: 'Particular Animal not found' });
    }
});

router.get('/', async(req, res) => {
    try {
        let userList = await userdata.getAllanimals();
        res.json(userList);
        res.sendStatus(200);
    } catch (e) {
        res.sendStatus(404).json({ error: 'Animals not found' });
    }
});

router.post('/', async(req, res) => {
    let userInfo = req.body;


    if (!userInfo) {
        res.status(400).json({ error: 'You must provide data to create animal' });
        return;
    }

    if (!userInfo.name) {
        res.status(400).json({ error: 'You must provide a name of the animal' });
        return;
    }
    if (typeof(userInfo.name) != "string") throw "Please provide proper name"

    if (!userInfo.animalType) {
        res.status(400).json({ error: 'You must provide animal type' });
        return;
    }
    if (typeof(userInfo.animalType) != "string") throw "Please provide proper name"
        // if (!userInfo.likes) {
        //     res.status(400).json({ error: 'You must provide likes to the animals' });
        //     return;
        // }
        // if (!userInfo.posts) {
        //     res.status(400).json({ error: 'You must provide posts to the animals' });
        //     return;
        // }
    try {
        const newUser = await userdata.addAnimal(userInfo.name, userInfo.animalType);
        res.json(newUser);
        res.sendStatus(200);
    } catch (e) {
        res.sendStatus(400).json({ error: 'animals not added' });
    }
});

router.put('/:id', async(req, res) => {
    let userInfo = req.body;



    if (!userInfo) {
        res.status(400).json({ error: 'You must provide data to update a user' });
        return;
    }

    if (!userInfo.newType) {
        res.status(400).json({ error: 'You must provide a new type' });
        return;
    }

    if (!userInfo.newName) {
        res.status(400).json({ error: 'You must provide a name' });
        return;
    }

    try {
        if (typeof(req.params.id) != "string") throw "Please enter correct id"
        if (typeof(userInfo.newType) != 'string') throw "Please  enter correct type"
        if (typeof(userInfo.newName) != 'string') throw "Please  enter correct name"
        const d = await userdata.getAnimalById(req.params.id);
        console.log(d)
    } catch (e) {
        res.status(400).json({ error: 'User not found' });
        return;
    }
    try {
        console.log(userInfo)
        const updatedUser = await userdata.updateAnimal(req.params.id, userInfo);
        res.json(updatedUser);
    } catch (e) {
        res.status(404).json({ error: 'User not found' });
    }
});

router.delete('/:id', async(req, res) => {
    try {
        if (typeof(req.params.id) != "string") throw "Please enter correct id"
        let user = await userdata.getAnimalById(req.params.id);
        res.json(user);
        // console.log(user)
    } catch (e) {
        res.status(404).json({ error: 'User not found' });
        return;
    }

    try {
        const d = await userdata.removeAnimal(req.params.id);
        console.log(d)
            // res.status(200).send('Ok');
            // res.sendStatus(200);
        console.log('Ok')
    } catch (e) {
        res.status(500).send({ error: e });
    }
});

module.exports = router;