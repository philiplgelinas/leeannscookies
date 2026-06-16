const { getStore } = require("@netlify/blobs");

function getSiteContentStore() {
  const siteID = process.env.NETLIFY_SITE_ID;
  const token = process.env.NETLIFY_AUTH_TOKEN;

  if (siteID && token) {
    return getStore("site-content", {
      siteID,
      token
    });
  }

  return getStore("site-content");
}

module.exports = {
  getSiteContentStore
};
