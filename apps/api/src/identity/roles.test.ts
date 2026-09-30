import { describe, expect, it } from "vitest";
import { roleGrants } from "./roles";
describe("roleGrants", () => { it("prevents viewers from starting simulations", () => expect(roleGrants("VIEWER", "simulation:run")).toBe(false)); it("allows modelers to start simulations", () => expect(roleGrants("MODELER", "simulation:run")).toBe(true)); });
