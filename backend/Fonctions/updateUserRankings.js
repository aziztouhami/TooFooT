const User = require('../Model/User'); 

const updateUserRankings = async () => {
  try {
    const users = await User.find({}).sort({ score: -1 });

    let currentRank = 0; 
    let lastScore = null; 

    for (let i = 0; i < users.length; i++) {
      if (users[i].score !== lastScore) {
        currentRank = i + 1; 
        lastScore = users[i].score; 
      }//
      users[i].ranking = currentRank; 
      await users[i].save(); 
    }

    console.log('Ranking updated successfully');
  } catch (error) {
    console.error(' An error occurred :', error);
  }
};

module.exports = updateUserRankings;
