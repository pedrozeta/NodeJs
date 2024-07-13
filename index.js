import express from 'express';
import pool from './config/db.js';

const app = express();

//middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// LEER TODO
app.get('/usuarios', async (req, res) => {
    try{
        const connection = await pool.getConnection();
        const sql = 'SELECT usuarios.*, datosUsuarios.*, rol.*, imgUsuarios.* FROM usuarios LEFT JOIN datosUsuarios ON usuarios.id_datos = datosUsuarios.id_datos LEFT JOIN rol ON usuarios.id_rol = rol.id_rol LEFT JOIN imgUsuarios ON usuarios.id_img = imgUsuarios.id_img';
        const [rows, fields] = await connection.query(sql);
        connection.release();
        res.json(rows);
    } catch (err) {
        console.error('Hubo un error al consultar la BD', err);
        res.status(500).send('Hubo un error al consultar la BD');
    }
});

// LEER POR ID
app.get('/usuarios/:id', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const id_usuario = req.params.id
        const sql =  'SELECT usuarios.*, datosUsuarios.*, rol.*, imgUsuarios.* FROM usuarios LEFT JOIN datosUsuarios ON usuarios.id_datos = datosUsuarios.id_datos LEFT JOIN rol ON usuarios.id_rol = rol.id_rol LEFT JOIN imgUsuarios ON usuarios.id_img = imgUsuarios.id_img WHERE id_usuario = ?';

        const [rows, fields] = await connection.query(sql, [id_usuario]);
        connection.release();
        if (rows.length === 0) {
            res.status(404).send('Usuario no encontrado');
        } else {
            res.json(rows[0]);
        }
    } catch (err) {
        console.error('Hubo un error al consultar la BD:', err);
        res.status(500).send('Hubo un error al consultar la BD');
    }
});

//AGREGAR DATOS DE USUARIO 
app.post('/usuarios/datos', async (req, res) => {
    try{
        const connection = await pool.getConnection();
        const userData = req.body;
        const sql = 'INSERT INTO datosUsuarios SET ?';
        const [rows] = await connection.query(sql, [userData]);
        connection.release();
        res.json({mensaje: 'Usuario agregado', id_datos: rows.insertId});
            } catch (err) {
                console.error('Hubo un error al agregar el usuario', err);
                res.status(500).send('Hubo un error al agregar el usuario'); 
            }
});

//AGREGAR IMAGEN GUARDADA DE USUARIO 
app.post('/usuarios/img', async (req, res) => {
    try{
        const connection = await pool.getConnection();
        const userData = req.body;
        const sql = 'INSERT INTO imgUsuarios SET ?';
        const [rows] = await connection.query(sql, [userData]);
        connection.release();
        res.json({mensaje: 'Imagen guardada', id_img: rows.insertId});
            } catch (err) {
                console.error('Hubo un error al agregar el usuario', err);
                res.status(500).send('Hubo un error al agregar el usuario'); 
            }
});

//AGREGAR USUARIO 
app.post('/usuarios/usuario', async (req, res) => {
    try{
        const connection = await pool.getConnection();
        const userData = req.body;
        const sql = 'INSERT INTO usuarios SET ?';
        const [rows] = await connection.query(sql, [userData]);
        connection.release();
        res.json({mensaje: 'Usuario agregado', id_usuario: rows.insertId});
            } catch (err) {
                console.error('Hubo un error al agregar el usuario', err);
                res.status(500).send('Hubo un error al agregar el usuario'); 
            }
});

//ACTUALIZAR USUARIO
app.post('/usuarios/actualizar/:id', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const id_user = req.params.id;
        const userData = req.body;
        const sql = 'UPDATE usuarios SET ? WHERE id_usuario = ?';
        const [rows] = await connection.query(sql, [userData, id_user]);
        connection.release();
        console.log(rows)
        res.json({ mensaje: 'Datos de usuario actualizados'});
    } catch (err) {
        console.error('Hubo un error al consultar la BD', err);
        res.status(500).send('Hubo un error al consultar la BD');
    }
});
//revisado

//BORRAR USUARIO
app.get('/usuarios/borrar/:id', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const id_user = req.params.id;                   
        const sql = 'DELETE FROM usuarios WHERE id_usuario = ?';
        const [rows] = await connection.query(sql, [id_user]);
        connection.release();
        if (rows.affectedRows === 0) {
            res.status(404).send('Usuario no encontrado');
        } else {
            res.json({ mensaje: 'Datos de usuario borrados'});
        }
    } catch (err) {
        console.error('Hubo un error al consultar la BD', err);
        res.status(500).send('Hubo un error al consultar la BD');
    }
});



app.listen(3000, () => {
    console.log('El servidor está funcionando en el puerto 3000');
});