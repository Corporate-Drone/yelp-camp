const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '601865eb5a912377acc21590',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque saepe ipsa, eum quas modi delectus consequatur molestiae excepturi, error temporibus sed veniam facilis hic laudantium alias consectetur perferendis non placeat.', price, images: [{
                url:
                 'https://res.cloudinary.com/dw2bqpmjv/image/upload/v1612319799/sample.jpg',
                filename: 'YelpCamp/jhmd2okanqpinkwqehqc' },
              {
                url:
                 'https://res.cloudinary.com/dw2bqpmjv/image/upload/v1612319799/sample.jpg',
                filename: 'YelpCamp/t0o6rexg4tvtou6c9mel' } ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});