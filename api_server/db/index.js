//导入mysql
const mysql = require("mysql2");

//建立与mysql的连接
const db = mysql.createPool({
  host: "localhost",
  port: 3306,
  database: "bishe",
  user: "root",
  password: "yangjunming123"
});

db.query("select 1", (err, res) => {
  if (err) return console.log(err.message);
  console.log(res);
});

module.exports = db;
