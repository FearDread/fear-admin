// BlogSteps/Step2.js
import React, { useState, useImperativeHandle, useCallback } from "react";
import { Row, Col, Button, Card, CardBody, Progress, Badge } from "reactstrap";

const BlogStep2 = React.forwardRef((props, ref) => {
    const {
        nextStep,
        previousStep,
        currentStep,
        totalSteps,
    } = props;

    const [featuredImage, setFeaturedImage] = useState(null);
    const [featuredPreview, setFeaturedPreview] = useState(null);
    const [images, setImages] = useState([]);
    const [imagesPreviews, setImagesPreviews] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({});
    const [errors, setErrors] = useState([]);

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const MAX_FILES = 10;
    const ACCEPTED_FORMATS = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const validateFile = (file) => {
        const errors = [];
        if (!ACCEPTED_FORMATS.includes(file.type)) {
            errors.push(`${ file.name }: Invalid format.Accepted: JPG, PNG, WEBP`);
        }
        if (file.size > MAX_FILE_SIZE) {
            errors.push(`${ file.name }: File too large(max 5MB)`);
        }
        return errors;
    };

    const processFeaturedImage = (file) => {
        const validationErrors = validateFile(file);
        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            setTimeout(() => setErrors([]), 5000);
            return;
        }

        setErrors([]);
        const reader = new FileReader();

        reader.onloadstart = () => {
            setUploadProgress(prev => ({ ...prev, featured: 0 }));
        };

        reader.onprogress = (e) => {
            if (e.lengthComputable) {
                const progress = Math.round((e.loaded / e.total) * 100);
                setUploadProgress(prev => ({ ...prev, featured: progress }));
            }
        };

        reader.onload = () => {
            setFeaturedImage(reader.result);
            setFeaturedPreview({
                url: reader.result,
                name: file.name,
                size: file.size
            });
            setTimeout(() => {
                setUploadProgress(prev => {
                    const newProgress = { ...prev };
                    delete newProgress.featured;
                    return newProgress;
                });
            }, 500);
        };

        reader.readAsDataURL(file);
    };
    const processFiles = useCallback((files) => {
        const fileArray = Array.from(files);
        const validationErrors = [];
        if (images.length + fileArray.length > MAX_FILES) {
            validationErrors.push(`Maximum ${MAX_FILES} images allowed`);
            setErrors(validationErrors);
            return;
        }

        fileArray.forEach(file => {
            const fileErrors = validateFile(file);
            validationErrors.push(...fileErrors);
        });

        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            setTimeout(() => setErrors([]), 5000);
            return;
        }

        setErrors([]);

        fileArray.forEach((file, index) => {
            const reader = new FileReader();

            reader.onloadstart = () => {
                setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));
            };

            reader.onprogress = (e) => {
                if (e.lengthComputable) {
                    const progress = Math.round((e.loaded / e.total) * 100);
                    setUploadProgress(prev => ({ ...prev, [file.name]: progress }));
                }
            };

            reader.onload = () => {
                setImagesPreviews(prev => [...prev, {
                    id: Date.now() + index,
                    url: reader.result,
                    name: file.name,
                    size: file.size
                }]);
                setImages(prev => [...prev, reader.result]);
                setTimeout(() => {
                    setUploadProgress(prev => {
                        const newProgress = { ...prev };
                        delete newProgress[file.name];
                        return newProgress;
                    });
                }, 500);
            };

            reader.readAsDataURL(file);
        });
    }, [images.length]);
    const handleFeaturedChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            processFeaturedImage(e.target.files[0]);
        }
    };
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            processFiles(e.target.files);
        }
    };
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
    const removeFeaturedImage = () => {
        setFeaturedImage(null);
        setFeaturedPreview(null);
    };
    const removeImage = (index) => {
        setImagesPreviews(prev => prev.filter((p, i) => i !== index));
        setImages(prev => prev.filter((p, i) => i !== index));
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };
    const handleNextClick = () => {
        // Featured image is optional for blog posts
        nextStep();
    };
    useImperativeHandle(ref, () => ({
        isValidated: () => true, // Media is optional
        state: {
            data: {
                featuredImage,
                images
            }
        }
    }));
    return (
        <>
            <div className="text-center mb-4">
                <h5 className="info-text text-white">
                    <i className="fa fa-image mr-2"></i>
                    Blog Media
                </h5>
                <p className="text-light-2 small">
                    Add a featured image and additional media (optional)
                </p>
            </div>
            <Row className="justify-content-center">
                <Col lg="10">
                    {/* Errors */}
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

                    {/* Featured Image */}
                    <Card className="mb-4">
                        <CardBody>
                            <h6 className="text-white mb-3">
                                <i className="fa fa-star mr-2"></i>
                                Featured Image
                            </h6>

                            {!featuredPreview ? (
                                <div className="text-center py-4">
                                    <i className="fa fa-image" style={{ fontSize: '48px', color: 'rgba(255,255,255,0.3)' }}></i>
                                    <p className="text-light-2 mt-3 mb-3">
                                        Add a featured image for your blog post
                                    </p>
                                    <input
                                        type="file"
                                        id="featuredUpload"
                                        accept="image/jpeg,image/jpg,image/png,image/webp"
                                        onChange={handleFeaturedChange}
                                        style={{ display: 'none' }}
                                    />
                                    <Button
                                        color="primary"
                                        size="sm"
                                        className="btn-round"
                                        onClick={() => document.getElementById('featuredUpload').click()}
                                    >
                                        <i className="fa fa-upload mr-2"></i>
                                        Upload Featured Image
                                    </Button>
                                </div>
                            ) : (
                                <div className="position-relative">
                                    <img
                                        src={featuredPreview.url}
                                        alt="Featured"
                                        style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '0.25rem' }}
                                    />
                                    <Button
                                        color="danger"
                                        size="sm"
                                        className="position-absolute"
                                        style={{ top: '10px', right: '10px' }}
                                        onClick={removeFeaturedImage}
                                    >
                                        <i className="fa fa-trash"></i>
                                    </Button>
                                    <div className="mt-2">
                                        <small className="text-light-2">
                                            {featuredPreview.name} ({formatFileSize(featuredPreview.size)})
                                        </small>
                                    </div>
                                </div>
                            )}
                        </CardBody>
                    </Card>

                    {/* Additional Images */}
                    <h6 className="text-white mb-3">
                        <i className="fa fa-images mr-2"></i>
                        Additional Images (Optional)
                    </h6>

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
                            minHeight: '200px'
                        }}
                    >
                        <CardBody className="text-center py-4">
                            <i
                                className="fa fa-cloud-upload"
                                style={{
                                    fontSize: '48px',
                                    color: isDragging ? '#7934f3' : 'rgba(255,255,255,0.3)'
                                }}
                            ></i>
                            <h6 className="text-white mt-3">
                                {isDragging ? "Drop files here" : "Drag & Drop Images"}
                            </h6>
                            <p className="text-light-2 mb-3">or click to browse</p>

                            <input
                                type="file"
                                id="imagesUpload"
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                multiple
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                            />

                            <Button
                                color="secondary"
                                size="sm"
                                className="btn-round"
                                onClick={() => document.getElementById('imagesUpload').click()}
                            >
                                <i className="fa fa-folder-open mr-2"></i>
                                Select Images
                            </Button>

                            <div className="mt-3">
                                <small className="text-light-2">
                                    JPG, PNG, WEBP • Max: 5MB • {images.length}/{MAX_FILES}
                                </small>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Upload Progress */}
                    {Object.keys(uploadProgress).length > 0 && (
                        <Card className="mt-3">
                            <CardBody>
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

                    {/* Images Preview */}
                    {imagesPreviews.length > 0 && (
                        <div className="mt-4">
                            <h6 className="text-white mb-3">
                                Gallery ({imagesPreviews.length})
                            </h6>
                            <Row>
                                {imagesPreviews.map((preview, index) => (
                                    <Col md="3" key={preview.id} className="mb-3">
                                        <Card>
                                            <div className="position-relative">
                                                <img
                                                    src={preview.url}
                                                    alt={`Preview ${index + 1}`}
                                                    style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                                                />
                                                <Button
                                                    color="danger"
                                                    size="sm"
                                                    className="position-absolute"
                                                    style={{ top: '5px', right: '5px' }}
                                                    onClick={() => removeImage(index)}
                                                >
                                                    <i className="fa fa-trash"></i>
                                                </Button>
                                            </div>
                                            <CardBody className="py-2">
                                                <small className="text-light-2 d-block text-truncate">
                                                    {preview.name}
                                                </small>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </div>
                    )}

                    {/* Navigation */}
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
BlogStep2.displayName = "BlogStep2";
export default BlogStep2;