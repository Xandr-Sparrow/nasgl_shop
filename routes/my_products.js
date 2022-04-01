// подключения модулей require('название или путь с названием и расширением')
const express = require('express'); // сам фреймворк express
const path = require('path'); // для путей файлов на разных ОС
const my_products = express.Router(); // опеределение роутера
const fs = require("fs"); // подключения базы продуктов
const uuid = require("uuid") // иникальные id использование uuid.v4()
const fileUpload = require('express-fileupload');

const app = express();
app.use(fileUpload({}));

function products_admin() {
  try {
    return JSON.parse(fs.readFileSync(path.join(__dirname, "..", "bases", "products.json"), 'utf8'));
  } catch (e) {
    console.error(e);
  }
}

// выдача товаро по id пользователя
function products(id_user) {
  let arr = [];
  try {
    let bases_products = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "bases", "products.json"), 'utf8'));
    bases_products.forEach((item, index, array) => {
      if (item.user_id === id_user) {
        arr.push(item);
      }
    })
  } catch (e) {
    console.error(e);
    setTimeout(() => {
      return products(id_user);
    }, 2000);
  }
  return arr;
}

// запись в базу товара
function products_add(user_id, product, description, img) {
  let arr = [];
  let per;
  try {
    let bases_products = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "bases", "products.json"), 'utf8'));
    let next_id_product = bases_products[bases_products.length - 1].id;
    let next_id_num = Number(next_id_product);
    next_id_num += 1;
    per = {
      "id": String(next_id_num),
      "product": product,
      "description": description,
      "user_id": user_id,
      "img": img
    };
    console.log("Новый товар создан:")
    console.log(per)
    bases_products.push(per);
    let fail = JSON.stringify(bases_products, null, 2).toString();
    fs.writeFileSync(path.join(__dirname, "..", "bases", "products.json"), fail, 'utf8');
  } catch (e) {
    console.error(e);
    setTimeout(() => {
      return products_add(user_id, product, description, img)
    }, 2000);
  }
  return arr;
}

// Удаления товара
function products_del(id) {
  try {
    let bases_products = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "bases", "products.json"), 'utf8'));
    let img;
    bases_products.forEach((item, index, array) => {
      if (item.id === id) {
        img = item.img;
      }
    })
    let bases_products_del = bases_products.filter(item =>
      item.id !== id
    )
    try {
      fs.unlinkSync(path.join(__dirname, "..", "public", "gallery", img));
      console.log("Картинка: " + img + " удалена");
    } catch (e) {
      console.log(e);
    }
    let fail = JSON.stringify(bases_products_del, null, 2).toString();
    fs.writeFileSync(path.join(__dirname, "..", "bases", "products.json"), fail, 'utf8');
  } catch (e) {
    console.error(e);
    setTimeout(() => {
      return products_del(id)
    }, 2000);
  }
}

// Страниц моих товаров
my_products.get("/", function (req, res, next) {
  console.log("ID пользователя: " + req.cookies.permission.user_id);
  console.log("Доступ пользователя: " + req.cookies.permission.permission);
  if (req.cookies.permission) {
    if (req.cookies.permission.permission === "admin") {
      res.render("block_my-products-users", {
        title: "Все товары на сервере",
        products: products_admin(),
      });
    } else {
      res.render("block_my-products-users", {
        title: "Мои товары",
        products: products(req.cookies.permission.user_id),
      });
    }
  } else {
    console.log(req.cookies.permission);
    res.render("block_home-guest", {
      title: "Только для зарегистрированых пользователей",
      title_img: "/img/nasgl.jpg",
    });
  }
});

// добавление товара
my_products.post("/", function (req, res, next) {
  console.log(req.body);
  console.log(req.files);
  let name_fail = uuid.v4() + ".jpg"
  req.files.img.mv(path.join(__dirname, "..", "public", "gallery", name_fail));
  products_add(req.cookies.permission.user_id, req.body.product, req.body.description, name_fail);
  res.redirect("my_products")
});

// удаления товара
my_products.post("/del", function (req, res, next) {
  products_del(req.body.product);
  res.redirect("/my_products")
});

// эексорт модуля маршрута
module.exports = my_products; // экспорт как my_products
