const User = require('../Model/User'); 
const FootballPlayer = require('../Model/FootballPlayer'); 
const jwt = require("jsonwebtoken"); 
const updateUserRankings = require('../Fonctions/updateUserRankings'); 
require('dotenv').config(); 

async function checkEmail(req, res) { 
    const { email } = req.body; 
    if (!email || !/.+@.+\..+/.test(email)) { 
        return res.status(400).json({ message: "Invalid email address" }); 
    } 
    const existingEmail = await User.findOne({ email }); 
    if (existingEmail) { 
        return res.status(400).json({ message: "This email is already in use" }); 
    } 
    res.status(200).json({ message: "Email address available" }); 
} 

async function checkUsername(req, res) { 
    const { username } = req.body; 
    if (!username) { 
        return res.status(400).json({ message: "Username is required" }); 
    } 
    const existingUsername = await User.findOne({ username }); 
    console.log(existingUsername)
    if (existingUsername) { 
        return res.status(400).json({ message: "This username is already in use" }); 
    } 
    res.status(200).json({ message: "Username available" }); 
} 

async function addUser(req, res) { 
    console.log(req.body)
    const { lastname, firstname, username, email, password } = req.body; 
    console.log(lastname, firstname, username, email, password)
    
    try { 
        const newUser = new User({ lastname, firstname, username, email, password }); 
        await newUser.save(); 
        res.status(201).json({ message: 'User added successfully', user: newUser }); 
    } catch (error) { 
        console.log(error)
        res.status(400).json({ message: 'Error adding user', error }); 
    } 
} 

const signIn = async (req, res) => { 
    const { identifier, password } = req.body; 
    console.log(identifier,' ', password); 
    try { 
        const foundUser = await User.findOne({ $or: [{ email: identifier }, { username: identifier }] }); 
        if (!foundUser) { 
            console.log('aaaaaaaaa')
            return res.status(400).json({ msg: "User not registered" }); 
        } 
        
        if (password === foundUser.password) { 
            

            const token = jwt.sign({ id: foundUser._id, role: foundUser.role }, process.env.JWT_SECRET); 
            console.log('token')
            return res.status(200).json({ user: foundUser, token: token }); 
        } else { 
            return res.status(400).json({ msg: "Incorrect password" }); 
        } 
        
    } catch (error) { 
        console.error(error); 
        return res.status(500).json({ msg: "Server error" }); 
    }  
}; 

const getAllPlayers = async (req, res) => { 
    try { 
        const players = await FootballPlayer.find({}, "image lastname firstname _id"); 
        res.status(200).json(players); 
        
    } catch (error) {  
        console.error(error);  
        res.status(500).json({ msg: "Error retrieving players" });  
    }  
}; 

const getPlayerById = async (req, res) => {  
    const { id } = req.params;  
    try {  
        const player = await FootballPlayer.findById(id);  
        
        if (!player) {  
            return res.status(404).json({ msg: "Player not found" });  
        }  
        
        res.status(200).json(player);  
        
    } catch (error) {  
        console.error(error);  
        res.status(500).json({ msg: "Error retrieving player" });  
    }  
}; 

const addPlayer = async (req, res) => {  console.log(req.body)
    const { lastname, firstname, nicknames, difficultylevel, description } = req.body;  
    
    
    try {  
        const newPlayer = new FootballPlayer({ lastname, firstname, nicknames: nicknames.split(","), difficultylevel, description, imageCache: req.files.imageCache[0].path.split("\\")[1], image: req.files.image[0].path.split("\\")[1], }); 
        
        await newPlayer.save();  
        
        res.status(201).json({ msg: "Player added successfully", player: newPlayer }); 
        
    } catch (error) {  
        console.error(error);  
        res.status(500).json({ msg: "Error adding player", error });  
    }  
}; 

const deletePlayer = async (req, res) => {  
    const { id } = req.params;  
    
    try {  
        const deletedPlayer = await FootballPlayer.findByIdAndDelete(id); 
        
        if (!deletedPlayer) {  
            return res.status(404).json({ msg: "Player not found" });  
        } 
        
        res.status(200).json({ msg: "Player deleted successfully", player: deletedPlayer }); 
        
    } catch (error) {
         console.error(error);  
         res.status(500).json({ msg: "Error deleting player", error });
     }
}; 

const updatePlayerAttribute = async (req, res) => {
     const { id } = req.params;  
    
     try {
         const updateData = {};  
    
         if (req.files['image']) {
             updateData.image = req.files['image'][0].filename;
         }
    
         if (req.files['imageCache']) {
             updateData.imageCache = req.files['imageCache'][0].filename;
         }
    
         const { lastname, firstname, nicknames, difficultylevel, description } = req.body;
    
         updateData.lastname = lastname;
         updateData.firstname = firstname;
         updateData.nicknames = nicknames.split(",").map(nick => nick.trim());
         updateData.difficultylevel = difficultylevel;
         updateData.description = description;
    
         const updatedPlayer = await FootballPlayer.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    
         if (!updatedPlayer) {
             return res.status(404).json({ msg: "Player not found" });
         }
    
         res.status(200).json({ msg: "Attribute updated successfully", player: updatedPlayer });
    
     } catch (error) {
         console.error(error);
         res.status(500).json({ msg: "Error updating player", error });
     }
}; 

const getAllUsers = async (req, res) => {
     try {
         const { id: userId } = req.user; 
    
         const players = await User.find(
             {
                 _id: {
                     $ne: userId
                 }
             },
             "lastname firstname username email score level role _id"
         ).sort({ score: -1 }); 
    
         res.status(200).json(players);
    
     } catch (error) {
         console.error(error);
         res.status(500).json({ msg: "Error retrieving players" });
     }
}; 

async function updateUserRole(req, res) {
     const { id } = req.params; 
    
     try {
         const user = await User.findById(id);
         
         if (!user)
             return res.status(404).json({ message: 'User not found' });
         
         user.role = user.role === 'admin' ? 'user' : 'admin'; 
    
         await user.save(); 
    
         res.status(200).json({ message: 'Role updated successfully', user });
    
     } catch (error) {
         res.status(400).json({ message: 'Error updating role', error });
     }
} 

async function deleteUser(req, res) {
     const { id } = req.params; 
    
     try {
         const deletedUser = await User.findByIdAndDelete(id);
         
         if (!deletedUser)
             return res.status(404).json({ message: 'User not found' });
         
         res.status(200).json({ message: 'User deleted successfully', user: deletedUser });
    
     } catch (error) {
         res.status(400).json({ message: 'Error deleting user', error });
     }
} 

const getUsersRanking = async (req, res) => {
     try {
        await updateUserRankings()
         const players = await User.find(
             { role: "user" },
             "username score ranking"
         ).sort({
             score: -1
         });
         
         res.status(200).json(players);
    
     } catch (error) {
         console.error(error);
         res.status(500).json({ msg: "Error retrieving ranking" });
     }
}; 

const getOtherUserProfile = async (req, res) => {
     const { id } = req.params; 
    
     try {
         const player = await User.findById(id,"lastname firstname username score ranking level");
         
         if (!player)
             return res.status(404).json({ msg: "Player not found" });
         
         res.status(200).json(player);
    
     } catch (error) {
          console.error(error);
          res.status(500).json({ msg: "Error retrieving player profile" });
     }
}; 

const getUserUsername = async (req, res) => {
     try {
          const user = await User.findById(req.user.id,"username");
          
          if (!user)
              return res.status(404).json({ msg: "User not found" });
          
          res.status(200).json({ username: user.username });
    
      } catch (error) {
          console.error(error);
          res.status(500).json({ msg: "Error retrieving username" });
      }
}; 

const getUserProfile = async (req, res) => {
      try {
          const user = await User.findById(req.user.id,"lastname firstname username email password ranking level score");
          
          if (!user)
              return res.status(404).json({ msg: "User not found" });
          
          res.status(200).json(user);
    
      } catch (error) {
          console.error(error);
          res.status(500).json({ msg: "Error retrieving profile" });
      }
}; 

const updateUserProfile = async (req, res) => {
      const { id } = req.user; 
    
      const updates = req.body; 
    
      try {
          const updatedUser = await User.findByIdAndUpdate(id, updates,{ new:true , runValidators:true});
          
          if (!updatedUser)
              return res.status(404).json({msg:"User not found"});
          
          res.status(200).json({
              msg:"Profile updated successfully",
              user : updatedUser
          });

      } catch (error){
          console.error(error);
          res.status(400). json({
              msg:"Error updating profile",
              error
          })
      }
}; 

const startAttempt= async(req,res)=>{
      const{ id}= req.user;
      
      try{
           const user=await User.findById(id);
           
           if(!user)return res.status(404). json ({msg:"User not found"});
           console.log(user)
           
           const level=user.level + 1;
           let players=await FootballPlayer.find ({difficultylevel : level});
           console.log(players)
           
           if(players.length < 3){
               return  res .status(400 ). json ({msg:"Not enough players for this level"});
           }
           
           const selectedPlayers=[];
           while(selectedPlayers.length<3){
               const randomIndex=Math.floor(Math.random()*players.length);
               const player=players[randomIndex];
               selectedPlayers.push(player);
               players=players.filter((p)=> p._id.toString()!==player._id.toString());
           }
           
           return res .status(200 ). json ({players:selectedPlayers,user:user});
           
       }
       catch(error){
           console.error("Error initializing attempt:", error.message);
           return res .status(500 ). json ({msg:"Internal server error"});
       }
};

const handleVictory=async(req,res)=>{
      const{id}=req.user;
      const{playerLevels}=req.body;
      
      try{
           const user=await User.findById(id);
           
           if(!user)return res .status(404 ). json ({msg:"User not found"});
           
           const currentLevel=user.level// + 1;
           const scoreBonus=playerLevels.reduce((acc ,level)=> acc + 3*level ,0)+ currentLevel;
           user.level=currentLevel;
           user.score+=scoreBonus;
           user.tryNumber=5;
           
           await user.save();
           await updateUserRankings();
           
           return res .status(200 ). json ({
               msg:"Victory! Level and score updated",
               user,
           });

       }
       catch(error){
           console.error("Error handling victory:", error.message);
           return
       }
};

const handleFailure=async(req,res)=>{
      const{id}=req.user;
      const{guessedPlayers}=req.body;
      
      try{
           const user=await User.findById(id);
           
           if(!user)return res .status(404 ). json ({msg:"User not found"});
           
           user.tryNumber -= 1;

           if(user.tryNumber > 0){
               user.score += guessedPlayers.reduce((acc ,level)=> acc + level ,0);
               user.score=Math.max(0,user.score - (user.level + 1));
           }
           else if(user.tryNumber == 0){
               user.score += guessedPlayers.reduce((acc ,level)=> acc + level ,0);
               const previousLevel=user.level;
               if(user.level > 0){
                   user.level -= 1;
               }
               user.score=Math.max(0,user.score - 5 * (previousLevel + 1));
               user.tryNumber=5;
           }

           await user.save();
           await updateUserRankings();

           return res .status(200 ). json ({
               msg:"Failure. Level, score and attempts updated",
               user,
           });

       }
       catch(error){
           console.error("Error handling failure:", error.message);
           return
       }
};



const searchPlayers = async (req, res) => {
    const { username } = req.query;
  
    try {
      const user = await User.find({
        username: { $regex: `^${username}`, $options: "i" }, 
      }).select("_id username"); 
  
      res.status(200).json(user);
    } catch (error) {
      console.error("Error searching Users:", error);
      res.status(500).json({ message: "Error searching Users" });
    }
  };

module.exports={
   checkEmail,
   checkUsername,
   addUser,
   signIn,
   getAllPlayers,
   getPlayerById,
   addPlayer,
   deletePlayer,
   updatePlayerAttribute,
   getAllUsers,
   deleteUser,
   updateUserRole,
   getUsersRanking,
   getOtherUserProfile,
   getUserUsername,
   getUserProfile,
   updateUserProfile,
   handleFailure,
   handleVictory,
   startAttempt,searchPlayers
};
