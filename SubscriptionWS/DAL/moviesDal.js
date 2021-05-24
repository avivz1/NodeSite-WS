const axios = require('axios');

const getAllMovies = function (){
    return axios.get('https://api.tvmaze.com/shows?page=0');
}


module.exports = {getAllMovies}