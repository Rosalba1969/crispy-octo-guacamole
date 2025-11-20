"""
Performance Optimization Example
==================================

This file demonstrates common performance issues and their solutions with
actual benchmarks to show the improvements.

Run this file with: python performance_example.py
"""

import time
from functools import wraps
from typing import List, Callable


def benchmark(func: Callable) -> Callable:
    """Decorator to measure execution time of a function."""
    @wraps(func)
    def wrapper(*args, **kwargs):
        start_time = time.perf_counter()
        result = func(*args, **kwargs)
        end_time = time.perf_counter()
        elapsed_ms = (end_time - start_time) * 1000
        print(f"{func.__name__:40} took {elapsed_ms:8.2f} ms")
        return result
    return wrapper


# =============================================================================
# Example 1: String Concatenation
# =============================================================================

@benchmark
def concatenate_strings_inefficient(n: int = 10000) -> str:
    """❌ Inefficient: Creates new string object in each iteration - O(n²)"""
    result = ""
    for i in range(n):
        result += str(i)
    return result


@benchmark
def concatenate_strings_efficient(n: int = 10000) -> str:
    """✅ Efficient: Uses list and join - O(n)"""
    parts = []
    for i in range(n):
        parts.append(str(i))
    return "".join(parts)


# =============================================================================
# Example 2: List Membership Testing
# =============================================================================

@benchmark
def membership_test_list(n: int = 10000) -> int:
    """❌ Inefficient: Linear search O(n) for each lookup"""
    allowed_numbers = list(range(n))
    count = 0
    for i in range(n):
        if i in allowed_numbers:  # O(n) operation
            count += 1
    return count


@benchmark
def membership_test_set(n: int = 10000) -> int:
    """✅ Efficient: Hash lookup O(1) for each lookup"""
    allowed_numbers = set(range(n))
    count = 0
    for i in range(n):
        if i in allowed_numbers:  # O(1) operation
            count += 1
    return count


# =============================================================================
# Example 3: Finding Duplicates
# =============================================================================

@benchmark
def find_duplicates_nested_loops(items: List[int]) -> bool:
    """❌ Inefficient: Nested loops - O(n²)"""
    for i in range(len(items)):
        for j in range(i + 1, len(items)):
            if items[i] == items[j]:
                return True
    return False


@benchmark
def find_duplicates_set(items: List[int]) -> bool:
    """✅ Efficient: Using set - O(n)"""
    seen = set()
    for item in items:
        if item in seen:
            return True
        seen.add(item)
    return False


# =============================================================================
# Example 4: Filtering and Transformation
# =============================================================================

@benchmark
def filter_and_transform_loops(numbers: List[int]) -> List[int]:
    """❌ Less efficient: Multiple passes over data"""
    # First pass: filter
    filtered = []
    for num in numbers:
        if num % 2 == 0:
            filtered.append(num)
    
    # Second pass: transform
    result = []
    for num in filtered:
        result.append(num * 2)
    
    return result


@benchmark
def filter_and_transform_comprehension(numbers: List[int]) -> List[int]:
    """✅ More efficient: Single pass, optimized by interpreter"""
    return [num * 2 for num in numbers if num % 2 == 0]


# =============================================================================
# Example 5: Unnecessary Calculations
# =============================================================================

@benchmark
def calculate_before_check(items: List[int], condition: bool) -> List[int]:
    """❌ Inefficient: Calculates values that might not be needed"""
    expensive_results = [item ** 3 + item ** 2 for item in items]
    if not condition:
        return []
    return expensive_results


@benchmark
def calculate_after_check(items: List[int], condition: bool) -> List[int]:
    """✅ Efficient: Only calculates when needed"""
    if not condition:
        return []
    return [item ** 3 + item ** 2 for item in items]


# =============================================================================
# Example 6: Dictionary Lookup Optimization
# =============================================================================

@benchmark
def count_frequencies_get(items: List[str]) -> dict:
    """❌ Less efficient: Multiple dictionary operations"""
    frequencies = {}
    for item in items:
        if item in frequencies:
            frequencies[item] = frequencies[item] + 1
        else:
            frequencies[item] = 1
    return frequencies


@benchmark
def count_frequencies_defaultdict(items: List[str]) -> dict:
    """✅ More efficient: Single dictionary operation per item"""
    from collections import defaultdict
    frequencies = defaultdict(int)
    for item in items:
        frequencies[item] += 1
    return dict(frequencies)


# =============================================================================
# Example 7: List Operations
# =============================================================================

@benchmark
def sum_with_loop(numbers: List[int]) -> int:
    """❌ Less efficient: Manual loop"""
    total = 0
    for num in numbers:
        total += num
    return total


@benchmark
def sum_with_builtin(numbers: List[int]) -> int:
    """✅ More efficient: Built-in function (implemented in C)"""
    return sum(numbers)


# =============================================================================
# Main Benchmark Runner
# =============================================================================

def run_all_benchmarks():
    """Run all performance comparisons and display results."""
    print("=" * 80)
    print("PERFORMANCE OPTIMIZATION EXAMPLES - Benchmark Results")
    print("=" * 80)
    
    print("\n1. STRING CONCATENATION (10,000 iterations)")
    print("-" * 80)
    concatenate_strings_inefficient(10000)
    concatenate_strings_efficient(10000)
    
    print("\n2. MEMBERSHIP TESTING (10,000 items, 10,000 lookups)")
    print("-" * 80)
    membership_test_list(10000)
    membership_test_set(10000)
    
    print("\n3. FINDING DUPLICATES (5,000 items)")
    print("-" * 80)
    test_data = list(range(5000))
    find_duplicates_nested_loops(test_data)
    find_duplicates_set(test_data)
    
    print("\n4. FILTERING AND TRANSFORMATION (100,000 items)")
    print("-" * 80)
    large_list = list(range(100000))
    filter_and_transform_loops(large_list)
    filter_and_transform_comprehension(large_list)
    
    print("\n5. UNNECESSARY CALCULATIONS (10,000 items, condition=False)")
    print("-" * 80)
    test_items = list(range(10000))
    calculate_before_check(test_items, False)
    calculate_after_check(test_items, False)
    
    print("\n6. DICTIONARY OPERATIONS (10,000 items)")
    print("-" * 80)
    words = ['apple', 'banana', 'apple', 'cherry'] * 2500
    count_frequencies_get(words)
    count_frequencies_defaultdict(words)
    
    print("\n7. LIST SUMMATION (1,000,000 items)")
    print("-" * 80)
    huge_list = list(range(1000000))
    sum_with_loop(huge_list)
    sum_with_builtin(huge_list)
    
    print("\n" + "=" * 80)
    print("KEY TAKEAWAYS:")
    print("=" * 80)
    print("1. Use appropriate data structures (set vs list for membership)")
    print("2. Avoid O(n²) algorithms when O(n) or O(n log n) exist")
    print("3. Use list comprehensions and built-in functions")
    print("4. Don't perform calculations until you know they're needed")
    print("5. Profile before optimizing - focus on actual bottlenecks")
    print("=" * 80)


if __name__ == "__main__":
    run_all_benchmarks()
