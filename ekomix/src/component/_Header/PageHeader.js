import React from "react";


const PageHeader = (...props) => {

    return (
        <div class="page-header page-header-small">
            <img alt="..." class="path shape" src="index.htmlstatic/media/shape-s.2bcd2b74.png" />
            <div class="container">
                <h1 class="h1-seo">{page}</h1>
                <h3>This is the best way to find your favorite stuff</h3>
            </div>
        </div>
    );
}

export default PageHeader;