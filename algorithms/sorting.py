"""
Sorting Algorithms Module
Each algorithm returns: { sorted_array, time_ms, comparisons, swaps }
"""

import time
import math


def run_algorithm(name: str, arr: list) -> dict:
    """Dispatch to the correct sorting algorithm and return metrics."""
    algorithms = {
        "bubble": bubble_sort,
        "selection": selection_sort,
        "insertion": insertion_sort,
        "merge": merge_sort,
        "quick": quick_sort,
        "heap": heap_sort,
        "radix": radix_sort,
    }
    fn = algorithms.get(name)
    if fn is None:
        return {"error": f"Unknown algorithm: {name}"}
    return fn(arr)


# ─────────────────────────────────────────────
# BUBBLE SORT  O(n²) avg/worst, O(n) best
# ─────────────────────────────────────────────
def bubble_sort(arr: list) -> dict:
    """
    Repeatedly compare adjacent elements and swap if out of order.
    Largest elements bubble to the end each pass.
    """
    a = arr[:]
    n = len(a)
    comparisons = 0
    swaps = 0

    start = time.perf_counter()
    for i in range(n):
        swapped = False
        for j in range(0, n - i - 1):
            comparisons += 1
            if a[j] > a[j + 1]:
                a[j], a[j + 1] = a[j + 1], a[j]
                swaps += 1
                swapped = True
        if not swapped:
            break
    elapsed = (time.perf_counter() - start) * 1000

    return {
        "sorted_array": a,
        "time_ms": round(elapsed, 4),
        "comparisons": comparisons,
        "swaps": swaps,
    }


# ─────────────────────────────────────────────
# SELECTION SORT  O(n²) all cases
# ─────────────────────────────────────────────
def selection_sort(arr: list) -> dict:
    """
    Divide array into sorted/unsorted parts.
    Repeatedly select the minimum from the unsorted part and place it at the end of sorted.
    """
    a = arr[:]
    n = len(a)
    comparisons = 0
    swaps = 0

    start = time.perf_counter()
    for i in range(n):
        min_idx = i
        for j in range(i + 1, n):
            comparisons += 1
            if a[j] < a[min_idx]:
                min_idx = j
        if min_idx != i:
            a[i], a[min_idx] = a[min_idx], a[i]
            swaps += 1
    elapsed = (time.perf_counter() - start) * 1000

    return {
        "sorted_array": a,
        "time_ms": round(elapsed, 4),
        "comparisons": comparisons,
        "swaps": swaps,
    }


# ─────────────────────────────────────────────
# INSERTION SORT  O(n²) avg/worst, O(n) best
# ─────────────────────────────────────────────
def insertion_sort(arr: list) -> dict:
    """
    Build sorted array one element at a time by inserting each element
    into its correct position in the already-sorted portion.
    """
    a = arr[:]
    n = len(a)
    comparisons = 0
    swaps = 0

    start = time.perf_counter()
    for i in range(1, n):
        key = a[i]
        j = i - 1
        while j >= 0:
            comparisons += 1
            if a[j] > key:
                a[j + 1] = a[j]
                swaps += 1
                j -= 1
            else:
                break
        a[j + 1] = key
    elapsed = (time.perf_counter() - start) * 1000

    return {
        "sorted_array": a,
        "time_ms": round(elapsed, 4),
        "comparisons": comparisons,
        "swaps": swaps,
    }


# ─────────────────────────────────────────────
# MERGE SORT  O(n log n) all cases
# ─────────────────────────────────────────────
def merge_sort(arr: list) -> dict:
    """
    Divide-and-conquer: recursively split array into halves,
    sort each half, then merge back in sorted order.
    """
    a = arr[:]
    comparisons = [0]
    swaps = [0]

    def _merge(arr, left, mid, right):
        left_part = arr[left:mid + 1]
        right_part = arr[mid + 1:right + 1]
        i = j = 0
        k = left
        while i < len(left_part) and j < len(right_part):
            comparisons[0] += 1
            if left_part[i] <= right_part[j]:
                arr[k] = left_part[i]
                i += 1
            else:
                arr[k] = right_part[j]
                swaps[0] += 1
                j += 1
            k += 1
        while i < len(left_part):
            arr[k] = left_part[i]
            i += 1
            k += 1
        while j < len(right_part):
            arr[k] = right_part[j]
            j += 1
            k += 1

    def _merge_sort(arr, left, right):
        if left < right:
            mid = (left + right) // 2
            _merge_sort(arr, left, mid)
            _merge_sort(arr, mid + 1, right)
            _merge(arr, left, mid, right)

    start = time.perf_counter()
    _merge_sort(a, 0, len(a) - 1)
    elapsed = (time.perf_counter() - start) * 1000

    return {
        "sorted_array": a,
        "time_ms": round(elapsed, 4),
        "comparisons": comparisons[0],
        "swaps": swaps[0],
    }


# ─────────────────────────────────────────────
# QUICK SORT  O(n log n) avg, O(n²) worst
# ─────────────────────────────────────────────
def quick_sort(arr: list) -> dict:
    """
    Choose a pivot element; partition array so all smaller elements come before
    and larger after; recursively sort the partitions.
    """
    a = arr[:]
    comparisons = [0]
    swaps = [0]

    def _partition(arr, low, high):
        pivot = arr[high]
        i = low - 1
        for j in range(low, high):
            comparisons[0] += 1
            if arr[j] <= pivot:
                i += 1
                arr[i], arr[j] = arr[j], arr[i]
                swaps[0] += 1
        arr[i + 1], arr[high] = arr[high], arr[i + 1]
        swaps[0] += 1
        return i + 1

    def _quick_sort(arr, low, high):
        if low < high:
            pi = _partition(arr, low, high)
            _quick_sort(arr, low, pi - 1)
            _quick_sort(arr, pi + 1, high)

    start = time.perf_counter()
    _quick_sort(a, 0, len(a) - 1)
    elapsed = (time.perf_counter() - start) * 1000

    return {
        "sorted_array": a,
        "time_ms": round(elapsed, 4),
        "comparisons": comparisons[0],
        "swaps": swaps[0],
    }


# ─────────────────────────────────────────────
# HEAP SORT  O(n log n) all cases
# ─────────────────────────────────────────────
def heap_sort(arr: list) -> dict:
    """
    Build a max-heap from the array, then repeatedly extract the maximum
    and place it at the end to produce a sorted array.
    """
    a = arr[:]
    n = len(a)
    comparisons = [0]
    swaps = [0]

    def _heapify(arr, n, i):
        largest = i
        left = 2 * i + 1
        right = 2 * i + 2
        if left < n:
            comparisons[0] += 1
            if arr[left] > arr[largest]:
                largest = left
        if right < n:
            comparisons[0] += 1
            if arr[right] > arr[largest]:
                largest = right
        if largest != i:
            arr[i], arr[largest] = arr[largest], arr[i]
            swaps[0] += 1
            _heapify(arr, n, largest)

    start = time.perf_counter()
    for i in range(n // 2 - 1, -1, -1):
        _heapify(a, n, i)
    for i in range(n - 1, 0, -1):
        a[0], a[i] = a[i], a[0]
        swaps[0] += 1
        _heapify(a, i, 0)
    elapsed = (time.perf_counter() - start) * 1000

    return {
        "sorted_array": a,
        "time_ms": round(elapsed, 4),
        "comparisons": comparisons[0],
        "swaps": swaps[0],
    }


# ─────────────────────────────────────────────
# RADIX SORT  O(nk) — non-comparison sort
# ─────────────────────────────────────────────
def radix_sort(arr: list) -> dict:
    """
    Sort by individual digits from least to most significant.
    Uses counting sort as a stable subroutine for each digit position.
    Works on non-negative integers only.
    """
    a = [int(x) for x in arr]
    comparisons = [0]
    swaps = [0]

    def _counting_sort(arr, exp):
        n = len(arr)
        output = [0] * n
        count = [0] * 10
        for i in range(n):
            idx = (arr[i] // exp) % 10
            count[idx] += 1
        for i in range(1, 10):
            count[i] += count[i - 1]
        for i in range(n - 1, -1, -1):
            idx = (arr[i] // exp) % 10
            output[count[idx] - 1] = arr[i]
            count[idx] -= 1
            swaps[0] += 1
        for i in range(n):
            comparisons[0] += 1
            arr[i] = output[i]

    start = time.perf_counter()
    if a:
        max_val = max(a)
        exp = 1
        while max_val // exp > 0:
            _counting_sort(a, exp)
            exp *= 10
    elapsed = (time.perf_counter() - start) * 1000

    return {
        "sorted_array": a,
        "time_ms": round(elapsed, 4),
        "comparisons": comparisons[0],
        "swaps": swaps[0],
    }
