const permissionsDal = require('../DAL/permissionsDal');
const usersDal = require('../DAL/usersDal');
const UserModel = require('../Model/UsersModel');
const moviesDal = require('../DAL/moviesWebSDal');
const membersDal = require('../DAL/membersDal');
const subscriptionsDal = require('../DAL/subscriptionsDal');
const { move } = require('../routes/MoviesRouter');
const jwt = require('jsonwebtoken')

const getUserIdByUserName = function (name){
    return new Promise((resolve,reject)=>{
        UserModel.find({}, function (err, data) {
            if (err) {
                reject(err);
            } else {
                data.forEach(user=>{
                    if(user.UserName==name){
                        resolve(user._id)
                    }
                })

            }
        })
    })
}

const getAllSubs = async function (){
    return subscriptionsDal.getAllSubs();
}

const subscribeToNewMovie = async function (obj){
    return subscriptionsDal.subscribeToNewMovie(obj);

}

const deleteMember = async function (mem){
    return membersDal.deleteMember(mem)
}

const getMember = async function (memberName){
    let members = await getAllMembers();
    let member = members.data.filter(m=>m.name==memberName);
     return member;
}

const updateMember = function (member){
    return membersDal.updateMember(member);
}

const addNewMember = function (member){
   return membersDal.addNewMember(member); 
}

const getAllFullMembers = async function (){
    let members = await getAllMembers();
    let movies = await getMoviesList();
    let subs = await getAllSubs();
    let movieDetails=[];

    members.data.forEach(mem => {
        mem.movies=[];
        
    //Step1 - **reach Subscriptions** with memberId to Get the right subscription
        let mySub = subs.data.filter(sub=>sub.memberId==mem._id);

    //Step2 (After Each Member have his subscription) - **reach Movies** with MovieId to get the movie Name & Date
        let myMovies= mySub[0].movies;
        myMovies.forEach(movie => {
            movieDetails = movies.data.filter(mov=>mov._id==movie.movieId);

    //Step3 - build the member Obj
            let obj = {
                name:movieDetails[0].name,
                date:movie.date}
            mem.movies.push(obj);
            });
            
    });
    return members;
}

const getAllMembers = function (){
    return membersDal.getAllMembers();
}

const deleteUser = function (id){
    return new Promise(async(resolve,reject)=>{
        //Step1 - Delete From DB (username + password)
        UserModel.findByIdAndDelete(id,function(err){
            if(err){
                reject(err)
            }
        })
        //Step2- Delete From users.json (user details)
        try{
            usersDal.deleteUser(id);
        }catch(err){
            reject(err)
        }
        //Step3 - Delete From permissions.json (user permissions)
        try{
            permissionsDal.deletePermissions(id);
        }catch(err){
            reject(err)
        }
        resolve("OK")
    })
}

const updateUser = function (user){
    return new Promise(async(resolve,reject)=>{
        //Step1- Update The username in the DB
        UserModel.findByIdAndUpdate(user.id,{
            UserName:user.username
        },function(err){
            if(err){
                reject(err)
            }
        })
                try{
                //Step2- Update The user permissions
                let obj={
                    id:user.id,
                    permissions:user.permissions
                }
                let resp = await permissionsDal.updatePermissionById(obj)
                //Step3 - update the user details
                let obj1 = {
                    id:user.id,
                    firstName:user.firstname,
                    lastName:user.lastname,
                    createdDate:user.createdDate,
                    session:user.session
                }
                console.log("STEP3-obj "+JSON.stringify(obj1))

                let resp1 = await usersDal.updateUserDetails(obj1);
                resolve("OK")

                }catch(err){
                    reject(err)
                }

    })
}

const getFullUserById = function (id) {
    return new Promise(async(resolve, reject) => {
        //Step1- get UserList(by username) From DB
        let dbUsersList = await getUsersLoginDetails();
        //Step2- get UserPermissionsList from Dal
        let permUsersList = await permissionsDal.getPermissionsList();
        //Step3 - get UserDetails from Dal
        let detailsUsersList = await usersDal.getUsersDetailsList();
        //Step4 - extract the user i want from the listS
        let dbUser = dbUsersList.filter(x=>x._id==id);
        let permUser = permUsersList.users.filter(x=>x.id==dbUser[0]._id);
        let detailsUser = detailsUsersList.users.filter(x=>x.id==dbUser[0]._id);
        let user={
            id:id,
            firstName:detailsUser[0].FirstName,
            lastName:detailsUser[0].LastName,
            userName:dbUser[0].UserName,
            createdDate:detailsUser[0].CreatedDate,
            session:detailsUser[0].SessionTimeOut,
            permissions:permUser[0].permissions
        }
        resolve(user)
    })
}

const getAllUsersFullDetails = function () {
    return new Promise(async (resolve, reject) => {
        let mergedUsers = [];
        //Step1- get UserList(by username) From DB
        let dbUsersList = await getUsersLoginDetails();
        //Step2- get UserPermissionsList from Dal
        let permUsersList = await permissionsDal.getPermissionsList();
        //Step3 - get UserDetails from Dal
        let detailsUsersList = await usersDal.getUsersDetailsList();
        //Step4 - merge by id to user obj and push to array
        dbUsersList.forEach(user => {
            let userPermissions = permUsersList.users.filter(perm => perm.id == user._id);
            let userDetails = detailsUsersList.users.filter(det => det.id == user._id);
            let obj = {
                id: user._id,
                name: userDetails[0].FirstName + ' ' + userDetails[0].LastName,
                username: user.UserName,
                session: userDetails[0].SessionTimeOut,
                createdDate: userDetails[0].CreatedDate,
                permissions: userPermissions[0].permissions
            }
            mergedUsers.push(obj)
        });
        resolve(mergedUsers);
    })

}

const getPermissionsList = async function () {
    let data = await permissionsDal.getPermissionsList();
    return data;
}

const getPermissionsByUserId = async function (userId) {
    let data = await getPermissionsList();
    let permissions = data.users.filter(per=>per.id==userId);
    return permissions[0];
}

const getUsersDetailsList = async function () {
    try {
        return usersDal.getUsersDetailsList;
    } catch (err) {
        return err;
    }
}

const step1CreateUserName = function (name) {
    return new Promise((resolve, reject) => {
        const u = new UserModel({
            UserName: name,
            Password: ''
        })
        u.save(function (err, item) {
            if (err) {
                reject(Err)
            } else {
                resolve(item)
            }
        })
    })
}

const createFullUser = function (user) {
    return new Promise(async (resolve, reject) => {
        let newUserId = '';
        //Step1-Create New UserName
        try {
            newUserId = await step1CreateUserName(user.userName);
        } catch (err) {
            reject("Create UserName Failed")
        }

        //Step2-Create Permissions in file
        let obj = {
            id: newUserId._id,
            permissions: user.permissions
        }
        try {
            let respon = await permissionsDal.addNewUserPermissions(obj);
        } catch (err) {
            reject("Create Permissions Failed")
        }

        //Get Today's Date
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        today = dd + '/' + mm + '/' + yyyy;

        //Step3-Create Details in file
        let obj1 = {
            id: newUserId._id,
            FirstName: user.fName,
            LastName: user.lName,
            CreatedDate: today,
            SessionTimeOut: user.session
        }
        try {
            let resp = await usersDal.addNewUser(obj1);
            resolve("OK")
        } catch (err) {
            reject("Create User Details Failed!")
        }


    })
}

const createPasswordByUserName = function (user) {
    return new Promise(async (resolve, reject) => {
        let users = await getUsersLoginDetails();
        //checking if username already given by admin - as suppose.
        users.forEach(user1 => {
            if (user1.UserName == user.UserName) {
                let id = user1._id;

                //if so- update password
                UserModel.findByIdAndUpdate(id, {
                    Password: user.Password
                }, function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve("OK")
                    }
                })
            }
        })
    })

}

const isAdmin = function (username) {
    return new Promise((resolve, reject) => {
        UserModel.find({}, function (err, data) {
            if (err) {
                reject(err);
            } else {
                data.forEach(user => {
                    if (user.type == "admin") {
                        resolve(true);
                    }
                });
                reject(false);
            }
        })
    })
}

const isUserShouldLogin = function (username, password) {
    return new Promise((resolve, reject) => {
        UserModel.find({}, function (err, data) {
            if (err) {
                reject(err);
            } else {
                data.forEach(user => {
                    if (user.UserName == username && user.Password == password) {
                        resolve(true);
                    }
                });
            }
        })
    })
}

const getUsersLoginDetails = function () {
    return new Promise(async (resolve, reject) => {
        UserModel.find({}, function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        })
    })
}

const addUserLoginDb = function (user) {
    return new Promise((resolve, reject) => {

        const u = new UserModel({
            UserName: user.Username,
            Password: user.Password
        });

        u.save(function (err) {
            if (err) {
                reject(err);
            } else {
                resolve('Created')
            }
        })
    })
}

const getFullMoviesList = async function (){
    let moviesList = await getMoviesList();
    let subs = await getAllSubs();
    let members = await getAllMembers();
    let obj={};


    moviesList.data.forEach(movie => {
        movie.subs=[]
        subs.data.forEach(sub => {
            sub.movies.forEach(mov=>{
                if(mov.movieId==movie._id){
                    let member = members.data.filter(mem=>mem._id==sub.memberId);
                    movie.subs.push({date:mov.date,memberName:member[0].name});
                }
            })
        });
    });
    return moviesList;
}

const getMoviesList = async function () {
        return await moviesDal.getAllMovies();
}

const getSearchedMovies = function (userMovie) {
    return new Promise(async (resolve, reject) => {
        let movData = await getFullMoviesList();
        let movies = movData.data.filter(mo=>mo.name.includes(userMovie));
        resolve(movies)
        // let arrByName = {};
        // let mergedData = await moviesDal.getAllMovies();
        // arrByName = mergedData.data.filter(movie => movie.name.includes(userMovie));
        // resolve(arrByName);
    })

}

const addMovie = function (movie) {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await moviesDal.addMovie(movie);
            resolve(response);
        } catch (err) {
            reject(err);
        }

    })
}

const updateMovie = function (id, movie) {
    return new Promise(async (resolve, reject) => {
        let response = await moviesDal.updateMovie(id, movie);
        resolve(response)
    })
}

const deleteMovie = function (id) {
    return new Promise(async (resolve, reject) => {
        let response = await moviesDal.deleteMovie(id);
        resolve(response)
    })
}

module.exports = {getPermissionsByUserId,getUserIdByUserName,getFullMoviesList,getAllFullMembers,getAllSubs,subscribeToNewMovie,deleteMember,updateMember,getMember,addNewMember,getAllMembers,deleteUser,updateUser, getFullUserById, getAllUsersFullDetails, step1CreateUserName, createFullUser, deleteMovie, updateMovie, addMovie, getSearchedMovies, getMoviesList, isAdmin, getPermissionsList, createPasswordByUserName, getUsersDetailsList, getUsersLoginDetails, addUserLoginDb, isUserShouldLogin }