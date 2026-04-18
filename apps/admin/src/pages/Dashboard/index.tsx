import { useEffect, useState } from "react";
import { ProCard, StatisticCard } from "@ant-design/pro-components";
import { Alert, Skeleton } from "antd";
import type { DashboardStats } from "@blog/shared/admin";
import { adminContentService } from "@/services/content";

const statMeta = [
  {
    key: "total",
    title: "总文章数",
    description: "当前后台已存储的全部文章。"
  },
  {
    key: "published",
    title: "已发布",
    description: "当前前台对外可见的文章数量。"
  },
  {
    key: "drafts",
    title: "草稿",
    description: "仍在撰写或待校对的文章。"
  },
  {
    key: "archived",
    title: "已归档",
    description: "已退出当前公开流通的历史文章。"
  }
] as const;

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    void adminContentService
      .getDashboardStats()
      .then((result) => {
        if (!active) {
          return;
        }

        setStats(result);
        setError(null);
      })
      .catch((requestError: unknown) => {
        if (!active) {
          return;
        }

        setError(
          requestError instanceof Error
            ? requestError.message
            : "加载仪表盘统计失败。"
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

      {loading || !stats ? (
        <Skeleton active paragraph={{ rows: 6 }} />
      ) : (
        <ProCard gutter={16} wrap>
          {statMeta.map((stat) => (
            <StatisticCard
              key={stat.key}
              statistic={{
                title: stat.title,
                value: stats[stat.key],
                description: stat.description
              }}
            />
          ))}
        </ProCard>
      )}

      <ProCard title="当前阶段">
        <p className="admin-page-copy">
          当前仪表盘展示的是来自 Next.js API 和 Supabase PostgreSQL 的实时汇总数据。
          写入能力与鉴权流程已接入同一管理边界。
        </p>
      </ProCard>
    </ProCard>
  );
}
