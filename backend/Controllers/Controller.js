const User = require('../Model/User');
const FootballPlayer = require('../Model/FootballPlayer');

const jwt = require("jsonwebtoken");
const updateUserRankings= require('../Fonctions/updateUserRankings')
require('dotenv').config();


async function checkEmail(req, res) {
  const { email } = req.body;

  if (!email || !/.+@.+\..+/.test(email)) {
    return res.status(400).json({ message: "Adresse e-mail invalide." });
  }

  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    return res.status(400).json({ message: "Cet e-mail est déjà utilisé." });
  }

  res.status(200).json({ message: "Adresse e-mail disponible." });
}

async function checkPseudo(req, res) {
  const { pseudo } = req.body;

  if (!pseudo) {
    return res.status(400).json({ message: "Le pseudo est requis." });
  }

  const existingPseudo = await User.findOne({ pseudo });
  if (existingPseudo) {
    return res.status(400).json({ message: "Ce pseudo est déjà utilisé." });
  }

  res.status(200).json({ message: "Pseudo disponible." });
}



async function addUser(req, res) {
  const { nom, prenom, pseudo,  email, password } = req.body;
  try {
    const newUser = new User({ nom, prenom, pseudo,  email, password });
    await newUser.save();
    res.status(201).json({ message: 'Utilisateur ajouté avec succès', user: newUser });
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de l’ajout de l’utilisateur', error });
  }
}













const signIn = async (req, res) => {
  const { identifier, password } = req.body; // `identifier` peut être l'email ou le pseudo
  console.log(identifier,'           ', password)
  try {
    // Rechercher l'utilisateur par email ou pseudo
    const foundUser = await User.findOne({
      $or: [{ email: identifier }, { pseudo: identifier }],
    });

    if (!foundUser) {
      return res.status(400).json({ msg: "Utilisateur non enregistré" });
    }

    // Vérifier le mot de passe
    if (password === foundUser.password) {
      const token = jwt.sign(
        { id: foundUser._id, role: foundUser.role },
        process.env.JWT_SECRET
      );
      return res.status(200).json({ user: foundUser, token: token });
    } else {
      return res.status(400).json({ msg: "Mot de passe incorrect" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Erreur du serveur" });
  }
};









const getAllPlayers = async (req, res) => {
  try {
    const players = await FootballPlayer.find({}, "nom prenom _id"); 
    res.status(200).json(players);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Erreur lors de la récupération des joueurs" });
  }
};

const getPlayerById = async (req, res) => {
  const { id } = req.params;

  try {
    const player = await FootballPlayer.findById(id);
    console.log(player.image)
    if (!player) {
      return res.status(404).json({ msg: "Joueur non trouvé" });
    }
    res.status(200).json(player);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Erreur lors de la récupération du joueur" });
  }

};


const addPlayer = async (req, res) => {
  const { nom, prenom, nicknames, niveauDifficulte, description } = req.body;

  try {
    const newPlayer = new FootballPlayer({
      nom,
      prenom,
      nicknames: nicknames.split(","), 
      niveauDifficulte,
      description,
      imageCache: req.files.imageCache[0].path.split("\\")[1], 
      image: req.files.image[0].path.split("\\")[1],      
    });

    await newPlayer.save();
    res.status(201).json({ msg: "Joueur ajouté avec succès", player: newPlayer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Erreur lors de l'ajout du joueur", error });
  }
};



const deletePlayer = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedPlayer = await FootballPlayer.findByIdAndDelete(id);
    if (!deletedPlayer) {
      return res.status(404).json({ msg: "Joueur non trouvé" });
    }
    res.status(200).json({ msg: "Joueur supprimé avec succès", player: deletedPlayer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Erreur lors de la suppression du joueur", error });
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

    const { nom, prenom, nicknames, niveauDifficulte, description } = req.body;
    updateData.nom = nom;
    updateData.prenom = prenom;
    updateData.nicknames = nicknames.split(",").map(nick => nick.trim());
    updateData.niveauDifficulte = niveauDifficulte;
    updateData.description = description;

    const updatedPlayer = await FootballPlayer.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

    if (!updatedPlayer) {
      return res.status(404).json({ msg: "Joueur non trouvé" });
    }
    
    res.status(200).json({ msg: "Attribut mis à jour avec succès", player: updatedPlayer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Erreur lors de la mise à jour du joueur", error });
  }
};












const getAllUsers = async (req, res) => {
  try {
    // L'identifiant de l'utilisateur connecté est extrait du token
    const { id: userId } = req.user;

    // Récupérer tous les utilisateurs sauf l'utilisateur connecté
    const players = await User.find(
      { _id: { $ne: userId } }, // Filtrer pour exclure l'utilisateur connecté
      "nom prenom pseudo email score classement role _id" // Champs à inclure
    );

    res.status(200).json(players);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Erreur lors de la récupération des joueurs" });
  }
};


async function updateUserRole(req, res) {
  const { id } = req.params; // ID de l'utilisateur
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    // Inversion du rôle (toggle)
    user.role = user.role === 'admin' ? 'user' : 'admin';
    await user.save();

    res.status(200).json({ message: 'Rôle mis à jour avec succès', user });
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la mise à jour du rôle', error });
  }
}

async function deleteUser(req, res) {
  const { id } = req.params; 
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.status(200).json({ message: 'Utilisateur supprimé avec succès', user: deletedUser });
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la suppression de l’utilisateur', error });
  }
}











const getUsersRanking = async (req, res) => {
  try {
    const players = await User.find({ role: "user" }, "pseudo score classement")
      .sort({ score: -1 });
    res.status(200).json(players);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Erreur lors de la récupération du classement" });
  }
};

const getOtherUserProfile = async (req, res) => {
  const { id } = req.params;
  try {
    const player = await User.findById(id, "nom prenom pseudo score classement niveau");
    if (!player) return res.status(404).json({ msg: "Joueur non trouvé" });
    res.status(200).json(player);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Erreur lors de la récupération du profil du joueur" });
  }
};

const getUserPseudo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id, "pseudo"); // req.user comes from the middleware
    if (!user) return res.status(404).json({ msg: "Utilisateur non trouvé" });
    res.status(200).json({ pseudo: user.pseudo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Erreur lors de la récupération du pseudo" });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id, "nom prenom email classement niveau score");
    if (!user) return res.status(404).json({ msg: "Utilisateur non trouvé" });
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Erreur lors de la récupération du profil" });
  }
};

const updateUserProfile = async (req, res) => {
  const { id } = req.user; 
  const updates = req.body; 
  
  try {
    const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!updatedUser) return res.status(404).json({ msg: "Utilisateur non trouvé" });
    res.status(200).json({ msg: "Profil mis à jour avec succès", user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(400).json({ msg: "Erreur lors de la mise à jour du profil", error });
  }
};

























const startAttempt = async (req, res) => {
  const { id } = req.user;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ msg: "Utilisateur non trouvé" });

    const level = user.niveau + 1;
    let players = await FootballPlayer.find({ niveauDifficulte: level });
    if (players.length < 3) {
      return res.status(400).json({ msg: "Pas assez de joueurs pour ce niveau." });
    }

    const selectedPlayers = [];
    while (selectedPlayers.length < 3) {
      const randomIndex = Math.floor(Math.random() * players.length);
      const player = players[randomIndex];
      selectedPlayers.push(player);
      players = players.filter((p) => p._id.toString() !== player._id.toString());
    }

    res.status(200).json({ players: selectedPlayers,user:user });
  } catch (error) {
    console.error("Erreur lors de l'initialisation de la tentative :", error.message);
    res.status(500).json({ msg: "Erreur interne du serveur" });
  }
};

const handleVictory = async (req, res) => {
  const { id } = req.user;
  const { playerLevels } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ msg: "Utilisateur non trouvé" });

    const currentLevel = user.niveau + 1;
    const scoreBonus = playerLevels.reduce((acc, level) => acc + 3 * level, 0) + currentLevel;

    user.niveau = currentLevel;
    user.score += scoreBonus;
    user.tryNumber = 5;

    await user.save();
    await updateUserRankings();

    res.status(200).json({
      msg: "Victoire! Niveau et score mis à jour.",
      user,
    });
  } catch (error) {
    console.error("Erreur lors du traitement de la victoire :", error.message);
    res.status(500).json({ msg: "Erreur interne du serveur" });
  }
};

const handleFailure = async (req, res) => {
  const { id } = req.user;
  const { guessedPlayers } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ msg: "Utilisateur non trouvé" });

    user.tryNumber -= 1;
console.log(user.tryNumber)
console.log(user.tryNumber== 0)

    if (user.tryNumber > 0) {

      user.score += guessedPlayers.reduce((acc, level) => acc + level, 0);
      user.score = Math.max(0, user.score - (user.niveau + 1));
    } 
    else if (user.tryNumber == 0) {
      user.score += guessedPlayers.reduce((acc, level) => acc + level, 0);
      const previousLevel = user.niveau;
      if (user.niveau > 0) {
        user.niveau -= 1;
      }
      user.score = Math.max(0, user.score - 5 * (previousLevel + 1));
      user.tryNumber = 5;
    }

    await user.save();
    await updateUserRankings();

    res.status(200).json({
      msg: "Échec. Niveau, score, et essais mis à jour.",
      user,
    });
  } catch (error) {
    console.error("Erreur lors du traitement de l'échec :", error.message);
    res.status(500).json({ msg: "Erreur interne du serveur" });
  }
};






module.exports = {checkEmail,checkPseudo,addUser,

  signIn,

getAllPlayers,getPlayerById,addPlayer, deletePlayer, updatePlayerAttribute,

getAllUsers,  deleteUser,updateUserRole,

getUsersRanking, getOtherUserProfile, getUserPseudo, getUserProfile, updateUserProfile ,
 
  
handleFailure,handleVictory,startAttempt

};
