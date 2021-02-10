const mongoCollections = require('./collections');
const animals = mongoCollections.animals;
ObjectId = require('mongodb').ObjectID;

//const axios = require('axios');
//const uuid = require('uuid/v4');

const exportedMethods = {
    async getAllanimals() {
        const postCollection = await animals();
        const ani = await postCollection.find({}).toArray();
        return ani;
    },
    async getAnimalById(id) {
        const postUser = require('./posts');
        const postCollection = await animals();
        const post = await postCollection.findOne({ _id: ObjectId(id) });
        // const l=await postUser.getPostById(post.)
        console.log(post)
        if (!post) throw 'Animal not found';
        return post;
    },

    async addAnimal(name, animalType) {

        if (typeof name !== 'string') throw 'No name provided';
        if (typeof animalType !== 'string') throw 'No animal';

        // if (!Array.isArray(likes)) {
        //     likes = [];
        // }
        // if (!Array.isArray(posts)) {
        //     posts = [];
        // }



        //const userThatPosted = await users.getAnimalById(posterId);

        const newPost = {
            name: name,
            animalType: animalType,
            likes: [],
            posts: []
        };

        const postCollection = await animals();
        const newInsertInformation = await postCollection.insertOne(newPost);

        if (newInsertInformation.insertedCount === 0) throw 'Insert failed!';
        const newId = newInsertInformation.insertedId;

        //await users.addPostToUser(posterId, newId, title);

        return await this.getAnimalById(newId);
    },


    async addPosttoAnimal(animalId, postId) {
        //console.log(animalId)
        let currentAnimal = await this.getAnimalById(animalId);
        console.log(currentAnimal);

        const animalCollection = await animals();
        const updateInfo = await animalCollection.replaceOne({ _id: ObjectId(animalId) }, { $push: { posts: postId, likes: postId }, });
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Update failed';
        return await this.getAnimalById(animalId);
    },

    async removePostFromAnimal(animalId, postId) {
        let currentUser = await this.getAnimalById(animalId);
        // console.log(currentUser);

        const userCollection = await animals();
        const updateInfo = await userCollection.replaceOne({ _id: ObjectId(animalId) }, { $pull: { posts: ObjectId(postId), likes: ObjectId(postId) } });
        //console.log(updateInfo)
        console.log("done")
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Update failed';
        return await this.getAnimalById(animalId);
    },


    async removeAnimal(id) {
        const postUser = require('./posts');
        const postCollection = await animals();

        let post = null;

        try {
            post = await this.getAnimalById(id);
        } catch (e) {
            console.log(e);
            return;
        }
        const deletionInfo = await postCollection.deleteOne({ _id: ObjectId(id) });

        if (deletionInfo.deletedCount === 0) {
            throw `Could not delete animal with id of ${id}`;
        }
        const f = await postUser.removeAnimalFromPost(id);
        console.log(f)
            // await postUser.removeAnimalFromPost(id);
        return true;
    },

    async updateAnimal(id, updatedAnimal) {

        const postCollection = await animals();

        const updatedPostData = {};

        if (updatedAnimal.newName) {
            updatedPostData.name = updatedAnimal.newName;
        }

        if (updatedAnimal.likes) {

            updatedPostData.likes = updatedAnimal.likes;
        }

        if (updatedAnimal.newType) {
            updatedPostData.animalType = updatedAnimal.newType;
        }

        if (updatedAnimal.posts) {
            updatedPostData.posts = updatedAnimal.posts;
        }

        await postCollection.replaceOne({ _id: ObjectId(id) }, { $set: updatedPostData });
        return await this.getAnimalById(id);
    },
    async renameAnimal(oldTag, newTag) {
        if (oldTag === newTag) throw 'tags are the same';
        let findDocuments = {
            tags: oldTag
        };

        let firstUpdate = {
            $addToSet: { tags: newTag }
        };

        let secondUpdate = {
            $pull: { tags: oldTag }
        };

        const postCollection = await posts();
        await postCollection.updateMany(findDocuments, firstUpdate);
        await postCollection.updateMany(findDocuments, secondUpdate);

        return await this.getPostsByTag(newTag);
    }
};

module.exports = exportedMethods;