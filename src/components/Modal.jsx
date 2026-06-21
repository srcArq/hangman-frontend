import { useRef, useEffect } from 'react';

const Modal = ({ open, title, message, image, actionLabel, onAction, variant }) => {
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
        {image && (
          <div className={`image-modal-wrap ${variant ?? ''}`}>
            <img
              className={`image-modal ${variant === 'win' ? 'trophy-bounce' : ''}`}
              src={image}
              alt={title}
            />
            {variant === 'lose' && (
              <>
                <span className="tear tear-1" aria-hidden="true"></span>
                <span className="tear tear-2" aria-hidden="true"></span>
                <span className="tear tear-3" aria-hidden="true"></span>
              </>
            )}
          </div>
        )}
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
