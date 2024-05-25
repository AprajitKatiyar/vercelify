import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import axios from "axios";
import Card from "@/components/Card";
const BACKEND_UPLOAD_URL = "http://localhost:3000";
export default function Home() {
  const router = useRouter();
  const [buttonText, setButtonText] = useState<string>("Upload");
  const [uploadId, setUploadId] = useState("");
  const [isDeployed, setIsDeployed] = useState<boolean>(false);
  const [inProcess, setInProcess] = useState<boolean>(false);
  const [webUrl, setWebUrl] = useState<string>("");

  return (
    <div className="flex flex-col justify-center items-center h-screen w-full">
      <Card
        title=" Deploy your GitHub repository."
        subTitle=" Enter the URL of your GitHub repository to deploy it."
        label=" GitHub repository URL"
        placeholder="https://github.com/username/repo"
        buttonText={buttonText}
        isDeployed={isDeployed}
        inProcess={inProcess}
        webUrl={webUrl}
        handleOnClick={async (repoUrl?: string | null) => {
          setInProcess(true);
          setButtonText("Uploading...");
          const res = await axios.post(`${BACKEND_UPLOAD_URL}/deploy`, {
            repoUrl: repoUrl,
          });
          setUploadId(res.data.id);
          setButtonText(`Deploying(${res.data.id})`);
          const interval = setInterval(async () => {
            const response = await axios.get(
              `${BACKEND_UPLOAD_URL}/status?id=${res.data.id}`
            );

            if (response.data.status === "deployed") {
              clearInterval(interval);
              setIsDeployed(true);
              setInProcess(false);
              setButtonText("Deployed");
            }
          }, 3000);
        }}
      />
      {isDeployed && (
        <Card
          title="Deployment Status"
          subTitle="Your website is successfully deployed!"
          label="Deployed URL"
          buttonText="Visit Website"
          isDeployed={isDeployed}
          inProcess={inProcess}
          webUrl={`http://${uploadId}.vercelify.com:3001/index.html`}
          handleOnClick={() => {
            router.push(`http://${uploadId}.vercelify.com:3001/index.html`);
          }}
        />
      )}
    </div>
  );
}
