"use strict";

const BaseApplication = require("../BaseApplication/BaseApplication");

class CentroEsportivoApplication extends BaseApplication {
  constructor(app, db) {
    super(app, db, "centrosesportivos");
  }
}

module.exports = CentroEsportivoApplication;
