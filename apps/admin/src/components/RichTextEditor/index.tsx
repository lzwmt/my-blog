import { useEffect, useRef, useState } from "react";
import {
  BoldOutlined,
  CodeOutlined,
  FontSizeOutlined,
  ItalicOutlined,
  LinkOutlined,
  OrderedListOutlined,
  UnorderedListOutlined
} from "@ant-design/icons";
import { Button, Divider, Input, Segmented, Space } from "antd";
import type { SegmentedValue } from "antd/es/segmented";

interface RichTextEditorProps {
  onChange?: (value: string) => void;
  value?: string;
}

type EditorMode = "html" | "visual";

function normalizeEditorHtml(value?: string) {
  return value && value.trim() ? value : "<p></p>";
}

export function RichTextEditor({ onChange, value }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<EditorMode>("visual");
  const editorValue = normalizeEditorHtml(value);

  useEffect(() => {
    if (
      mode === "visual" &&
      editorRef.current &&
      editorRef.current.innerHTML !== editorValue
    ) {
      editorRef.current.innerHTML = editorValue;
    }
  }, [editorValue, mode]);

  function emitChange(nextValue: string) {
    const normalized = normalizeEditorHtml(nextValue);

    onChange?.(normalized);
  }

  function focusEditor() {
    editorRef.current?.focus();
  }

  function runCommand(command: string, commandValue?: string) {
    focusEditor();
    document.execCommand(command, false, commandValue);
    emitChange(editorRef.current?.innerHTML ?? editorValue);
  }

  function setBlock(tagName: "blockquote" | "h2" | "h3" | "p" | "pre") {
    runCommand("formatBlock", tagName);
  }

function insertLink() {
    const url = window.prompt("请输入链接地址");

    if (!url) {
      return;
    }

    runCommand("createLink", url);
  }

  function handleModeChange(nextMode: SegmentedValue) {
    if (nextMode !== "visual" && nextMode !== "html") {
      return;
    }

    if (editorRef.current) {
      emitChange(editorRef.current.innerHTML);
    }

    setMode(nextMode);
  }

  return (
    <div className="rich-editor">
      <div className="rich-editor__toolbar">
        <Space wrap size={[8, 8]}>
          <Segmented<EditorMode>
            value={mode}
            onChange={handleModeChange}
            options={[
              { label: "可视化", value: "visual" },
              { label: "HTML 源码", value: "html" }
            ]}
          />
          <Divider type="vertical" />
          <Button icon={<BoldOutlined />} onClick={() => runCommand("bold")}>
            加粗
          </Button>
          <Button icon={<ItalicOutlined />} onClick={() => runCommand("italic")}>
            斜体
          </Button>
          <Button icon={<FontSizeOutlined />} onClick={() => setBlock("h2")}>
            标题 2
          </Button>
          <Button icon={<FontSizeOutlined />} onClick={() => setBlock("h3")}>
            标题 3
          </Button>
          <Button icon={<UnorderedListOutlined />} onClick={() => runCommand("insertUnorderedList")}>
            无序列表
          </Button>
          <Button icon={<OrderedListOutlined />} onClick={() => runCommand("insertOrderedList")}>
            有序列表
          </Button>
          <Button icon={<LinkOutlined />} onClick={insertLink}>
            链接
          </Button>
          <Button icon={<CodeOutlined />} onClick={() => setBlock("pre")}>
            代码块
          </Button>
          <Button onClick={() => setBlock("blockquote")}>引用</Button>
          <Button onClick={() => setBlock("p")}>段落</Button>
          <Button onClick={() => runCommand("removeFormat")}>清除格式</Button>
        </Space>
      </div>

      {mode === "visual" ? (
        <div
          ref={editorRef}
          aria-label="文章内容可视化编辑器"
          className="rich-editor__surface"
          contentEditable
          data-testid="rich-editor-visual-surface"
          suppressContentEditableWarning
          onInput={(event) => {
            emitChange(event.currentTarget.innerHTML);
          }}
          onBlur={(event) => {
            emitChange(event.currentTarget.innerHTML);
          }}
        />
      ) : (
        <Input.TextArea
          aria-label="文章内容 HTML 编辑器"
          data-testid="rich-editor-html-input"
          rows={18}
          value={editorValue}
          onChange={(event) => {
            emitChange(event.target.value);
          }}
          onBlur={(event) => {
            emitChange(event.target.value);
          }}
        />
      )}

      <p className="rich-editor__note">
        当前支持：段落、二级标题、三级标题、加粗、斜体、列表、链接、引用、
        代码块、图片、换行和分隔线。
      </p>
    </div>
  );
}
