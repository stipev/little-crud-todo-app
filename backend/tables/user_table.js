const pool = require("../databasePool");
const jwt = require("jsonwebtoken");

class UserTable {
  static storeUser(username, password) {
    return new Promise((resolve, reject) => {
      pool.query(
        "INSERT INTO _user(username,userpassword) VALUES($1,$2) RETURNING id",
        [username, password],
        (error, response) => {
          if (error) reject(error);
          const Id = response.rows[0].id;
        }
      );
    });
  }

  static userExist(username, res) {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT username from _user WHERE username=$1",
        [username],
        (error, response) => {
          if (error) {
            return reject(error);
          }
          if (response.rows.length === 0) {
            res.json({
              message: `User with username: ${username} created successfully`,
              sucess: true,
              err: null,
              flag: false
            });
            //return reject(new Error("no User!"));
          } else {
            res.json({
              message: `User with username: ${username} already exist`,
              flag: true
            });
            resolve(response.rows[0]);
          }
        }
      );
    });
  }

  static logInUser(username, password, res, secret) {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT username,id from _user WHERE username=$1 AND userpassword=$2",
        [username, password],
        (error, response) => {
          if (error) {
            return reject(error);
          }
          if (response.rows.length === 0) {
            res.status(401).json({
              sucess: false,
              token: null,
              err: "Username or password is incorrect"
            });
          } else {
            let token = jwt.sign(
              {
                id: response.rows[0].id,
                username
              },
              secret
            );
            res.json({
              sucess: true,
              err: null,
              token
            });
          }
        }
      );
    });
  }
}
module.exports = UserTable;
