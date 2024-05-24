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
  await new Promise((resolve) => {
    setTimeout(resolve, 5000);
  });
  publisher.lPush("build-queue", id);
  publisher.hSet("status", id, "uploaded");
  res.json({ id });
});

app.get("/status", async (req, res) => {
  const id = req.query.id;
  const response = await subscriber.hGet("status", id as string);
  res.json({
    status: response,
  });
});

app.listen(3000, () => console.log("Server is up and running!"));
