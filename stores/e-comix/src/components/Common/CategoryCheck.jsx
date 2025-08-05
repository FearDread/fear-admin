

const CategoryCheck = (props) => {

    return (
    <>
        <div className="form-check corm-check">
            <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault2" />
            <label className="form-check-label" htmlFor="flexCheckDefault2">
                {props.title}
            </label>
        </div>
    </>
    )
}

export default CategoryCheck;