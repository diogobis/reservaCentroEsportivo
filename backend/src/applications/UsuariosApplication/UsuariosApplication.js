"use strict";

const BaseApplication = require("../BaseApplication/BaseApplication");

class UsuariosApplication extends BaseApplication {
  constructor(app, db) {
    super(app, db, "usuarios");

    app.get("/usuarios/filtroNome", (req, res) => {
      let filter = req.query && req.query.nome ? req.query.nome : null;

      if (filter === null) return [];

      let sql = `SELECT * FROM usuarios WHERE nome LIKE '%${filter}%'`;
      db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
      });
    });

    app.get("/usuarios/validar", (req, res) => {
      let participantes = JSON.parse(req.query.participantes);
      let sql = `SELECT * FROM usuarios WHERE RA IN (${participantes
        .map((p) => `'${p.RA}'`)
        .join(",")})`;

      db.query(sql, (err, results) => {
        if (err) throw err;

        let invalidUsuarios = [];

        let valid = true;
        for (let p of participantes) {
          let usuario = results.find((r) => r.RA == p.RA);
          if (!usuario) {
            valid = false;
            invalidUsuarios.push(p);
          } else if (usuario.nome !== p.nome) {
            valid = false;
            invalidUsuarios.push(p);
          }
        }

        res.json({ valid, invalidUsuarios });
      });
    });
  }
}

module.exports = UsuariosApplication;
