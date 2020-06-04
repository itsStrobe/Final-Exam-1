const express = require( 'express' );
const bodyParser = require( 'body-parser' );
const errorHandler = require('./middleware/errorHandler');
const mongoose = require( 'mongoose' );
const jsonParser = bodyParser.json();
const { DATABASE_URL, PORT } = require( './config' );
const { Actors } = require('./models/actor-model');
const { Movies } = require('./models/movie-model');

const app = express();

/* 
    Your code goes here 
*/
app.get('/api/movie/:movie_ID', (req, res) => {
    let id = Number(req.params.movie_ID);

    Movies
        .getMovieById(id)
        .then(movie => {
            return res.status(200).json(movie);
        })
        .catch(err => {
            return res.status(404).end();
        })
})

app.post('/api/add-actor', jsonParser, (req, res) => {
    const { actor_ID, firstName, lastName } = req.body;

    Actors
        .createActor({
            actor_ID,
            firstName,
            lastName
        })
        .then( newActor => {
            console.log(`Created Actor: ${newActor.firstName} ${newActor.lastName}.`);
            return res.status(201).json(newActor);
        })
        .catch( err => {
            console.error( err );
            res.statusMessage = err;
            return res.status(400).end();
        });
});

app.post('/api/add-movie', jsonParser, (req, res) => {
    const { movie_ID, movie_title, year, rating } = req.body;

    Movies
        .createMovie({
            movie_ID,
            movie_title,
            year,
            rating,
            actors : []
        })
        .then( newMovie => {
            console.log(`Created Movie: ${newMovie.movie_title}.`);
            return res.status(201).json(newMovie);
        })
        .catch( err => {
            console.error( err );
            res.statusMessage = err;
            return res.status(400).end();
        });
});

app.patch('/api/add-movie-actor/:movie_ID', [jsonParser], (req, res) => {
    const movie_ID = req.params.movie_ID;
    const { id, firstName, lastName } = req.body;

    if(!id){
        res.statusMessage = "Id is missing in the body of the request";
        return res.status(406).end();
    }

    if(movie_ID != id){
        res.statusMessage = `id=${id} and movie_ID=${movie_ID} do not match.`;
        return res.status(409).end();
    }

    if(!firstName || !lastName){
        res.statusMessage = "You need to send both firstName and lastName of the actor to add to the movie list.";
        return res.status(403).end();
    }

    // Create Actor
    Actors
        .getActorByName(
            firstName,
            lastName
        )
        .then(actor => {
            Movies
                .getMovieById(id)
                .then(movie => {
                    let actors = movie.actors;
                    actors.push(actor['_id']);
                    Movies
                        .setMovieActors(movie_ID, actors)
                        .then(updatedMovie => {
                            return res.status(201).json(updatedMovie);
                        })
                        .catch(err => {
                            console.error(err);
                            res.statusMessage = "Error Updating the Movies Actors";
                            return res.status(404).end;
                        });
                })
                .catch(err => {
                    console.error(err);
                    res.statusMessage = "The movie does not exist";
                    return res.status(404).end;
                });
        })
        .catch(err => {
            console.error(err);
            res.statusMessage = "The actor does not exist";
            return res.status(404).end;
        });
})

app.listen( PORT, () => {
    console.log( "This server is running on port 8080" );
    new Promise( ( resolve, reject ) => {
        const settings = {
            useNewUrlParser: true, 
            useUnifiedTopology: true, 
            useCreateIndex: true,
            useFindAndModify : false
        };
        mongoose.connect( DATABASE_URL, settings, ( err ) => {
            if( err ){
                return reject( err );
            }
            else{
                console.log( "Database connected successfully." );
                return resolve();
            }
        })
    })
    .catch( err => {
        console.log( err );
    });
});