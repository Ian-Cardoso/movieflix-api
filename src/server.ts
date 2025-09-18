import express from "express";
import console = require("node:console");
import { PrismaClient } from "../src/generated/prisma";
import log = require("node:console");

const port = 3000;
const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.get("/movies", async (_, res) => {
  const movies = await prisma.movie.findMany({
    orderBy: {
      title: "asc",
    },
    include: {
      genres: true,
      languages: true,
    },
  });
  res.json(movies);
});

app.post("/movies", async (req, res) => {
  const { title, genre_id, language_id, oscar_count, release_date } = req.body;

  try {
    // verificar no banco se ja existe um filme com o nome que esta sendo enviado

    const movieWithSameTitle = await prisma.movie.findFirst({
      where: { title: { equals: title, mode: "insensitive" } },
    });

    if (movieWithSameTitle) {
      return res
        .status(409)
        .send({ message: "Ja existe um filme cadastrado com esse nome" });
    }

    await prisma.movie.create({
      data: {
        title,
        genre_id,
        language_id,
        oscar_count,
        release_date: new Date(release_date),
      },
    });
  } catch (error) {
    return res.status(500).send({ message: "Falha ao cadastrar um filme" });
  }

  res.status(201).send();
});

app.put("/movies/:id", async (req, res) => {
  // pegar o id do registro que vai ser atualizado
  const id = Number(req.params.id);

  try {
    const movie = await prisma.movie.findUnique({
      where: {
        id,
      },
    });

    if (!movie) {
      return res.status(404).send({ message: "Filme não encontrado" });
    }

    const data = { ...req.body };
    data.release_date = data.release_date
      ? new Date(data.release_date)
      : undefined;

    // pegar os dados do filme que sera atualizado
    await prisma.movie.update({
      where: {
        id,
      },
      data,
    });
  } catch (error) {
    return res.status(500).send({ message: "Falha ao atualizar o registro" });
  }

  // retornar o status correto informado que o filme foi atualizado
  res.status(200).send();
});

app.delete('/movies/:id', async (req, res) => {
   const id = Number(req.params.id);


   try{
     const movie = await prisma.movie.findUnique({
     where: { id }})

 

     if (!movie) {
        return res.status(404).send({ message: 'Filme não encontrado' });
     }

       await prisma.movie.delete({ where: { id }});
   
     }catch(error) {
       res.status(500).send({ message: 'Falha ao remover o registro' });
     }
   
 res.status(200).send();
});

app.listen(port, () => {
  console.log(`Servidor iniciado na porta http://localhost/${port}`);
});
