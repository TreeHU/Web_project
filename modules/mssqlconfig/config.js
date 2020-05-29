// var sql = require("mssql");
// const pool = new sql.ConnectionPool({
//   user: 'sa',
//   password: 'loomis9884!',
//   server: "DESKTOP-0UCS3FD",
//   database: 'CEMS-DR',
//   port: '1433',
//   connectionTimeout: 15000,
//   requestTimeout: 150000
// })
// var conn = pool;
// module.exports = conn;

/*
const config = {
  user: 'sa',
  password: '125768@gns',
  server: "211.61.36.101",
  database: 'CEMS-DR',
  port: '20100',
  connectionTimeout:300000,
  requestTimeout:300000,
  pool:{
    idleTimeoutMillis : 300000,
    max :50,
  }
};
*/
const config = {
  user: 'sa',
  password: '125768gns',
  server: "localhost",
  database: 'CEMS-DR',
  port: '20100',
  connectionTimeout:300000,
  requestTimeout:300000,
  pool:{
    idleTimeoutMillis : 300000,
    max :50,
  }
};

module.exports = config;



