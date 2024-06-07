"use strict";

class BaseApplication {
  constructor(app, db, table) {
    app.get(`/${table}`, (req, res) => {
      let filter = req.query;
      let sql = `SELECT * FROM ${table} `;

      //WHERE
      if (Object.keys(filter).length > 0) sql += "WHERE ";
      let where = [];
      for (let key of Object.keys(filter)) {
        where.push(`${key} = '${filter[key]}'`);
      }
      where = where.join(" AND ");
      sql += where;

      db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
      });
    });

    app.post(`/${table}`, (req, res) => {
      let body = req.body;

      let sql = `INSERT INTO ${table}(${Object.keys(body).join(
        ","
      )}) VALUES (${Object.keys(body)
        .map((key) => {
          return `'${body[key]}'`;
        })
        .join(",")})`;

      db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
      });
    });

    app.put(`/${table}/:KEY`, (req, res) => {
      let KEY = req.params.KEY;

      let sql = `UPDATE ${table} SET ${Object.keys(reserva)
        .map((key) => {
          return `${key} = '${reserva[key]}'`;
        })
        .join(",")} WHERE ID = '${KEY}'`;

      db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
      });
    });

    app.delete(`/${table}/:KEY`, (req, res) => {
      let KEY = req.params.KEY;

      let sql = `DELETE FROM ${table} WHERE ID = '${KEY}'`;
      db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
      });
    });
  }
}

module.exports = BaseApplication;
