const config  = require('./config.js');
const sql = require('mssql');

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('Connected to MSSQL')
    return pool
  })
  .catch(err => console.log('Database Connection Failed! Bad Config: ', err))

module.exports = poolPromise;
// exports.execSql = async function(sqlquery) {
//     const pool = new sql.ConnectionPool(settings);
//     pool.on('error', err => {
//       // ... error handler 
//       console.log('sql errors', err);
//     });
  
//     try {
//       await pool.connect();
//       let result = await pool.request().query(sqlquery);

//       return {success: result};
     
//     } catch (err) { 
//       return {err: err};
//     } finally {
//     //connection pool을 반환함. 실제 connection 이 끊어지는것이 아님
//       pool.close(); //closing connection after request is finished.
      
//     }
//   };
