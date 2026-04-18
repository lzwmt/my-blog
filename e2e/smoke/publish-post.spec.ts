import { expect, test } from "@playwright/test";

const adminBaseUrl =
  process.env.PLAYWRIGHT_ADMIN_BASE_URL ?? "http://localhost:8000";
const webBaseUrl =
  process.env.PLAYWRIGHT_WEB_BASE_URL ?? "http://localhost:3000";
const adminUsername = process.env.E2E_ADMIN_USERNAME ?? "owner";
const adminPassword =
  process.env.E2E_ADMIN_PASSWORD ?? process.env.ADMIN_BOOTSTRAP_PASSWORD;

function extractPostId(url: string) {
  const match = url.match(/\/posts\/([^/?#]+)/);

  return match?.[1] ?? null;
}

async function deletePostById(postId: string, cookieHeader: string) {
  const response = await fetch(`${webBaseUrl}/api/admin/posts/${postId}`, {
    method: "DELETE",
    headers: {
      Cookie: cookieHeader
    }
  });

  if (!response.ok && response.status !== 404) {
    throw new Error(`Failed to delete smoke-test post. Status: ${response.status}`);
  }
}

async function getAdminPost(postId: string, cookieHeader: string) {
  const response = await fetch(`${webBaseUrl}/api/admin/posts/${postId}`, {
    headers: {
      Cookie: cookieHeader
    }
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as {
    data?: Record<string, unknown>;
  };

  return payload.data ?? null;
}

test.describe("blog publishing smoke", () => {
  test("admin can publish an article and read it on the public site", async ({
    page,
    context
  }) => {
    test.skip(!adminPassword, "Set E2E_ADMIN_PASSWORD or ADMIN_BOOTSTRAP_PASSWORD first.");

    const token = `${Date.now()}`;
    const title = `E2E Smoke ${token}`;
    const slug = `e2e-smoke-${token}`;
    const bodyText = `Smoke body ${token}`;
    let createdPostId: string | null = null;
    let publishedSlug = slug;
    let cleanupError: Error | null = null;

    try {
      await page.goto(`${adminBaseUrl}/login`);
      await page.getByLabel("用户名").fill(adminUsername);
      await page.getByLabel("密码").fill(adminPassword ?? "");
      await page.getByRole("button", { name: /登\s*录/ }).click();

      await expect(page).toHaveURL(/\/dashboard$/, {
        timeout: 45_000
      });

      await page.goto(`${adminBaseUrl}/posts/new`);
      await expect(page).toHaveURL(/\/posts\/new$/, {
        timeout: 45_000
      });

      await page.getByLabel("标题").fill(title);
      await page.getByLabel("链接别名").fill(slug);
      await page.getByLabel("摘要").fill(`冒烟摘要 ${token}`);
      await page
        .locator(".rich-editor .ant-segmented-item")
        .filter({ hasText: "HTML" })
        .click();
      await page.getByTestId("rich-editor-html-input").fill(`<p>${bodyText}</p>`);
      await page.getByRole("button", { name: /发\s*布/ }).click();

      await expect(page).toHaveURL(/\/posts\/(?!new$)[^/]+$/, {
        timeout: 45_000
      });
      createdPostId = extractPostId(page.url());

      expect(createdPostId).not.toBeNull();
      const sessionCookie = (await context.cookies()).find(
        (cookie) => cookie.name === "blog_admin_session"
      );

      expect(sessionCookie).toBeDefined();
      const cookieHeader = `${sessionCookie?.name}=${sessionCookie?.value}`;

      await expect.poll(async () => {
        const post = await getAdminPost(createdPostId ?? "", cookieHeader);

        if (!post) {
          return "http-404";
        }

        const nextSlug = typeof post.slug === "string" ? post.slug : null;

        if (nextSlug) {
          publishedSlug = nextSlug;
        }

        return typeof post.status === "string" ? post.status : "unknown";
      }).toBe("published");

      await expect
        .poll(
          async () => {
            const response = await page.request.get(
              `${webBaseUrl}/api/public/posts/${publishedSlug}`
            );
            return response.status();
          },
          {
            timeout: 45_000
          }
        )
        .toBe(200);

      await page.goto(`${webBaseUrl}/posts/${publishedSlug}`);
      await expect(page.getByRole("heading", { name: title })).toBeVisible();
      await expect(page.getByText(bodyText)).toBeVisible();
    } finally {
      if (createdPostId) {
        const sessionCookie = (await context.cookies()).find(
          (cookie) => cookie.name === "blog_admin_session"
        );

        if (!sessionCookie) {
          cleanupError = new Error(
            "Smoke test created a post but no admin session cookie was available for cleanup."
          );
        } else {
          try {
            await deletePostById(
              createdPostId,
              `${sessionCookie.name}=${sessionCookie.value}`
            );
          } catch (error) {
            cleanupError =
              error instanceof Error
                ? error
                : new Error("Failed to clean up smoke-test post.");
          }
        }
      }
    }

    if (cleanupError) {
      throw cleanupError;
    }
  });
});
