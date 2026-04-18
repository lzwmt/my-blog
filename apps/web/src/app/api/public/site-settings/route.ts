import { SiteSettingResponseSchema } from "@blog/shared";
import { getSiteSetting } from "@blog/shared/db";
import { errorResponse, jsonResponse, optionsResponse } from "@/src/app/api/_lib/response";

export async function GET() {
  try {
    const siteSetting = await getSiteSetting();
    return jsonResponse(SiteSettingResponseSchema.parse({ data: siteSetting }));
  } catch {
    return errorResponse(
      500,
      "INTERNAL_SERVER_ERROR",
      "加载站点设置失败。"
    );
  }
}

export function OPTIONS() {
  return optionsResponse();
}
