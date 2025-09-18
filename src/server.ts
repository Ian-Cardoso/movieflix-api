import express from 'express';
import console = require('node:console');
import { PrismaClient } from '../src/generated/prisma';

const port = 3000
const app = express()
const prisma = new PrismaClient();

app.get('/movies', async (_, res) =>{
    const movies = await prisma.movie.findMany({
        orderBy: {
            title: "asc",
        },
        include: {
            genres: true,
            languages: true,
        },
    });
    res.json(movies)
})

app.listen(port, () => {
    console.log(`Servidor iniciado na porta http://localhost/${port}`)
})