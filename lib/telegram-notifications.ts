type TelegramReviewNotification = {
  authorName: string;
  phoneNumber: string;
  body: string;
  rating: number;
  imageUrl: string | null;
  productName: string;
  productSlug: string;
  createdAt: Date;
};

type TelegramContactNotification = {
  fullName: string;
  phone: string;
  message: string | null;
  createdAt: Date;
};

function getTelegramConfig(kind: "review" | "contact") {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId =
    (kind === "review" ? process.env.TELEGRAM_REVIEW_CHAT_ID?.trim() : process.env.TELEGRAM_CONTACT_CHAT_ID?.trim()) ||
    process.env.TELEGRAM_CHAT_ID?.trim();

  if (!token || !chatId) {
    return null;
  }

  return { token, chatId };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "") || "https://modaily.uk";
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Tashkent"
  }).format(value);
}

async function sendTelegramMessage(kind: "review" | "contact", text: string) {
  const config = getTelegramConfig(kind);

  if (!config) {
    return;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2500);

  try {
    const response = await fetch(`https://api.telegram.org/bot${config.token}/sendMessage`, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      signal: controller.signal,
      body: JSON.stringify({
        chat_id: config.chatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: false
      })
    });

    if (!response.ok) {
      console.warn(`[telegram] ${kind} notification failed`, {
        status: response.status,
        statusText: response.statusText
      });
    }
  } catch (error) {
    console.warn(`[telegram] ${kind} notification error`, {
      error: error instanceof Error ? error.message : "Unknown Telegram error"
    });
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function notifyTelegramAboutReview(review: TelegramReviewNotification) {
  const productUrl = `${getSiteUrl()}/ru/catalog/${review.productSlug}`;
  const lines = [
    "<b>New product review</b>",
    "",
    `<b>Product:</b> <a href="${escapeHtml(productUrl)}">${escapeHtml(review.productName)}</a>`,
    `<b>Rating:</b> ${review.rating}/5`,
    `<b>Name:</b> ${escapeHtml(review.authorName)}`,
    `<b>Phone:</b> ${escapeHtml(review.phoneNumber)}`,
    `<b>Time:</b> ${escapeHtml(formatDate(review.createdAt))}`,
    "",
    `<b>Review:</b>\n${escapeHtml(review.body)}`
  ];

  if (review.imageUrl) {
    lines.push("", `<b>Image:</b> ${escapeHtml(review.imageUrl)}`);
  }

  await sendTelegramMessage("review", lines.join("\n"));
}

export async function notifyTelegramAboutContactMessage(message: TelegramContactNotification) {
  const lines = [
    "<b>New contact message</b>",
    "",
    `<b>Name:</b> ${escapeHtml(message.fullName)}`,
    `<b>Phone:</b> ${escapeHtml(message.phone)}`,
    `<b>Time:</b> ${escapeHtml(formatDate(message.createdAt))}`,
    "",
    `<b>Message:</b>\n${escapeHtml(message.message || "-")}`
  ];

  await sendTelegramMessage("contact", lines.join("\n"));
}
