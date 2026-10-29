import { describe, it, expect } from "vitest";
import { validateHandle, isLinkActiveNow } from "@/lib/validation";

describe("Backend Logic Verification", () => {
  // Test 1: Reserved Handles Rejection
  it("rejects system reserved handles like 'admin' and 'api'", () => {
    expect(validateHandle("admin").isValid).toBe(false);
    expect(validateHandle("api").isValid).toBe(false);
    expect(validateHandle("dashboard").isValid).toBe(false);
  });

  // Test 2: Handle Format & Length Constraints
  it("enforces handle formatting rules and minimum lengths", () => {
    expect(validateHandle("ab").isValid).toBe(false); // too short
    expect(validateHandle("user@name").isValid).toBe(false); // special char
    expect(validateHandle("valid_handle-123").isValid).toBe(true);
  });

  // Test 3: Link Scheduling - Active Window Inclusion
  it("allows links where the current time falls inside start and end windows", () => {
    const now = new Date();
    const link = {
      isActive: true,
      startDate: new Date(now.getTime() - 60000), // 1 min ago
      endDate: new Date(now.getTime() + 60000),   // 1 min in future
    };
    expect(isLinkActiveNow(link, now)).toBe(true);
  });

  // Test 4: Link Scheduling - Future Links Exclusion
  it("excludes links scheduled to start in the future", () => {
    const now = new Date();
    const link = {
      isActive: true,
      startDate: new Date(now.getTime() + 3600000), // 1 hr future
      endDate: null,
    };
    expect(isLinkActiveNow(link, now)).toBe(false);
  });

  // Test 5: Link Scheduling - Expired Links Exclusion
  it("excludes links whose end date has passed", () => {
    const now = new Date();
    const link = {
      isActive: true,
      startDate: new Date(now.getTime() - 7200000),
      endDate: new Date(now.getTime() - 3600000), // expired 1 hr ago
    };
    expect(isLinkActiveNow(link, now)).toBe(false);
  });
});