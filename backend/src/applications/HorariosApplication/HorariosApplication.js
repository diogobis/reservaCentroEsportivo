const BaseApplication = require("../BaseApplication/BaseApplication");

class HorariosApplication extends BaseApplication {
  constructor(app, db) {
    super(app, db, "horarios");
  }
}

module.exports = HorariosApplication;
