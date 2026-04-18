import { PostResponseSchema, SlugParamsSchema } from "@blog/shared";
import { findPublishedPostBySlug } from "@blog/shared/db";
import { errorResponse, jsonResponse, optionsResponse } from "@/src/app/api/_lib/response";

interface PostRouteProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function GET(_: Request, { params }: PostRouteProps) {
  const parsedParams = SlugParamsSchema.safeParse(await params);

  if (!parsedParams.success) {
    return errorResponse(400, "INVALID_SLUG", "文章链接别名无效。");
  }

  try {
    const post = await findPublishedPostBySlug(parsedParams.data.slug);

    if (!post) {
      return errorResponse(404, "POST_NOT_FOUND", "未找到对应文章。");
    }

    return jsonResponse(PostResponseSchema.parse({ data: post }));
  } catch {
    return errorResponse(500, "INTERNAL_SERVER_ERROR", "加载文章失败。");
  }
}

export function OPTIONS() {
  return optionsResponse();
}
