import express from 'express';
import console = require('node:console');

const port = 3000
const app = express()

app.get('/movies', (req, res) =>{
    res.send('Listar filmes')
})

app.listen(port, () => {
    console.log(`Servidor iniciado na porta ${port}`)
})