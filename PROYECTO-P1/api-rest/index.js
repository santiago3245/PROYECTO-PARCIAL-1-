import express from 'express';
import bodyParser from 'body-parser';
import mysql from 'mysql2';
import cors from 'cors';

const app = express();
const port = 8000;

app.use(cors());
app.use(bodyParser.json());

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

app.get("/", (req, res) => {
    res.send("Bienvenidos a mi api");
});

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    port: 3306,
    database: 'bd_api_rest'
});

db.connect((error) => {
    if (error) {
        console.log("Error al conectar a la base de datos");
        return;
    } else {
        console.log("Conexion Exitosa");
    }
});

app.get('/libros/', (req, res) => {
    const query = "SELECT * FROM libros";
    db.query(query, (error, results) => {
        if (error) {
            res.status(500).send('Error al ejecutar la consulta');
            return;
        } else {
            res.status(200).json(results);
        }
    });
});

app.get('/libros/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM libros WHERE id = ?';
    db.query(query, [id], (error, results) => {
        if (error) {
            res.status(500).send('Error al ejecutar la consulta');
            return;
        }
        if (results.length === 0) {
            res.status(404).send('Libro no encontrado');
            return;
        }
        res.status(200).json(results[0]); 
    });
});


app.post('/libros/', (req, res) => {
    const { titulo, genero, fecha_publicacion } = req.body;
    const query = 'INSERT INTO libros (titulo, genero, fecha_publicacion) VALUES (?, ?, ?)';
    db.query(query, [titulo, genero, fecha_publicacion], (error, results) => {
        if (error) {
            res.status(500).send('Error al ejecutar la consulta');
            return;
        }
        res.status(201).json('Libro registrado exitosamente');
    });
});


app.delete('/libros/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM libros WHERE id = ?';
    db.query(query, [id], (error, results) => {
        if (error) {
            res.status(500).send('Error al eliminar el libro');
            return;
        }
        if (results.affectedRows === 0) {
            res.status(404).send('No existe el libro');
            return;
        }
        res.status(200).json('Libro eliminado exitosamente');
    });
});



app.put('/libros/:id', (req, res) => {
    const { id } = req.params;
    const { titulo, genero, fecha_publicacion } = req.body;
    const query = 'UPDATE libros SET titulo = ?, genero = ?, fecha_publicacion = ? WHERE id = ?';
    db.query(query, [titulo, genero, fecha_publicacion, id], (error, results) => {
        if (error) {
            res.status(500).send('Error al actualizar el libro');
            return;
        }
        if (results.affectedRows === 0) {
            res.status(404).send('No existe el libro');
            return;
        }
        res.status(200).json('Libro actualizado exitosamente');
    });
});


app.get('/autores/', (req, res) => {
    const query = "SELECT * FROM autores";
    db.query(query, (error, results) => {
        if (error) {
            res.status(500).send('Error al ejecutar la consulta');
            return;
        } else {
            res.status(200).json(results);
        }
    });
});


app.get('/autores/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM autores WHERE id_autor = ?';
    db.query(query, [id], (error, results) => {
        if (error) {
            res.status(500).send('Error al ejecutar la consulta');
            return;
        }
        if (results.length === 0) {
            res.status(404).send('Autor no encontrado');
            return;
        }
        res.status(200).json(results[0]); 
    });
});


app.post('/autores/', (req, res) => {
    const { nombre, nacionalidad, fecha_nacimiento } = req.body;
    const query = 'INSERT INTO autores (nombre, nacionalidad, fecha_nacimiento) VALUES (?, ?, ?)';
    db.query(query, [nombre, nacionalidad, fecha_nacimiento], (error, results) => {
        if (error) {
            res.status(500).send('Error al ejecutar la consulta');
            return;
        }
        res.status(201).json('Autor registrado exitosamente');
    });
});


app.delete('/autores/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM autores WHERE id_autor = ?';
    db.query(query, [id], (error, results) => {
        if (error) {
            res.status(500).send('Error al eliminar el autor');
            return;
        }
        if (results.affectedRows === 0) {
            res.status(404).send('No existe el autor');
            return;
        }
        res.status(200).json('Autor eliminado exitosamente');
    });
});


app.put('/autores/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, nacionalidad, fecha_nacimiento } = req.body;
    const query = 'UPDATE autores SET nombre = ?, nacionalidad = ?, fecha_nacimiento = ? WHERE id_autor = ?';
    db.query(query, [nombre, nacionalidad, fecha_nacimiento, id], (error, results) => {
        if (error) {
            res.status(500).send('Error al actualizar el autor');
            return;
        }
        if (results.affectedRows === 0) {
            res.status(404).send('No existe el autor');
            return;
        }
        res.status(200).json('Autor actualizado exitosamente');
    });
});

app.get('/autoreslibros', (req, res) => {
    const query = `
        SELECT 
            al.id, al.id_autor,
            l.titulo AS libro_titulo,
            l.genero AS libro_genero,
            l.fecha_publicacion AS libro_fecha_publicacion,
            a.nombre AS autor_nombre,
            a.nacionalidad
        FROM AutoresLibros al
        INNER JOIN Libros l ON al.id = l.id
        INNER JOIN Autores a ON al.id_autor = a.id_autor
    `;

    db.query(query, (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Error al obtener los datos' });
            return;
        }
        res.status(200).json(results);
    });
});

app.post('/autoreslibros', (req, res) => {
    const { id, id_autor } = req.body;
    if (!id || !id_autor) {
        res.status(400).json({ error: 'Datos incompletos' });
        return;
    }

    const query = 'INSERT INTO autoresLibros (id, id_autor) VALUES (?, ?)';
    db.query(query, [id, id_autor], (err) => {
        if (err) {
            res.status(500).json({ error: 'Error al registrar la relación' });
            return;
        }
        res.status(201).json({ message: 'Relación registrada correctamente' });
    });
});

