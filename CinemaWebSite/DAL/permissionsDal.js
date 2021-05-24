const jsonFile = require('jsonfile');
const filePath = './Files/permissions.json';

const getPermissionsList = function(){
    return new Promise(async(resolve,reject)=>{
        let file = await jsonFile.readFile(filePath);
        resolve(file)
    })
}

const updatePermissionById = function (obj){
    return new Promise(async(resolve,reject)=>{
        let file= await jsonFile.readFile(filePath);
        file.users.forEach(perm => {
            if(perm.id==obj.id){
                perm.permissions= obj.permissions;
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

const addNewUserPermissions = function (user){
    return new Promise(async(resolve,reject)=>{
        let file = await jsonFile.readFile(filePath);
        file.users.push(user)
        try{
            jsonFile.writeFile(filePath,file);
            resolve("OK")

        }catch(err){
            reject(err);
        }
    })

}

const deletePermissions = function (id){
    return new Promise(async(resolve,reject)=>{
        let file = await jsonFile.readFile(filePath);
        let afterDelete = file.users.filter(x=>x.id!=id);
        let arr = {users:afterDelete}
        try{
            jsonFile.writeFile(filePath,arr);
            resolve("OK");
        }catch(err){
            reject(err);
        }
    })
}


module.exports={deletePermissions,updatePermissionById,getPermissionsList,addNewUserPermissions}