// подключения модулей require('название или путь с названием и расширением')
const express = require('express'); // подключение express
const path = require("path"); // для путей файлов на разных ОС
const products = express.Router(); // опеределение роутера
const fs = require("fs"); // подключения базы продуктов

// проверка карзины для пользователей
function user_basket_check(id_user) {
  let par;
  try {
    let base_users = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "bases", "users.json"), 'utf8'));
    base_users.forEach(item => {
      if (item.user_id === id_user) {
        par = item.basket
      }
    })
    console.log(par)
  } catch (e) {
    console.error(e)
  }
  return par;
}

// обновление карзины для пользователей
function user_basket_update(user_id, product_to_basket) {
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

// поиск товараврой по id
function products_id(id) {
  let arr;
  try {
    let bases_products = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "bases", "products.json"), 'utf8'));
    bases_products.forEach((item, index, array) => {
      if (item.id === id) {
        arr = item;
      }
    })
  } catch (e) {
    console.error(e);
    setTimeout(() => {
      return products_id(id)
    }, 2000);
  }
  return arr;
}

// Страница товаров
products.get("/", function (req, res, next) {
  console.log(req.cookies.basket)
  try {
    let bases_products = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "bases", "products.json"), 'utf8'));
    if (req.cookies.permission) {
      res.render("block_products-users", {
        title: "Товары",
        products: bases_products,
      });
    } else {
      res.render("block_products-guest", {
        title: "Товары",
        products: bases_products,
      });
    }
  } catch (e) {
    console.error(e);
    res.render("block_error", {
      message: "Ошибка чтения базы",
    });
  }
});

// добавление в карзину
products.post("/", function (req, res, next) {
  let product_to_basket = req.body.product
  let product_to_basket_id = products_id(product_to_basket)

  if (req.cookies.permission) {
    let basket = user_basket_check(req.cookies.permission.user_id)
    let product_to_basket_clean = basket.filter((item) => item.id !== product_to_basket_id.id)
    product_to_basket_clean.push(product_to_basket_id)
    user_basket_update(req.cookies.permission.user_id, product_to_basket_clean)
    res.redirect("products");
  } else {
    let arr_to_basket;
    if (!req.cookies.basket) {
      arr_to_basket = [];
    } else {
      arr_to_basket = req.cookies.basket;
    }
    let product_to_basket_clean = arr_to_basket.filter(item => item.id !== product_to_basket_id.id)
    product_to_basket_clean.push(product_to_basket_id)
    res.cookie("basket", product_to_basket_clean);
    res.redirect("products");
  }
});

// эексорт модуля маршрута
module.exports = products; // экспорт как products
