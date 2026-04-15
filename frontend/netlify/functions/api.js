const crypto = require("crypto");
const { MongoClient } = require("mongodb");
const nodemailer = require("nodemailer");

let cachedClientPromise = null;

const jsonHeaders = {
  "Content-Type": "application/json",
  "Cache-Control": "no-store",
};

const defaultContent = [
  {
    content_id: "hero_title",
    content_type: "text",
    value: "Building Digital Solutions That Matter",
    section: "hero",
    label: "Hero Title",
  },
  {
    content_id: "hero_subtitle",
    content_type: "text",
    value: "Transforming ideas into powerful apps and websites",
    section: "hero",
    label: "Hero Subtitle",
  },
  {
    content_id: "hero_image",
    content_type: "image",
    value: "https://images.unsplash.com/photo-1619241805829-34fb64299391?auto=format&fit=crop&q=80",
    section: "hero",
    label: "Hero Image",
  },
  {
    content_id: "hero_stat_projects_value",
    content_type: "text",
    value: "10+",
    section: "hero",
    label: "Hero Projects Stat Value",
  },
  {
    content_id: "hero_stat_projects_label",
    content_type: "text",
    value: "Projects Delivered",
    section: "hero",
    label: "Hero Projects Stat Label",
  },
  {
    content_id: "hero_stat_satisfaction_value",
    content_type: "text",
    value: "100%",
    section: "hero",
    label: "Hero Satisfaction Stat Value",
  },
  {
    content_id: "hero_stat_satisfaction_label",
    content_type: "text",
    value: "Client Satisfaction",
    section: "hero",
    label: "Hero Satisfaction Stat Label",
  },
  {
    content_id: "about_title",
    content_type: "text",
    value: "About Open Circuit Solutions",
    section: "about",
    label: "About Title",
  },
  {
    content_id: "about_description",
    content_type: "text",
    value: "I'm Dante Ivery, CEO of Open Circuit Solutions. I specialize in building custom applications and websites that help businesses thrive in the digital world. From mobile apps to responsive websites, I deliver solutions that combine cutting-edge technology with intuitive design.",
    section: "about",
    label: "About Description",
  },
  {
    content_id: "stat_projects_value",
    content_type: "text",
    value: "10+",
    section: "about",
    label: "Projects Stat Value",
  },
  {
    content_id: "stat_projects_label",
    content_type: "text",
    value: "Projects Completed",
    section: "about",
    label: "Projects Stat Label",
  },
  {
    content_id: "stat_clients_value",
    content_type: "text",
    value: "5+",
    section: "about",
    label: "Clients Stat Value",
  },
  {
    content_id: "stat_clients_label",
    content_type: "text",
    value: "Happy Clients",
    section: "about",
    label: "Clients Stat Label",
  },
  {
    content_id: "stat_experience_value",
    content_type: "text",
    value: "3+",
    section: "about",
    label: "Experience Stat Value",
  },
  {
    content_id: "stat_experience_label",
    content_type: "text",
    value: "Years Experience",
    section: "about",
    label: "Experience Stat Label",
  },
  {
    content_id: "stat_support_value",
    content_type: "text",
    value: "24/7",
    section: "about",
    label: "Support Stat Value",
  },
  {
    content_id: "stat_support_label",
    content_type: "text",
    value: "Support Available",
    section: "about",
    label: "Support Stat Label",
  },
].map((item) => ({
  ...item,
  updated_at: new Date().toISOString(),
}));

const defaultContentMap = new Map(defaultContent.map((item) => [item.content_id, item]));

function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: jsonHeaders,
    body: JSON.stringify(body),
  };
}

function sanitizeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildAdminToken() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    return null;
  }

  const salt = process.env.ADMIN_TOKEN_SALT || "open-circuit-solutions-admin";
  return crypto
    .createHash("sha256")
    .update(`${username}:${password}:${salt}`)
    .digest("hex");
}

function compareSecure(a, b) {
  if (typeof a !== "string" || typeof b !== "string") {
    return false;
  }

  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) {
    return false;
  }

  return crypto.timingSafeEqual(left, right);
}

function parseBody(body) {
  if (!body) {
    return {};
  }

  try {
    return JSON.parse(body);
  } catch (error) {
    throw new Error("Invalid JSON body.");
  }
}

function normalizePath(rawPath = "") {
  if (rawPath.startsWith("/.netlify/functions/api")) {
    const nextPath = rawPath.replace("/.netlify/functions/api", "");
    return nextPath || "/";
  }

  if (rawPath.startsWith("/api")) {
    const nextPath = rawPath.replace("/api", "");
    return nextPath || "/";
  }

  return rawPath || "/";
}

function buildContentRecord(contentId, value) {
  const template = defaultContentMap.get(contentId);
  if (template) {
    return {
      ...template,
      value,
      updated_at: new Date().toISOString(),
    };
  }

  return {
    content_id: contentId,
    content_type: String(value).startsWith("http") || String(value).startsWith("data:image/")
      ? "image"
      : "text",
    value,
    section: contentId.includes("_") ? contentId.split("_")[0] : "general",
    label: contentId.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()),
    updated_at: new Date().toISOString(),
  };
}

async function getDatabase() {
  if (!process.env.MONGO_URL) {
    return null;
  }

  if (!cachedClientPromise) {
    const client = new MongoClient(process.env.MONGO_URL);
    cachedClientPromise = client.connect();
  }

  const client = await cachedClientPromise;
  return client.db(process.env.DB_NAME || "open_circuit_solutions");
}

async function ensureDefaultContentRecords(db) {
  if (!db) {
    return;
  }

  const collection = db.collection("editable_content");
  const existingIds = await collection.distinct("content_id");
  const existingSet = new Set(existingIds);
  const missing = defaultContent
    .filter((item) => !existingSet.has(item.content_id))
    .map((item) => ({ ...item, updated_at: new Date().toISOString() }));

  if (missing.length > 0) {
    await collection.insertMany(missing);
  }
}

function requireAdmin(event) {
  const expectedToken = buildAdminToken();
  if (!expectedToken) {
    return jsonResponse(503, {
      detail: "Admin credentials are not configured. Set ADMIN_USERNAME and ADMIN_PASSWORD.",
    });
  }

  const authorization = event.headers.authorization || event.headers.Authorization || "";
  if (!authorization.startsWith("Bearer ")) {
    return jsonResponse(401, { detail: "Unauthorized" });
  }

  const token = authorization.slice("Bearer ".length);
  if (!compareSecure(token, expectedToken)) {
    return jsonResponse(401, { detail: "Unauthorized" });
  }

  return null;
}

async function handleLogin(event) {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    return jsonResponse(200, {
      success: false,
      message: "Admin login is disabled until ADMIN_USERNAME and ADMIN_PASSWORD are configured.",
    });
  }

  const body = parseBody(event.body);
  if (!compareSecure(body.username, username) || !compareSecure(body.password, password)) {
    return jsonResponse(200, {
      success: false,
      message: "Invalid credentials.",
    });
  }

  return jsonResponse(200, {
    success: true,
    token: buildAdminToken(),
    message: "Edit mode enabled.",
  });
}

async function handleGetContent(pathParts) {
  const db = await getDatabase();
  if (!db) {
    if (pathParts.length === 1) {
      return jsonResponse(200, defaultContent);
    }

    const item = defaultContentMap.get(pathParts[1]);
    if (!item) {
      return jsonResponse(404, { detail: "Content not found" });
    }
    return jsonResponse(200, item);
  }

  await ensureDefaultContentRecords(db);
  const collection = db.collection("editable_content");

  if (pathParts.length === 1) {
    const items = await collection.find({}, { projection: { _id: 0 } }).toArray();
    return jsonResponse(200, items);
  }

  const item = await collection.findOne(
    { content_id: pathParts[1] },
    { projection: { _id: 0 } }
  );

  if (!item) {
    return jsonResponse(404, { detail: "Content not found" });
  }

  return jsonResponse(200, item);
}

async function handleUpdateContent(event, pathParts) {
  const authError = requireAdmin(event);
  if (authError) {
    return authError;
  }

  const db = await getDatabase();
  if (!db) {
    return jsonResponse(503, {
      detail: "Database is not configured. Set MONGO_URL and DB_NAME to enable persistence.",
    });
  }

  const contentId = pathParts[1];
  if (!contentId) {
    return jsonResponse(400, { detail: "Missing content id." });
  }

  const body = parseBody(event.body);
  const record = buildContentRecord(contentId, body.value ?? "");
  await db.collection("editable_content").updateOne(
    { content_id: contentId },
    { $set: record },
    { upsert: true }
  );

  return jsonResponse(200, { success: true, message: "Content updated" });
}

async function handleGetPortfolio() {
  const db = await getDatabase();
  if (!db) {
    return jsonResponse(200, []);
  }

  const items = await db
    .collection("portfolio")
    .find({}, { projection: { _id: 0 } })
    .sort({ order: 1 })
    .toArray();

  return jsonResponse(200, items);
}

async function handleCreatePortfolio(event) {
  const authError = requireAdmin(event);
  if (authError) {
    return authError;
  }

  const db = await getDatabase();
  if (!db) {
    return jsonResponse(503, {
      detail: "Database is not configured. Set MONGO_URL and DB_NAME to enable persistence.",
    });
  }

  const body = parseBody(event.body);
  const existingCount = await db.collection("portfolio").countDocuments();
  const project = {
    project_id: crypto.randomUUID(),
    title: body.title || "",
    description: body.description || "",
    full_description: body.full_description || "",
    project_type: body.project_type,
    video_url: body.video_url || "",
    seo_keywords: Array.isArray(body.seo_keywords) ? body.seo_keywords : [],
    order: existingCount,
    created_at: new Date().toISOString(),
  };

  await db.collection("portfolio").insertOne(project);
  return jsonResponse(200, project);
}

async function handleUpdatePortfolio(event, pathParts) {
  const authError = requireAdmin(event);
  if (authError) {
    return authError;
  }

  const db = await getDatabase();
  if (!db) {
    return jsonResponse(503, {
      detail: "Database is not configured. Set MONGO_URL and DB_NAME to enable persistence.",
    });
  }

  const projectId = pathParts[1];
  const body = parseBody(event.body);
  const result = await db.collection("portfolio").updateOne(
    { project_id: projectId },
    {
      $set: {
        title: body.title || "",
        description: body.description || "",
        full_description: body.full_description || "",
        project_type: body.project_type,
        video_url: body.video_url || "",
        seo_keywords: Array.isArray(body.seo_keywords) ? body.seo_keywords : [],
      },
    }
  );

  if (result.matchedCount === 0) {
    return jsonResponse(404, { detail: "Project not found" });
  }

  return jsonResponse(200, { success: true, message: "Project updated" });
}

async function handleDeletePortfolio(event, pathParts) {
  const authError = requireAdmin(event);
  if (authError) {
    return authError;
  }

  const db = await getDatabase();
  if (!db) {
    return jsonResponse(503, {
      detail: "Database is not configured. Set MONGO_URL and DB_NAME to enable persistence.",
    });
  }

  const projectId = pathParts[1];
  const result = await db.collection("portfolio").deleteOne({ project_id: projectId });

  if (result.deletedCount === 0) {
    return jsonResponse(404, { detail: "Project not found" });
  }

  return jsonResponse(200, { success: true, message: "Project deleted" });
}

async function handleInitializeContent(event) {
  const authError = requireAdmin(event);
  if (authError) {
    return authError;
  }

  const db = await getDatabase();
  if (!db) {
    return jsonResponse(503, {
      detail: "Database is not configured. Set MONGO_URL and DB_NAME to enable persistence.",
    });
  }

  const refreshedDefaults = defaultContent.map((item) => ({
    ...item,
    updated_at: new Date().toISOString(),
  }));

  const collection = db.collection("editable_content");
  await collection.deleteMany({});
  await collection.insertMany(refreshedDefaults);

  return jsonResponse(200, { success: true, message: "Content initialized" });
}

async function handleContact(event) {
  const body = parseBody(event.body);

  const smtpServer = process.env.SMTP_SERVER;
  const smtpPort = Number(process.env.SMTP_PORT || 465);
  const smtpUser = process.env.SMTP_USER;
  const smtpPassword = process.env.SMTP_PASSWORD;

  if (!smtpServer || !smtpUser || !smtpPassword) {
    return jsonResponse(500, {
      detail: "Email configuration is not set. Add SMTP_SERVER, SMTP_PORT, SMTP_USER, and SMTP_PASSWORD.",
    });
  }

  const transporter = nodemailer.createTransport({
    host: smtpServer,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPassword,
    },
  });

  const htmlBody = `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5;">
          <div style="background: #0B0F14; color: #F5F5F5; padding: 20px; text-align: center;">
            <h2 style="color: #D4AF37; margin: 0;">New Contact Form Submission</h2>
            <p style="color: #A1A1AA; margin: 5px 0;">Open Circuit Solutions</p>
          </div>
          <div style="background: white; padding: 30px; margin-top: 20px; border-radius: 5px;">
            <h3 style="color: #0B0F14; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">Contact Details</h3>
            <p><strong>Name:</strong> ${sanitizeHtml(body.first_name)} ${sanitizeHtml(body.last_name)}</p>
            <p><strong>Email:</strong> <a href="mailto:${sanitizeHtml(body.email)}">${sanitizeHtml(body.email)}</a></p>
            <p><strong>Phone:</strong> ${sanitizeHtml(body.phone)}</p>
            <p><strong>Subject:</strong> ${sanitizeHtml(body.subject)}</p>
            <h3 style="color: #0B0F14; border-bottom: 2px solid #D4AF37; padding-bottom: 10px; margin-top: 30px;">Message</h3>
            <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #D4AF37; margin-top: 10px;">
              <p style="white-space: pre-wrap;">${sanitizeHtml(body.message)}</p>
            </div>
          </div>
          <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
            <p>This email was sent from the Open Circuit Solutions contact form</p>
          </div>
        </div>
      </body>
    </html>
  `;

  await transporter.sendMail({
    from: smtpUser,
    to: smtpUser,
    replyTo: body.email,
    subject: `Open Circuit Solutions Contact: ${body.subject}`,
    html: htmlBody,
  });

  const db = await getDatabase();
  if (db) {
    await db.collection("contact_submissions").insertOne({
      ...body,
      submitted_at: new Date().toISOString(),
    });
  }

  return jsonResponse(200, {
    success: true,
    message: "Your message has been sent successfully!",
  });
}

async function handleRoot() {
  return jsonResponse(200, {
    message: "Open Circuit Solutions API",
    status: "operational",
    databaseConfigured: Boolean(process.env.MONGO_URL),
    adminConfigured: Boolean(process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD),
    runtime: "netlify-function",
  });
}

exports.handler = async (event) => {
  try {
    const method = event.httpMethod || "GET";
    const normalizedPath = normalizePath(event.path);
    const pathParts = normalizedPath.split("/").filter(Boolean);

    if (method === "GET" && normalizedPath === "/") {
      return handleRoot();
    }

    if (method === "POST" && normalizedPath === "/auth/login") {
      return handleLogin(event);
    }

    if (pathParts[0] === "content") {
      if (method === "GET") {
        return handleGetContent(pathParts);
      }
      if (method === "PUT") {
        return handleUpdateContent(event, pathParts);
      }
    }

    if (normalizedPath === "/portfolio" && method === "GET") {
      return handleGetPortfolio();
    }

    if (normalizedPath === "/portfolio" && method === "POST") {
      return handleCreatePortfolio(event);
    }

    if (pathParts[0] === "portfolio" && pathParts[1] && method === "PUT") {
      return handleUpdatePortfolio(event, pathParts);
    }

    if (pathParts[0] === "portfolio" && pathParts[1] && method === "DELETE") {
      return handleDeletePortfolio(event, pathParts);
    }

    if (normalizedPath === "/contact" && method === "POST") {
      return handleContact(event);
    }

    if (normalizedPath === "/init-content" && method === "POST") {
      return handleInitializeContent(event);
    }

    return jsonResponse(404, { detail: "Not found" });
  } catch (error) {
    console.error("Netlify API error:", error);
    return jsonResponse(500, {
      detail: error.message || "An unexpected error occurred.",
    });
  }
};
