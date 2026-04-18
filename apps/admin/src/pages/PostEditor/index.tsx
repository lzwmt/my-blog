import { useEffect, useRef, useState } from "react";
import {
  slugifyText,
  type CreatePostInput,
  type Post,
  type Tag
} from "@blog/shared/admin";
import {
  Alert,
  Button,
  Form,
  Input,
  Popconfirm,
  Select,
  Skeleton,
  Space
} from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RichTextEditor } from "@/components/RichTextEditor";
import { ADMIN_SITE_BASE_URL, adminContentService } from "@/services/content";

type PostEditorValues = CreatePostInput;

const STATUS_OPTIONS = [
  { label: "草稿", value: "draft" },
  { label: "已发布", value: "published" },
  { label: "已归档", value: "archived" }
];

function mapPostToFormValues(post: Post): PostEditorValues {
  return {
    title: post.title,
    slug: post.slug,
    summary: post.summary ?? "",
    content: post.content,
    coverImage: post.coverImage ?? "",
    status: post.status,
    publishedAt: post.publishedAt ?? null,
    tagIds: post.tags.map((tag) => tag.id)
  };
}

export default function PostEditorPage() {
  const [form] = Form.useForm<PostEditorValues>();
  const submitStatusRef = useRef<PostEditorValues["status"]>("draft");
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [tags, setTags] = useState<Tag[]>([]);
  const [post, setPost] = useState<Post | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    void adminContentService
      .listTags()
      .then((result) => {
        if (active) {
          setTags(result);
        }
      })
      .catch((requestError: unknown) => {
        if (active) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "加载标签失败。"
          );
        }
      });

    if (!isEditing || !id) {
      submitStatusRef.current = "draft";
      form.setFieldsValue({
        title: "",
        slug: "",
        summary: "",
        content: "<p></p>",
        coverImage: "",
        status: "draft",
        publishedAt: null,
        tagIds: []
      });

      return () => {
        active = false;
      };
    }

    void adminContentService
      .getPost(id)
      .then((result) => {
        if (!active) {
          return;
        }

        setPost(result);
        submitStatusRef.current = result.status;
        form.setFieldsValue(mapPostToFormValues(result));
        setError(null);
      })
      .catch((requestError: unknown) => {
        if (!active) {
          return;
        }

        setError(
          requestError instanceof Error
            ? requestError.message
            : "加载文章失败。"
        );
      });

    return () => {
      active = false;
    };
  }, [form, id, isEditing]);

  async function handleSubmit(values: PostEditorValues) {
    setSaving(true);
    setError(null);

    const payload: CreatePostInput = {
      ...values,
      summary: values.summary || null,
      coverImage: values.coverImage || null,
      publishedAt: values.publishedAt || null,
      status: submitStatusRef.current
    };

    try {
      const savedPost =
        isEditing && id
          ? await adminContentService.updatePost(id, payload)
          : await adminContentService.createPost(payload);

      navigate(`/posts/${savedPost.id}`, { replace: true });
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "保存文章失败。"
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!id) {
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await adminContentService.deletePost(id);
      navigate("/posts", { replace: true });
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "删除文章失败。"
      );
      setSaving(false);
    }
  }

  if (isEditing && !post && !error) {
    return <Skeleton active paragraph={{ rows: 12 }} />;
  }

  return (
    <Space direction="vertical" size={16} style={{ width: "100%" }}>
      <Alert
        type="info"
        showIcon
        message="当前编辑器支持直接录入 HTML 内容，便于在接入更完整富文本编辑器前先验证文章创建、更新和发布流程。"
      />

      {error ? <Alert type="error" showIcon message={error} /> : null}

      <Form<PostEditorValues>
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          status: "draft",
          tagIds: []
        }}
      >
        <div className="admin-form-grid">
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: "请输入标题。" }]}
          >
            <Input
              placeholder="例如：如何搭建一套安静但高效的发布流程"
              onBlur={(event) => {
                const currentSlug = form.getFieldValue("slug");

                if (!currentSlug) {
                  form.setFieldValue("slug", slugifyText(event.target.value));
                }
              }}
            />
          </Form.Item>

          <Form.Item
            label="链接别名"
            name="slug"
            rules={[{ required: true, message: "请输入链接别名。" }]}
          >
            <Input placeholder="architecting-a-calm-publishing-workflow" />
          </Form.Item>
        </div>

        <Form.Item label="摘要" name="summary">
          <Input.TextArea rows={3} placeholder="简短概述这篇文章的核心内容" />
        </Form.Item>

        <div className="admin-form-grid">
          <Form.Item label="封面图地址" name="coverImage">
            <Input placeholder="https://images.example.com/cover.jpg" />
          </Form.Item>

          <Form.Item label="状态" name="status">
            <Select options={STATUS_OPTIONS} />
          </Form.Item>
        </div>

        <Form.Item label="标签" name="tagIds">
          <Select
            mode="multiple"
            options={tags.map((tag) => ({
              label: tag.name,
              value: tag.id
            }))}
            placeholder="请选择标签"
          />
        </Form.Item>

        <Form.Item label="发布时间（ISO 字符串）" name="publishedAt">
          <Input placeholder="2026-04-18T09:00:00.000Z" />
        </Form.Item>

        <Form.Item
          label="正文内容"
          name="content"
          rules={[{ required: true, message: "请输入正文内容。" }]}
        >
          <RichTextEditor />
        </Form.Item>

        <Space wrap>
          <Button
            type="primary"
            loading={saving}
            onClick={() => {
              submitStatusRef.current = "draft";
              form.setFieldValue("status", "draft");
              void form.submit();
            }}
          >
            保存草稿
          </Button>
          <Button
            loading={saving}
            onClick={() => {
              submitStatusRef.current = "published";
              form.setFieldValue("status", "published");
              void form.submit();
            }}
          >
            发布
          </Button>
          <Button
            loading={saving}
            onClick={() => {
              submitStatusRef.current = "archived";
              form.setFieldValue("status", "archived");
              void form.submit();
            }}
          >
            归档
          </Button>
          <Button>
            <Link to="/posts">返回列表</Link>
          </Button>
          {post ? (
            <Button
              href={`${ADMIN_SITE_BASE_URL}/posts/${post.slug}`}
              target="_blank"
            >
              打开前台页面
            </Button>
          ) : null}
          {isEditing && id ? (
            <Popconfirm
              title="确认删除这篇文章？"
              description="删除后将无法恢复。"
              okText="删除"
              cancelText="取消"
              onConfirm={() => {
                void handleDelete();
              }}
            >
              <Button danger loading={saving}>
                删除
              </Button>
            </Popconfirm>
          ) : null}
        </Space>
      </Form>
    </Space>
  );
}
