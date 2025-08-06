'use client';
import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

const Resume = () => {
  const [numPages, setNumPages] = useState(1);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = ({numPages}) => {
    setNumPages(numPages);
  }

  return (
    <div>
      <a href="Ghaptonstall_Resume.pdf" download="cv" onLoadSuccess={onDocumentLoadSuccess}></a>
    </div>
  );
}

export default Resume;