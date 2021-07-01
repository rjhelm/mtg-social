const faker = require('faker');
const db = require('../db');
const User = require('../models/user');
const Post = require('../models/post');

db.once('open', async () => {
    await User.deleteMany({});
    await Post.deleteMany({});

    const userData = [];
    for (let i = 0; i < 50; i += 1) {
        const username = faker.internet.userName();
        const passwordHash = faker.internet.password();

        userData.push({ username, passwordHash });
    }

    const createdUsers = await User.collection.insertMany(userData);

    let createdPosts = [];
    for (let i = 0; i < 50; i =+ 1) {
        const title = faker.lorem.words(Math.round(Math.random() * 10) + 15);
        const body = faker.lorem.words(Math.round(Math.random() * 10) + 30);
        const randomUserIndex = Math.floor(Math.random() * createdUsers.ops.length);
        const { _id: author } = createdUsers.ops[randomUserIndex];
        const savedPost = await Post.create({ title, body, author });
        const updatedUser = await User.updateOne({ _id: author }, { $push: { posts: savedPost._id } } );

        createdPosts.push(savedPost)
    }
    console.log('all done!');
    process.exit(0);
});