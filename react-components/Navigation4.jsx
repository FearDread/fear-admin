import React from 'react';

function Navigation4() {
  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb mb-0 p-0">
        <li className="breadcrumb-item"><a href="javascript:;"><i className="bx bx-home-alt"></i> Home</a>
      </li>
      <li className="breadcrumb-item"><a href="javascript:;">Blog</a>
    </li>
    <li className="breadcrumb-item active" aria-current="page">Blog Posts</li>
    </ol>
    </nav>
  );
}

export default Navigation4;
