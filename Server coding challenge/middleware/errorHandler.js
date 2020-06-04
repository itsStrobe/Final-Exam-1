function errorHandler(error, req, res) {
    /* 

        Your code goes here

    */

    // Error in the request
    if(error.body){
        let movie_ID = error.params;
        let {id, firstName, lastName} = error.body;

        if(!id){
            res.statusMessage = "Id is missing in the body of the request.";
            return res.status(406).end();
        }
    }
}

module.exports = errorHandler;