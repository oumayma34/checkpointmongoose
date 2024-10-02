// Configuration et paramétrage de la connexion à la base de données
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const express = require('express');
require('dotenv').config();

const app = express();
const PORT = 3001;

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('\x1b[1m\x1b[33m%s\x1b[0m', '--------------Installing and setting up Mongoose------------------\n\n');
    console.log('L\'application est connectée à la base de données MongoDB');
  })
  .catch(err => {
    console.error('Erreur de connexion à la base de données MongoDB :', err);
  });

// Création du schéma Mongoose pour Person
const personSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, default: 0 },
  favoriteFoods: { type: [String], default: [] }
});

const Person = mongoose.model('Person', personSchema);
console.log('\x1b[1m\x1b[33m%s\x1b[0m', '------------Create a person with this prototype------------\n\n');
console.log(Person);

// Fonction pour insérer une personne dans la collection "Person"
const createPerson = async () => {
  try {
    const person = new Person({ name: 'wassim', age: 30, favoriteFoods: ['music', 'development', 'pizza'] });
    const savedPerson = await person.save();
    console.log('\x1b[1m\x1b[33m%s\x1b[0m', '------------Create and Save a Record of a Model------------\n\n');
    console.log(`La personne ${savedPerson.name} a été créée dans la base de données`);
    return savedPerson;
  } catch (err) {
    console.error('Erreur lors de la création de la personne :', err);
  }
}

// Fonction pour insérer plusieurs personnes dans la collection "Person"
const arrayOfPersons = [
  { name: 'wafa', age: 29, favoriteFoods: ["pizza", "sandwich"] },
  { name: 'mahran', age: 9, favoriteFoods: ["pizza", "spaghetti"] },
  { name: 'nader', age: 15, favoriteFoods: ["pizza", "mlwai"] },
  { name: 'samira', age: 22, favoriteFoods: ["pizza", "cuisse panné"] },
  { name: 'wissem', age: 33, favoriteFoods: ["makloub", "escalope grillé"] }
];

const createManyPersons = async () => {
  try {
    const data = await Person.create(arrayOfPersons);
    console.log('\x1b[1m\x1b[33m%s\x1b[0m', '------------Create Many Records with model.create()------------\n\n');
    console.log('Voici les personnes créées dans la base de données avec succès:', data.map(person => person.name), 'avec IDs:', data.map(person => person._id));
    return data;
  } catch (err) {
    console.error('Erreur lors de la création de plusieurs personnes :', err);
  }
}

// Fonction pour rechercher par nom de personne
const findOnePerson = async (personName) => {
  try {
    const data = await Person.find({ name: personName });
    const count = await Person.countDocuments({ name: personName });
    console.log('\x1b[1m\x1b[33m%s\x1b[0m', '------------Use model.find() to Search Your Database------------\n\n');
    console.log('Les personnes trouvées de nom', personName, 'sont:', count, 'avec les IDs:', data.map(person => person._id));
    return data, count;
  } catch (err) {
    console.error('Erreur lors de la recherche par nom :', err);
  }
}

// Fonction pour rechercher avec méthode findOne une nourriture favorite
const findOneFood = async (food) => {
  try {
    const data = await Person.findOne({ favoriteFoods: food });
    const persons = await Person.find({ favoriteFoods: food });
    const count = await Person.countDocuments({ favoriteFoods: food });
    console.log('\x1b[1m\x1b[33m%s\x1b[0m', '------------Use model.findOne() to Return a Single Matching Document from Your Database------------\n\n');
    console.log('La première personne dans la base avec la nourriture', food, 'est :', data.name, 'parmi', count, 'qui aiment cette nourriture.');
    return data, count, persons;
  } catch (err) {
    console.error('Erreur lors de la recherche par nourriture :', err);
  }
}

// Fonction pour rechercher avec _id de personne
const findById = async (personId) => {
  try {
    const data = await Person.findById(new ObjectId(personId));
    console.log('\x1b[1m\x1b[33m%s\x1b[0m', '------------Use model.findById() to Search Your Database By _id------------\n\n');
    console.log('La personne :', data.name, 'avec ID :', personId);
    return data;
  } catch (err) {
    console.error('Erreur lors de la recherche par ID :', err);
  }
}

// Fonction pour trouver une personne par ID, ajouter une nourriture favorite et enregistrer dans la base de données
const updateFavoriteFood = async (personId) => {
  try {
    const data = await Person.findById(new ObjectId(personId));
    const oldFavorites = data.favoriteFoods;
    console.log('\x1b[1m\x1b[33m%s\x1b[0m', '------------Perform Classic Updates by Running Find, Edit, then Save------------\n\n');
    console.log(`Ancien favoris de l'ID ${personId} :`, oldFavorites);
    data.favoriteFoods.push('hamburger');
    const updatedPerson = await data.save();
    console.log('Mis à jour avec succès. Nouveaux favoris :', updatedPerson.favoriteFoods);
    return updatedPerson;
  } catch (err) {
    console.error('Erreur lors de la mise à jour des favoris :', err);
  }
};

// Fonction pour mettre à jour l'âge d'une personne
const updatePersonAge = async (personName) => {
  try {
    const person = await Person.findOne({ name: personName });
    console.log('\x1b[1m\x1b[33m%s\x1b[0m', '------------Perform New Updates on a Document Using model.findOneAndUpdate()------------\n\n');
    console.log('Ancien âge de', person.name, ':', person.age);
    const updatedPerson = await Person.findOneAndUpdate(
      { name: personName },
      { age: 20 },
      { new: true }
    );
    console.log(`Âge de ${person.name} mis à jour à 20 :`, updatedPerson.age);
    return updatedPerson;
  } catch (err) {
    console.error('Erreur lors de la mise à jour de l\'âge :', err);
  }
};

// Fonction pour effacer un document avec clé de recherche _id
const deletePersonById = async (personId) => {
  try {
    const data = await Person.findByIdAndDelete(new ObjectId(personId));
    console.log('\x1b[1m\x1b[33m%s\x1b[0m', '------------Delete One Document Using model.findByIdAndRemove------------\n\n');
    console.log('Personne supprimée :', data.name);
    return data;
  } catch (err) {
    console.error('Erreur lors de la suppression de la personne :', err);
  }
};

// Fonction pour effacer plusieurs documents avec clé de recherche nom de personne
const deleteManyPersons = async (personName) => {
  try {
    const result = await Person.deleteMany({ name: personName });
    console.log('\x1b[1m\x1b[33m%s\x1b[0m', '------------Delete Many Documents with model.remove()------------\n\n');
    console.log('Personnes supprimées :', result.deletedCount);
    return result;
  } catch (err) {
    console.error('Erreur lors de la suppression de plusieurs personnes :', err);
  }
};

// Fonction pour filtrer avec des paramètres spécifiques
const findPizza = async (food) => {
  try {
    const data = await Person.find({ favoriteFoods: food }).limit(4).select({ name: 1, _id: 0 }).exec();
    console.log('\x1b[1m\x1b[33m%s\x1b[0m', '------------Chain Search Query Helpers to Narrow Search Results------------\n\n');
    console.log(data);
  } catch (err) {
    console.error('Erreur lors de la recherche par nourriture :', err);
  }
}

// Fonction pour fermer la connexion à MongoDB
const closeConnection = () => {
  mongoose.connection.close()
    .then(() => {
      console.log('\x1b[1m\x1b[33m%s\x1b[0m', '--------------Fermeture de la connexion avec la base de données------------------\n\n');
      console.log('Connexion MongoDB fermée');
    })
    .catch(err => {
      console.error('Erreur lors de la fermeture de la connexion MongoDB :', err);
    });
};

app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port http://localhost:${PORT}`);
});

// Fonction principale asynchrone pour exécuter le code
(async () => {
  try {
    //const IdTest = '668ee98f5acc8a5a4925c3e4';
    //const IdTest2 = '668ee98f5acc8a5a4925c3e5';
   // const IdTest3 = '668ee98f5acc8a5a4925c3e7';
    const name1 = 'mahran';
    const name2 = 'wafa';
    const food = 'makloub';

    await createPerson();
    await createManyPersons();
    await findOnePerson(name2);
    await findOneFood(food);
    //await findById(IdTest);
    //await updateFavoriteFood(IdTest2);
    await updatePersonAge(name1);
   // await deletePersonById(IdTest3);
    await deleteManyPersons('wassim');
    await findPizza('pizza');

  } catch (error) {
    console.error('Erreur dans la fonction principale :', error);
  } finally {
    closeConnection();
  }
})();