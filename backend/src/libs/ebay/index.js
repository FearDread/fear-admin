const axios = require("axios");
const qs    = require("qs");
require('dotenv').config();
/**
 *  - All eBay API calls are proxied through FEAR server so that:
 *  - eBay App credentials (Client ID / Secret) never reach the client
 *  - OAuth tokens are stored server-side only
 *
 *
 * Environment variables required (.env)
 * ──────────────────────────────────────

 *                         e.g. https://yourdomain.com/api/ebay/auth/callback
 *  EBAY_ENV             – 'sandbox' | 'production'  (default: sandbox)
 *
 * Token storage
 * ─────────────
 *  Tokens are kept in-memory in `tokenStore` below.
 *  For production, replace the get/set helpers with your DB / Redis layer.
 */

const IS_PRODUCTION  = process.env.EBAY_ENV === "production";
const EBAY_BASE_URL  = IS_PRODUCTION
      ? "https://api.ebay.com"
      : "https://api.sandbox.ebay.com";
const EBAY_AUTH_URL  = IS_PRODUCTION
      ? "https://auth.ebay.com/oauth2/authorize"
      : "https://auth.sandbox.ebay.com/oauth2/authorize";
const EBAY_TOKEN_URL = IS_PRODUCTION
      ? "https://api.ebay.com/identity/v1/oauth2/token"
      : "https://api.sandbox.ebay.com/identity/v1/oauth2/token";

const CLIENT_ID     = process.env.EBAY_CLIENT_ID;
const CLIENT_SECRET = process.env.EBAY_CLIENT_SECRET;
const REDIRECT_URI  = process.env.EBAY_REDIRECT_URI;

const SCOPES = [
      "https://api.ebay.com/oauth/api_scope",
      "https://api.ebay.com/oauth/api_scope/sell.inventory",
      "https://api.ebay.com/oauth/api_scope/sell.inventory.readonly",
      "https://api.ebay.com/oauth/api_scope/sell.account",
      "https://api.ebay.com/oauth/api_scope/sell.fulfillment.readonly",
].join(" ");

// ── In-memory token store (replace with DB for production) ────────────────────

let tokenStore = {
      accessToken:  null,
      refreshToken: null,
      expiresAt:    null,   // Unix timestamp (ms)
};

const getToken    = () => tokenStore;
const saveToken   = (data) => { tokenStore = { ...tokenStore, ...data }; };
const clearToken  = () => { tokenStore = { accessToken: null, refreshToken: null, expiresAt: null }; };
const isConnected = () => !!tokenStore.accessToken && tokenStore.expiresAt > Date.now();

const ebayClient = () => {
      const { accessToken } = getToken();
      if (!accessToken) throw new Error("eBay account not connected.");
      return axios.create({
            baseURL: EBAY_BASE_URL,
            headers: {
                  Authorization:           `Bearer ${accessToken}`,
                  "Content-Type":          "application/json",
                  "X-EBAY-C-MARKETPLACE-ID": "EBAY_US",
            },
      });
};

const fetchTokenFromCode = async (code) => {
      const credentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");
      const { data } = await axios.post(
            EBAY_TOKEN_URL,
            qs.stringify({
                  grant_type:   "authorization_code",
                  code,
                  redirect_uri: REDIRECT_URI,
            }),
            {
                  headers: {
                        Authorization:  `Basic ${credentials}`,
                        "Content-Type": "application/x-www-form-urlencoded",
                  },
            }
      );
      return data;
};

const refreshAccessToken = async () => {
      const { refreshToken } = getToken();
      if (!refreshToken) throw new Error("No refresh token available.");
      const credentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");
      const { data } = await axios.post(
            EBAY_TOKEN_URL,
            qs.stringify({
                  grant_type:    "refresh_token",
                  refresh_token: refreshToken,
                  scope:         SCOPES,
            }),
            {
                  headers: {
                        Authorization:  `Basic ${credentials}`,
                        "Content-Type": "application/x-www-form-urlencoded",
                  },
            }
      );
      saveToken({
            accessToken: data.access_token,
            expiresAt:   Date.now() + data.expires_in * 1000,
      });
      return data.access_token;
};

module.exports = {

      // ── GET /auth/connect
      // Redirects the seller browser to the eBay OAuth consent page.
      connect: async (req, res) => {
        console.log('attempting to connect to ebay');
            const params = new URLSearchParams({
                  client_id:     CLIENT_ID,
                  response_type: "code",
                  redirect_uri:  REDIRECT_URI,
                  scope:         SCOPES,
            });
            const url = `${EBAY_AUTH_URL}?${params.toString()}`;
            return res.redirect(url);
      },

      // ── GET /auth/callback
      // eBay redirects here after the seller grants consent.
      callback: async (req, res) => {
            const { code, error, error_description } = req.query;

            if (error) {
                  return res.status(400).json({ success: false, message: error_description || error });
            }
            if (!code) {
                  return res.status(400).json({ success: false, message: "Missing authorization code." });
            }

            const data = await fetchTokenFromCode(code);

            saveToken({
                  accessToken:  data.access_token,
                  refreshToken: data.refresh_token,
                  expiresAt:    Date.now() + data.expires_in * 1000,
            });

            // Close the popup and signal the parent window that auth succeeded
            return res.send(`
                  <script>
                        if (window.opener) {
                              window.opener.postMessage({ ebayConnected: true }, "*");
                        }
                        window.close();
                  </script>
                  <p>Connected! You can close this window.</p>
            `);
      },

      // ── GET /auth/status
      // Returns whether a valid token is currently stored.
      status: async (req, res) => {
            const connected = isConnected();
            return res.json({
                  success:   true,
                  connected,
                  expiresAt: connected ? new Date(tokenStore.expiresAt).toISOString() : null,
            });
      },

      // ── POST /auth/disconnect
      // Revokes the stored token and clears it.
      disconnect: async (req, res) => {
            clearToken();
            return res.json({ success: true, message: "Disconnected from eBay." });
      },

      // ── POST /auth/refresh
      // Force-refreshes the access token using the stored refresh token.
      refresh: async (req, res) => {
            const newToken = await refreshAccessToken();
            return res.json({ success: true, message: "Token refreshed.", accessToken: newToken });
      },

      // ── GET /listings
      // Returns the seller's active eBay inventory items.
      listListings: async (req, res) => {
            const { limit = 50, offset = 0 } = req.query;
            const client = ebayClient();
            const { data } = await client.get("/sell/inventory/v1/inventory_item", {
                  params: { limit, offset },
            });
            return res.json({ success: true, listings: data.inventoryItems || [], total: data.total || 0 });
      },

      // ── GET /listings/:listingId
      // Returns a single eBay inventory item.
      getListing: async (req, res) => {
            const { listingId } = req.params;
            const client = ebayClient();
            const { data } = await client.get(`/sell/inventory/v1/inventory_item/${listingId}`);
            return res.json({ success: true, listing: data });
      },

      // ── PUT /listings/:listingId
      // Updates an existing eBay inventory item.
      updateListing: async (req, res) => {
            const { listingId } = req.params;
            const client = ebayClient();
            await client.put(`/sell/inventory/v1/inventory_item/${listingId}`, req.body);
            return res.json({ success: true, message: `Listing ${listingId} updated on eBay.` });
      },

      // ── DELETE /listings/:listingId
      // Ends (removes) a listing from eBay.
      deleteListing: async (req, res) => {
            const { listingId } = req.params;
            const client = ebayClient();
            await client.delete(`/sell/inventory/v1/inventory_item/${listingId}`);
            return res.json({ success: true, message: `Listing ${listingId} removed from eBay.` });
      },

      // ── POST /listings/search
      // Searches the seller's eBay listings by keyword and optional filters.
      searchListings: async (req, res) => {
            const { keyword, category, priceMin, priceMax, limit = 20 } = req.body;
            const client = ebayClient();
            const params = { q: keyword, limit };
            if (category)              params.category_ids = category;
            if (priceMin || priceMax)  params.price        = `[${priceMin || ""},${priceMax || ""}]`;
            const { data } = await client.get("/buy/browse/v1/item_summary/search", { params });
            return res.json({ success: true, listings: data.itemSummaries || [], total: data.total || 0 });
      },

      // ── POST /listings/import
      // Imports selected eBay listings into the local product catalogue.
      importListings: async (req, res) => {
            const { listingIds } = req.body;

            if (!listingIds?.length) {
                  return res.status(400).json({ success: false, message: "No listing IDs provided." });
            }

            const Product = require("./product"); // reuse your existing product model / controller helpers
            const client  = ebayClient();
            const results = { imported: [], failed: [] };

            for (const id of listingIds) {
                  try {
                        const { data } = await client.get(`/sell/inventory/v1/inventory_item/${id}`);
                        const item     = data;

                        // Map eBay fields → your local product schema
                        const productData = {
                              name:        item.product?.title        || "Untitled",
                              description: item.product?.description  || "",
                              price:       item.offers?.[0]?.pricingSummary?.price?.value || 0,
                              quantity:    item.availability?.shipToLocationAvailability?.quantity || 0,
                              sku:         item.sku,
                              images:      item.product?.imageUrls    || [],
                              ebayItemId:  id,
                              ebayStatus:  "imported",
                              source:      "ebay",
                        };

                        // Upsert by SKU so re-imports don't create duplicates
                        // Replace with your real model:
                        // await ProductModel.findOneAndUpdate({ sku: productData.sku }, productData, { upsert: true });

                        results.imported.push(id);
                  } catch (err) {
                        results.failed.push({ id, reason: err.message });
                  }
            }

            return res.json({
                  success: true,
                  message: `${results.imported.length} listing(s) imported, ${results.failed.length} failed.`,
                  results,
            });
      },

      // ── POST /listings/export
      // Pushes local products to eBay as new / updated inventory items.
      exportProducts: async (req, res) => {
            const { productIds } = req.body;

            if (!productIds?.length) {
                  return res.status(400).json({ success: false, message: "No product IDs provided." });
            }

            // Replace with your real model:
            // const ProductModel = require("../models/product");
            const client  = ebayClient();
            const results = { exported: [], failed: [] };

            for (const productId of productIds) {
                  try {
                        // const product = await ProductModel.findById(productId);
                        // if (!product) throw new Error("Product not found");

                        // ── Mock product for illustration ──────────────────
                        const product = {
                              _id:         productId,
                              name:        "Sample Product",
                              description: "Sample description",
                              price:       19.99,
                              quantity:    10,
                              sku:         `SKU-${productId}`,
                        };

                        // Map local product → eBay inventory item schema
                        const ebayPayload = {
                              product: {
                                    title:       product.name,
                                    description: product.description,
                                    imageUrls:   product.images || [],
                              },
                              condition: "NEW",
                              availability: {
                                    shipToLocationAvailability: {
                                          quantity: product.quantity,
                                    },
                              },
                        };

                        await client.put(
                              `/sell/inventory/v1/inventory_item/${product.sku}`,
                              ebayPayload
                        );

                        // Persist the eBay SKU back to the local product:
                        // await ProductModel.findByIdAndUpdate(productId, { ebayItemId: product.sku, ebayStatus: "synced" });

                        results.exported.push(productId);
                  } catch (err) {
                        results.failed.push({ id: productId, reason: err.message });
                  }
            }

            return res.json({
                  success: true,
                  message: `${results.exported.length} product(s) exported, ${results.failed.length} failed.`,
                  results,
            });
      },

      // ── POST /listings/sync/:productId
      // Syncs price and stock for a single product between eBay and local.
      syncProduct: async (req, res) => {
            const { productId } = req.params;
            const client = ebayClient();

            // const product = await ProductModel.findById(productId);
            // if (!product?.ebayItemId) return res.status(404).json({ success: false, message: "Product not linked to eBay." });

            // Replace with real values from your DB:
            const ebayItemId = `SKU-${productId}`;
            const quantity   = 10;
            const price      = 19.99;

            // Push updated quantity
            await client.post(
                  `/sell/inventory/v1/bulk_update_price_quantity`,
                  {
                        requests: [
                              {
                                    sku:          ebayItemId,
                                    shipToLocationAvailability: { quantity },
                                    offers: [{ price: { value: price, currency: "USD" } }],
                              },
                        ],
                  }
            );

            // await ProductModel.findByIdAndUpdate(productId, { ebayStatus: "synced", lastSyncedAt: new Date() });

            return res.json({ success: true, message: `Product ${productId} synced with eBay.` });
      },

      // ── POST /listings/sync
      // Syncs all locally-linked products with eBay in one pass.
      syncAll: async (req, res) => {
            const client = ebayClient();

            // const linkedProducts = await ProductModel.find({ ebayItemId: { $exists: true, $ne: null } });
            const linkedProducts = []; // replace with real query

            const results = { synced: [], failed: [] };

            for (const product of linkedProducts) {
                  try {
                        await client.post("/sell/inventory/v1/bulk_update_price_quantity", {
                              requests: [
                                    {
                                          sku:      product.ebayItemId,
                                          shipToLocationAvailability: { quantity: product.quantity },
                                          offers:   [{ price: { value: product.price, currency: "USD" } }],
                                    },
                              ],
                        });
                        results.synced.push(product._id);
                  } catch (err) {
                        results.failed.push({ id: product._id, reason: err.message });
                  }
            }

            return res.json({
                  success: true,
                  message: `${results.synced.length} synced, ${results.failed.length} failed.`,
                  results,
            });
      },

};