import express from "express";
import cors from "cors";
import { v4 as uuid } from "uuid";
import simpleGit from "simple-git";
import path from "path";
import { getAllFiles } from "./file";
import { uploadFile } from "./aws";
import { createClient } from "redis";

const publisher = createClient();
publisher.connect();

const subscriber = createClient();
subscriber.connect();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/deploy", async (req, res) => {
  const repoUrl = req.body.repoUrl;
  const id = uuid();
  await simpleGit().clone(repoUrl, path.join(__dirname, `output/${id}`));
  const files = getAllFiles(path.join(__dirname, `output/${id}`));

  files.forEach(async (file) => {
    await uploadFile(
      file.slice(__dirname.length + 1).replace(/\\/g, "/"),
      file
    );
  });
  publisher.lPush("build-queue", id);
  res.json({ id });
});

app.listen(3000, () => console.log("Server is up and running!"));
