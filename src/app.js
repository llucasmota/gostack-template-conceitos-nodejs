const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validProjectId(request, response, next) {
  const { id } = request.params;
  if (!isUuid(id)) {
    return response
      .status(400)
      .json({ error: { message: "Invalid project id" } });
  }
  return next();
}

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  if (!title) {
    return response
      .status(400)
      .json({ error: { message: "Informar todos os parâmetros" } });
  }
  if (!url) {
    return response
      .status(400)
      .json({ error: { message: "Informar todos os parâmetros" } });
  }
  if (!techs) {
    return response
      .status(400)
      .json({ error: { message: "Informar todos os parâmetros" } });
  }
  const repositorio = { id: uuid(), title, url, techs, likes: 0 };
  repositories.push(repositorio);
  return response.status(201).json(repositorio);
});

app.put("/repositories/:id", validProjectId, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const reporsitorieIndex = repositories.findIndex((repo) => repo.id === id);

  if (reporsitorieIndex < 0) {
    return response
      .status(400)
      .json({ error: { message: "Repositório não encontrado" } });
  }
  const repository = { id, title, url, techs };
  Object.assign(repositories[reporsitorieIndex], repository);
  return response.status(200).json(repositories[reporsitorieIndex]);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const reporsitorieIndex = repositories.findIndex((repo) => repo.id === id);

  if (reporsitorieIndex < 0) {
    return response
      .status(400)
      .json({ error: { message: "Repositório não encontrado" } });
  }

  repositories.splice(reporsitorieIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", validProjectId, (request, response) => {
  const { id } = request.params;
  const reporsitorieIndex = repositories.findIndex((repo) => repo.id === id);

  if (reporsitorieIndex < 0) {
    return response
      .status(400)
      .json({ error: { message: "Repositório não encontrado" } });
  }
  const likeRepo = repositories[reporsitorieIndex].likes;
  repositories[reporsitorieIndex].likes = likeRepo + 1;

  return response.status(200).json(repositories[reporsitorieIndex]);
});

module.exports = app;
