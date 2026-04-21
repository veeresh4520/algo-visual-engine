"""
List vs Set Analysis Module
Compares performance of list (linear) vs set (hash-based) operations.
"""

import time


def membership_check(lst: list, target) -> dict:
    """
    Compare list linear search vs set O(1) lookup for membership.
    Returns timing and step counts for both approaches.
    """
    # ── List: linear search ──────────────────────────────────
    list_steps = 0
    list_found = False
    start = time.perf_counter()
    for item in lst:
        list_steps += 1
        if item == target:
            list_found = True
            break
    list_time = (time.perf_counter() - start) * 1000

    # ── Set: hash lookup ─────────────────────────────────────
    s = set(lst)
    start = time.perf_counter()
    set_found = target in s
    set_time = (time.perf_counter() - start) * 1000

    return {
        "target": target,
        "list": {
            "found": list_found,
            "time_ms": round(list_time, 6),
            "steps": list_steps,
        },
        "set": {
            "found": set_found,
            "time_ms": round(set_time, 6),
            "steps": 1,  # Hash lookup is always O(1)
        },
    }


def duplicate_removal(lst: list) -> dict:
    """
    Measure time to remove duplicates using list approach vs set conversion.
    """
    # ── List approach: manual dedup preserving order ─────────
    start = time.perf_counter()
    seen = []
    unique_list = []
    for item in lst:
        if item not in seen:
            seen.append(item)
            unique_list.append(item)
    list_time = (time.perf_counter() - start) * 1000

    # ── Set approach: direct conversion ──────────────────────
    start = time.perf_counter()
    unique_set = list(set(lst))
    set_time = (time.perf_counter() - start) * 1000

    return {
        "original_size": len(lst),
        "unique_size": len(unique_list),
        "duplicates_removed": len(lst) - len(unique_list),
        "list": {
            "time_ms": round(list_time, 6),
            "result": unique_list[:50],  # Return first 50 for display
        },
        "set": {
            "time_ms": round(set_time, 6),
            "result": unique_set[:50],
        },
    }


def common_elements_comparison(list_a: list, list_b: list) -> dict:
    """
    Find common elements using nested-loop list approach vs set intersection.
    """
    # ── List approach: nested loops O(n*m) ───────────────────
    list_ops = 0
    start = time.perf_counter()
    common_list = []
    for a in list_a:
        for b in list_b:
            list_ops += 1
            if a == b and a not in common_list:
                common_list.append(a)
                break
    list_time = (time.perf_counter() - start) * 1000

    # ── Set approach: intersection O(min(n,m)) ───────────────
    set_ops = len(list_a) + len(list_b)  # building sets + intersection
    start = time.perf_counter()
    common_set = list(set(list_a) & set(list_b))
    set_time = (time.perf_counter() - start) * 1000

    return {
        "common_count": len(common_list),
        "common_elements": sorted(common_list)[:50],
        "list": {
            "time_ms": round(list_time, 6),
            "operations": list_ops,
        },
        "set": {
            "time_ms": round(set_time, 6),
            "operations": set_ops,
        },
    }
