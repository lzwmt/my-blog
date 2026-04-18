import { PostsResponseSchema } from "@blog/shared";
import { listPublishedPosts } from "@blog/shared/db";
import { errorResponse, jsonResponse, optionsResponse } from "@/src/app/api/_lib/response";

export async function GET() {
  try {
    const posts = await listPublishedPosts();
    return jsonResponse(PostsResponseSchema.parse({ data: posts }));
  } catch {
    return errorResponse(500, "INTERNAL_SERVER_ERROR", "加载文章失败。");
  }
}

export function OPTIONS() {
  return optionsResponse();
}
