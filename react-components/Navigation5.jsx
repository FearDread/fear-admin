import React from 'react';

function Navigation5() {
  return (
    <nav className="d-flex justify-content-between" aria-label="Page navigation">
      <ul className="pagination">
        <li className="page-item"><a className="page-link" href="javascript:;"><i className='bx bx-chevron-left'></i> Prev</a>
      </li>
    </ul>
    <ul className="pagination">
      <li className="page-item active d-none d-sm-block" aria-current="page"><span className="page-link">1<span className="visually-hidden">(current)</span></span>
    </li>
    <li className="page-item d-none d-sm-block"><a className="page-link" href="javascript:;">2</a>
    </li>
    <li className="page-item d-none d-sm-block"><a className="page-link" href="javascript:;">3</a>
    </li>
    <li className="page-item d-none d-sm-block"><a className="page-link" href="javascript:;">4</a>
    </li>
    <li className="page-item d-none d-sm-block"><a className="page-link" href="javascript:;">5</a>
    </li>
    </ul>
    <ul className="pagination">
      <li className="page-item"><a className="page-link" href="javascript:;" aria-label="Next">Next <i className='bx bx-chevron-right'></i></a>
    </li>
    </ul>
    </nav>
  );
}

export default Navigation5;
