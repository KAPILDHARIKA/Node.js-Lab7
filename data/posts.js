const mongoCollections = require('./collections');
const posts = mongoCollections.posts;
const animal = require('./animals');
ObjectId = require('mongodb').ObjectID;
//const uuid = require('uuid/v4');

const exportedMethods = {
    async getAllPosts() {
        const postCollection = await posts();
        return await postCollection.find({}).toArray();
    },
    async getPostById(id) {
        //console.log(id)
        const postCollection = await posts();
        const post = await postCollection.findOne({ _id: ObjectId(id) });

        if (!post) throw 'Post not found...';
        //if (post.hasOwnProperty("title"))
        return post;
    },

    async addPost(title, animalId, content) {
        try {
            if (typeof(title) != 'string') throw 'No title provided';
            if (typeof author !== 'string') throw 'I aint got nobody!';
            if (typeof(content) != 'string') throw 'I aint got nobody!';

            const postCollection = await posts();

            //const animalThatPosted = await animal.getAnimalById(animalId);

            const newPost = {
                title: title,
                author: ObjectId(animalId),
                content: content
            };
        } catch (e) {
            res.status(404).json({ error: 'Please enter correct data' });
            return;
        }

        const newInsertInformation = await postCollection.insertOne(newPost);
        const newId = newInsertInformation.insertedId;
        //console.log(newId)
        console.log('addingtoanimal....');
        const v = await animal.addPosttoAnimal(animalId, newId);
        console.log(v)
        return await this.getPostById(newId);
    },

    async removePost(id) {
        const postCollection = await posts();
        let post = null;
        try {
            if (typeof(id) != "string") throw 'Enter correct id'
            post = await this.getPostById(id);

            if (post.hasOwnProperty('title')) {
                const deletionInfo = await postCollection.deleteOne({ _id: ObjectId(id) });
                if (deletionInfo.deletedCount === 0) {
                    throw `Could not delete post with id of ${id}`;
                }
                // console.log('author')
                // console.log(post.author)
                await animal.removePostFromAnimal(post.author, id);
                return true;
            }
        } catch (e) {
            console.log(e);
            return;
        }
    },

    async updatePost(id, updatedPost) {
        const postCollection = await posts();

        const updatedPostData = {};
        try {
            if (typeof(id) != 'string') throw "Enter id"
            if ((typeof(updatedPost.newTitle) != 'string') || (!updatedPost.newTitle)) throw "Please enter correct string"
            if ((typeof(updatedPost.newContent) != 'string') || (!updatedPost.newContent)) throw "Please enter correct string"

            if (updatedPost.newTitle) {
                updatedPostData.title = updatedPost.newTitle;
            }

            if (updatedPost.newContent) {
                updatedPostData.content = updatedPost.newContent;
            }
        } catch (e) {
            res.status(404).json({ error: 'Please enter correct data' });
            return;

        }
        await postCollection.replaceOne({ _id: ObjectId(id) }, { $set: updatedPostData });

        return await this.getPostById(id);
    },
    async removeAnimalFromPost(postId) {
        console.log(postId)
        let postc = [];
        const postcollection = await posts();
        //let currentUser = await this.getAnimalById(animalId);
        //console.log(currentUser);
        console.log('posts getting deleted')
        const deletionInfo = await postcollection.deleteMany({ author: ObjectId(postId) })
        console.log("done")
        if (deletionInfo.deletedCount === 0) {
            throw `Could not delete post with id of ${id}`;
        }
        return true //await this.getPostById();
    },

    async renameTag(oldTag, newTag) {
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