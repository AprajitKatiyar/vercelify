import { S3 } from "aws-sdk";
import fs from "fs";

const s3 = new S3({
  accessKeyId: "e6f3e1edf429fa6e5766ade2d9f35925",
  secretAccessKey:
    "0b596b4ff764eaa0a986b685026fea7adddd8ac062a893dea1442d5e28f8e7d8",
  endpoint: "https://056e8b1ec58fc215b2082bfb18237093.r2.cloudflarestorage.com",
});

export const uploadFile = async (fileName: string, localFilePath: string) => {
  const fileContent = fs.readFileSync(localFilePath);
  const response = await s3
    .upload({
      Body: fileContent,
      Bucket: "vercelify",
      Key: fileName,
    })
    .promise();
  console.log(response);
};
