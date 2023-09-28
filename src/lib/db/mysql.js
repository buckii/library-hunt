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
        .query("INSERT INTO users(email,created_at) VALUES('" + data.email + "',now());")
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
        + ",updated_at=now() WHERE id='" + id + "';"
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

export async function getVoteCounts() {
  let mysqlconn = await mysqlconnFn();
  let results;

  try {
    await mysqlconn
      .query("SELECT vote,count(*) as vote_count FROM users WHERE LENGTH(vote)>0 GROUP BY vote ORDER BY vote;")
      .then(function ([rows, fields]) {
        results = rows;
      })
      .then( () => mysqlconn.end());

  } catch (error) {
    console.error("Got an error!!!");
    console.log(error);
  }
  return results;
}

export async function getAllUsers() {
  let mysqlconn = await mysqlconnFn();
  let results;

  try {
    await mysqlconn
      .query("SELECT * FROM users ORDER BY id DESC;")
      .then(function ([rows, fields]) {
        results = rows;
      })
      .then( () => mysqlconn.end());

  } catch (error) {
    console.error("Got an error!!!");
    console.log(error);
  }
  return results;
}

export async function getLeaderboard() {
  let mysqlconn = await mysqlconnFn();
  let latest;
  let libraries;
  let leaders;

  try {
    await mysqlconn
      .query("SELECT library,count(*) as library_count FROM users "
       + "WHERE LENGTH(library)>0 AND library != 'Buckeye Innovation'"
       + "GROUP BY library ORDER BY count(*) DESC LIMIT 10;")
      .then(function ([rows, fields]) {
        libraries = rows;
      });
    await mysqlconn
      .query("SELECT name,library,tags_tapped FROM users "
        + "WHERE name not like '%test%' AND email NOT LIKE '%test%' and library != 'Buckeye Innovation'"
        + "ORDER BY id DESC LIMIT 10;")
      .then(function ([rows, fields]) {
        latest = rows;
      });
    await mysqlconn
      .query("SELECT name,library,tags_tapped FROM users "
        + "WHERE name not like '%test%' AND email NOT LIKE '%test%' and library != 'Buckeye Innovation'"
        + "ORDER BY LENGTH(tags_tapped) DESC,id DESC LIMIT 10;")
      .then(function ([rows, fields]) {
        leaders = rows;
      });

      mysqlconn.end();

  } catch (error) {
    console.error("Got an error!!!");
    console.log(error);
  }
  return {
    latest,
    leaders,
    libraries,
  };
}