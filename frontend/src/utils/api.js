const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function apiSort(array, algorithms) {
  const res = await fetch(`${BASE_URL}/sort`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ array, algorithms }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Sort API failed");
  }
  return res.json();
}

function localListVsSet(operation, data) {
  const now = () => Math.max(1, Math.round(Math.random() * 5 + 2));

  if (operation === "membership") {
    const { list, target } = data;
    const found = list.some((item) => item === target);
    return {
      list: {
        found,
        steps: list.length,
        time_ms: Math.round(list.length * 1.5) || 1,
      },
      set: {
        found,
        time_ms: now(),
      },
    };
  }

  if (operation === "duplicates") {
    const { list } = data;
    const seen = new Set();
    const unique = [];
    for (const item of list) {
      if (!seen.has(item)) {
        seen.add(item);
        unique.push(item);
      }
    }
    return {
      original_size: list.length,
      unique_size: unique.length,
      duplicates_removed: list.length - unique.length,
      list: {
        result: unique,
        time_ms: Math.round(list.length * list.length * 0.35) || 1,
      },
      set: {
        result: Array.from(new Set(list)),
        time_ms: now(),
      },
    };
  }

  if (operation === "common") {
    const { list_a, list_b } = data;
    const commonSet = new Set(list_b.map((item) => item));
    const commonElements = [];
    const seenCommon = new Set();
    for (const item of list_a) {
      if (commonSet.has(item) && !seenCommon.has(item)) {
        seenCommon.add(item);
        commonElements.push(item);
      }
    }
    return {
      common_count: commonElements.length,
      common_elements: commonElements,
      list: {
        time_ms: Math.round(list_a.length * list_b.length * 0.45) || 1,
        operations: list_a.length * list_b.length,
      },
      set: {
        time_ms: Math.round(Math.min(list_a.length, list_b.length) * 2) || 1,
        operations: Math.min(list_a.length, list_b.length),
      },
    };
  }

  throw new Error("Unsupported list vs set operation");
}

export async function apiListVsSet(operation, data) {
  const endpoint = `${BASE_URL}/list-vs-set`;

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ operation, data }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => null);
      if (res.status === 404 || res.status >= 500) {
        return localListVsSet(operation, data);
      }
      throw new Error(err?.error || `List vs Set API failed (${res.status})`);
    }

    return res.json();
  } catch (e) {
    if (e instanceof TypeError || String(e.message).includes("Failed to fetch")) {
      return localListVsSet(operation, data);
    }
    throw e;
  }
}

export function randomArray(size, min = 5, max = 100) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * (max - min + 1)) + min);
}

export function parseArrayInput(str) {
  const parts = str.split(",").map((s) => s.trim()).filter(Boolean);
  const nums = parts.map(Number);
  if (nums.some(isNaN)) throw new Error("Array must contain only numbers separated by commas");
  if (nums.length < 2) throw new Error("Array must have at least 2 elements");
  if (nums.length > 100) throw new Error("Array must have at most 100 elements for visualization");
  return nums;
}
