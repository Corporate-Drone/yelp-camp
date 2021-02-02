const { campgroundSchema, reviewSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');
const Review = require('./models/review');


//check if user is logged in
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl //store url user was on
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

//check for error when validating campground Joi schema when creating a new campground 
module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        //map over details to create single string message
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

//check if viewed campground belongs to the current user
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params; //take id from URL
    const campground = await Campground.findById(id); //lookup campground wth ID
    if (!campground.author.equals(req.user._id)) { //check if logged in user ID is equal to campground author ID
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

//check if viewed campground reviews belong to the current user
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params; //take id from URL get review ID
    const review = await Review.findById(reviewId); //lookup review wth ID
    if (!review.author.equals(req.user._id)) { //check if logged in user ID is equal to review author ID
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

//validate schema from req.body (Joi schema)
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        //map over details to create single string message
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}