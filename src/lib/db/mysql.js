import { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } from "$env/static/private";

import mysql from "mysql2/promise";

export function mysqlconnFn() {
  //always create a new connection to avoid closed connections
  let mysqlconn = mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    connectionLimit: 10,
  });

  return mysqlconn;
}

export async function storeInDB(data) {
  let mysqlconn = await mysqlconnFn();
  let results;
  let id;
  try {
    if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.email)) {
      return 'Invalid email';
    }

    await mysqlconn
      .query("SELECT id FROM users where email='" + data.email + "';")
      .then(function ([rows, fields]) {
        if(rows && rows.length) {
          id = rows[0].id;
        }
      });

    if(!id) {
      await mysqlconn
        .query("INSERT INTO users(email) VALUES('" + data.email + "');")
        .then(function ([rows, fields]) {
          id = rows.insertId;
        });
    }

    if(!id) {
      mysqlconn.end();
      return 'Insert failed';
    }

    await mysqlconn
      .query("UPDATE users SET "
        + "name='" + data.name + "'"
        + ",library='" + data.library + "'"
        + ",vote='" + data.vote + "'"
        + ",tags_tapped='" + data.tags_tapped + "'"
        + ",cta_success='" + data.cta_success + "'"
        + " WHERE id='" + id + "';"
      )
      .then(function ([rows, fields]) {
        mysqlconn.end();
      });

    return {
      data: results,
    };
  } catch (error) {
    console.error("Got an error!!!");
    console.log(error);
    return error;
  }
}