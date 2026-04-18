import { describe, expect, it } from "vitest";
import { slugifyText } from "./slug";

describe("slugifyText", () => {
  it("converts mixed text to lowercase kebab-case", () => {
    expect(slugifyText("  Calm Editorial Rhythm  ")).toBe(
      "calm-editorial-rhythm"
    );
  });

  it("removes punctuation and collapses repeated separators", () => {
    expect(slugifyText("Launch!!! notes --- v1")).toBe("launch-notes-v1");
  });

  it("returns an empty string when nothing slug-safe remains", () => {
    expect(slugifyText("###")).toBe("");
  });
});
