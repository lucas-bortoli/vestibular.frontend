import React, { useRef, useState } from "react";

import style from "./style.module.css";

interface Props {
  // A lista de extensões permitidas
  allowedExtensions: string[];
}

const FileInput = (props: Props) => {
  const inputRef = useRef<HTMLInputElement>();
  const [selectedFile, setSelectedFile] = useState<File>(null);

  const extensions = props.allowedExtensions
    .map((e) => (e.charAt(0) === "." ? e.slice(1) : e))
    .join(", ");

  const inputChanged = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const file = ev.target.files[0];
    setSelectedFile(file);
  };

  return (
    <div className={style.fileInputWrapper}>
      <button disabled onClick={() => inputRef.current.click()} className="primary">
        Trocar arquivo
      </button>
      <button disabled>Baixar arquivo atual</button>
      <span>{(false && selectedFile && selectedFile.name) ?? "Nenhum arquivo selecionado"}</span>
      <input
        type="file"
        accept={extensions}
        onChange={inputChanged}
        ref={inputRef}
        className={style.fileInputCore}
      />

      <span className={style.uploadStatus}>Nenhum arquivo cadastrado</span>
    </div>
  );
};

export default FileInput;
