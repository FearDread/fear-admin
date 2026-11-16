import React, { useState, useCallback } from "react";
import { Modal, Button } from "rsuite";

/**
 * Reusable confirmation dialog (delete, archive, ...).
 *
 * <ConfirmModal open onClose onConfirm title="Delete User?" itemName="Jane Doe" />
 *
 * Pass `itemName` for the standard "delete <name>" message, or `children` to write your own.
 * onConfirm may be async: the button shows a spinner and ignores clicks until it settles.
 */
const ConfirmModal = ({
    open,
    onClose,
    onConfirm,
    title = "Are you sure?",
    icon = "fa-exclamation-triangle",
    itemName,
    children,
    confirmLabel = "Yes, Delete It",
    confirmIcon = "fa-trash",
    cancelLabel = "Cancel",
    color = "red",
    size = "xs",
    className = "rs-theme-dark",
}) => {
    const [submitting, setSubmitting] = useState(false);

    const handleConfirm = useCallback(async () => {
        if (submitting) return;
        setSubmitting(true);
        try {
            await onConfirm?.();
        } finally {
            setSubmitting(false);
        }
    }, [submitting, onConfirm]);

    return (
        <Modal open={open} onClose={onClose} size={size} className={className}>
            <Modal.Header>
                <Modal.Title>
                    {icon && <i className={`fa ${icon} mr-2 text-${color === "red" ? "danger" : "warning"}`} aria-hidden="true"></i>}
                    {title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p style={{ color: "rgba(255,255,255,0.7)" }}>
                    {children ?? (
                        <>
                            Are you sure you want to delete &quot;<strong style={{ color: "white" }}>{itemName}</strong>&quot;? This action cannot be undone.
                        </>
                    )}
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handleConfirm} appearance="primary" color={color} loading={submitting}>
                    {confirmIcon && <i className={`fa ${confirmIcon} mr-2`} aria-hidden="true"></i>}
                    {confirmLabel}
                </Button>
                <Button onClick={onClose} appearance="subtle">{cancelLabel}</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ConfirmModal;