import { LockOutlined, UserOutlined } from "@ant-design/icons";
import type { AdminCredential } from "@blog/shared/admin";
import { Alert, Button, Form, Input } from "antd";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { adminContentService } from "@/services/content";

export default function LoginPage() {
  const [form] = Form.useForm<AdminCredential>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const nextPath =
    new URLSearchParams(location.search).get("next") || "/dashboard";

  useEffect(() => {
    let active = true;

    void adminContentService
      .getSession()
      .then(() => {
        if (active) {
          navigate(nextPath, { replace: true });
        }
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, [navigate, nextPath]);

  async function handleSubmit(values: AdminCredential) {
    setLoading(true);
    setError(null);

    try {
      await adminContentService.login(values);
      navigate(nextPath, { replace: true });
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "登录失败。"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="admin-login-shell">
      <section className="admin-login-panel">
        <div className="admin-login-panel__card admin-login-panel__surface">
          <p className="admin-login-panel__eyebrow">后台登录</p>
          <h1 className="admin-login-panel__title">写作、校对与发布统一在这里完成。</h1>
          <p className="admin-login-panel__copy">
            当前版本使用单管理员账号登录。登录成功后，仪表盘和内容管理接口会
            共享同一会话边界。
          </p>

          {error ? (
            <Alert
              style={{ marginBottom: 20 }}
              type="error"
              showIcon
              message={error}
            />
          ) : null}

          <Form<AdminCredential>
            form={form}
            layout="vertical"
            size="large"
            onFinish={handleSubmit}
          >
            <Form.Item label="用户名" name="username">
              <Input
                prefix={<UserOutlined />}
                placeholder="owner"
                autoComplete="username"
              />
            </Form.Item>
            <Form.Item label="密码" name="password">
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              登录
            </Button>
          </Form>
        </div>
      </section>

      <section className="admin-login-stage">
        <div className="admin-login-stage__card">
          <div className="admin-login-stage__content">
            <div>
              <div className="admin-login-stage__badge">个人博客控制台</div>
              <h2 className="admin-login-stage__headline">
                先把发布流程跑通，再处理复杂度。
              </h2>
            </div>

            <div className="admin-login-stage__list">
              <div className="admin-login-stage__tile">
                <strong>文章</strong>
                <span>创建、编辑、保存草稿、发布和归档技术文章。</span>
              </div>
              <div className="admin-login-stage__tile">
                <strong>标签</strong>
                <span>管理影响前台阅读流的标签体系。</span>
              </div>
              <div className="admin-login-stage__tile">
                <strong>设置</strong>
                <span>控制首页文案和站点核心信息。</span>
              </div>
            </div>

            <p className="admin-login-stage__footnote">
              首次登录会使用 `ADMIN_BOOTSTRAP_PASSWORD`，直到占位密码哈希被升级。
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
