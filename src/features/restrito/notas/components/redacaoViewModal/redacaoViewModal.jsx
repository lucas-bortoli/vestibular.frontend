import ReactModal from "react-modal";

import styles from "./redacaoViewModal.module.css";

export const RedacaoViewModal = ({ isOpen, onRequestClose }) => {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={() => onRequestClose()}
      className="appModal"
      ariaHideApp={false}>
      <div className="modal-content">
        <h2 className="modal-title">Redação</h2>
        <div className={styles.pageWrapper}>
          <div className={styles.page}>
            <textarea spellCheck={true} readOnly={true} maxLength={720}></textarea>
          </div>
          <br />
          <span>201 caracteres</span>
          <span>Prova realizada em 00:32:10</span>
        </div>
      </div>
      <div className="modal-footer">
        <button onClick={() => onRequestClose()} className="primary">
          OK
        </button>
      </div>
    </ReactModal>
  );
};
