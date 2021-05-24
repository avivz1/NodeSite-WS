const axios = require('axios');

const getAllMovies = function (){
    return axios.get('http://localhost:8000/api/subscription/getallmovies');
}

const addMovie = function (obj){
    return axios.post('http://localhost:8000/api/subscription/addmovie',obj);
}

const updateMovie = function (id,obj){
    return axios.put('http://localhost:8000/api/subscription/updatemovie/'+id,obj); 
}

const deleteMovie = function (id){
    return axios.delete('http://localhost:8000/api/subscription/deletemovie/'+id); 
}




module.exports = {deleteMovie,updateMovie,getAllMovies,addMovie}