const axios = require('axios');

const getAllMembers = function (){
    return axios.get('https://jsonplaceholder.typicode.com/users');
}


module.exports = {getAllMembers}