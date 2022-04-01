// подключения модулей require('название или путь с названием и расширением')
const express = require('express'); // подключение express
const main = express.Router(); // опеределение роутера


// Главная страница
main.get("/", function (req, res, next) {
  if (req.cookies.permission) {
    res.render("block_home-users", {
      title: "Добро пожаловать на Черный Рынок Назгл",
      title_img: "/img/nasgl.jpg",
    });
  } else {
    console.log(req.cookies.permission);
    res.render("block_home-guest", {
      title: "Добро пожаловать на Черный Рынок Назгл",
      title_img: "/img/nasgl.jpg",
    });
  }
});

// эексорт модуля маршрута
module.exports = main; // экспорт как main
