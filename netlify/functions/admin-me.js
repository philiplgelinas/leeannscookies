const {
  createExpiredSessionCookie,
  jsonResponse,
  verifySession
} = require("./_admin-auth");

exports.handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return jsonResponse(405, {
      error: "Method not allowed"
    });
  }

  const adminSessionSecret = process.env.ADMIN_SESSION_SECRET;

  if (!adminSessionSecret) {
    console.error("Missing required ADMIN_SESSION_SECRET environment variable.");

    return jsonResponse(200, {
      authenticated: false
    });
  }

  const session = verifySession(event, adminSessionSecret);

  if (!session) {
    return jsonResponse(200, {
      authenticated: false
    }, {
      "Set-Cookie": createExpiredSessionCookie(event)
    });
  }

  return jsonResponse(200, {
    authenticated: true,
    username: session.username
  });
};
