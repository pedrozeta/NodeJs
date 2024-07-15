import { createPool } from 'mysql2/promise';

const pool = createPool({
    host: process.env.MYSQL_ADDON_HOST,
    user: process.env.MYSQL_ADDON_USER,
    password: process.env.MYSQL_ADDON_PASSWORD,
    database: process.env.MYSQL_ADDON_DB,
    waitForConnections: true,
    connectionLimit: 5
});

pool.getConnection()
.then(connection => {
    pool.releaseConnection(connection);
    console.log('La DB está conectada');
})
.catch(err => {
    console.error('Hubo un error al conectar la DB:', err);
});

export default pool;
