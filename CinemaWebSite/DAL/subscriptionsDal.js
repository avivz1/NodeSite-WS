const axios = require('axios')

const subscribeToNewMovie = function (obj){
    return axios.post('http://localhost:8000/api/subscription/newmoviesubscription',obj)
}

const getAllSubs = function (){
    return axios.get('http://localhost:8000/api/subscription/getallsubs')
}


module.exports={getAllSubs,subscribeToNewMovie}