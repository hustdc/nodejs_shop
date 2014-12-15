var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session')
var flash = require('connect-flash');
var route = require('./lib/route');
var filter = require('./lib/filter');

var app = express();


app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('app_domain', 'localhost:8888');
app.set('img_path', '/images');
app.use(express.static('public'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(session({secret: 'keyboard cat'}))
app.use(flash()); // error success message

/* admin management */
/* home controller */
app.get('/admin/', route.adminexec('index'));
app.post('/admin/home/', route.adminexec('home'));
app.get('/admin/home/', filter.authorize, route.adminexec('home'));
app.get('/admin/shop/', filter.authorize, route.adminexec('shop').list);

app.get('/admin/shop/pg:page.html', filter.authorize, route.adminexec('shop').list);

/* shop controller */
app.get('/admin/shop/:shopId/addarticle/', filter.authorize, route.adminexec('article').addArticle);
app.post('/admin/shop/:shopId/addarticlecomplete/', filter.authorize, route.adminexec('article').addArticleComplete);
//app.get('/admin/shop/:id/', filter.authorize, route.adminexec('shop').detail);
app.get('/admin/addshop/', filter.authorize, route.adminexec('shop').addShop);
app.get('/admin/cities/', filter.authorize, route.adminexec('shop').getCities);
app.post('/admin/createshopcomplete/', filter.authorize, route.adminexec('shop').addShopComplete);

app.get('/admin/shop/:id/additem/', filter.authorize, route.adminexec('item').addItem);
app.post('/admin/additemcomplete/', filter.authorize, route.adminexec('item').addItemComplete);


/* user display */
app.get('/shop/:id/', route.exec('shop').detail);

app.get('/item/:id.html', route.exec('item').detail);

app.get('/shop/:id/list/', route.exec('list').list);
app.get('/shop/:id/list/pg:page.html', route.exec('list').list);
app.get('/shop/:id/list/a:a?b:b?c:c?d:d?/', route.exec('list').list);
app.get('/shop/:id/list/a:a?b:b?c:c?d:d/pg:page.html', route.exec('list').list);
app.get('/shop/:id/list/a:a?b:b?c:c?d:d?e:e/', route.exec('list').list);
app.get('/shop/:id/list/a:a?b:b?c:c?d:d?e:e/pg:page.html', route.exec('list').list);

app.get('/shop/:id/introduce/', route.exec('shop').introduce);
app.listen(8888);
console.log('server start at port 8888');
