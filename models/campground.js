const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    reviews: [
        {
            //acquire review ID & populate using Review model
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

//review needs to be deleted (review is linked to campground) after the corresponding campground has been deleted through middleware (after every findOneAndDelete)
//previously deleted item is passed to middleware function
CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
} )

module.exports = mongoose.model('Campground', CampgroundSchema);