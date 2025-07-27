


const UserCartItem = ({ data }) => {

    const linkref = "/product/" + data._id;

    const handleRemoveItem = () => {

    }

    return (
        <>

            <div class="comon-items-cart">
                <div class="left-section-div">
                    <figure>
                        <img src={data.images[0].url} alt="pn" />
                    </figure>
                    <div class="products-cart1">
                        <h5>{data.title}</h5>
                        <ul>
                            <li>
                                <span> Category: </span>
                                <span>{data.category}</span>
                            </li>
                            <li>
                                <span>
                                    Order ID:
                                </span>
                                <span>
                                    {data._id}
                                </span>
                            </li>
                            <li>
                                <span>
                                    Qty
                                </span>
                                <span>
                                    {data.quantity}
                                </span>
                            </li>
                        </ul>

                        <a onClick={handleRemoveItem} class="btn remove-btn p-0 mt-2">
                            <span> <i class="fas fa-trash"></i> </span> Remove
                        </a>
                    </div>
                </div>

                <div class="crat-linl-pay">
                    <h4> <span>$30.00</span> $20.00 </h4>
                    <h6>You Save $10.00</h6>


                    <div class="quantity-field" >
                        <button
                            class="value-button decrease-button"
                            onclick="decreaseValue(this)"
                            title="Azalt">-</button>
                        <div class="number">0</div>
                        <button
                            class="value-button increase-button"
                            onclick="increaseValue(this, 5)"
                            title="Arrtır"
                        >+
                        </button>
                    </div>

                </div>

            </div>

        </>
    )
}

export default UserCartItem