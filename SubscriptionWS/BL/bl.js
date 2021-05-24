const membersDal = require('../DAL/membersDal');
const moviesDal = require('../DAL/moviesDal');
const Member = require('../Models/membersModel');
const Movie = require('../Models/moviesModel');
const Subscription = require('../Models/subscriptionsModel');

const getAllSubs = function (){
    return new Promise(async(resolve,reject)=>{
        Subscription.find({},function(err,subs){
            if(err){
                reject(err);
            }else{
                resolve(subs);
            }
        })
    })
}

const returnSubByMemberId = function (id){
    return new Promise(async(resolve,reject)=>{
        Subscription.find({},function(err,subs){
            if(err){
                reject(err);
            }else{
               let chosenSub= subs.filter(sub=>sub.memberId==id);
            resolve(chosenSub[0]);
            }
        })
    })
}

const subscribeNewMovie = function (obj){
    return new Promise(async(resolve,reject)=>{
        let sub = await returnSubByMemberId(obj.mem_id);
        sub.movies.push({movieId:obj.drop_down,date:obj.date});
        Subscription.findByIdAndUpdate(sub._id,{
            movies:sub.movies
        },function(err){
            if(err){
                reject(err);
            }else{
                resolve("OK")
            }
        })
    })

}

const updateMembersMoviesCollections = async function () {

    let mergedData = { movies: [], members: [] }
    let movies = await moviesDal.getAllMovies();
    let members = await membersDal.getAllMembers();

    movies.data.forEach(movie => {
        mergedData.movies.push(movie)
    });
    members.data.forEach(movie => {
        mergedData.members.push(movie)
    });

    return new Promise((resolve, reject) => {
        //ADDING MOVIES TO MONGODB
        mergedData.movies.forEach(movie => {
            const mov = new Movie({
                name: movie.name,
                genres: movie.genres,
                image: movie.image.medium,
                premiered: movie.premiered
            })
            mov.save( function (err) {
                if (err) {
                    reject(err)
                } 
            })
        });
        //ADDING members TO MONGODB
        mergedData.members.forEach(member => {
            const mem = new Member({
                name: member.name,
                email: member.email,
                city: member.address.city
            })
            mem.save(function (err) {
                if (err) {
                    reject(err)
                } 
            })
            const subs = new Subscription({
                memberId : mem._id,
                movies:[]
            })
            subs.save(function(err){
                if(err){
                    reject(err);
                }
            })
            
        })
        resolve("OK")
    });
}

const getMergedData = function (){
    return new Promise(async(resolve,reject)=>{
        let mergedData = { movies: [], members: [] }
        let movies = await moviesDal.getAllMovies();
        let members = await membersDal.getAllMembers();
    
        movies.data.forEach(movie => {
            mergedData.movies.push(movie)
        });
        members.data.forEach(movie => {
            mergedData.members.push(movie)
        });
        resolve(mergedData)
    })

}

const updateMember = function (mem){
    return new Promise((resolve,reject)=>{
        Member.findByIdAndUpdate(mem.id,{
            name:mem.name,
            email:mem.email,
            city:mem.city
        },function(err){
            if(err){
                reject(err);
            }else{
                resolve("Updated")
            }
        })
    })
}

const updateMovie = async function (id,movie){
    return new Promise ((resolve,reject)=>{
        Movie.findByIdAndUpdate(id,{
            name:movie.name,
            genres:movie.genres,
            image:movie.image,
            premiered:movie.premiered
        },
            function (err){
            if(err){
                reject(err)
            }else{
                resolve("Updated")
            }
        })
    })
}

const addMovie = async function (movie){
    return new Promise((resolve,reject)=>{
        const m = Movie({
            name:movie.name,
            genres:movie.genres,
            image:movie.image,
            premiered:movie.premiered
        })
        m.save(function(err){
            if(err){
                reject(err);
            }else{resolve('Created')}
        })
    })
}

const deleteMember = async function (mem){
    return new Promise(async(resolve,reject)=>{
        Member.findByIdAndDelete(mem._id,function(err){
            if(err){
                reject(err)
            }else{
                resolve("Deleted")
            }
        })
    })

}

const addMember = function(mem){
    return new Promise((resolve, reject) =>
        {
            const m = new Member({
                name:mem.name,
                email:mem.email,
                city:mem.city
            });

            m.save(function(err) 
            {
                if(err)
                {
                    reject(err);
                }
                else
                {
                    resolve('Created');
                }
            })
        })
}

const getMember = function (id){
    return new Promise(async (resolve,reject)=>{
        Member.findById(id,function(err,mem){
            if(err){
                reject(err);
            }else{
                resolve(mem)
            }
        })
    })
}

const getAllMembers = function (){
    return new Promise(async(resolve,reject)=>{
        Member.find({},function(err,members){
            if(err){
                reject(err);
            }else{
                resolve(members);
            }
        })
    })
}

const getAllMovies = function (){
    return new Promise(async(resolve,reject)=>{
        Movie.find({},function(err,movies){
            if(err){
                reject(err);
            }else{
                resolve(movies);
            }
        })
    })
}

const getMovie = function (id){
    return new Promise(async (resolve,reject)=>{
        Movie.findById(id,function(err,movie){
            if(err){
                reject(err);
            }else{
                resolve(movie)
            }
        })
    })
}

const deleteMovie = async function (id){
    return new Promise(async(resolve,reject)=>{
        Movie.findByIdAndDelete(id,function(err){
            if(err){
                reject(err)
            }else{
                resolve("Deleted")
            }
        })
    })

}

const newSubscription = async function (sub){
    return new Promise(async(resolve,reject)=>{
        const subs = {
            memberId: sub.memberid,
            movies: [{movieId : sub.movies.movieId, date : sub.movies.date}]}

    })
}


module.exports = {getAllSubs,returnSubByMemberId,subscribeNewMovie,updateMember,updateMovie,getAllMembers,addMovie,getMember,getAllMovies,getMovie,deleteMember,deleteMovie,newSubscription,addMember, getMergedData,updateMembersMoviesCollections }