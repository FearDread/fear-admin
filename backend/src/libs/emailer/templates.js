module.exports = {

    welcome(data) { 
        return `
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<link href="https://fonts.googleapis.com/css2?family=Anton&amp;family=Space+Mono:ital@0;1&amp;display=swap" rel="stylesheet">
<!--[if mso]><style>td,p,a{font-family:Arial,sans-serif!important;}</style><![endif]-->


<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#080808;">
  <tbody><tr><td align="center" style="padding:24px 16px;">
    <table width="640" cellpadding="0" cellspacing="0" border="0" style="max-width:640px;width:100%;background:#0e0e0e;border:1px solid #242424;">
      
      
  <tbody><tr>
    <td style="background:#131313;border-bottom:3px solid #c41a1a;padding:22px 32px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tbody><tr>
          <td>
            <span style="font-family:'Anton',Impact,sans-serif;font-size:28px;color:#f0f0f0;letter-spacing:.05em;">
              e<span style="color:#c41a1a;">Fear</span>
            </span>
            <span style="font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:#5a5a5a;display:inline-block;padding-left:14px;margin-left:10px;border-left:1px solid #242424;">
              Comics · Collectibles
            </span>
          </td>
          <td align="right" style="font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:#5a5a5a;">
            Account Confirmation
          </td>
        </tr>
      </tbody></table>
    </td>
  </tr>
      
  <tr>
    <td style="padding:36px 32px 20px;">
      <div style="font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.22em;text-transform:uppercase;color:#c41a1a;margin-bottom:8px;">// welcome aboard</div>
      <div style="font-family:'Anton',Impact,sans-serif;font-size:30px;color:#f0f0f0;letter-spacing:.03em;line-height:1.1;">You're part
of the crew.</div>
    </td>
  </tr>
      <tr>
        <td style="padding:0 32px 28px;">
          <p style="font-family:'Space Mono',monospace;font-size:12px;color:#b0b0b0;line-height:1.9;margin-bottom:20px;">
            Hey <strong style="color:#f0f0f0;">${data.firstName}</strong>,<br><br>
            Your eFear account is live. Comics, graphic novels, trading cards, manga — all of it, one login. We don't do junk mail. We do drops, restocks, and members-only deals.
          </p>
          <table cellpadding="0" cellspacing="0" border="0">
            <tbody><tr>
              <td style="padding-right:12px;">
  <a href=${data.userUrl} style="display:inline-block;padding:13px 28px;background:#c41a1a;color:#fff;font-family:'Space Mono',monospace;font-size:11px;letter-spacing:.12em;text-transform:uppercase;text-decoration:none;clip-path:polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px));">
    Go to My Account →
  </a></td>
              <td>
  <a href="#" style="display:inline-block;padding:12px 28px;border:1px solid #242424;color:#b0b0b0;font-family:'Space Mono',monospace;font-size:11px;letter-spacing:.12em;text-transform:uppercase;text-decoration:none;">
    Browse the Store
  </a></td>
            </tr>
          </tbody></table>
        </td>
      </tr>
      <tr><td style="padding:0 32px;"><div style="height:1px;background:#242424;"></div></td></tr>
      <tr>
        <td style="padding:28px 32px;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tbody><tr>
              <td width="33%" style="padding-right:16px;vertical-align:top;">
                <div style="font-family:'Anton',sans-serif;font-size:22px;color:#c41a1a;margin-bottom:6px;">01</div>
                <div style="font-family:'Space Mono',monospace;font-size:10px;font-weight:700;color:#f0f0f0;letter-spacing:.08em;text-transform:uppercase;margin-bottom:6px;">Browse &amp; Wishlist</div>
                <div style="font-family:'Space Mono',monospace;font-size:10px;color:#5a5a5a;line-height:1.7;">Save items before they sell out.</div>
              </td>
              <td width="33%" style="padding-right:16px;vertical-align:top;border-left:1px solid #242424;padding-left:16px;">
                <div style="font-family:'Anton',sans-serif;font-size:22px;color:#c41a1a;margin-bottom:6px;">02</div>
                <div style="font-family:'Space Mono',monospace;font-size:10px;font-weight:700;color:#f0f0f0;letter-spacing:.08em;text-transform:uppercase;margin-bottom:6px;">Checkout Fast</div>
                <div style="font-family:'Space Mono',monospace;font-size:10px;color:#5a5a5a;line-height:1.7;">Saved addresses &amp; payment methods.</div>
              </td>
              <td width="33%" style="vertical-align:top;border-left:1px solid #242424;padding-left:16px;">
                <div style="font-family:'Anton',sans-serif;font-size:22px;color:#c41a1a;margin-bottom:6px;">03</div>
                <div style="font-family:'Space Mono',monospace;font-size:10px;font-weight:700;color:#f0f0f0;letter-spacing:.08em;text-transform:uppercase;margin-bottom:6px;">Track Orders</div>
                <div style="font-family:'Space Mono',monospace;font-size:10px;color:#5a5a5a;line-height:1.7;">Real-time updates on every order.</div>
              </td>
            </tr>
          </tbody></table>
        </td>
      </tr>
      
  <tr>
    <td style="background:#131313;border-top:1px solid #242424;padding:28px 32px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tbody><tr>
          <td align="center" style="padding-bottom:16px;">
            <span style="font-family:'Anton',Impact,sans-serif;font-size:20px;color:#5a5a5a;letter-spacing:.05em;">
              e<span style="color:#c41a1a;">Fear</span>
            </span>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding-bottom:12px;">
            <a href="#" style="font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:#5a5a5a;text-decoration:none;margin:0 10px;">Shop</a>
            <a href="#" style="font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:#5a5a5a;text-decoration:none;margin:0 10px;">Orders</a>
            <a href="#" style="font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:#5a5a5a;text-decoration:none;margin:0 10px;">Contact</a>
            <a href="#" style="font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:#5a5a5a;text-decoration:none;margin:0 10px;">Unsubscribe</a>
          </td>
        </tr>
        <tr>
          <td align="center" style="font-family:'Space Mono',monospace;font-size:9px;color:#5a5a5a;letter-spacing:.06em;line-height:1.8;">
            © 2026 eFear LLC · 123 Collector's Way, Waco TX · All rights reserved<br>
            <span style="color:#3a3a3a;">You're receiving this because you signed up at efear.com</span>
          </td>
        </tr>
      </tbody></table>
    </td>
  </tr>
    
    </tbody></table>
  </td></tr>
</tbody></table>

</div>
    `},
    
    confirm(data) {
        return  `
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<link href="https://fonts.googleapis.com/css2?family=Anton&amp;family=Space+Mono:ital@0;1&amp;display=swap" rel="stylesheet">
<!--[if mso]><style>td,p,a{font-family:Arial,sans-serif!important;}</style><![endif]-->


<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#080808;">
  <tbody><tr><td align="center" style="padding:24px 16px;">
    <table width="640" cellpadding="0" cellspacing="0" border="0" style="max-width:640px;width:100%;background:#0e0e0e;border:1px solid #242424;">
      
      
  <tbody><tr>
    <td style="background:#131313;border-bottom:3px solid #c41a1a;padding:22px 32px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tbody><tr>
          <td>
            <span style="font-family:'Anton',Impact,sans-serif;font-size:28px;color:#f0f0f0;letter-spacing:.05em;">
              e<span style="color:#c41a1a;">Fear</span>
            </span>
            <span style="font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:#5a5a5a;display:inline-block;padding-left:14px;margin-left:10px;border-left:1px solid #242424;">
              Comics · Collectibles
            </span>
          </td>
          <td align="right" style="font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:#5a5a5a;">
            Order Receipt
          </td>
        </tr>
      </tbody></table>
    </td>
  </tr>
      
  <tr>
    <td style="padding:36px 32px 20px;">
      <div style="font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.22em;text-transform:uppercase;color:#c41a1a;margin-bottom:8px;">// order confirmed</div>
      <div style="font-family:'Anton',Impact,sans-serif;font-size:30px;color:#f0f0f0;letter-spacing:.03em;line-height:1.1;">Got it.
You're good.</div>
    </td>
  </tr>
      <tr>
        <td style="padding:0 32px 24px;">
          <p style="font-family:'Space Mono',monospace;font-size:12px;color:#b0b0b0;line-height:1.9;margin-bottom:0;">
            Hey <strong style="color:#f0f0f0;">[[FIRST_NAME]]</strong> — your order is confirmed and being picked. We'll send tracking as soon as it ships.
          </p>
        </td>
      </tr>
      <tr><td style="padding:0 32px;"><div style="height:1px;background:#242424;"></div></td></tr>
      <tr>
        <td style="padding:24px 32px;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#1a1a1a;border:1px solid #242424;">
            <tbody><tr>
              <td style="padding:14px 18px;border-bottom:1px solid #242424;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tbody><tr>
                    <td style="font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:#5a5a5a;">Order</td>
                    <td style="font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:#5a5a5a;" align="right">Date</td>
                  </tr>
                  <tr>
                    <td style="font-family:'Space Mono',monospace;font-size:13px;color:#f0f0f0;font-weight:700;padding-top:4px;">#[[ORDER_ID]]</td>
                    <td style="font-family:'Space Mono',monospace;font-size:11px;color:#b0b0b0;padding-top:4px;" align="right">[[ORDER_DATE]]</td>
                  </tr>
                </tbody></table>
              </td>
            </tr>
            <!-- Item row template — repeat as needed -->
            <tr>
              <td style="padding:14px 18px;border-bottom:1px solid #242424;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tbody><tr>
                    <td style="width:48px;vertical-align:middle;padding-right:14px;">
                      <div style="width:48px;height:48px;background:#242424;border:1px solid #2e2e2e;"></div>
                    </td>
                    <td style="vertical-align:middle;">
                      <div style="font-family:'Space Mono',monospace;font-size:11px;color:#f0f0f0;font-weight:700;margin-bottom:3px;">[[ITEM_NAME]]</div>
                      <div style="font-family:'Space Mono',monospace;font-size:10px;color:#5a5a5a;">Qty: [[QTY]] &nbsp;·&nbsp; [[VARIANT]]</div>
                    </td>
                    <td align="right" style="vertical-align:middle;font-family:'Space Mono',monospace;font-size:12px;color:#f0f0f0;font-weight:700;">
                      $[[ITEM_PRICE]]
                    </td>
                  </tr>
                </tbody></table>
              </td>
            </tr>
            <!-- Totals -->
            <tr>
              <td style="padding:14px 18px;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tbody><tr>
                    <td style="font-family:'Space Mono',monospace;font-size:10px;color:#5a5a5a;padding-bottom:6px;">Subtotal</td>
                    <td align="right" style="font-family:'Space Mono',monospace;font-size:10px;color:#b0b0b0;padding-bottom:6px;">$[[SUBTOTAL]]</td>
                  </tr>
                  <tr>
                    <td style="font-family:'Space Mono',monospace;font-size:10px;color:#5a5a5a;padding-bottom:6px;">Shipping</td>
                    <td align="right" style="font-family:'Space Mono',monospace;font-size:10px;color:#b0b0b0;padding-bottom:6px;">$[[SHIPPING]]</td>
                  </tr>
                  <tr>
                    <td style="font-family:'Space Mono',monospace;font-size:10px;color:#5a5a5a;padding-bottom:0;padding-top:10px;border-top:1px solid #242424;">
                      <strong style="color:#f0f0f0;font-size:12px;">Total</strong>
                    </td>
                    <td align="right" style="font-family:'Space Mono',monospace;font-size:12px;color:#c41a1a;font-weight:700;border-top:1px solid #242424;padding-top:10px;">
                      $[[TOTAL]]
                    </td>
                  </tr>
                </tbody></table>
              </td>
            </tr>
          </tbody></table>
        </td>
      </tr>
      <tr><td style="padding:0 32px;"><div style="height:1px;background:#242424;"></div></td></tr>
      <tr>
        <td style="padding:24px 32px;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tbody><tr>
              <td width="50%" style="padding-right:16px;vertical-align:top;">
                <div style="font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:#5a5a5a;margin-bottom:8px;">Ship To</div>
                <div style="font-family:'Space Mono',monospace;font-size:11px;color:#b0b0b0;line-height:1.8;">
                  [[FULL_NAME]]<br>[[ADDRESS_LINE1]]<br>[[CITY]], [[STATE]] [[ZIP]]
                </div>
              </td>
              <td width="50%" style="vertical-align:top;border-left:1px solid #242424;padding-left:16px;">
                <div style="font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:#5a5a5a;margin-bottom:8px;">Payment</div>
                <div style="font-family:'Space Mono',monospace;font-size:11px;color:#b0b0b0;line-height:1.8;">
                  [[PAYMENT_METHOD]]<br>ending in [[CARD_LAST4]]
                </div>
              </td>
            </tr>
          </tbody></table>
        </td>
      </tr>
      <tr>
        <td style="padding:4px 32px 32px;">
          
  <a href="#" style="display:inline-block;padding:13px 28px;background:#c41a1a;color:#fff;font-family:'Space Mono',monospace;font-size:11px;letter-spacing:.12em;text-transform:uppercase;text-decoration:none;clip-path:polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px));">
    Track My Order →
  </a>
        </td>
      </tr>
      
  <tr>
    <td style="background:#131313;border-top:1px solid #242424;padding:28px 32px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tbody><tr>
          <td align="center" style="padding-bottom:16px;">
            <span style="font-family:'Anton',Impact,sans-serif;font-size:20px;color:#5a5a5a;letter-spacing:.05em;">
              e<span style="color:#c41a1a;">Fear</span>
            </span>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding-bottom:12px;">
            <a href="#" style="font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:#5a5a5a;text-decoration:none;margin:0 10px;">Shop</a>
            <a href="#" style="font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:#5a5a5a;text-decoration:none;margin:0 10px;">Orders</a>
            <a href="#" style="font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:#5a5a5a;text-decoration:none;margin:0 10px;">Contact</a>
            <a href="#" style="font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:#5a5a5a;text-decoration:none;margin:0 10px;">Unsubscribe</a>
          </td>
        </tr>
        <tr>
          <td align="center" style="font-family:'Space Mono',monospace;font-size:9px;color:#5a5a5a;letter-spacing:.06em;line-height:1.8;">
            © 2026 eFear LLC · 123 Collector's Way, Waco TX · All rights reserved<br>
            <span style="color:#3a3a3a;">You're receiving this because you signed up at efear.com</span>
          </td>
        </tr>
      </tbody></table>
    </td>
  </tr>
    
    </tbody></table>
  </td></tr>
</tbody></table>
    
    `},

    promo(data) {
     return `
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<link href="https://fonts.googleapis.com/css2?family=Anton&amp;family=Space+Mono:ital@0;1&amp;display=swap" rel="stylesheet">
<!--[if mso]><style>td,p,a{font-family:Arial,sans-serif!important;}</style><![endif]-->


<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#080808;">
  <tbody><tr><td align="center" style="padding:24px 16px;">
    <table width="640" cellpadding="0" cellspacing="0" border="0" style="max-width:640px;width:100%;background:#0e0e0e;border:1px solid #242424;">
      
      
  <tbody><tr>
    <td style="background:#131313;border-bottom:3px solid #c41a1a;padding:22px 32px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tbody><tr>
          <td>
            <span style="font-family:'Anton',Impact,sans-serif;font-size:28px;color:#f0f0f0;letter-spacing:.05em;">
              e<span style="color:#c41a1a;">Fear</span>
            </span>
            <span style="font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:#5a5a5a;display:inline-block;padding-left:14px;margin-left:10px;border-left:1px solid #242424;">
              Comics · Collectibles
            </span>
          </td>
          <td align="right" style="font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:#5a5a5a;">
            New Arrival
          </td>
        </tr>
      </tbody></table>
    </td>
  </tr>
      <tr>
        <td style="background:#c41a1a;padding:40px 32px 36px;position:relative;overflow:hidden;">
          <div style="font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.22em;text-transform:uppercase;color:rgba(255,255,255,.5);margin-bottom:10px;">// new drop</div>
          <div style="font-family:'Anton',Impact,sans-serif;font-size:48px;color:#fff;letter-spacing:.02em;line-height:1;margin-bottom:12px;">Collection Update!</div>
          <div style="font-family:'Space Mono',monospace;font-size:11px;color:rgba(255,255,255,.7);line-height:1.8;margin-bottom:24px;max-width:420px;">Check out our latest rare comics!</div>
          
  <a href="https://efear.shop/shop" style="display:inline-block;padding:13px 28px;background:#fff;color:#c41a1a;font-family:'Space Mono',monospace;font-size:11px;letter-spacing:.12em;text-transform:uppercase;text-decoration:none;clip-path:polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px));">
    Shop the Drop →
  </a>
        </td>
      </tr>
      <tr>
        <td style="padding:32px 32px 20px;">
          <div style="font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:#5a5a5a;margin-bottom:20px;">Featured Comics</div>
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tbody><tr>
              <!-- Product card — repeat x3 -->
              <td width="33%" style="padding-right:10px;vertical-align:top;">
                <div style="background:#1a1a1a;border:1px solid #242424;padding:16px;">
                  <div style="height:140px;background:url(https://res.cloudinary.com/dgzxxbqa0/image/upload/v1773358297/products/hlfzruocsnoa2rg4piiv.webp);margin-bottom:14px;"></div>
                  <div style="font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:#5a5a5a;margin-bottom:4px;">Comic Books</div>
                  <div style="font-family:'Space Mono',monospace;font-size:11px;color:#f0f0f0;font-weight:700;margin-bottom:10px;line-height:1.4;">Spawn #1</div>
                  <div style="font-family:'Anton',sans-serif;font-size:18px;color:#c41a1a;">$30.99</div>
                </div>
              </td>
              <td width="33%" style="padding-right:10px;vertical-align:top;">
                <div style="background:#1a1a1a;border:1px solid #242424;padding:16px;">
                  <div style="height:140px;background:url(https://res.cloudinary.com/dgzxxbqa0/image/upload/v1773358023/products/vcerejp5tz3d3jp57wub.webp);margin-bottom:14px;"></div>
                  <div style="font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:#5a5a5a;margin-bottom:4px;">Comic Books</div>
                  <div style="font-family:'Space Mono',monospace;font-size:11px;color:#f0f0f0;font-weight:700;margin-bottom:10px;line-height:1.4;">Teenage Mutant Ninja Turtles</div>
                  <div style="font-family:'Anton',sans-serif;font-size:18px;color:#c41a1a;">$29.99</div>
                </div>
              </td>
              <td width="33%" style="vertical-align:top;">
                <div style="background:#1a1a1a;border:1px solid #242424;padding:16px;">
                  <div style="height:140px;background:url(https://res.cloudinary.com/dgzxxbqa0/image/upload/v1766610330/products/ja3y2gzv0ujcafqerk32.jpg);margin-bottom:14px;"></div>
                  <div style="font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:#5a5a5a;margin-bottom:4px;">E-Books</div>
                  <div style="font-family:'Space Mono',monospace;font-size:11px;color:#f0f0f0;font-weight:700;margin-bottom:10px;line-height:1.4;">F.E.A.R. The Vegan Manifesto</div>
                  <div style="font-family:'Anton',sans-serif;font-size:18px;color:#c41a1a;">$5.99</div>
                </div>
              </td>
            </tr>
          </tbody></table>
        </td><
      </tr>
      <tr>
        <td style="padding:8px 32px 36px;">
          
  <a href="#" style="display:inline-block;padding:13px 28px;background:#c41a1a;color:#fff;font-family:'Space Mono',monospace;font-size:11px;letter-spacing:.12em;text-transform:uppercase;text-decoration:none;clip-path:polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px));">
    See All New Arrivals →
  </a>
        </td>
      </tr>
      
  <tr>
    <td style="background:#131313;border-top:1px solid #242424;padding:28px 32px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tbody><tr>
          <td align="center" style="padding-bottom:16px;">
            <span style="font-family:'Anton',Impact,sans-serif;font-size:20px;color:#5a5a5a;letter-spacing:.05em;">
              e<span style="color:#c41a1a;">Fear</span>
            </span>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding-bottom:12px;">
            <a href="#" style="font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:#5a5a5a;text-decoration:none;margin:0 10px;">Shop</a>
            <a href="#" style="font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:#5a5a5a;text-decoration:none;margin:0 10px;">Orders</a>
            <a href="#" style="font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:#5a5a5a;text-decoration:none;margin:0 10px;">Contact</a>
            <a href="#" style="font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:#5a5a5a;text-decoration:none;margin:0 10px;">Unsubscribe</a>
          </td>
        </tr>
        <tr>
          <td align="center" style="font-family:'Space Mono',monospace;font-size:9px;color:#5a5a5a;letter-spacing:.06em;line-height:1.8;">
            © 2026 eFear LLC · 123 Collector's Way, Waco TX · All rights reserved<br>
            <span style="color:#3a3a3a;">You're receiving this because you signed up at efear.com</span>
          </td>
        </tr>
      </tbody></table>
    </td>
  </tr>
    
    </tbody></table>
  </td></tr>
</tbody></table>
    `},

    contactForm(data) {
        return `
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<link href="https://fonts.googleapis.com/css2?family=Anton&amp;family=Space+Mono:ital@0;1&amp;display=swap" rel="stylesheet">
<!--[if mso]><style>td,p,a{font-family:Arial,sans-serif!important;}</style><![endif]-->

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#080808;">
  <tbody><tr><td align="center" style="padding:24px 16px;">
    <table width="640" cellpadding="0" cellspacing="0" border="0" style="max-width:640px;width:100%;background:#0e0e0e;border:1px solid #242424;">

  <tbody><tr>
    <td style="background:#131313;border-bottom:3px solid #c41a1a;padding:22px 32px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tbody><tr>
          <td>
            <span style="font-family:'Anton',Impact,sans-serif;font-size:28px;color:#f0f0f0;letter-spacing:.05em;">
              e<span style="color:#c41a1a;">FEAR</span>
            </span>
            <span style="font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:#5a5a5a;display:inline-block;padding-left:14px;margin-left:10px;border-left:1px solid #242424;">
              Comics · Collectibles
            </span>
          </td>
          <td align="right" style="font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:#5a5a5a;">
            Contact Form
          </td>
        </tr>
      </tbody></table>
    </td>
  </tr>

  <tr>
    <td style="padding:36px 32px 20px;">
      <div style="font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.22em;text-transform:uppercase;color:#c41a1a;margin-bottom:8px;">// message received</div>
      <div style="font-family:'Anton',Impact,sans-serif;font-size:30px;color:#f0f0f0;letter-spacing:.03em;line-height:1.1;">We got your message.</div>
    </td>
  </tr>
  <tr>
    <td style="padding:0 32px 28px;">
      <p style="font-family:'Space Mono',monospace;font-size:12px;color:#b0b0b0;line-height:1.9;margin-bottom:0;">
        Hey <strong style="color:#f0f0f0;">${data.$name}</strong>,<br><br>
        Thanks for reaching out. Our team has received your message and will get back to you within 1–2 business days. Here's a copy of what you sent.
      </p>
    </td>
  </tr>
  <tr><td style="padding:0 32px;"><div style="height:1px;background:#242424;"></div></td></tr>
  <tr>
    <td style="padding:24px 32px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#1a1a1a;border:1px solid #242424;">
        <tbody>
          <tr>
            <td style="padding:14px 18px;border-bottom:1px solid #242424;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tbody><tr>
                  <td style="font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:#5a5a5a;">Subject</td>
                  <td align="right" style="font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:#5a5a5a;">Submitted</td>
                </tr>
                <tr>
                  <td style="font-family:'Space Mono',monospace;font-size:13px;color:#f0f0f0;font-weight:700;padding-top:4px;">${data.$subject}</td>
                  <td align="right" style="font-family:'Space Mono',monospace;font-size:11px;color:#b0b0b0;padding-top:4px;">${new Date()}</td>
                </tr>
              </tbody></table>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 18px;">
              <div style="font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:#5a5a5a;margin-bottom:10px;">Your Message</div>
              <div style="font-family:'Space Mono',monospace;font-size:11px;color:#b0b0b0;line-height:1.9;border-left:3px solid #c41a1a;padding-left:14px;">
                ${data.$message}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </td>
  </tr>
  <tr><td style="padding:0 32px;"><div style="height:1px;background:#242424;"></div></td></tr>
  <tr>
    <td style="padding:24px 32px 32px;">
      <div style="font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:#5a5a5a;margin-bottom:12px;">Need faster help?</div>
      <table cellpadding="0" cellspacing="0" border="0">
        <tbody><tr>
          <td style="padding-right:12px;">
<a href="https://efear.shop/faq" style="display:inline-block;padding:13px 28px;background:#c41a1a;color:#fff;font-family:'Space Mono',monospace;font-size:11px;letter-spacing:.12em;text-transform:uppercase;text-decoration:none;clip-path:polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px));">
  Browse FAQ →
</a></td>
          <td>
<a href="https://efear.shop/shop" style="display:inline-block;padding:12px 28px;border:1px solid #242424;color:#b0b0b0;font-family:'Space Mono',monospace;font-size:11px;letter-spacing:.12em;text-transform:uppercase;text-decoration:none;">
  Back to Store
</a></td>
        </tr>
      </tbody></table>
    </td>
  </tr>

  <tr>
    <td style="background:#131313;border-top:1px solid #242424;padding:28px 32px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tbody><tr>
          <td align="center" style="padding-bottom:16px;">
            <span style="font-family:'Anton',Impact,sans-serif;font-size:20px;color:#5a5a5a;letter-spacing:.05em;">
              e<span style="color:#c41a1a;">FEAR</span>
            </span>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding-bottom:12px;">
            <a href="https://efear.shop/shop" style="font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:#5a5a5a;text-decoration:none;margin:0 10px;">Shop</a>
            <a href="https://efear.shop/about" style="font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:#5a5a5a;text-decoration:none;margin:0 10px;">Orders</a>
            <a href="https://efear.shop/contact" style="font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:#5a5a5a;text-decoration:none;margin:0 10px;">Contact</a>
            <a href="https://efear.shop/unsubscribe" style="font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:#5a5a5a;text-decoration:none;margin:0 10px;">Unsubscribe</a>
          </td>
        </tr>
        <tr>
          <td align="center" style="font-family:'Space Mono',monospace;font-size:9px;color:#5a5a5a;letter-spacing:.06em;line-height:1.8;">
            © 2026 FEAR Inc. · 2003 E. Veterans Memorial Blvd, Killeen TX · All rights reserved<br>
            <span style="color:#3a3a3a;">You're receiving this because you submitted a contact form at efear.com</span>
          </td>
        </tr>
      </tbody></table>
    </td>
  </tr>

    </tbody></table>
  </td></tr>
</tbody></table>
`},

    passwordReset(data) {
        return `
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<link href="https://fonts.googleapis.com/css2?family=Anton&amp;family=Space+Mono:ital@0;1&amp;display=swap" rel="stylesheet">
<!--[if mso]><style>td,p,a{font-family:Arial,sans-serif!important;}</style><![endif]-->

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#080808;">
  <tbody><tr><td align="center" style="padding:24px 16px;">
    <table width="640" cellpadding="0" cellspacing="0" border="0" style="max-width:640px;width:100%;background:#0e0e0e;border:1px solid #242424;">

  <tbody><tr>
    <td style="background:#131313;border-bottom:3px solid #c41a1a;padding:22px 32px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tbody><tr>
          <td>
            <span style="font-family:'Anton',Impact,sans-serif;font-size:28px;color:#f0f0f0;letter-spacing:.05em;">
              e<span style="color:#c41a1a;">Fear</span>
            </span>
            <span style="font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:#5a5a5a;display:inline-block;padding-left:14px;margin-left:10px;border-left:1px solid #242424;">
              Comics · Collectibles
            </span>
          </td>
          <td align="right" style="font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:#5a5a5a;">
            Password Reset
          </td>
        </tr>
      </tbody></table>
    </td>
  </tr>

  <tr>
    <td style="padding:36px 32px 20px;">
      <div style="font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.22em;text-transform:uppercase;color:#c41a1a;margin-bottom:8px;">// access request</div>
      <div style="font-family:'Anton',Impact,sans-serif;font-size:30px;color:#f0f0f0;letter-spacing:.03em;line-height:1.1;">Reset your<br>password.</div>
    </td>
  </tr>
  <tr>
    <td style="padding:0 32px 28px;">
      <p style="font-family:'Space Mono',monospace;font-size:12px;color:#b0b0b0;line-height:1.9;margin-bottom:0;">
        Hey <strong style="color:#f0f0f0;">${data.firstName}</strong>,<br><br>
        We received a request to reset the password for your eFear account. Click the button below — this link expires in <strong style="color:#f0f0f0;">30 minutes</strong>. If you didn't request this, you can safely ignore this email.
      </p>
    </td>
  </tr>
  <tr><td style="padding:0 32px;"><div style="height:1px;background:#242424;"></div></td></tr>
  <tr>
    <td style="padding:28px 32px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#1a1a1a;border:1px solid #242424;">
        <tbody>
          <tr>
            <td style="padding:20px 22px;border-bottom:1px solid #242424;">
              <div style="font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.16em;text-transform:uppercase;color:#5a5a5a;margin-bottom:6px;">Account</div>
              <div style="font-family:'Space Mono',monospace;font-size:13px;color:#f0f0f0;font-weight:700;">${data.email}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 22px;border-bottom:1px solid #242424;">
              <div style="font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.16em;text-transform:uppercase;color:#5a5a5a;margin-bottom:6px;">Link Expires</div>
              <div style="font-family:'Space Mono',monospace;font-size:13px;color:#c41a1a;font-weight:700;">${data.expiresAt}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:22px 22px;">
<a href="${data.resetUrl}" style="display:inline-block;padding:13px 28px;background:#c41a1a;color:#fff;font-family:'Space Mono',monospace;font-size:11px;letter-spacing:.12em;text-transform:uppercase;text-decoration:none;clip-path:polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px));">
  Reset My Password →
</a>
            </td>
          </tr>
        </tbody>
      </table>
    </td>
  </tr>
  <tr><td style="padding:0 32px;"><div style="height:1px;background:#242424;"></div></td></tr>
  <tr>
    <td style="padding:24px 32px 32px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tbody><tr>
          <td width="33%" style="padding-right:16px;vertical-align:top;">
            <div style="font-family:'Anton',sans-serif;font-size:22px;color:#c41a1a;margin-bottom:6px;">01</div>
            <div style="font-family:'Space Mono',monospace;font-size:10px;font-weight:700;color:#f0f0f0;letter-spacing:.08em;text-transform:uppercase;margin-bottom:6px;">Click the Link</div>
            <div style="font-family:'Space Mono',monospace;font-size:10px;color:#5a5a5a;line-height:1.7;">Opens a secure reset page.</div>
          </td>
          <td width="33%" style="padding-right:16px;vertical-align:top;border-left:1px solid #242424;padding-left:16px;">
            <div style="font-family:'Anton',sans-serif;font-size:22px;color:#c41a1a;margin-bottom:6px;">02</div>
            <div style="font-family:'Space Mono',monospace;font-size:10px;font-weight:700;color:#f0f0f0;letter-spacing:.08em;text-transform:uppercase;margin-bottom:6px;">Set New Password</div>
            <div style="font-family:'Space Mono',monospace;font-size:10px;color:#5a5a5a;line-height:1.7;">Choose something strong.</div>
          </td>
          <td width="33%" style="vertical-align:top;border-left:1px solid #242424;padding-left:16px;">
            <div style="font-family:'Anton',sans-serif;font-size:22px;color:#c41a1a;margin-bottom:6px;">03</div>
            <div style="font-family:'Space Mono',monospace;font-size:10px;font-weight:700;color:#f0f0f0;letter-spacing:.08em;text-transform:uppercase;margin-bottom:6px;">Back in Business</div>
            <div style="font-family:'Space Mono',monospace;font-size:10px;color:#5a5a5a;line-height:1.7;">Log in and get back to the haul.</div>
          </td>
        </tr>
      </tbody></table>
    </td>
  </tr>

  <tr>
    <td style="background:#131313;border-top:1px solid #242424;padding:28px 32px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tbody><tr>
          <td align="center" style="padding-bottom:16px;">
            <span style="font-family:'Anton',Impact,sans-serif;font-size:20px;color:#5a5a5a;letter-spacing:.05em;">
              e<span style="color:#c41a1a;">Fear</span>
            </span>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding-bottom:12px;">
            <a href="#" style="font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:#5a5a5a;text-decoration:none;margin:0 10px;">Shop</a>
            <a href="#" style="font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:#5a5a5a;text-decoration:none;margin:0 10px;">Orders</a>
            <a href="#" style="font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:#5a5a5a;text-decoration:none;margin:0 10px;">Contact</a>
            <a href="#" style="font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:#5a5a5a;text-decoration:none;margin:0 10px;">Unsubscribe</a>
          </td>
        </tr>
        <tr>
          <td align="center" style="font-family:'Space Mono',monospace;font-size:9px;color:#5a5a5a;letter-spacing:.06em;line-height:1.8;">
            © 2026 eFear LLC · 123 Collector's Way, Waco TX · All rights reserved<br>
            <span style="color:#3a3a3a;">You're receiving this because a reset was requested for your account at efear.com</span>
          </td>
        </tr>
      </tbody></table>
    </td>
  </tr>

    </tbody></table>
  </td></tr>
</tbody></table>
`},

    orderComplete(data) {
        return `
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<link href="https://fonts.googleapis.com/css2?family=Anton&amp;family=Space+Mono:ital@0;1&amp;display=swap" rel="stylesheet">
<!--[if mso]><style>td,p,a{font-family:Arial,sans-serif!important;}</style><![endif]-->

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#080808;">
  <tbody><tr><td align="center" style="padding:24px 16px;">
    <table width="640" cellpadding="0" cellspacing="0" border="0" style="max-width:640px;width:100%;background:#0e0e0e;border:1px solid #242424;">

  <tbody><tr>
    <td style="background:#131313;border-bottom:3px solid #c41a1a;padding:22px 32px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tbody><tr>
          <td>
            <span style="font-family:'Anton',Impact,sans-serif;font-size:28px;color:#f0f0f0;letter-spacing:.05em;">
              e<span style="color:#c41a1a;">Fear</span>
            </span>
            <span style="font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:#5a5a5a;display:inline-block;padding-left:14px;margin-left:10px;border-left:1px solid #242424;">
              Comics · Collectibles
            </span>
          </td>
          <td align="right" style="font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:#5a5a5a;">
            Order Complete
          </td>
        </tr>
      </tbody></table>
    </td>
  </tr>

  <tr>
    <td style="background:#1a1a1a;border-bottom:1px solid #242424;padding:32px;">
      <div style="font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.22em;text-transform:uppercase;color:#c41a1a;margin-bottom:10px;">// delivered</div>
      <div style="font-family:'Anton',Impact,sans-serif;font-size:36px;color:#f0f0f0;letter-spacing:.02em;line-height:1.1;margin-bottom:14px;">Your haul<br>has landed.</div>
      <p style="font-family:'Space Mono',monospace;font-size:12px;color:#b0b0b0;line-height:1.9;margin:0;">
        Order <strong style="color:#f0f0f0;">#${data.orderId}</strong> has been delivered. We hope everything is in perfect condition — if not, we'll make it right.
      </p>
    </td>
  </tr>

  <tr>
    <td style="padding:28px 32px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#1a1a1a;border:1px solid #242424;">
        <tbody>
          <tr>
            <td style="padding:20px 22px;border-bottom:1px solid #242424;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tbody><tr>
                  <td style="font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.16em;text-transform:uppercase;color:#5a5a5a;">Delivered To</td>
                  <td align="right" style="font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.16em;text-transform:uppercase;color:#5a5a5a;">Delivered On</td>
                </tr>
                <tr>
                  <td style="font-family:'Space Mono',monospace;font-size:12px;color:#b0b0b0;padding-top:4px;line-height:1.7;">${data.fullName}<br>${data.addressLine1}<br>${data.city}, ${data.state} ${data.zip}</td>
                  <td align="right" style="font-family:'Space Mono',monospace;font-size:13px;color:#f0f0f0;font-weight:700;padding-top:4px;vertical-align:top;">${data.deliveredDate}</td>
                </tr>
              </tbody></table>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 22px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tbody><tr>
                  <td width="33%" style="text-align:center;vertical-align:top;">
                    <div style="width:32px;height:32px;border-radius:50%;background:#c41a1a;font-family:'Space Mono',monospace;font-size:13px;color:#fff;line-height:32px;text-align:center;margin:0 auto 8px;">✓</div>
                    <div style="font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:#f0f0f0;">Order Placed</div>
                    <div style="font-family:'Space Mono',monospace;font-size:9px;color:#5a5a5a;margin-top:3px;">${data.placedDate}</div>
                  </td>
                  <td width="33%" style="text-align:center;vertical-align:top;">
                    <div style="width:32px;height:32px;border-radius:50%;background:#c41a1a;font-family:'Space Mono',monospace;font-size:13px;color:#fff;line-height:32px;text-align:center;margin:0 auto 8px;">✓</div>
                    <div style="font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:#f0f0f0;">Dispatched</div>
                    <div style="font-family:'Space Mono',monospace;font-size:9px;color:#5a5a5a;margin-top:3px;">${data.shippedDate}</div>
                  </td>
                  <td width="33%" style="text-align:center;vertical-align:top;">
                    <div style="width:32px;height:32px;border-radius:50%;background:#c41a1a;font-family:'Space Mono',monospace;font-size:13px;color:#fff;line-height:32px;text-align:center;margin:0 auto 8px;">✓</div>
                    <div style="font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:#f0f0f0;">Delivered</div>
                    <div style="font-family:'Space Mono',monospace;font-size:9px;color:#5a5a5a;margin-top:3px;">${data.deliveredDate}</div>
                  </td>
                </tr>
              </tbody></table>
            </td>
          </tr>
        </tbody>
      </table>
    </td>
  </tr>
  <tr><td style="padding:0 32px;"><div style="height:1px;background:#242424;"></div></td></tr>

  <tr>
    <td style="padding:24px 32px 8px;">
      <div style="font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:#5a5a5a;margin-bottom:16px;">What Was Inside</div>
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#1a1a1a;border:1px solid #242424;">
        <tbody>
          <tr>
            <td style="padding:14px 18px;border-bottom:1px solid #242424;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tbody><tr>
                  <td style="width:48px;vertical-align:middle;padding-right:14px;">
                    <div style="width:48px;height:48px;background:#242424;border:1px solid #2e2e2e;"></div>
                  </td>
                  <td style="vertical-align:middle;">
                    <div style="font-family:'Space Mono',monospace;font-size:11px;color:#f0f0f0;font-weight:700;margin-bottom:3px;">${data.itemName}</div>
                    <div style="font-family:'Space Mono',monospace;font-size:10px;color:#5a5a5a;">Qty: ${data.qty} &nbsp;·&nbsp; ${data.variant}</div>
                  </td>
                  <td align="right" style="vertical-align:middle;font-family:'Space Mono',monospace;font-size:12px;color:#f0f0f0;font-weight:700;">
                    $${data.itemPrice}
                  </td>
                </tr>
              </tbody></table>
            </td>
          </tr>
          <tr>
            <td style="padding:14px 18px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tbody><tr>
                  <td style="font-family:'Space Mono',monospace;font-size:10px;color:#5a5a5a;">Order Total</td>
                  <td align="right" style="font-family:'Space Mono',monospace;font-size:12px;color:#c41a1a;font-weight:700;">$${data.total}</td>
                </tr>
              </tbody></table>
            </td>
          </tr>
        </tbody>
      </table>
    </td>
  </tr>

  <tr>
    <td style="padding:20px 32px 32px;">
      <table cellpadding="0" cellspacing="0" border="0">
        <tbody><tr>
          <td style="padding-right:12px;">
<a href="${data.reviewUrl}" style="display:inline-block;padding:13px 28px;background:#c41a1a;color:#fff;font-family:'Space Mono',monospace;font-size:11px;letter-spacing:.12em;text-transform:uppercase;text-decoration:none;clip-path:polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px));">
  Leave a Review →
</a></td>
          <td>
<a href="${data.shopUrl}" style="display:inline-block;padding:12px 28px;border:1px solid #242424;color:#b0b0b0;font-family:'Space Mono',monospace;font-size:11px;letter-spacing:.12em;text-transform:uppercase;text-decoration:none;">
  Shop Again
</a></td>
        </tr>
      </tbody></table>
    </td>
  </tr>
  <tr><td style="padding:0 32px;"><div style="height:1px;background:#242424;"></div></td></tr>
  <tr>
    <td style="padding:22px 32px 28px;">
      <div style="font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:#5a5a5a;margin-bottom:10px;">Something not right?</div>
      <p style="font-family:'Space Mono',monospace;font-size:11px;color:#b0b0b0;line-height:1.9;margin:0;">
        Missing items, damage, wrong product — <a href="${data.supportUrl}" style="color:#c41a1a;text-decoration:none;">contact our team</a> within 7 days and we'll sort it out, no hassle.
      </p>
    </td>
  </tr>

  <tr>
    <td style="background:#131313;border-top:1px solid #242424;padding:28px 32px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tbody><tr>
          <td align="center" style="padding-bottom:16px;">
            <span style="font-family:'Anton',Impact,sans-serif;font-size:20px;color:#5a5a5a;letter-spacing:.05em;">
              e<span style="color:#c41a1a;">Fear</span>
            </span>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding-bottom:12px;">
            <a href="#" style="font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:#5a5a5a;text-decoration:none;margin:0 10px;">Shop</a>
            <a href="#" style="font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:#5a5a5a;text-decoration:none;margin:0 10px;">Orders</a>
            <a href="#" style="font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:#5a5a5a;text-decoration:none;margin:0 10px;">Contact</a>
            <a href="#" style="font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:#5a5a5a;text-decoration:none;margin:0 10px;">Unsubscribe</a>
          </td>
        </tr>
        <tr>
          <td align="center" style="font-family:'Space Mono',monospace;font-size:9px;color:#5a5a5a;letter-spacing:.06em;line-height:1.8;">
            © 2026 eFear LLC · 123 Collector's Way, Waco TX · All rights reserved<br>
            <span style="color:#3a3a3a;">You're receiving this because you placed an order at efear.com</span>
          </td>
        </tr>
      </tbody></table>
    </td>
  </tr>

    </tbody></table>
  </td></tr>
</tbody></table>
`},

    update(data) {

        return `
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<link href="https://fonts.googleapis.com/css2?family=Anton&amp;family=Space+Mono:ital@0;1&amp;display=swap" rel="stylesheet">
<!--[if mso]><style>td,p,a{font-family:Arial,sans-serif!important;}</style><![endif]-->


<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#080808;">
  <tbody><tr><td align="center" style="padding:24px 16px;">
    <table width="640" cellpadding="0" cellspacing="0" border="0" style="max-width:640px;width:100%;background:#0e0e0e;border:1px solid #242424;">
      
      
  <tbody><tr>
    <td style="background:#131313;border-bottom:3px solid #c41a1a;padding:22px 32px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tbody><tr>
          <td>
            <span style="font-family:'Anton',Impact,sans-serif;font-size:28px;color:#f0f0f0;letter-spacing:.05em;">
              e<span style="color:#c41a1a;">Fear</span>
            </span>
            <span style="font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:#5a5a5a;display:inline-block;padding-left:14px;margin-left:10px;border-left:1px solid #242424;">
              Comics · Collectibles
            </span>
          </td>
          <td align="right" style="font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:#5a5a5a;">
            Shipping Update
          </td>
        </tr>
      </tbody></table>
    </td>
  </tr>
      <tr>
        <td style="background:#1a1a1a;border-bottom:1px solid #242424;padding:32px;">
          <div style="font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.22em;text-transform:uppercase;color:#c41a1a;margin-bottom:10px;">// dispatched</div>
          <div style="font-family:'Anton',Impact,sans-serif;font-size:36px;color:#f0f0f0;letter-spacing:.02em;line-height:1.1;margin-bottom:14px;">Your order<br>just shipped.</div>
          <p style="font-family:'Space Mono',monospace;font-size:12px;color:#b0b0b0;line-height:1.9;margin:0;">
            Order <strong style="color:#f0f0f0;">#[[ORDER_ID]]</strong> left our warehouse and is heading your way. Use the tracking number below to follow it.
          </p>
        </td>
      </tr>
      <!-- Tracking block -->
      <tr>
        <td style="padding:28px 32px;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#1a1a1a;border:1px solid #242424;">
            <tbody><tr>
              <td style="padding:20px 22px;border-bottom:1px solid #242424;">
                <div style="font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.16em;text-transform:uppercase;color:#5a5a5a;margin-bottom:6px;">Tracking Number</div>
                <div style="font-family:'Space Mono',monospace;font-size:16px;color:#f0f0f0;font-weight:700;letter-spacing:.1em;">[[TRACKING_NUMBER]]</div>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 22px;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tbody><tr>
                    <td width="33%" style="text-align:center;vertical-align:top;">
                      <div style="width:32px;height:32px;border-radius:50%;background:#c41a1a;font-family:'Space Mono',monospace;font-size:13px;color:#fff;line-height:32px;text-align:center;margin:0 auto 8px;">✓</div>
                      <div style="font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:#f0f0f0;">Order Placed</div>
                      <div style="font-family:'Space Mono',monospace;font-size:9px;color:#5a5a5a;margin-top:3px;">[[PLACED_DATE]]</div>
                    </td>
                    <td width="33%" style="text-align:center;vertical-align:top;">
                      <div style="width:32px;height:32px;border-radius:50%;background:#c41a1a;font-family:'Space Mono',monospace;font-size:13px;color:#fff;line-height:32px;text-align:center;margin:0 auto 8px;">✓</div>
                      <div style="font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:#f0f0f0;">Dispatched</div>
                      <div style="font-family:'Space Mono',monospace;font-size:9px;color:#5a5a5a;margin-top:3px;">[[SHIP_DATE]]</div>
                    </td>
                    <td width="33%" style="text-align:center;vertical-align:top;">
                      <div style="width:32px;height:32px;border-radius:50%;background:#242424;border:2px solid #242424;font-family:'Space Mono',monospace;font-size:13px;color:#5a5a5a;line-height:28px;text-align:center;margin:0 auto 8px;">○</div>
                      <div style="font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:#5a5a5a;">Delivered</div>
                      <div style="font-family:'Space Mono',monospace;font-size:9px;color:#5a5a5a;margin-top:3px;">Est. [[ETA_DATE]]</div>
                    </td>
                  </tr>
                </tbody></table>
              </td>
            </tr>
          </tbody></table>
        </td>
      </tr>
      <tr><td style="padding:0 32px;"><div style="height:1px;background:#242424;"></div></td></tr>
      <tr>
        <td style="padding:24px 32px;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tbody><tr>
              <td width="50%" style="padding-right:16px;vertical-align:top;">
                <div style="font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:#5a5a5a;margin-bottom:8px;">Delivering To</div>
                <div style="font-family:'Space Mono',monospace;font-size:11px;color:#b0b0b0;line-height:1.8;">
                  [[FULL_NAME]]<br>[[ADDRESS_LINE1]]<br>[[CITY]], [[STATE]] [[ZIP]]
                </div>
              </td>
              <td width="50%" style="vertical-align:top;border-left:1px solid #242424;padding-left:16px;">
                <div style="font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:#5a5a5a;margin-bottom:8px;">Carrier</div>
                <div style="font-family:'Space Mono',monospace;font-size:11px;color:#b0b0b0;line-height:1.8;">
                  [[CARRIER]]<br>[[SERVICE_LEVEL]]
                </div>
              </td>
            </tr>
          </tbody></table>
        </td>
      </tr>
      <tr>
        <td style="padding:4px 32px 32px;">
          
  <a href="#" style="display:inline-block;padding:13px 28px;background:#c41a1a;color:#fff;font-family:'Space Mono',monospace;font-size:11px;letter-spacing:.12em;text-transform:uppercase;text-decoration:none;clip-path:polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px));">
    Track Package →
  </a>
        </td>
      </tr>
      
  <tr>
    <td style="background:#131313;border-top:1px solid #242424;padding:28px 32px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tbody><tr>
          <td align="center" style="padding-bottom:16px;">
            <span style="font-family:'Anton',Impact,sans-serif;font-size:20px;color:#5a5a5a;letter-spacing:.05em;">
              e<span style="color:#c41a1a;">Fear</span>
            </span>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding-bottom:12px;">
            <a href="#" style="font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:#5a5a5a;text-decoration:none;margin:0 10px;">Shop</a>
            <a href="#" style="font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:#5a5a5a;text-decoration:none;margin:0 10px;">Orders</a>
            <a href="#" style="font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:#5a5a5a;text-decoration:none;margin:0 10px;">Contact</a>
            <a href="#" style="font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:#5a5a5a;text-decoration:none;margin:0 10px;">Unsubscribe</a>
          </td>
        </tr>
        <tr>
          <td align="center" style="font-family:'Space Mono',monospace;font-size:9px;color:#5a5a5a;letter-spacing:.06em;line-height:1.8;">
            © 2026 eFear LLC · 123 Collector's Way, Waco TX · All rights reserved<br>
            <span style="color:#3a3a3a;">You're receiving this because you signed up at efear.com</span>
          </td>
        </tr>
      </tbody></table>
    </td>
  </tr>
    
    </tbody></table>
  </td></tr>
</tbody></table>
    
    `},

}