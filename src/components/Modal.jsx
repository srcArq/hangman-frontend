import { useRef, useEffect } from 'react';

const Modal = ({ open, title, message, image, actionLabel, onAction }) => {
  const dialogRef = useRef();

  useEffect(() => {
    if (open) {
      dialogRef.current.showModal();
    } else {
      dialogRef.current.close();
    }
  }, [open]);

  return (
    <dialog ref={dialogRef} className="dialog-modal" aria-label={title}>
      <form method="dialog">
        <h2 className="title-modal">{title}</h2>
        {image && <img className="image-modal" src={image} alt={title} />}
        <p className="message-modal">{message}</p>
        <div>
          <button type="button" onClick={onAction}>
            {actionLabel}
          </button>
        </div>
      </form>
    </dialog>
  );
};

export default Modal;
