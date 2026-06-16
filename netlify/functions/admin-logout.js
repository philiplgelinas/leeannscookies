const {
  createExpiredSessionCookie,
  jsonResponse
} = require("./_admin-auth");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return jsonResponse(405, {
      error: "Method not allowed"
    });
  }

  return jsonResponse(200, {
    success: true
  }, {
    "Set-Cookie": createExpiredSessionCookie(event)
  });
};
