import { describe, expect, it } from "vitest";
import { AppController } from "./app.controller";

describe("AppController", () => {
  it("reports service health", () => {
    expect(new AppController().health()).toEqual({ status: "ok", service: "predict-api" });
  });
});

