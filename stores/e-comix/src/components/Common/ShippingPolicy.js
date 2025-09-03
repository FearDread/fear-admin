import React from "react";
import Breadcrumbs from "../components/Common/Breadcrumbs";
import Meta from "../components/Meta/Meta";

const ShippingPolicy = () => {
  return (
    <>
      <Meta title={"Shipping Policy"} />
      <main className="float-start w-100 total-body home-body mt-0">
        <Breadcrumbs crumbs={{link:"/", crumb:"Shipping Policy"}} />
        <section className="about-hisotry float-start w-100 position-relative">
          <div className="container">
            <div className="row row-cols-1 row-cols-lg-2 g-5 mt-0 align-items-center">
              <div className="col position-relative">
                <div className="policy">
ONLINE RETURN POLICY
Effective as of: September 1 2025
1. RETURNS. We allow returns for refund only. We do not allow exchanges. For items purchased
online, returns are accepted within 30 days of the delivery date. To initiate a return, please contact us at
ecomix-support@gmail.com to obtain a return authorization. Be sure to include the item's order
number and your reason for the return. Returns that are shipped without authorization may not be
accepted. Please allow up to 10 business days for your refund to be processed once we receive your
return.
2. RETURN SHIPPING. Shipping instructions will be included with your return authorization.
3. ELIGIBLE ITEMS. The following items: Clearance items, Final Sale items, Perishable items,
Special-Order items, Custom Products, and Gift Cards are not eligible for return/exchange. We reserve
the right to refuse any return/exchange, at management's discretion, if the item being
returned/exchanged does not meet the criteria set forth within this policy.
4. CONDITION OF ITEMS. Except for items that were damaged when purchased, items must be in
new, unused, and in saleable condition with all original packaging intact and tags attached.
5. FORM OF PAYMENT. Refunds, if issued, will be issued in the original form of payment minus
shipping and handling fees unless otherwise stated. If the original form of payment is unavailable, store
credit may be issued at our discretion.
If you have any questions about this return policy, please contact us at fear.dedyn.io 
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
