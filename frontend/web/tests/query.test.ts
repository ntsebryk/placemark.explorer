import { describe, expect, it } from "vitest";
import { toQueryString } from "../src/lib/query";

describe("toQueryString", () => {
  it("keeps defined values and skips empty values", () => {
    const result = toQueryString({
      page: 0,
      size: 20,
      category: "",
      q: undefined
    });
    expect(result).toBe("page=0&size=20");
  });
});
