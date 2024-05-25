import React, { useEffect, useState } from "react";

type cardProps = {
  title: string;
  subTitle: string;
  label: string;
  placeholder?: string;
  buttonText: string;
  isDeployed: boolean;
  inProcess: boolean;
  webUrl: string;
  handleOnClick: (repoUrl?: string | null) => void;
};
export default function Card({
  title,
  subTitle,
  label,
  placeholder,
  buttonText,
  isDeployed,
  inProcess,
  webUrl,
  handleOnClick,
}: cardProps) {
  const [url, setUrl] = useState<string>(isDeployed ? webUrl : "");

  return (
    <div className="p-4 w-[520px] bg-white shadow-lg border">
      <h2 className="text-2xl text-left font-bold my-4">{title}</h2>
      <h3 className="text text-left font-small my-4">{subTitle}</h3>
      <div className="flex flex-col my-3">
        <label className=" font-bold text-xl">{label}</label>
        <input
          className="border shadow-sm focus:outline focus:shadow-md pl-1 py-1 my-4 text-left rounded-md"
          type="text"
          placeholder={placeholder}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          readOnly={isDeployed}
        ></input>
        <button
          className={`w-full border rounded-md p-2 ${
            buttonText == "Upload" || buttonText == "Visit Website"
              ? "bg-black text-white hover:bg-black-200"
              : "bg-gray-400 text-gray-600 cursor-not-allowed"
          }`}
          onClick={() => handleOnClick(url)}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}
