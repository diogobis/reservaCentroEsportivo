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
        where.push(`${key} = '${filter[key]}'`);
      }
      where = where.join(" AND ");
      sql += where;

      db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
      });
    });

    app.get(`/reserva/horarios`, (req, res) => {
      let filter = req.query;
      let sql = `SELECT * FROM reserva `;

      //WHERE
      let where = [];

      if (Object.keys(filter).length > 0) {
        sql += "WHERE ";

        where.push(
          `dataReserva BETWEEN '${filter["start"]}' AND '${filter["end"]}'`
        );

        delete filter.start;
        delete filter.end;
      }
      for (let key of Object.keys(filter)) {
        where.push(`${key} = '${filter[key]}'`);
      }

      where = where.join(" AND ");
      sql += where;

      // sql += ` INNER JOIN horarios ON horarios.ID = reserva.horarioID `;

      let horarios = {};
      db.query("SELECT * FROM horarios", (err, results) => {
        results.map((h) => {
          horarios[h.ID] = h;
        });
        db.query(sql, (err, results) => {
          if (err) throw err;

          results.map((r) => {
            r.horario = horarios[r.horarioID];
            return r;
          });

          res.json(results);
        });
      });
    });

    app.get(`/reserva/participantes`, (req, res) => {
      let filter = req.query;
      let sql = `SELECT * FROM reserva `;

      let start = filter.start;
      let end = filter.end;

      delete filter.start;
      delete filter.end;

      //WHERE
      if (Object.keys(filter).length > 0) sql += "WHERE ";
      let where = [];
      for (let key of Object.keys(filter)) {
        where.push(`${key} = '${filter[key]}'`);
      }

      if (start && end) {
        where.push(`dataReserva BETWEEN '${start}' AND '${end}'`);
      } else if (start) {
        where.push(`dataReserva > '${start}'`);
      } else if (end) {
        where.push(`dataReserva < '${end}'`);
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
        INNER JOIN usuarios a ON a.RA = pr.usuario 
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
      let reserva = { ...req.body };
      let editingID = reserva.id;
      
      delete reserva.participantes;

      if (editingID) {
        delete reserva.created;
      } else {
        reserva.created = new Date()
          .toISOString()
          .replace("Z", " ")
          .replace("T", " ")
          .trim();
      }

      let participantes = req.body.participantes;

      let queryReserva = "";
      if (editingID) {
        delete reserva.id;
        queryReserva = `UPDATE reserva SET `;

        queryReserva += Object.keys(reserva)
          .map((key) => {
            return `${key} = '${reserva[key]}'`;
          })
          .join(",");

        queryReserva += ` WHERE ID = ${editingID}`;
      } else {
        queryReserva = `INSERT INTO Reserva (${Object.keys(reserva).join(
          ","
        )}) VALUES (${Object.keys(reserva)
          .map((key) => `'${reserva[key]}'`)
          .join(",")})`;
      }

      db.query(queryReserva, (err, results) => {
        if (err) throw err;

        let insertId = editingID ? editingID : results.insertId;

        let adicionarParticipantes = () => {
          let queryParticipantes = `INSERT INTO participantesreserva (usuario, reserva, created) VALUES ${participantes
            .map((p) => {
              return `('${p.RA}', ${insertId}, '${new Date()
                .toISOString()
                .replace("Z", "")
                .replace("T", " ")}')`;
            })
            .join(",")}`;
          db.query(queryParticipantes, (err, results) => {
            if (err) throw err;

            res.json({ message: "Success!" });
          });
        };

        if (editingID) {
          let dropParticipantes = `DELETE FROM participantesreserva WHERE reserva = ${editingID}`;
          db.query(dropParticipantes, (err, results) => {
            if (err) throw err;

            adicionarParticipantes();
          });
        } else {
          adicionarParticipantes();
        }
      });
    });
  }
}

module.exports = ReservaApplication;
