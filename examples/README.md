# Performance Optimization Examples

This directory contains executable code examples demonstrating common performance issues and their solutions.

## Running the Examples

### Python Example

```bash
python3 performance_example.py
```

**Requirements:** Python 3.6+

This example demonstrates:
- String concatenation optimization
- List vs Set for membership testing (O(n) vs O(1))
- Finding duplicates (O(n²) vs O(n))
- Filtering and transformation techniques
- Avoiding unnecessary calculations
- Dictionary operation optimization
- Built-in function performance

### JavaScript Example

```bash
node performance_example.js
```

**Requirements:** Node.js 10+

This example demonstrates:
- Array pre-allocation
- String concatenation strategies
- Set vs Array for lookups
- DOM manipulation batching
- Filtering and mapping optimization
- Property access caching
- Function call overhead
- Object creation patterns

## Understanding the Results

Each example shows:
- ❌ **Inefficient approach** - Common anti-pattern with performance issues
- ✅ **Optimized approach** - Improved implementation
- **Execution time** - Measured in milliseconds for comparison

### Expected Performance Improvements

You should see significant improvements in scenarios like:
- **Membership testing**: 100x-300x faster with Set vs List/Array
- **Duplicate detection**: 500x-1000x faster with hash-based approach
- **List operations**: 2x-3x faster with built-in functions vs manual loops

## Key Principles Demonstrated

1. **Data Structure Selection** - Use the right tool for the job
   - Sets for membership tests (O(1) vs O(n))
   - Pre-allocated arrays when size is known
   - Hash tables for fast lookups

2. **Algorithm Efficiency** - Avoid nested loops when possible
   - O(n) vs O(n²) makes orders of magnitude difference
   - Single-pass algorithms over multiple passes

3. **Lazy Evaluation** - Don't compute what you might not need
   - Check conditions before expensive calculations
   - Use generators for large datasets

4. **Built-in Optimization** - Language built-ins are often faster
   - They're implemented in C/native code
   - They're optimized by language developers

5. **Reduce Overhead** - Minimize repeated operations
   - Cache property lookups
   - Batch updates (e.g., DOM manipulations)
   - Avoid object creation in tight loops

## Customizing the Benchmarks

You can modify the `n` parameter in each function to test with different data sizes:

```python
# Python
concatenate_strings_inefficient(50000)  # Test with 50,000 iterations

# JavaScript
stringConcatInefficient(50000)  // Test with 50,000 iterations
```

## Further Learning

After running these examples, refer to [PERFORMANCE_GUIDE.md](../PERFORMANCE_GUIDE.md) for:
- More detailed explanations
- Additional optimization techniques
- Language-specific best practices
- Profiling and benchmarking tools
