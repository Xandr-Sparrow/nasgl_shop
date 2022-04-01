// подключения модулей require('название или путь с названием и расширением')
const create_error = require('http-errors'); // для создания ошибок HTTP
const express = require('express'); // сам фреймворк express
const path = require('path'); // для путей файлов на разных ОС
const cookie_parser = require('cookie-parser'); // для анализа куков
const logger = require('morgan'); // для журналирования, регистрации запросов HTTP и другой информации
const fileUpload = require("express-fileupload");

// пути основных роутеров
const routes_main = require(path.join(__dirname, 'routes', 'main')); // роутер для главной страници
const routes_products = require(path.join(__dirname, 'routes', 'products')); // роутер для страници товаров
const routes_my_products = require(path.join(__dirname, 'routes', 'my_products')); // роутер для страници моих товаров
const routes_basket = require(path.join(__dirname, 'routes', 'basket')); // роутер для корзины
const routes_auth = require(path.join(__dirname, 'routes', 'auth')); // роутер для страници авторизации
const routes_users = require(path.join(__dirname, 'routes', 'users')); // роутер для пользователей


// созадния серверв
const app = express(); // создания приложения express для работы
const port = 3000; // порт подключения
const host = "127.0.0.1"; // адрес сервера

// настройка движка представления PUG
app.set('views', path.join(__dirname, 'views')); // присваение (.set) шаблонам 'views' пути папки с шаблонами
app.set('view engine', 'pug'); // присовение (.set) движка 'view engine' шаблонов PUG

// подключение модулей (.use любые методы для HTTP, без передачи маршрута для всех маршрутов)
app.use(logger('dev')); // использование жцрнала в режиме "разработке"
app.use(express.json()); // анализ входящий JSON для всех путей, встроено в express
app.use(express.urlencoded({ extended: false })); // анализ входящих закодированых URL для всех путей, встроено в express, по умолчанию false
app.use(cookie_parser()); // анализ файлов куков
app.use(express.static(path.join(__dirname, 'public'))); // папка для статичский файлов фронтенда, встроено в express

app.use(fileUpload({}));


// подключения роутеров
app.use('/', routes_main); // подключения роутера для главной страници
app.use('/products', routes_products); // подключения роутера для страници товаров
app.use('/my_products', routes_my_products); // подключения роутера для страници моих товаров
app.use('/basket', routes_basket); // подключения роутера для страници корзины
app.use('/', routes_auth); // подключения роутера для страници авторизации
app.use('/', routes_users); // подключения роутера users

// перехватить 404 и перенаправить в обработчик ошибок
app.use(function(req, res, next) {
  next(create_error(404)); // передача в функцию создания ошибки 404
});

// обработка ошибок
app.use(function(err, req, res, next) {
  // установить локальные значения, выдает ошибку только в разработке
  res.locals.message = err.message; // вывод в переменую шаблона (.locals.message) сообщения с ошибкой (err.message)
  res.locals.error = req.app.get('env') === 'development' ? err : {}; // выводить сообщения об ошибки в режиме разработчика

  // отображения страници с ошибкой
  res.status(err.status || 500); // задаёт состояние HTTP ошибки для ответа клиенту
  res.render('block_error'); // Вывод сообщения в шаблон отрисовки
});

// запуск прослушивания портта и адреса
app.listen(port, host, function () {
  console.log(`Серевер запущен по адресу http://${host}:${port}`)
})

// для эксорта как модуля с названием app
module.exports = app;
