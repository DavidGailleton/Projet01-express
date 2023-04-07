// Importation des modules nécessaires
import bodyParser from 'body-parser';
import express from 'express';
import mysql from 'mysql2/promise';

// création de la fonction main qui créer une connection avec le base SQL
async function main() {
  // Connexion à la base de données SQL
  const connection = await mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'notSecureChangeMe',
    database: 'DAGA'
  });
  // Initialisation de l'application Express
  const app = express();
  // Configuration de l'application Express
  app.use(bodyParser.urlencoded({extended: true}))
  app.use(express.static('public'))
  app.set('view engine', 'ejs')

  // Définition de la route pour la page d'accueil
  app.get('/', function (httpRequest, httpResponse) {
    // Renvoie la réponse HTTP en rendant la page 'index.ejs'
    httpResponse.render('pages/index')
  });

  // Définition de la route pour la page du panier
  app.get('/panier', async function (httpRequest, httpResponse) {
    // Création d'une variable contenant le tableau orders contenu dans la base de données SQL
    const [rows, fields] = await connection.execute('SELECT * FROM orders');
    // Affichage des données dans la console
    console.log(`products`, rows);
    // Renvoie la réponse HTTP en rendant la page 'panier.ejs' avec les données 'orders'
    httpResponse.render('pages/panier', { orders: rows });
  });
  // Définition de la route pour la suppression des éléments du panier
  app.post('/clear-orders', async function (req, res, next) {
    // Suppression des éléments dans la table 'orders' de la base de données SQL
    await connection.execute('TRUNCATE TABLE orders');
    // Redirection vers la page 'panier'
    res.redirect('/panier');

  });
  // Définition de la route pour le traitement de la commande
  app.post('/process-order', async function (req, res, next) {
    // Suppression des éléments dans la table 'orders' de la base de données SQL
      await connection.execute('TRUNCATE TABLE orders');
    // Redirection vers la page de confirmation
      res.redirect('/confirm');
  });
  // Définition de la route pour la page de confirmation
  app.get('/confirm', function (httpRequest, httpResponse) {
    // Renvoie la réponse HTTP en rendant la page 'confirm.ejs'
    httpResponse.render('pages/confirm')
    // Redirection vers la page d'accueil après 5 secondes
    setTimeout(function () {
      httpResponse.redirect('/');
    }, 5000);
  });
  // Définition de la route pour la page de contact
  app.get('/contact', function (httpRequest, httpResponse) {
    // Renvoie la réponse HTTP en rendant la page 'contact.ejs'
    httpResponse.render('pages/contact')
  });

  // Définition de la route pour la page du store
  app.get('/store', async function (httpRequest, httpResponse, next) {
    // Création d'une variable contenant le tableau products contenu dans la base de données SQL
      const [rows, fields] = await connection.execute('SELECT * FROM products');
    // Affichage des données dans la console
      console.log(`products`, rows);
      httpResponse.render('pages/store', { products: rows });
  });

// Renvoie la réponse HTTP en rendant la page 'store.ejs' avec les données
  app.post('/store', async function (req, res, next) {
    // Récupération des informations envoyées dans le corps de la requête POST
    const itemName = req.body.item_name;
    const price = req.body.price;
    // Création de la requête SQL à partir des informations récupérées
    const sql = `INSERT INTO orders (item_name, price) VALUES (?, ?)`;
    try {
      // Exécution de la requête SQL pour insérer les informations dans la base de données
      const [result] = await connection.execute(sql, [itemName, price]);
      console.log(result);
      // Redirection vers la page du panier
      res.redirect('/panier');
    } catch (error) {
      console.log(error);
      next(error);
    }
  });


  // Démarrage du serveur Express sur le port 3003
  app.listen('3003');

}
// Appel de la fonction main pour lancer l'application
main()
