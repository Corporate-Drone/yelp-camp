const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String

})

//smaller image dislay for edit page
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
})

const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
          type: String, 
          enum: ['Point'],
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
    price: Number,
    description: String,
    location: String,
    author: {
        //acquire author ID & populate using User model
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
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
})

module.exports = mongoose.model('Campground', CampgroundSchema);