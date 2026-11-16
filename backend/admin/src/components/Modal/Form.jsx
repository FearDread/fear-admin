import React, { useState, useCallback } from "react";
import { Row, Col } from "reactstrap";
import { Modal, Form, Input, Button, SelectPicker, Toggle } from "rsuite";

const { Group: FormGroup, Control: FormControl, ControlLabel } = Form;

/* -------------------------------------------------------------------------
   Field accepters
   ---------------------------------------------------------------------- */

const Textarea = React.forwardRef((props, ref) => <Input {...props} as="textarea" ref={ref} />);

// <Form.Control> hands the accepter `value`, but <Toggle> reads `checked`
const ToggleField = ({ value, ...rest }) => <Toggle {...rest} checked={Boolean(value)} />;

/** Defaults per field `type`. A field's own `props` override these. */
const FIELD_TYPES = {
    text: {},
    email: { type: "email" },
    number: { type: "number" },
    password: { type: "password", autoComplete: "new-password" },
    textarea: { accepter: Textarea, rows: 3 },
    select: { accepter: SelectPicker, block: true },
    toggle: { accepter: ToggleField },
};

/* -------------------------------------------------------------------------
   Helpers
   ---------------------------------------------------------------------- */

const renderField = (field, formValue, setFormValue) => {
    // Escape hatch for anything the config can't describe
    if (field.render) return <React.Fragment key={field.name}>{field.render({ formValue, setFormValue })}</React.Fragment>;

    const { name, label, type = "text", required, props } = field;
    const control = <FormControl name={name} {...(FIELD_TYPES[type] || FIELD_TYPES.text)} {...props} placeholder={field.placeholder} />;

    return (
        <FormGroup key={name}>
            {label && (
                <ControlLabel>
                    {label}
                    {required && " *"}
                </ControlLabel>
            )}
            {type === "toggle" ? <div className="mt-2">{control}</div> : control}
        </FormGroup>
    );
};

/** Consecutive fields that have a `col` share one <Row>; the rest stack full width. */
const groupFields = (fields) => {
    const groups = [];
    fields.filter((field) => field && !field.hidden).forEach((field) => {
        const last = groups[groups.length - 1];
        if (!field.col) return groups.push({ row: false, items: [field] });
        if (last?.row) last.items.push(field);
        else groups.push({ row: true, items: [field] });
    });
    return groups;
};

/* -------------------------------------------------------------------------
   Component
   ---------------------------------------------------------------------- */

/**
 * Reusable add / edit modal. The page owns the form state; this owns layout and the submit button.
 *
 * fields: [{
 *   name,                       // key in formValue (required)
 *   label, placeholder,
 *   type,                       // text | email | number | password | textarea | select | toggle
 *   required,                   // appends " *" to the label (display only, validate in onSubmit)
 *   col,                        // 1-12: fields with a col sit side by side in one row
 *   hidden,                     // skip this field
 *   props,                      // passed to the control, e.g. { data, cleanable, renderValue, rows }
 *   render({ formValue, setFormValue }),  // fully custom field
 * }]
 *
 * onChange should be the useState setter, so toggles and custom fields can use the updater form.
 * onSubmit may be async: the button shows a spinner and ignores clicks until it settles.
 */
const FormModal = ({
    open,
    onClose,
    onSubmit,
    title,
    icon,
    submitLabel = "Save",
    submitIcon = "fa-check",
    cancelLabel = "Cancel",
    size = "md",
    className = "rs-theme-dark",
    formValue,
    onChange,
    fields = [],
    children,
}) => {
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = useCallback(async () => {
        if (submitting) return;
        setSubmitting(true);
        try {
            await onSubmit?.(formValue);
        } finally {
            setSubmitting(false);
        }
    }, [submitting, onSubmit, formValue]);

    return (
        <Modal open={open} onClose={onClose} size={size} className={className}>
            <Modal.Header>
                <Modal.Title>
                    {icon && <i className={`fa ${icon} mr-2`} aria-hidden="true"></i>}
                    {title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form fluid formValue={formValue} onChange={onChange} onSubmit={() => handleSubmit()}>
                    {groupFields(fields).map((group) =>
                        group.row ? (
                            <Row key={group.items.map((f) => f.name).join("|")}>
                                {group.items.map((field) => (
                                    <Col md={field.col} key={field.name}>
                                        {renderField(field, formValue, onChange)}
                                    </Col>
                                ))}
                            </Row>
                        ) : (
                            renderField(group.items[0], formValue, onChange)
                        )
                    )}
                    {children}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handleSubmit} appearance="primary" loading={submitting}>
                    {submitIcon && <i className={`fa ${submitIcon} mr-2`} aria-hidden="true"></i>}
                    {submitLabel}
                </Button>
                <Button onClick={onClose} appearance="subtle">{cancelLabel}</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default FormModal;