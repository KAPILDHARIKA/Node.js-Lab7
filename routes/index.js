const AnimalsRoutes = require("./animals");
const PostsRoutes = require("./posts");
const LikesRoutes = require("./likes");

const constructorMethod = app => {
    app.use("/animals", AnimalsRoutes);
    app.use("/posts", PostsRoutes);
    app.use("/likes", LikesRoutes);

    app.use("*", (req, res) => {
        res.sendStatus(404);
    });
};

module.exports = constructorMethod;