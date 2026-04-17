/**
 * Step generators for sorting visualizations.
 * Each function returns an array of "frames" describing the array state
 * and what's being compared/swapped at each step.
 *
 * Frame shape: { array, comparing: [i,j], swapping: [i,j], message, phase }
 */

function frame(array, comparing = [], swapping = [], message = "", phase = "compare") {
  return {
    array: [...array],
    comparing,
    swapping,
    message,
    phase, // "compare" | "swap" | "sorted" | "done"
  };
}

export function generateBubbleFrames(arr) {
  const a = [...arr];
  const frames = [];
  const n = a.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      frames.push(frame(a, [j, j + 1], [], `Comparing A[${j}]=${a[j]} and A[${j+1}]=${a[j+1]}`));
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        frames.push(frame(a, [], [j, j + 1], `Swapping ${a[j+1]} ↔ ${a[j]}`, "swap"));
      }
    }
  }
  frames.push(frame(a, [], [], "Sorted!", "done"));
  return frames;
}

export function generateSelectionFrames(arr) {
  const a = [...arr];
  const frames = [];
  const n = a.length;
  for (let i = 0; i < n; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      frames.push(frame(a, [minIdx, j], [], `Finding min: A[${j}]=${a[j]} vs current min A[${minIdx}]=${a[minIdx]}`));
      if (a[j] < a[minIdx]) minIdx = j;
    }
    if (minIdx !== i) {
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
      frames.push(frame(a, [], [i, minIdx], `Swapping min ${a[i]} to position ${i}`, "swap"));
    }
  }
  frames.push(frame(a, [], [], "Sorted!", "done"));
  return frames;
}

export function generateInsertionFrames(arr) {
  const a = [...arr];
  const frames = [];
  for (let i = 1; i < a.length; i++) {
    const key = a[i];
    let j = i - 1;
    frames.push(frame(a, [i], [], `Inserting key=${key} into sorted portion`));
    while (j >= 0 && a[j] > key) {
      frames.push(frame(a, [j, j + 1], [], `Comparing ${a[j]} > ${key}, shifting right`));
      a[j + 1] = a[j];
      frames.push(frame(a, [], [j, j + 1], `Shifted A[${j}]=${a[j+1]} right`, "swap"));
      j--;
    }
    a[j + 1] = key;
  }
  frames.push(frame(a, [], [], "Sorted!", "done"));
  return frames;
}

export function generateMergeFrames(arr) {
  const a = [...arr];
  const frames = [];

  function merge(arr, left, mid, right) {
    const L = arr.slice(left, mid + 1);
    const R = arr.slice(mid + 1, right + 1);
    let i = 0, j = 0, k = left;
    while (i < L.length && j < R.length) {
      frames.push(frame(arr, [left + i, mid + 1 + j], [], `Merging: comparing ${L[i]} and ${R[j]}`));
      if (L[i] <= R[j]) { arr[k++] = L[i++]; }
      else { arr[k++] = R[j++]; frames.push(frame(arr, [], [k - 1], `Placed ${arr[k-1]} from right half`, "swap")); }
    }
    while (i < L.length) arr[k++] = L[i++];
    while (j < R.length) arr[k++] = R[j++];
    frames.push(frame(arr, [], Array.from({ length: right - left + 1 }, (_, x) => left + x), `Merged segment [${left}..${right}]`, "swap"));
  }

  function mergeSort(arr, left, right) {
    if (left < right) {
      const mid = Math.floor((left + right) / 2);
      mergeSort(arr, left, mid);
      mergeSort(arr, mid + 1, right);
      merge(arr, left, mid, right);
    }
  }

  mergeSort(a, 0, a.length - 1);
  frames.push(frame(a, [], [], "Sorted!", "done"));
  return frames;
}

export function generateQuickFrames(arr) {
  const a = [...arr];
  const frames = [];

  function partition(arr, low, high) {
    const pivot = arr[high];
    let i = low - 1;
    frames.push(frame(arr, [high], [], `Pivot = ${pivot}`));
    for (let j = low; j < high; j++) {
      frames.push(frame(arr, [j, high], [], `Comparing A[${j}]=${arr[j]} with pivot=${pivot}`));
      if (arr[j] <= pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        if (i !== j) frames.push(frame(arr, [], [i, j], `Swapping ${arr[j]} ↔ ${arr[i]}`, "swap"));
      }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    frames.push(frame(arr, [], [i + 1, high], `Pivot ${pivot} placed at position ${i + 1}`, "swap"));
    return i + 1;
  }

  function quickSort(arr, low, high) {
    if (low < high) {
      const pi = partition(arr, low, high);
      quickSort(arr, low, pi - 1);
      quickSort(arr, pi + 1, high);
    }
  }

  quickSort(a, 0, a.length - 1);
  frames.push(frame(a, [], [], "Sorted!", "done"));
  return frames;
}

export function generateHeapFrames(arr) {
  const a = [...arr];
  const frames = [];

  function heapify(arr, n, i) {
    let largest = i, l = 2 * i + 1, r = 2 * i + 2;
    if (l < n) { frames.push(frame(arr, [i, l], [], `Heapify: compare ${arr[i]} and left child ${arr[l]}`)); if (arr[l] > arr[largest]) largest = l; }
    if (r < n) { frames.push(frame(arr, [largest, r], [], `Heapify: compare ${arr[largest]} and right child ${arr[r]}`)); if (arr[r] > arr[largest]) largest = r; }
    if (largest !== i) {
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      frames.push(frame(arr, [], [i, largest], `Heap swap ${arr[largest]} ↔ ${arr[i]}`, "swap"));
      heapify(arr, n, largest);
    }
  }

  const n = a.length;
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(a, n, i);
  frames.push(frame(a, [], [], "Max-heap built!"));
  for (let i = n - 1; i > 0; i--) {
    [a[0], a[i]] = [a[i], a[0]];
    frames.push(frame(a, [], [0, i], `Extract max ${a[i]} to position ${i}`, "swap"));
    heapify(a, i, 0);
  }
  frames.push(frame(a, [], [], "Sorted!", "done"));
  return frames;
}

export function generateRadixFrames(arr) {
  const a = [...arr.map(Number)];
  const frames = [];
  const maxVal = Math.max(...a);

  function countingSort(arr, exp) {
    const n = arr.length;
    const output = new Array(n).fill(0);
    const count = new Array(10).fill(0);
    for (let i = 0; i < n; i++) count[Math.floor(arr[i] / exp) % 10]++;
    for (let i = 1; i < 10; i++) count[i] += count[i - 1];
    for (let i = n - 1; i >= 0; i--) {
      const idx = Math.floor(arr[i] / exp) % 10;
      output[count[idx] - 1] = arr[i];
      count[idx]--;
    }
    for (let i = 0; i < n; i++) arr[i] = output[i];
    frames.push(frame(arr, [], Array.from({ length: n }, (_, i) => i), `Sorted by digit place ${exp}`, "swap"));
  }

  let exp = 1;
  while (Math.floor(maxVal / exp) > 0) {
    frames.push(frame(a, [], [], `Processing digit place: ${exp}`));
    countingSort(a, exp);
    exp *= 10;
  }
  frames.push(frame(a, [], [], "Sorted!", "done"));
  return frames;
}

export const FRAME_GENERATORS = {
  bubble: generateBubbleFrames,
  selection: generateSelectionFrames,
  insertion: generateInsertionFrames,
  merge: generateMergeFrames,
  quick: generateQuickFrames,
  heap: generateHeapFrames,
  radix: generateRadixFrames,
};
