const mongoCollections = require('./collections');
const posts = mongoCollections.posts;
const animals = mongoCollections.animals;
ObjectId = require('mongodb').ObjectID;

const exportedMethods = {

    async addlikePosttoAnimal(animalId, postId) {
        //console.log(animalId)
        let currentAnimal = await this.getAnimalById(animalId);
        console.log(currentAnimal);

        const animalCollection = await animals();
        const updateInfo = await animalCollection.replaceOne({ _id: ObjectId(animalId) }, { $push: { posts: postId, likes: postId }, });
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Update failed';
        return await this.getAnimalById(animalId);
    },

    async removelikePostFromAnimal(animalId, postId) {
        let currentUser = await this.getAnimalById(animalId);
        // console.log(currentUser);

        const userCollection = await animals();
        const updateInfo = await userCollection.replaceOne({ _id: ObjectId(animalId) }, { $pull: { posts: ObjectId(postId), likes: ObjectId(postId) } });
        //console.log(updateInfo)
        console.log("done")
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Update failed';
        return await this.getAnimalById(animalId);
    }

};

module.exports = exportedMethods;