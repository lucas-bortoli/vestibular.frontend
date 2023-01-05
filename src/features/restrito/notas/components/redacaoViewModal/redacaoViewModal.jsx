import { useEffect, useState } from "react";
import ReactModal from "react-modal";
import { useSelector } from "react-redux";
import { useGetRedacaoQuery } from "../../../../../api/restrito/slice";
import styles from "./redacaoViewModal.module.css";

/**
 * Viewer (read-only) de redações. O CSS é semelhante ao usado no editor, para
 * obter a fidelidade visual do texto.
 */
export const RedacaoViewModal = ({ isOpen, onRequestClose, participanteId }) => {
  const userToken = useSelector((state) => state.restrito.auth.token);
  const redacaoQuery = useGetRedacaoQuery({ token: userToken, participanteId });

  const [redacaoCorpo, setRedacaoCorpo] = useState("");
  const [redacaoTempo, setRedacaoTempo] = useState(0);

  useEffect(() => {
    if (redacaoQuery.isSuccess) {
      setRedacaoCorpo(redacaoQuery.data.corpo);
      setRedacaoTempo(redacaoQuery.data.fimTimestamp - redacaoQuery.data.inicioTimestamp);
    } else if (redacaoQuery.isError || redacaoQuery.isLoading) {
      setRedacaoCorpo("");
      setRedacaoTempo(0);
    }
  }, [redacaoQuery.isSuccess, redacaoQuery.error]);

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={() => onRequestClose()}
      className="appModal"
      ariaHideApp={false}>
      <div className="modal-content">
        <h2 className="modal-title">Visualizar redação</h2>
        {redacaoQuery.isSuccess && (
          <div className={styles.pageWrapper}>
            <div className={styles.page}>
              <textarea spellCheck={true} readOnly={true} value={redacaoCorpo}></textarea>
            </div>
            <br />
            <span>{redacaoCorpo.length} caracteres</span>
            <span>
              Prova realizada em{" "}
              {new Date(redacaoTempo || 0).toISOString().split("T")[1].slice(0, 8)}
            </span>
          </div>
        )}
        {redacaoQuery.isError && (
          <>
            <p>Não há nenhuma redação enviada por este participante.</p>
          </>
        )}
        {redacaoQuery.isLoading && (
          <>
            <p>Carregando dados...</p>
          </>
        )}
      </div>
      <div className="modal-footer">
        <button onClick={() => onRequestClose()} className="primary">
          OK
        </button>
      </div>
    </ReactModal>
  );
};
