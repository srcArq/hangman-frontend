// src/components/Modal.jsx
import React, { useRef, useEffect } from 'react';

const Modal = ({ open, title, message, actionLabel, onAction }) => {
  const dialogRef = useRef();

  useEffect(() => {
    console.log('Modal open state:', open);
    if (open) {
      dialogRef.current.showModal();
    } else {
      dialogRef.current.close();
    }
  }, [open]);

  return (
    <dialog ref={dialogRef} className="dialog-modal">
      <form method="dialog" style={{ padding: '1.5rem', width: '90vw', maxWidth: '400px' }}>
        <h2 className="title-modal">{title}</h2>
        <p className="message-modal">{message}</p>
        <div>
          <button
            type="button"
            onClick={onAction}
          >
            {actionLabel}
          </button>
        </div>
      </form>
    </dialog>
  );
};


export default Modal;
