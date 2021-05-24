const axios = require('axios');

const getAllMembers = function (){
    return axios.get('http://localhost:8000/api/subscription/getallmembers');
}

const addNewMember = function (obj){
    return axios.post('http://localhost:8000/api/subscription/addnewmember',obj)
}

const updateMember = function (obj){
    return axios.put('http://localhost:8000/api/subscription/updatemember',obj)
}

const deleteMember = function (obj){
    return axios.post('http://localhost:8000/api/subscription/deletemember',obj)
}

module.exports = {deleteMember,updateMember,getAllMembers,addNewMember}