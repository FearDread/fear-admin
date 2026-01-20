import React, { useState, useImperativeHandle, useCallback } from "react";
import { Row, Col, Button, Card, CardBody, Progress, Badge } from "reactstrap";

/**
 * Modern Step 2 - Product Images
 * Updated for react-step-wizard
 */
const Step2 = React.forwardRef((props, ref) => {
  const { 
    title, 
    subtitle,
    nextStep,
    previousStep,
    currentStep,
    totalSteps,
    firstStep,
    lastStep,
    goToStep
  } = props;

  const [images, setImages] = useState([]);
  const [imagesPreviews, setImagesPreviews] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [errors, setErrors] = useState([]);
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const MAX_FILES = 5;
  const ACCEPTED_FORMATS = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  const validateFile = (file) => {
    const errors = [];

    if (!ACCEPTED_FORMATS.includes(file.type)) {
      errors.push(`${file.name}: Invalid format. Accepted: JPG, PNG, WEBP`);
    }
    if (file.size > MAX_FILE_SIZE) {
      errors.push(`${file.name}: File too large (max 5MB)`);
    }

    return errors;
  };

  /**
   * Process and add images
   */
  const processFiles = useCallback((files) => {
    const fileArray = Array.from(files);
    const validationErrors = [];

    // Check total count
    if (images.length + fileArray.length > MAX_FILES) {
      validationErrors.push(`Maximum ${MAX_FILES} images allowed`);
      setErrors(validationErrors);
      return;
    }

    // Validate each file
    fileArray.forEach(file => {
      const fileErrors = validateFile(file);
      validationErrors.push(...fileErrors);
    });

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setTimeout(() => setErrors([]), 5000);
      return;
    }

    // Clear previous errors
    setErrors([]);

    // Process valid files
    fileArray.forEach((file, index) => {
      const reader = new FileReader();
      
      reader.onloadstart = () => {
        setUploadProgress(prev => ({
          ...prev,
          [file.name]: 0
        }));
      };

      reader.onprogress = (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          setUploadProgress(prev => ({
            ...prev,
            [file.name]: progress
          }));
        }
      };

      reader.onload = () => {
        if (reader.readyState === 2) {
          // Add to previews
          setImagesPreviews(prev => [...prev, {
            id: Date.now() + index,
            url: reader.result,
            name: file.name,
            size: file.size
          }]);

          // Add to images array
          setImages(prev => [...prev, reader.result]);

          // Clear progress
          setTimeout(() => {
            setUploadProgress(prev => {
              const newProgress = { ...prev };
              delete newProgress[file.name];
              return newProgress;
            });
          }, 500);
        }
      };

      reader.onerror = () => {
        setErrors(prev => [...prev, `Failed to read ${file.name}`]);
      };

      reader.readAsDataURL(file);
    });
  }, [images.length]);

  /**
   * Handle file input change
   */
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  /**
   * Handle drag events
   */
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragOut = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  }, [processFiles]);

  /**
   * Remove image
   */
  const removeImage = (index) => {
    setImagesPreviews(prev => prev.filter((_, i) => i !== index));
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  /**
   * Set primary image
   */
  const setPrimaryImage = (index) => {
    if (index === 0) return; // Already primary

    // Move to first position
    setImagesPreviews(prev => {
      const newPreviews = [...prev];
      const [item] = newPreviews.splice(index, 1);
      newPreviews.unshift(item);
      return newPreviews;
    });

    setImages(prev => {
      const newImages = [...prev];
      const [item] = newImages.splice(index, 1);
      newImages.unshift(item);
      return newImages;
    });
  };

  /**
   * Format file size
   */
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  /**
   * Handle next button click
   */
  const handleNextClick = () => {
    if (images.length === 0) {
      setErrors(["Please upload at least one product image"]);
      return;
    }
    nextStep();
  };

  /**
   * Expose validation and state to parent
   */
  useImperativeHandle(ref, () => ({
    isValidated: () => {
      if (images.length === 0) {
        setErrors(["Please upload at least one product image"]);
        return false;
      }
      return true;
    },
    state: {
      data: {
        images,
        previews: imagesPreviews
      }
    }
  }));

  return (
    <>
      <div className="text-center mb-4">
        <h5 className="info-text text-white">
          <i className="fa fa-camera mr-2"></i>
          {title || "Product Media"}
        </h5>
        <p className="text-light-2 small">
          {subtitle || "Upload high-quality product images"}
        </p>
      </div>

      <Row className="justify-content-center">
        <Col lg="10">
          {/* Error Messages */}
          {errors.length > 0 && (
            <div className="alert alert-danger mb-4">
              <i className="fa fa-exclamation-triangle mr-2"></i>
              <strong>Upload Errors:</strong>
              <ul className="mb-0 mt-2">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Upload Area */}
          <Card 
            className={`upload-zone ${isDragging ? 'dragging' : ''}`}
            onDragEnter={handleDragIn}
            onDragLeave={handleDragOut}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            style={{
              border: isDragging ? '2px dashed #7934f3' : '2px dashed rgba(255,255,255,0.2)',
              backgroundColor: isDragging ? 'rgba(121, 52, 243, 0.1)' : 'rgba(0,0,0,0.2)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              minHeight: '250px'
            }}
          >
            <CardBody className="text-center py-5">
              <i 
                className="fa fa-cloud-upload" 
                style={{ 
                  fontSize: '64px', 
                  color: isDragging ? '#7934f3' : 'rgba(255,255,255,0.3)',
                  transition: 'color 0.3s ease'
                }}
              ></i>
              <h5 className="text-white mt-3">
                {isDragging ? "Drop files here" : "Drag & Drop Images"}
              </h5>
              <p className="text-light-2 mb-4">
                or click to browse
              </p>

              <input
                type="file"
                id="imageUpload"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                multiple
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              
              <Button
                color="primary"
                className="btn-round"
                onClick={() => document.getElementById('imageUpload').click()}
              >
                <i className="fa fa-folder-open mr-2"></i>
                Select Images
              </Button>

              <div className="mt-3">
                <small className="text-light-2">
                  <i className="fa fa-info-circle mr-1"></i>
                  Accepted: JPG, PNG, WEBP • Max size: 5MB • Max files: {MAX_FILES}
                </small>
              </div>

              <div className="mt-2">
                <Badge color="info" pill>
                  {images.length}/{MAX_FILES} images uploaded
                </Badge>
              </div>
            </CardBody>
          </Card>

          {/* Upload Progress */}
          {Object.keys(uploadProgress).length > 0 && (
            <Card className="mt-3">
              <CardBody>
                <h6 className="text-white mb-3">
                  <i className="fa fa-spinner fa-spin mr-2"></i>
                  Uploading...
                </h6>
                {Object.entries(uploadProgress).map(([fileName, progress]) => (
                  <div key={fileName} className="mb-2">
                    <div className="d-flex justify-content-between mb-1">
                      <small className="text-light-1">{fileName}</small>
                      <small className="text-light-1">{progress}%</small>
                    </div>
                    <Progress value={progress} color="primary" />
                  </div>
                ))}
              </CardBody>
            </Card>
          )}

          {/* Image Previews */}
          {imagesPreviews.length > 0 && (
            <div className="mt-4">
              <h6 className="text-white mb-3">
                <i className="fa fa-images mr-2"></i>
                Preview ({imagesPreviews.length})
              </h6>
              
              <Row>
                {imagesPreviews.map((preview, index) => (
                  <Col md="4" key={preview.id} className="mb-3">
                    <Card className="image-preview-card">
                      <div className="position-relative">
                        {/* Primary Badge */}
                        {index === 0 && (
                          <Badge 
                            color="success" 
                            className="position-absolute"
                            style={{ top: '10px', left: '10px', zIndex: 10 }}
                          >
                            <i className="fa fa-star mr-1"></i>
                            Primary
                          </Badge>
                        )}

                        {/* Image */}
                        <img
                          src={preview.url}
                          alt={`Preview ${index + 1}`}
                          style={{
                            width: '100%',
                            height: '200px',
                            objectFit: 'cover',
                            borderTopLeftRadius: '0.25rem',
                            borderTopRightRadius: '0.25rem'
                          }}
                        />

                        {/* Actions Overlay */}
                        <div 
                          className="image-actions-overlay"
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0,0,0,0.7)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: 0,
                            transition: 'opacity 0.3s ease'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                          onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
                        >
                          {index !== 0 && (
                            <Button
                              color="primary"
                              size="sm"
                              className="mr-2"
                              onClick={() => setPrimaryImage(index)}
                              title="Set as primary"
                            >
                              <i className="fa fa-star"></i>
                            </Button>
                          )}
                          <Button
                            color="danger"
                            size="sm"
                            onClick={() => removeImage(index)}
                            title="Remove image"
                          >
                            <i className="fa fa-trash"></i>
                          </Button>
                        </div>
                      </div>

                      {/* Image Info */}
                      <CardBody className="py-2">
                        <small className="text-light-2 d-block text-truncate">
                          {preview.name}
                        </small>
                        <small className="text-light-2">
                          {formatFileSize(preview.size)}
                        </small>
                      </CardBody>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          )}

          {/* Help Text */}
          <div className="bg-dark-light p-3 rounded mt-4">
            <h6 className="text-primary mb-2">
              <i className="fa fa-lightbulb-o mr-2"></i>
              Image Guidelines
            </h6>
            <ul className="text-light-2 small mb-0">
              <li>Use high-quality, well-lit images</li>
              <li>The first image will be used as the primary product image</li>
              <li>Include multiple angles and close-ups of important features</li>
              <li>Use a clean, neutral background for best results</li>
              <li>Recommended resolution: 1200x1200 pixels or higher</li>
            </ul>
          </div>

          {/* Navigation Buttons */}
          <div className="d-flex justify-content-between mt-5">
            <Button
              color="secondary"
              className="btn-round"
              onClick={previousStep}
              style={{ minWidth: '120px' }}
            >
              <i className="fa fa-arrow-left mr-2"></i>
              Previous
            </Button>

            <div className="text-center">
              <small className="text-light-2">
                Step {currentStep} of {totalSteps}
              </small>
            </div>

            <Button
              color="primary"
              className="btn-round"
              onClick={handleNextClick}
              style={{ minWidth: '120px' }}
            >
              Next
              <i className="fa fa-arrow-right ml-2"></i>
            </Button>
          </div>
        </Col>
      </Row>
    </>
  );
});

Step2.displayName = "Step2";

export default Step2;