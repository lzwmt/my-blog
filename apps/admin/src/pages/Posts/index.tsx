import { useEffect, useState } from "react";
import { Button, Alert, Empty, Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { Post } from "@blog/shared/admin";
import { Link } from "react-router-dom";
import { adminContentService } from "@/services/content";

const statusColorMap: Record<Post["status"], string> = {
  published: "blue",
  draft: "gold",
  archived: "default"
};

const statusLabelMap: Record<Post["status"], string> = {
  published: "已发布",
  draft: "草稿",
  archived: "已归档"
};

function formatDate(value?: string | null) {
  if (!value) {
    return "未设置";
  }

  return new Date(value).toLocaleDateString("zh-CN");
}

const columns: ColumnsType<Post> = [
  {
    title: "标题",
    dataIndex: "title"
  },
  {
    title: "状态",
    dataIndex: "status",
    render: (status: Post["status"]) => (
      <Tag color={statusColorMap[status]}>{statusLabelMap[status]}</Tag>
    )
  },
  {
    title: "标签",
    key: "tags",
    render: (_, post) =>
      post.tags.length > 0 ? (
        <Space size={[4, 4]} wrap>
          {post.tags.map((tag) => (
            <Tag key={tag.id}>{tag.name}</Tag>
          ))}
        </Space>
      ) : (
        <span className="admin-muted-text">暂无标签</span>
      )
  },
  {
    title: "发布时间",
    dataIndex: "publishedAt",
    render: (value: string | null) => formatDate(value)
  },
  {
    title: "更新时间",
    dataIndex: "updatedAt",
    render: (value?: string) => formatDate(value)
  },
  {
    title: "操作",
    key: "actions",
    render: (_, post) => (
      <Space>
        <Button size="small">
          <Link to={`/posts/${post.id}`}>编辑</Link>
        </Button>
        <Button
          size="small"
          href={`http://localhost:3000/posts/${post.slug}`}
          target="_blank"
        >
          预览
        </Button>
      </Space>
    )
  }
];

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    void adminContentService
      .listPosts()
      .then((result) => {
        if (!active) {
          return;
        }

        setPosts(result);
        setError(null);
      })
      .catch((requestError: unknown) => {
        if (!active) {
          return;
        }

        setError(
          requestError instanceof Error
            ? requestError.message
            : "加载文章列表失败。"
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
    <>
      <div className="admin-toolbar">
        <Button type="primary">
          <Link to="/posts/new">新建文章</Link>
        </Button>
      </div>

      {error ? (
        <Alert
          style={{ marginBottom: 16 }}
          type="error"
          showIcon
          message={error}
        />
      ) : null}

      <Table
        rowKey="id"
        loading={loading}
        dataSource={posts}
        pagination={false}
        locale={{
          emptyText: <Empty description="数据库中暂时还没有文章。" />
        }}
        columns={columns}
      />
    </>
  );
}
