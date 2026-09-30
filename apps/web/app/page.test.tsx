import { describe, expect, it } from "vitest";
import HomePage from "./page";

describe("HomePage", () => {
  it("exports the product landing page", () => {
    expect(HomePage).toBeTypeOf("function");
  });
});

