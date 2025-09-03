import React from "react";
import BreadCrumbs from "../components/Common/BreadCrumbs";
import Meta from "../components/Meta/Meta";

const ShippingPolicy = () => {
  return (
    <>
      <Meta title={"Shipping Policy"} />

      <main className="float-start w-100 total-body home-body mt-0">
        <BreadCrumbs breadcrumbs={[{ id: 'shipping', label: 'Shipping', path: '/shipping-policy' }]} />
        <section className="about-hisotry float-start w-100 position-relative">
          <div className="container">
            <div className="row row-cols-1 row-cols-lg-2 g-5 mt-0 align-items-center">
              <div className="col position-relative">
                <div className="policy">

                  SHIPPING POLICY
                  This shipping policy is for FEAR Inc. and was last updated on 09/02/2025.

                  1. SHIPPING / DELIVERY OPTIONS
                  Free standard shipping on orders over $50.
                  Shipping Fees:
                  • Domestic Standard (5-7 business days): $5.00
                  • Domestic Express (2-3 business days): $25.00

                  2. PROCESSING TIME

                  Orders are processed within 2-3 business day(s) excluding weekends and public holidays. Once the
                  item has been handed to the delivery carrier, a tracking number will be sent to the customer.

                  3. CANCELLATIONS

                  After an order is submitted, processing begins and the order cannot be canceled. If there are questions
                  about canceling an order, please contact us.

                  4. RETURNS
                  Returns will be accepted within 30 day(s) from the original purchase date. Items must be returned
                  unused and in original condition. Some items, such as items on sale, may be ineligible for returns. For
                  more information, visit www.e-comix.com/return-policy

                  5. DELAYED ORDERS

                  In the case of delayed processing, customers will have the option to cancel their order for a full refund.
                  Shipping provider delays do not fall under the seller’s liability. For delayed orders, please first contact
                  the shipping carrier for the item’s status.

                  6. DAMAGED ORDERS

                  Our business is not liable for lost or damaged products after the order has been placed in the hands of
                  the shipping carrier. If your product has arrived damaged, reach out to us so that we may assist you in
                  filing a claim with the shipping provider.

                  7. SHIPPING RESTRICTIONS

                  The TSA (Transportation Security Administration) has restrictions on what items can be shipped
                  through air transportation in the U.S. As such, any unauthorized items for air shipment may require a
                  different shipping method.
                  Page 1

                  8. CONTACT
                  For questions about this shipping policy, contact our business at

                  Phone number: (254) 435-0130
                  Email address: ecomix-support@gmail.com
                  Page 2
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default ShippingPolicy;
