const express = require('express');
const users = express.Router();

// удалмить это
users.get("/1", function (req, res, next) {
  res.cookie('permission', "proverka");
  res.cookie('user', "1");
  res.render("block_home-guest", {
    title: "Добро пожаловать на Черный Рынок Назгл",
    title_img: "/img/nasgl.jpg",
  });
});

module.exports = users;
