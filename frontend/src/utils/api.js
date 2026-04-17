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

export async function apiListVsSet(operation, data) {
  const res = await fetch(`${BASE_URL}/list-vs-set`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ operation, data }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "List vs Set API failed");
  }
  return res.json();
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
