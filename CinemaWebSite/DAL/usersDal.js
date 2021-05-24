const { json } = require("express");
const jsonFile = require("jsonfile")
const filePath = './Files/users.json'

const updateUserDetails = function (obj){
    return new Promise(async(resolve,reject)=>{
        let file= await jsonFile.readFile(filePath);
        file.users.forEach(detail => {
            if(detail.id==obj.id){
                detail.FirstName=obj.firstName
                detail.LastName=obj.lastName
                detail.CreatedDate=obj.createdDate
                detail.SessionTimeOut=obj.session
            }
        });
        try{
            jsonFile.writeFile(filePath,file)
            resolve("OK")
        }catch(err){
            reject(err)
        }
    })

}

const getUsersDetailsList = function (){
    try{
        return jsonFile.readFile(filePath);
    }catch(err){
        return err;
    }
}

const addNewUser =  function (user){
    return new Promise(async(resolve,reject)=>{
        let file = await jsonFile.readFile(filePath);
        file.users.push(user);
        try{
            jsonFile.writeFile(filePath,file)
            resolve("OK")
        }catch(err){
            reject(err);
        }
    })

}

const deleteUser = function(id){
    return new Promise(async(resolve,reject)=>{
        let file= await jsonFile.readFile(filePath);
        let afterDelete = file.users.filter(x=>x.id!=id);
        let arr = {users:afterDelete}
        try{
            jsonFile.writeFile(filePath,arr);
            resolve("OK")
        }catch(err){
            reject(err)
        }
    })
}

module.exports={deleteUser,updateUserDetails,getUsersDetailsList,addNewUser}