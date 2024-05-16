"use strict";

const BaseApplication = require("../BaseApplication/BaseApplication");

class ReservaApplication extends BaseApplication {
  constructor(app, db) {
    super(app, db, "reserva");

    app.get(`/reserva/interval`, (req, res) => {
      let filter = req.query;
      let sql = `SELECT * FROM reserva WHERE dataReserva BETWEEN '${filter.start}' AND '${filter.end}' `;

      delete filter.start;
      delete filter.end;

      //WHERE
      if (Object.keys(filter).length > 0) sql += "WHERE ";
      let where = [];
      for (let key of Object.keys(filter)) {
        where.push(`${key} = ${filter[key]}`);
      }
      where = where.join(" AND ");
      sql += where;

      db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
      });
    });

    app.get(`/reserva/include`, (req, res) => {
      let filter = req.query;
      let sql = `SELECT * FROM reserva `;

      //WHERE
      if (Object.keys(filter).length > 0) sql += "WHERE ";
      let where = [];
      for (let key of Object.keys(filter)) {
        where.push(`${key} = ${filter[key]}`);
      }
      where = where.join(" AND ");
      sql += where;

      let reservas;

      db.query(sql, (err, results) => {
        if (err) throw err;
        reservas = results;

        let participantesQuery = `
        SELECT pr.reserva, a.* 
        FROM participantesreserva pr 
        INNER JOIN alunos a ON a.RA = pr.aluno 
        WHERE reserva IN (${reservas.map((r) => r.ID).join(",")})`;

        db.query(participantesQuery, (err, results) => {
          reservas.map((rs) => {
            let ps = results.filter((r) => r.reserva == rs.ID);
            rs.participantes = ps;
            return rs;
          });

          res.json(reservas);
        });
      });
    });

    app.get("/reserva/disponibilidade", (req, res) => {
      let filter = req.query;

      let diaDaSemana = new Date(filter.dataReserva).getDay();
      diaDaSemana = diaDaSemana == 5 || diaDaSemana == 6 ? "F" : "S";

      let sql = `
      SELECT * FROM horarios WHERE horarios.tipo = '${diaDaSemana}' AND horarios.ID NOT IN (
        SELECT 
          horarios.ID
        FROM reserva 
        INNER JOIN horarios ON reserva.horarioID = horarios.ID 
        WHERE reserva.dataReserva = '${filter.dataReserva}' AND reserva.centroEsportivo = ${filter.centroEsportivo}
      );`;

      db.query(sql, (err, results) => {
        if (err) throw err;

        res.json(results);
      });
    });

    app.post(`/reserva/registrar`, (req, res) => {
      console.log(req, res);

      let reserva = { ...req.body };
      delete reserva.participantes;
      reserva.created = new Date()
        .toISOString()
        .replace("Z", " ")
        .replace("T", " ");

      let participantes = req.body.participantes;

      console.log(reserva, participantes);

      let queryReserva = `INSERT INTO Reserva (${Object.keys(reserva).join(
        ","
      )}) VALUES (${Object.keys(reserva)
        .map((key) => `'${reserva[key]}'`)
        .join(",")})`;
      db.query(queryReserva, (err, results) => {
        if (err) throw err;

        console.log(results);

        let queryParticipantes = `INSERT INTO participantesreserva (aluno, reserva, created) VALUES ${participantes
          .map((p) => {
            return `(${p.RA}, ${results.insertId}, '${new Date()
              .toISOString()
              .replace("Z", " ")
              .replace("T", " ")}')`;
          })
          .join(",")}`;
        db.query(queryParticipantes, (err, results) => {
          console.log(results);
          if (err) throw err;

          res.json({ message: "Success!" });
        });
      });
    });
  }
}

module.exports = ReservaApplication;
