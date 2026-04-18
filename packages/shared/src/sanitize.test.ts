import { describe, expect, it } from "vitest";
import { extractPlainText, sanitizeRichTextHtml } from "./sanitize";

describe("sanitizeRichTextHtml", () => {
  it("removes blocked tags and dangerous attributes", () => {
    const input = [
      "<!-- hidden -->",
      '<p onclick="alert(1)" style="color:red">Hello',
      "<script>alert(1)</script>",
      "<strong>world</strong></p>"
    ].join("");

    expect(sanitizeRichTextHtml(input)).toBe("<p>Hello<strong>world</strong></p>");
  });

  it("preserves safe links and adds rel for target blank", () => {
    const input =
      '<a href="https://example.com/docs" title="Read docs" target="_blank" onclick="alert(1)">Docs</a>';

    expect(sanitizeRichTextHtml(input)).toBe(
      '<a href="https://example.com/docs" title="Read docs" target="_blank" rel="noopener noreferrer">Docs</a>'
    );
  });

  it("drops dangerous URLs from links and images", () => {
    const input = [
      '<a href="javascript:alert(1)" target="_blank">Bad link</a>',
      '<img src="data:text/html;base64,abc" alt="Bad image" onerror="alert(1)" />',
      '<img src="/safe-cover.jpg" alt="Safe image" style="width:100%" />'
    ].join("");

    const output = sanitizeRichTextHtml(input);

    expect(output).not.toContain("javascript:");
    expect(output).not.toContain("data:text/html");
    expect(output).toContain('<img src="/safe-cover.jpg" alt="Safe image" />');
  });
});

describe("extractPlainText", () => {
  it("returns normalized text content", () => {
    const input = "<p>Hello&nbsp;<strong>world</strong></p><p>From <em>tests</em></p>";

    expect(extractPlainText(input)).toBe("Hello world From tests");
  });
});
