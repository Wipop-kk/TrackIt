import { describe, it, expect } from "vitest";
import { getDictionary } from "../i18n";
import { en } from "../i18n/dictionaries/en";
import { th } from "../i18n/dictionaries/th";

describe("i18n", () => {
  describe("getDictionary", () => {
    it("should return English dictionary", () => {
      expect(getDictionary("en")).toBe(en);
    });

    it("should return Thai dictionary", () => {
      expect(getDictionary("th")).toBe(th);
    });
  });

  describe("Dictionary Parity", () => {
    it("should have exactly the same keys in both dictionaries", () => {
      const enKeys = Object.keys(en).sort();
      const thKeys = Object.keys(th).sort();
      expect(enKeys).toEqual(thKeys);
    });
  });
});
