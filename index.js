import bodyParser from 'body-parser';
import express from 'express';


const app = express();
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static('public'))
app.set('view engine','ejs')

app.get ('/', function (httpRequest, httpResponse, next )
{
  //log de la requete entrante
  console.log('objet request: ', httpRequest);
  //envoie de la reponse http
  httpResponse.render('pages/index')
});
app.get ('/contact', function (httpRequest, httpResponse, next ) {
  httpResponse.render('pages/contact')
});
app.get ('/simulateur', function (httpRequest, httpResponse, next ) {
  httpResponse.render('pages/simulateur')
});

app.listen('3003');