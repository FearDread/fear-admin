import React, { useState, useImperativeHandle } from "react";
import {
  Input,
  Row,
  Col,
  FormGroup,
  Label,
  Button,
  Card,
  CardBody,
} from "reactstrap";

const BlogStep3 = React.forwardRef((props, ref) => {
  const { 
    onFinish, 
    previousStep,
    currentStep,
    totalSteps
  } = props;

  const [formData, setFormData] = useState({
    published: false,
    featured: false,
    allowComments: true,
    visibility: "public",
    metaTitle: "",
    metaDescription: ""
  });

  const [isValidating, setIsValidating] = useState(false);

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFinishClick = async () => {
    setIsValidating(true);
    if (onFinish) {
      await onFinish();
    }
    setIsValidating(false);
  };

  useImperativeHandle(ref, () => ({
    isValidated: () => true, // Settings are all optional
    state: {
      data: formData
    }
  }));

  return (
    <>
      <div className="text-center mb-4">
        <h5 className="info-text text-white">
          <i className="fa fa-cog mr-2"></i>
          Post Settings
        </h5>
        <p className="text-light-2 small">
          Configure publishing options and SEO settings
        </p>
      </div>

      <Row className="justify-content-center mt-4">
        {/* Publishing Options */}
        <Col sm="10">
          <Card className="mb-4">
            <CardBody>
              <h6 className="text-primary mb-3">
                <i className="fa fa-globe mr-2"></i>
                Publishing Options
              </h6>

              <Row>
                <Col md="6">
                  <FormGroup>
                    <Input
                      type="switch"
                      id="published"
                      name="published"
                      label="Publish immediately"
                      checked={formData.published}
                      onChange={handleChange("published")}
                    />
                    <small className="text-light-2">
                      {formData.published ? 'Post will be published now' : 'Save as draft'}
                    </small>
                  </FormGroup>
                </Col>

                <Col md="6">
                  <FormGroup>
                    <Input
                      type="switch"
                      id="featured"
                      name="featured"
                      label="Mark as featured"
                      checked={formData.featured}
                      onChange={handleChange("featured")}
                    />
                    <small className="text-light-2">
                      Featured posts appear in highlighted sections
                    </small>
                  </FormGroup>
                </Col>

                <Col md="6">
                  <FormGroup>
                    <Input
                      type="switch"
                      id="allowComments"
                      name="allowComments"
                      label="Allow comments"
                      checked={formData.allowComments}
                      onChange={handleChange("allowComments")}
                    />
                    <small className="text-light-2">
                      Readers can leave comments on this post
                    </small>
                  </FormGroup>
                </Col>

                <Col md="6">
                  <FormGroup>
                    <Label className="text-light-1">Visibility</Label>
                    <Input
                      type="select"
                      name="visibility"
                      value={formData.visibility}
                      onChange={handleChange("visibility")}
                      className="form-control"
                    >
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                      <option value="password">Password Protected</option>
                      <option value="members-only">Members Only</option>
                    </Input>
                    <small className="text-light-2">
                      Control who can view this post
                    </small>
                  </FormGroup>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>

        {/* SEO Settings */}
        <Col sm="10">
          <Card>
            <CardBody>
              <h6 className="text-primary mb-3">
                <i className="fa fa-search mr-2"></i>
                SEO Settings
              </h6>

              <FormGroup>
                <Label className="text-light-1">
                  Meta Title <span className="text-light-2">(optional)</span>
                </Label>
                <Input
                  name="metaTitle"
                  placeholder="Custom meta title for search engines..."
                  type="text"
                  value={formData.metaTitle}
                  onChange={handleChange("metaTitle")}
                  className="form-control"
                  maxLength="70"
                />
                <small className="text-light-2">
                  {formData.metaTitle.length}/70 characters (defaults to post title)
                </small>
              </FormGroup>

              <FormGroup>
                <Label className="text-light-1">
                  Meta Description <span className="text-light-2">(optional)</span>
                </Label>
                <Input
                  type="textarea"
                  name="metaDescription"
                  value={formData.metaDescription}
                  placeholder="Custom meta description for search engines..."
                  rows="3"
                  onChange={handleChange("metaDescription")}
                  className="form-control"
                  maxLength="160"
                />
                <small className="text-light-2">
                  {formData.metaDescription.length}/160 characters (defaults to excerpt)
                </small>
              </FormGroup>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Summary */}
      <Row className="justify-content-center mt-4">
        <Col sm="10">
          <Card className="bg-primary-light border-primary">
            <CardBody>
              <h6 className="text-primary mb-3">
                <i className="fa fa-info-circle mr-2"></i>
                Publishing Summary
              </h6>
              
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-light-1">Status:</span>
                <span className={`font-weight-bold ${formData.published ? 'text-success' : 'text-warning'}`}>
                  {formData.published ? 'Will Publish' : 'Save as Draft'}
                </span>
              </div>

              {formData.featured && (
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-light-1">Featured:</span>
                  <span className="text-warning">
                    <i className="fa fa-star mr-1"></i>
                    Yes
                  </span>
                </div>
              )}

              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-light-1">Visibility:</span>
                <span className="text-info text-capitalize">
                  {formData.visibility.replace('-', ' ')}
                </span>
              </div>

              <div className="d-flex justify-content-between align-items-center">
                <span className="text-light-1">Comments:</span>
                <span className={formData.allowComments ? 'text-success' : 'text-danger'}>
                  {formData.allowComments ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Help Text */}
      <Row className="justify-content-center mt-4">
        <Col sm="10">
          <div className="bg-dark-light p-3 rounded">
            <h6 className="text-primary mb-2">
              <i className="fa fa-lightbulb-o mr-2"></i>
              Publishing Tips
            </h6>
            <ul className="text-light-2 small mb-0">
              <li>Publish immediately to make your post live right away</li>
              <li>Save as draft to preview and edit before publishing</li>
              <li>Featured posts get more visibility on your site</li>
              <li>Optimize meta title and description for better search rankings</li>
              <li>Use visibility settings to control access to your content</li>
            </ul>
          </div>
        </Col>
      </Row>

      {/* Navigation */}
      <Row className="justify-content-center mt-5">
        <Col sm="10">
          <div className="d-flex justify-content-between">
            <Button
              color="secondary"
              className="btn-round"
              onClick={previousStep}
              style={{ minWidth: '120px' }}
            >
              <i className="fa fa-arrow-left mr-2"></i>
              Previous
            </Button>

            <Button
              color="success"
              className="btn-round"
              onClick={handleFinishClick}
              disabled={isValidating}
              style={{ minWidth: '150px' }}
            >
              {isValidating ? (
                <>
                  <span className="spinner-border spinner-border-sm mr-2"></span>
                  Creating...
                </>
              ) : (
                <>
                  <i className="fa fa-check mr-2"></i>
                  {formData.published ? 'Publish Post' : 'Save Draft'}
                </>
              )}
            </Button>
          </div>
        </Col>
      </Row>
    </>
  );
});

BlogStep3.displayName = "BlogStep3";

export default BlogStep3;