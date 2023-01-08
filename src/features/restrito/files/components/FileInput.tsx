import React, { useRef, useState } from "react";
import apiBaseUrl from "../../../../api/baseUrl";
import { useGetAttachmentOpaqueQuery } from "../../../../api/apiSlice";

import style from "./style.module.css";
import { usePutAttachmentMutation } from "../../../../api/restrito/slice";
import { RootState } from "../../../../store";
import { useSelector } from "react-redux";

interface Props {
  // A lista de extensões permitidas
  allowedExtensions: string[];

  fileId: string;
  mimeType: string;
}

const FileInput = (props: Props) => {
  const userToken = useSelector((state: RootState) => state.restrito.auth.token);
  const attachmentQuery = useGetAttachmentOpaqueQuery({ id: props.fileId });
  const [uploadAttachment, uploadStatus] = usePutAttachmentMutation();

  const inputRef = useRef<HTMLInputElement>();
  const [selectedFile, setSelectedFile] = useState<File>(null);

  const extensions = props.allowedExtensions
    .map((e) => (e.charAt(0) === "." ? e : "." + e))
    .join(", ");

  const inputChanged = async (ev: React.ChangeEvent<HTMLInputElement>) => {
    const file = ev.target.files[0];

    setSelectedFile(file);

    uploadAttachment({ token: userToken, fileId: props.fileId, file })
      .unwrap()
      .then(() => {
        attachmentQuery.refetch();
      });
  };

  const doDownload = () => {
    if (!attachmentQuery.isSuccess) return;

    const a = document.createElement("a");
    a.download = attachmentQuery.data.nome;
    a.href = apiBaseUrl + "/attachments/data/" + props.fileId + "?forceDownload=1";
    a.target = "_blank";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className={style.fileInputWrapper}>
      <button
        onClick={() => inputRef.current.click()}
        className="primary"
        disabled={attachmentQuery.isFetching || uploadStatus.isLoading}>
        Trocar arquivo
      </button>
      <button
        disabled={attachmentQuery.isFetching || attachmentQuery.isError || uploadStatus.isLoading}
        onClick={() => doDownload()}>
        Baixar arquivo atual
      </button>
      <span>{(false && selectedFile && selectedFile.name) ?? "Nenhum arquivo selecionado"}</span>
      <input
        type="file"
        accept={extensions}
        onChange={inputChanged}
        ref={inputRef}
        className={style.fileInputCore}
      />

      <span className={style.uploadStatus}>
        {(uploadStatus.isLoading && "Enviando arquivo...") ||
          (attachmentQuery.isFetching && "Carregando...") ||
          (attachmentQuery.isSuccess && attachmentQuery.data.nome) ||
          (attachmentQuery.isError && "Nenhum arquivo cadastrado")}
      </span>
    </div>
  );
};

export default FileInput;
