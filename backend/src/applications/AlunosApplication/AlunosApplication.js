"use strict";

const BaseApplication = require("../BaseApplication/BaseApplication");

class AlunosApplication extends BaseApplication {
  constructor(app, db) {
    super(app, db, "alunos");

    app.get("/alunos/filtroNome", (req, res) => {
      let filter = req.query && req.query.nome ? req.query.nome : null;

      if (filter === null) return [];

      let sql = `SELECT * FROM alunos WHERE nome LIKE '%${filter}%'`;
      db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
      });
    });

    app.get("/alunos/validar", (req, res) => {
      let participantes = JSON.parse(req.query.participantes);
      let sql = `SELECT * FROM alunos WHERE RA IN (${participantes
        .map((p) => p.RA)
        .join(",")})`;

      db.query(sql, (err, results) => {
        if (err) throw err;

        let valid = true;
        for (let p of participantes) {
          let aluno = results.find((r) => r.RA == p.RA);
          if (aluno.nome !== p.nome) {
            valid = false;
            break;
          }
        }

        res.json({ valid: valid });
      });
    });
  }
}

module.exports = AlunosApplication;
