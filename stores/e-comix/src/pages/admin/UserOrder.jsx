import { useSelector } from "react-redux";
import Loader from "../../components/Loader/Loader";
import { Link } from "react-router-dom";
import BannerSub from "../../components/Banner/BannerSub";
import { store } from "../../features/store";
import { Order } from "../../features/orders/slice";
//import { Link } from "react-router-dom";
//import { useGetMyOrdersQuery } from "../../redux/api/orderApiSlice";

const UserOrder = () => {
  const { data: orders, loading, success, error } = useSelector( state => state.order.data );

  return (
    <>
    <BannerSub />
    <div className="container mx-auto">
      <h2 className="text-2xl font-semibold mb-4">My Orders </h2>

      {loading ? (
        <Loader />
      ) : error ? (
        <div> error </div>
      ) : (
        <table className="w-full">
          <thead>
            <tr>
              <td className="py-2">IMAGE</td>
              <td className="py-2">ID</td>
              <td className="py-2">DATE</td>
              <td className="py-2">TOTAL</td>
              <td className="py-2">PAID</td>
              <td className="py-2">DELIVERED</td>
              <td className="py-2"></td>
            </tr>
          </thead>

          <tbody>
            {orders?.map((order) => (
              <tr key={order._id}>
                <img
                  src={order.orderItems[0].image}
                  alt={order.user}
                  className="w-[6rem] mb-5"
                />

                <td className="py-2">{order._id}</td>
                <td className="py-2">{order.createdAt.substring(0, 10)}</td>
                <td className="py-2">$ {order.totalPrice}</td>

                <td className="py-2">
                  {order.isPaid ? (
                    <p className="p-1 text-center bg-green-400 w-[6rem] rounded-full">
                      Completed
                    </p>
                  ) : (
                    <p className="p-1 text-center bg-red-400 w-[6rem] rounded-full">
                      Pending
                    </p>
                  )}
                </td>

                <td className="px-2 py-2">
                  {order.isDelivered ? (
                    <p className="p-1 text-center bg-green-400 w-[6rem] rounded-full">
                      Completed
                    </p>
                  ) : (
                    <p className="p-1 text-center bg-red-400 w-[6rem] rounded-full">
                      Pending
                    </p>
                  )}
                </td>

                <td className="px-2 py-2">
                  <Link to={`/order/${order._id}`}>
                    <button className="bg-pink-400 text-back py-2 px-3 rounded">
                      View Details
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
    </>
  );
};

export default UserOrder;
