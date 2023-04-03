import bodyParser from 'body-parser';
import express from 'express';
import mysql from 'mysql2/promise';

async function main() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'notSecureChangeMe',
    database: 'DAGA'
  });

  const app = express();
  app.use(bodyParser.urlencoded({extended: true}))
  app.use(express.static('public'))
  app.set('view engine', 'ejs')

  app.get('/', function (httpRequest, httpResponse) {
    httpResponse.render('pages/index')
  });

  app.get('/panier', async function (httpRequest, httpResponse) {
    const [rows, fields] = await connection.execute('SELECT * FROM orders');
    console.log(`products`, rows);
    httpResponse.render('pages/panier', { orders: rows });
  });

  app.post('/clear-orders', async function (req, res, next) {

    await connection.execute('TRUNCATE TABLE orders');
    res.redirect('/panier');

  });

  app.post('/process-order', async function (req, res, next) {
      // Clear the orders table
      await connection.execute('TRUNCATE TABLE orders');
      // Redirect to the home page
      res.redirect('/confirm');
  });

  app.get('/confirm', function (httpRequest, httpResponse) {
    httpResponse.render('pages/confirm')
    setTimeout(function () {
      httpResponse.redirect('/');
    }, 5000);
  });

  app.get('/contact', function (httpRequest, httpResponse) {
    httpResponse.render('pages/contact')
  });
  app.get('/simulateur', async function (httpRequest, httpResponse, next) {
      const [rows, fields] = await connection.execute('SELECT * FROM products');
      console.log(`products`, rows);
      httpResponse.render('pages/simulateur', { products: rows });
  });

  app.post('/simulateur', async function (req, res, next) {
    const itemName = req.body.item_name;
    const price = req.body.price;
    const sql = `INSERT INTO orders (item_name, price) VALUES (?, ?)`;
    try {
      const [result] = await connection.execute(sql, [itemName, price]);
      console.log(result);
      res.redirect('/panier');
    } catch (error) {
      console.log(error);
      next(error);
    }
  });



  app.listen('3003');

}

main()
