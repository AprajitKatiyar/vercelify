import express from "express";
import { S3 } from "aws-sdk";
const app = express();
app.use(express.json());
const s3 = new S3({
  accessKeyId: "e6f3e1edf429fa6e5766ade2d9f35925",
  secretAccessKey:
    "0b596b4ff764eaa0a986b685026fea7adddd8ac062a893dea1442d5e28f8e7d8",
  endpoint: "https://056e8b1ec58fc215b2082bfb18237093.r2.cloudflarestorage.com",
});

app.get("/*", async (req, res) => {
  const host = req.hostname;
  const id = host.split(".")[0];
  const filePath = req.path;

  const contents = await s3
    .getObject({
      Bucket: "vercelify",
      Key: `dist/${id}${filePath}`,
    })
    .promise();

  const type = filePath.endsWith("html")
    ? "text/html"
    : filePath.endsWith("css")
    ? "text/css"
    : "application/javascript";
  res.set("Content-Type", type);
  res.send(contents.Body);
  console.log(id);
});

app.listen(3001, () => {
  console.log("Request Handler server is up and running!");
});
