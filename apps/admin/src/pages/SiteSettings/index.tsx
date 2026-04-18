import { useEffect, useState } from "react";
import {
  ProCard,
  ProForm,
  ProFormList,
  ProFormText,
  ProFormTextArea
} from "@ant-design/pro-components";
import { Alert, Form, Skeleton, message } from "antd";
import type { SiteSetting } from "@blog/shared/admin";
import { adminContentService } from "@/services/content";

const DEFAULT_SITE_SETTING: SiteSetting = {
  siteName: "",
  siteDescription: "",
  heroTitle: "",
  heroDescription: "",
  socialLinks: []
};

export default function SiteSettingsPage() {
  const [form] = Form.useForm<SiteSetting>();
  const [siteSetting, setSiteSetting] = useState<SiteSetting | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    void adminContentService
      .getSiteSetting()
      .then((result) => {
        if (!active) {
          return;
        }

        setSiteSetting(result);
        setError(null);
      })
      .catch((requestError: unknown) => {
        if (!active) {
          return;
        }

        setError(
          requestError instanceof Error
            ? requestError.message
            : "加载站点设置失败。"
        );
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <ProCard direction="column" ghost gutter={[0, 16]}>
      {error ? <Alert type="error" showIcon message={error} /> : null}

      {loading ? (
        <Skeleton active paragraph={{ rows: 8 }} />
      ) : (
        <ProCard>
          <ProForm<SiteSetting>
            form={form}
            initialValues={siteSetting ?? DEFAULT_SITE_SETTING}
            submitter={{
              searchConfig: {
                submitText: "保存设置"
              },
              submitButtonProps: {
                loading: saving
              }
            }}
            onFinish={async (values) => {
              setSaving(true);
              setError(null);

              try {
                const updated = await adminContentService.updateSiteSetting({
                  ...values,
                  socialLinks: values.socialLinks ?? []
                });

                setSiteSetting(updated);
                if (updated) {
                  form.setFieldsValue(updated);
                }
                message.success("站点设置已保存。");
              } catch (requestError) {
                setError(
                  requestError instanceof Error
                    ? requestError.message
                    : "保存站点设置失败。"
                );
              } finally {
                setSaving(false);
              }
            }}
          >
            <ProFormText name="siteName" label="站点名称" />
            <ProFormTextArea
              name="siteDescription"
              label="站点描述"
              fieldProps={{ rows: 4 }}
            />
            <ProFormText name="heroTitle" label="首页主标题" />
            <ProFormTextArea
              name="heroDescription"
              label="首页说明文案"
              fieldProps={{ rows: 4 }}
            />
            <ProFormList
              name="socialLinks"
              label="社交链接"
              creatorButtonProps={false}
              copyIconProps={false}
              deleteIconProps={false}
            >
              <ProFormText
                name="label"
                label="名称"
                rules={[{ required: true, message: "请输入名称。" }]}
              />
              <ProFormText
                name="url"
                label="URL"
                rules={[{ required: true, message: "请输入 URL。" }]}
              />
            </ProFormList>
          </ProForm>
        </ProCard>
      )}
    </ProCard>
  );
}
