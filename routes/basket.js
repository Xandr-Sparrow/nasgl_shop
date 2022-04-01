// подключения модулей require('название или путь с названием и расширением')
const express = require('express'); // сам фреймворк express
const path = require('path'); // для путей файлов на разных ОС
const basket = express.Router(); // опеределение роутера
const fs = require("fs"); // подключения базы продуктов

// проверка карзины для пользователей
function user_basket_check_in_basket(user_id) {
  let par;
  try {
    let base_users = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "bases", "users.json"), 'utf8'));
    base_users.forEach((item) => {
      if (item.user_id === user_id) {
        par = item.basket;
      }
    })
  } catch (e) {
    console.error(e)
  }
  return par;
}

// обновление карзины для пользователей
function user_basket_update_in_basket(user_id, product_to_basket) {
  if (!product_to_basket) {
    product_to_basket = []
  }
  let par;
  try {
    let base_users = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "bases", "users.json"), 'utf8'));
    base_users.forEach((item) => {
      if (item.user_id === user_id) {
        item.basket = product_to_basket
        par = item.basket;
      }
    })
    let fail = JSON.stringify(base_users, null, 2).toString();
    fs.writeFileSync(path.join(__dirname, "..", "bases", "users.json"), fail, 'utf8');
  } catch (e) {
    console.error(e)
  }
  return par;
}

// страница корзины
basket.get("/", function (req, res, next) {
  if (req.cookies.permission) {
    let basket = user_basket_check_in_basket(req.cookies.permission.user_id)
    if (basket.length === 0) {
      basket = null
    }
    res.render("block_basket-users", {
      title: "Корзина",
      products: basket
    });
  } else {
    let basket = req.cookies.basket;
    if (basket && basket.length === 0) {
        basket = null
      }
    res.render("block_basket-guest", {
      title: "Корзина",
      products: basket
    });
  }
});

// удаление из карзины
basket.post("/", function (req, res, next) {
  let arr_to_basket = req.cookies.basket;
  let product_del_basket = req.body.product

  if (req.cookies.permission) {
    let user_basket = user_basket_check_in_basket(req.cookies.permission.user_id);
    let product_new_basket_user = user_basket.filter((element, index, array) =>
      element.id !== product_del_basket)
    user_basket_update_in_basket(req.cookies.permission.user_id, product_new_basket_user)
    res.redirect("/basket")
    res.end();
  } else {
    let product_basket = arr_to_basket.filter(item =>
      item.id !== product_del_basket
    );
    res.cookie("basket", product_basket);
    res.redirect("/basket")
    res.end();
  }
});

// эексорт модуля маршрута
module.exports = basket; // экспорт как basket
