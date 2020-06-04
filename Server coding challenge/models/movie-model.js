const mongoose = require( 'mongoose' );

const moviesSchema = mongoose.Schema({
    movie_ID : {
        type : Number,
        unique : true,
        required : true
    },
    movie_title : {
        type : String,
        required : true
    },
    year :  {
        type : Number,
        required : true
    },
    rating : {
        type : Number,
        required : true
    },
    actors : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'actors',
        required : true
    }]
});

const moviesCollection = mongoose.model( 'movies', moviesSchema );

const Movies = {
    createMovie : function( newMovie ){
        return moviesCollection
                .create( newMovie )
                .then( createdMovie => {
                    return createdMovie;
                })
                .catch( err => {
                    throw new Error( err );
                });
    },
    /*
        Your code goes here
    */
   getMovieById : function( movie_ID ){
       return moviesCollection
                .findOne({
                    movie_ID : movie_ID
                })
                .then(movie => {
                    if(!movie){
                        throw new Error('Movie not found');
                    }

                    return movie
                })
                .catch(err => {
                    console.error(err);
                    throw new Error(err);
                });
   },
   setMovieActors : function( movie_ID, actors ){
       return moviesCollection
                .findOneAndUpdate( 
                    { movie_ID : movie_ID },
                    {
                        actors
                    },
                    { new : true }
                 )
                 .populate('actors')
                 .then(res => {
                     console.log(res);
                     return res;
                 })
                 .catch(err => {
                     console.error(err);
                     throw new Error(err);
                 });
   }
}

module.exports = {
    Movies
};

