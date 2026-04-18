const ALLOWED_TAGS = new Set([
  "a",
  "blockquote",
  "br",
  "code",
  "em",
  "h2",
  "h3",
  "hr",
  "img",
  "li",
  "ol",
  "p",
  "pre",
  "strong",
  "ul"
]);

const SELF_CLOSING_TAGS = new Set(["br", "hr", "img"]);

function decodeAttributeValue(value: string) {
  const trimmed = value.trim();

  if (
    (trimmed.startsWith("\"") && trimmed.endsWith("\"")) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }

  return trimmed;
}

function escapeHtmlAttribute(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function isSafeUrl(url: string, type: "href" | "src") {
  const normalized = url.trim().toLowerCase();

  if (!normalized) {
    return false;
  }

  if (
    normalized.startsWith("javascript:") ||
    normalized.startsWith("vbscript:") ||
    normalized.startsWith("data:")
  ) {
    return false;
  }

  if (type === "href") {
    return (
      normalized.startsWith("http://") ||
      normalized.startsWith("https://") ||
      normalized.startsWith("mailto:") ||
      normalized.startsWith("tel:") ||
      normalized.startsWith("/") ||
      normalized.startsWith("./") ||
      normalized.startsWith("../") ||
      normalized.startsWith("#")
    );
  }

  return (
    normalized.startsWith("http://") ||
    normalized.startsWith("https://") ||
    normalized.startsWith("/") ||
    normalized.startsWith("./") ||
    normalized.startsWith("../")
  );
}

function sanitizeAttributes(tagName: string, rawAttributes: string) {
  const attributes: string[] = [];
  const attributePattern =
    /([a-zA-Z0-9:-]+)(?:\s*=\s*("[^"]*"|'[^']*'|[^\s"'=<>`]+))?/g;

  let match: RegExpExecArray | null;
  let openInNewTab = false;

  while ((match = attributePattern.exec(rawAttributes)) !== null) {
    const attributeName = match[1].toLowerCase();
    const rawValue = match[2];

    if (!rawValue || attributeName.startsWith("on") || attributeName === "style") {
      continue;
    }

    const value = decodeAttributeValue(rawValue);

    if (tagName === "a") {
      if (attributeName === "href" && isSafeUrl(value, "href")) {
        attributes.push(`href="${escapeHtmlAttribute(value)}"`);
        continue;
      }

      if (attributeName === "title") {
        attributes.push(`title="${escapeHtmlAttribute(value)}"`);
        continue;
      }

      if (attributeName === "target" && value === "_blank") {
        openInNewTab = true;
      }

      continue;
    }

    if (tagName === "img") {
      if (attributeName === "src" && isSafeUrl(value, "src")) {
        attributes.push(`src="${escapeHtmlAttribute(value)}"`);
        continue;
      }

      if (attributeName === "alt" || attributeName === "title") {
        attributes.push(`${attributeName}="${escapeHtmlAttribute(value)}"`);
      }
    }
  }

  if (tagName === "a" && openInNewTab) {
    attributes.push('target="_blank"', 'rel="noopener noreferrer"');
  }

  return attributes.length > 0 ? ` ${attributes.join(" ")}` : "";
}

export function sanitizeRichTextHtml(input: string) {
  const withoutBlockedTags = input
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(
      /<\s*(script|style|iframe|object|embed|svg|math|form|button|textarea|select|option|link|meta|base)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi,
      ""
    )
    .replace(
      /<\s*\/?\s*(script|style|iframe|object|embed|svg|math|form|button|textarea|select|option|link|meta|base)[^>]*\/?\s*>/gi,
      ""
    );

  return withoutBlockedTags.replace(/<[^>]+>/g, (tag) => {
    const tagMatch = /^<\s*(\/)?\s*([a-zA-Z0-9-]+)([^>]*)>$/i.exec(tag);

    if (!tagMatch) {
      return "";
    }

    const isClosingTag = Boolean(tagMatch[1]);
    const tagName = tagMatch[2].toLowerCase();
    const rawAttributes = tagMatch[3] ?? "";

    if (!ALLOWED_TAGS.has(tagName)) {
      return "";
    }

    if (isClosingTag) {
      return SELF_CLOSING_TAGS.has(tagName) ? "" : `</${tagName}>`;
    }

    const attributes = sanitizeAttributes(tagName, rawAttributes);

    if (SELF_CLOSING_TAGS.has(tagName)) {
      return `<${tagName}${attributes} />`;
    }

    return `<${tagName}${attributes}>`;
  });
}

export function extractPlainText(input: string) {
  return sanitizeRichTextHtml(input)
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}
