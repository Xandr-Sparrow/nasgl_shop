// подключения модулей require('название или путь с названием и расширением')
const express = require('express'); // сам фреймворк express
const path = require('path'); // для путей файлов на разных ОС
const auth = express.Router(); // опеределение роутера
const fs = require("fs");

// поиск пользователя по нику и паролю
function users_in(user, password) {
  let per;
  try {
    let to_json = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "bases", "users.json"), 'utf8'));
    to_json.forEach((item) => {
      if (item.user === user && item.password === password) {
        per = item;
        console.log("Пользователь: " + item.user + " с паролем: " + item.password + " найден");
      }
    })
  } catch (e) {
    console.error(e);
    setTimeout(() => {
      return users_check(user, password);
    }, 2000);
  }
  return per;
}

// проверка пользователя
function user_check (user) {
  let per;
  try {
    let base_users = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "bases", "users.json"), 'utf8'));
    base_users.forEach((item, index, array) => {
      if (item.user_id === id_user) {
        arr.push(item);
      }
    })
    base_users.forEach((item) => {
      if (item.user === user) {
        console.log("Пользователь: " + item.user + " уже существует");
        per = true;
      }
    })
  } catch (e) {
    console.error(e);
    setTimeout(() => {
      return user_check (user);
    }, 2000);
  }
  return per;
}

// добавление нового пользователя
function users_new(user, password) {
  let per;
  try {
    let base_users = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "bases", "users.json"), 'utf8'));
    let next_id = base_users[base_users.length - 1].user_id;
    let next_id_num = Number(next_id);
    next_id_num += 1;
    per = {
      "user_id": String(next_id_num),
      "user": user,
      "password": password,
      "permission": "user",
      "basket": []
    };
    console.log("Новый пользовтель создан:")
    console.log(per)
    base_users.push(per);
    let fail = JSON.stringify(base_users, null, 2).toString();
    fs.writeFileSync(path.join(__dirname, "..", "bases", "users.json"), fail, 'utf8');
  } catch (e) {
    console.error(e);
    setTimeout(() => {
      return users_new(user, password);
    }, 2000);
  }
  return per;
}


// Страница авторизации
auth.get("/auth", function (req, res, next) {
  res.render("block_auth", {
    title: "Авторизация",
  });
});
auth.post("/auth", function (req, res, next) {
  if (users_in(req.body.name, req.body.password)) {
    let per = users_in(req.body.name, req.body.password);
    res.cookie('permission', per,);
    res.render("block_home-users", {
      title: "Вход выполнен",
      title_img: "/img/nasgl.jpg",
    });
  } else {
    res.render("block_auth", {
      title: "Отсутствует",
    });
  }
});

// регистрация
auth.get("/reg", function (req, res, next) {
  res.render("block_reg", {
    title: "Регистрация",
  });
});
auth.post("/reg", function (req, res, next) {
  if (!user_check(req.body.name)) {
    let user_add = users_new(req.body.name, req.body.password)
    res.cookie('permission', user_add,);
    res.render("block_home-users", {
      title: "Регистрация и вход выполнен",
      title_img: "/img/nasgl.jpg",
    });
  } else {
    res.render("block_reg", {
      title: "Пользователь уже существует",
    });
  }
});

// выход
auth.get("/exit", function (req, res, next) {
  res.clearCookie('permission');
  res.render("block_home-guest", {
    title: "Выход выполнен",
    title_img: "/img/nasgl.jpg",
  });
});

// эексорт модуля маршрута
module.exports = auth; // экспорт как auth
