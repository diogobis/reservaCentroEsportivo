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
      console.log(req,res);
    })
  }
}

module.exports = BaseApplication;
