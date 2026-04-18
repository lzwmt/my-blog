import { useEffect, useState } from "react";
import { Button, Form, Input, Modal, Popconfirm, Space, Table, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { slugifyText, type Tag, type TagInput } from "@blog/shared/admin";
import { adminContentService } from "@/services/content";

export default function TagsPage() {
  const [form] = Form.useForm<TagInput>();
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);

  useEffect(() => {
    void loadTags();
  }, []);

  async function loadTags() {
    setLoading(true);

    try {
      const result = await adminContentService.listTags();
      setTags(result);
    } catch (error) {
      message.error(
        error instanceof Error ? error.message : "加载标签失败。"
      );
    } finally {
      setLoading(false);
    }
  }

  function openCreateModal() {
    setEditingTag(null);
    form.resetFields();
    setIsModalOpen(true);
  }

  function openEditModal(tag: Tag) {
    setEditingTag(tag);
    form.setFieldsValue({
      name: tag.name,
      slug: tag.slug
    });
    setIsModalOpen(true);
  }

  async function handleSubmit(values: TagInput) {
    setSubmitting(true);

    try {
      if (editingTag) {
        await adminContentService.updateTag(editingTag.id, values);
        message.success("标签已更新。");
      } else {
        await adminContentService.createTag(values);
        message.success("标签已创建。");
      }

      setIsModalOpen(false);
      form.resetFields();
      await loadTags();
    } catch (error) {
      message.error(
        error instanceof Error ? error.message : "保存标签失败。"
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await adminContentService.deleteTag(id);
      message.success("标签已删除。");
      await loadTags();
    } catch (error) {
      message.error(
        error instanceof Error ? error.message : "删除标签失败。"
      );
    }
  }

  const columns: ColumnsType<Tag> = [
    {
      title: "名称",
      dataIndex: "name"
    },
    {
      title: "链接别名",
      dataIndex: "slug"
    },
    {
      title: "更新时间",
      dataIndex: "updatedAt",
      render: (value?: string) =>
        value ? new Date(value).toLocaleDateString("zh-CN") : "-"
    },
    {
      title: "操作",
      key: "actions",
      render: (_, tag) => (
        <Space>
          <Button size="small" onClick={() => openEditModal(tag)}>
            编辑
          </Button>
          <Popconfirm
            title="确认删除这个标签？"
            description="相关文章会失去与该标签的关联。"
            onConfirm={() => {
              void handleDelete(tag.id);
            }}
          >
            <Button size="small" danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <>
      <div className="admin-toolbar">
        <Button type="primary" onClick={openCreateModal}>
          新建标签
        </Button>
      </div>

      <Table rowKey="id" loading={loading} dataSource={tags} columns={columns} />

      <Modal
        title={editingTag ? "编辑标签" : "创建标签"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        onOk={() => {
          void form.submit();
        }}
        okButtonProps={{ loading: submitting }}
      >
        <Form<TagInput> form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="名称"
            name="name"
            rules={[{ required: true, message: "请输入标签名称。" }]}
          >
            <Input
              placeholder="architecture"
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
            rules={[{ required: true, message: "请输入标签别名。" }]}
          >
            <Input placeholder="architecture" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
