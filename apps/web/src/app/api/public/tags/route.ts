import { TagsResponseSchema } from "@blog/shared";
import { listTags } from "@blog/shared/db";
import { errorResponse, jsonResponse, optionsResponse } from "@/src/app/api/_lib/response";

export async function GET() {
  try {
    const tags = await listTags();
    return jsonResponse(TagsResponseSchema.parse({ data: tags }));
  } catch {
    return errorResponse(500, "INTERNAL_SERVER_ERROR", "加载标签失败。");
  }
}

export function OPTIONS() {
  return optionsResponse();
}
