import React from "react";

const Breadcrumb = (props) => {

    const { crumbs } = props || {link: '', crumb: ''};

    return (
        <section className="bedcrum float-start w-100">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
                
                    <li className="breadcrumb-item"><a href={crumbs.link}> Home </a></li>
                    <li className="breadcrumb-item active" aria-current="page"> {crumbs.crumb} </li>

                
            </ol>
          </nav>
        </div>
      </section>
    )
}

export default Breadcrumb;