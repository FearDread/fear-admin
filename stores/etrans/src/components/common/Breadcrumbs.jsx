

const BreadCrumbs = (crumbs) => {

    if (!crumbs) crumbs = [
        {href: 'javascript:;', icon: 'bx bx-home-alt', label: 'Home', active:false},
        {href: null, icon: null, label: 'About Us', active:true}
    ]

    return (
        <>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-0 p-0">
                    {crumbs.forEach((idx, crumb) => {
                        if (crumb.active) {
                        return (
                            <li className='breadcrumb-item active' aria-current="page">${crumb.label}</li>
                        )
                        }

                    })}
                    <li className="breadcrumb-item">
                        <a href="javascript:;">
                            <i className="bx bx-home-alt"></i> Home
                        </a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">About Us</li>
                </ol>
            </nav>
        </>
    );
}