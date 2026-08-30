import { test } from "node:test";
import assert from "node:assert/strict";
import { stripLocalePrefix } from "./stripLocalePrefix.ts";

test("strips the default locale's internal rewrite prefix", () => {
  assert.equal(stripLocalePrefix("/global/services/sea-freight", "global"), "/services/sea-freight");
});

test("strips a Tier 1 locale prefix", () => {
  assert.equal(stripLocalePrefix("/us/services/sea-freight", "us"), "/services/sea-freight");
  assert.equal(stripLocalePrefix("/de/services/sea-freight", "de"), "/services/sea-freight");
});

test("strips based on the actual locale value, not a fixed segment count", () => {
  // A "drop the first segment" implementation would strip "de" here just
  // because it's in first position, regardless of what locale was
  // actually passed in. Asserting the path is left untouched when the
  // first segment doesn't match `locale` is what would catch a regression
  // back to positional slicing.
  assert.equal(stripLocalePrefix("/de/services/sea-freight", "us"), "/de/services/sea-freight");
});

test("does not strip a segment that merely starts with the locale value", () => {
  // "/usa" must not be treated as "/us" + "a" — only a full path-segment
  // match counts.
  assert.equal(stripLocalePrefix("/usa/services/sea-freight", "us"), "/usa/services/sea-freight");
});

test("bare locale root strips to the site root", () => {
  assert.equal(stripLocalePrefix("/global", "global"), "/");
  assert.equal(stripLocalePrefix("/us", "us"), "/");
});

test("empty locale is a no-op", () => {
  assert.equal(stripLocalePrefix("/services/sea-freight", ""), "/services/sea-freight");
});

test("an already-canonical pathname that doesn't carry this locale's prefix is left untouched", () => {
  // What a real (non-prerendered) client-side navigation reports for the
  // default locale: the true, unprefixed browser URL.
  assert.equal(stripLocalePrefix("/services/sea-freight", "global"), "/services/sea-freight");
});
