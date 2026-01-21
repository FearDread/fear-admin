import React from 'react';
import Alert from 'react-bootstrap/Alert';

const ReactAlert = ({ props }) => {
    const { title, message, variant, onSubmit, onClose, onCancel } = props;
   const [show, setShow] = useState(false);

    const handleConfirm = () => {
        setShow(false);
        if (onSubmit && typeof onSubmit === 'function') onSubmit({success: true, message: 'Confirmed!'});
    };

    const handleCancel = () => {
        // Handle cancellation logic here
        console.log("Cancelled!");
        setShow(false);
        if (onCancel && typeof onCancel === 'function') onCancel({success: false, message: 'Cancelled!'});
    };

    return (
        <>
            {show && (
                <Alert variant={variant || "warning"} dismissible onClose={onClose}>
                    <Alert.Heading>{title}</Alert.Heading>
                    <p>
                        {message}
                    </p>
                    <div>
                        <Button variant="primary" onClick={handleConfirm}>
                            Confirm
                        </Button>
                        <Button variant="secondary" onClick={handleCancel}>
                            Cancel
                        </Button>
                    </div>
                </Alert>
            )}
        </>
    );
};

export default ReactAlert;