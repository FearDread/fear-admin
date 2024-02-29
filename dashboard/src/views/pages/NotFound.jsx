import React, { useEffect } from "react";
import { Button, Container } from "reactstrap";

const NotFound = () => {
  useEffect(() => {

  }, []);

  return (
    <>
      <Container
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Button href="/" type="primary">
            Back Home
          </Button>
        }
      />
    </>
  );
};

export default NotFound;
