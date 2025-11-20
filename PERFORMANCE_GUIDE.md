# Performance Optimization Guide

## Overview

This guide provides strategies and best practices for identifying and improving slow or inefficient code across different programming languages and paradigms.

## Table of Contents

1. [Common Performance Anti-Patterns](#common-performance-anti-patterns)
2. [Profiling and Benchmarking](#profiling-and-benchmarking)
3. [Algorithm Optimization](#algorithm-optimization)
4. [Data Structure Selection](#data-structure-selection)
5. [Memory Management](#memory-management)
6. [Database and I/O Optimization](#database-and-io-optimization)
7. [Concurrency and Parallelization](#concurrency-and-parallelization)
8. [Caching Strategies](#caching-strategies)
9. [Language-Specific Optimizations](#language-specific-optimizations)

---

## Common Performance Anti-Patterns

### 1. N+1 Query Problem

**Problem**: Making N database queries in a loop instead of a single query.

```python
# ❌ Inefficient - N+1 queries
for user_id in user_ids:
    user = database.query(f"SELECT * FROM users WHERE id = {user_id}")
    process_user(user)

# ✅ Efficient - Single query
users = database.query(f"SELECT * FROM users WHERE id IN ({','.join(map(str, user_ids))})")
for user in users:
    process_user(user)
```

### 2. Unnecessary Object Creation in Loops

**Problem**: Creating objects repeatedly when they could be reused.

```java
// ❌ Inefficient - Creates new StringBuilder each iteration
public String concatenate(List<String> items) {
    String result = "";
    for (String item : items) {
        result += item;  // Creates new String object each time
    }
    return result;
}

// ✅ Efficient - Reuses single StringBuilder
public String concatenate(List<String> items) {
    StringBuilder sb = new StringBuilder();
    for (String item : items) {
        sb.append(item);
    }
    return sb.toString();
}
```

### 3. Inefficient Searching

**Problem**: Using linear search when better alternatives exist.

```javascript
// ❌ Inefficient - O(n) lookup for each check
const allowedUsers = ['user1', 'user2', 'user3', /* ... hundreds more */];
function isAllowed(username) {
    return allowedUsers.includes(username); // O(n)
}

// ✅ Efficient - O(1) lookup
const allowedUsers = new Set(['user1', 'user2', 'user3', /* ... hundreds more */]);
function isAllowed(username) {
    return allowedUsers.has(username); // O(1)
}
```

### 4. Premature Calculation

**Problem**: Computing values that might not be needed.

```python
# ❌ Inefficient - Calculates all values upfront
def process_data(items, condition):
    expensive_values = [expensive_calculation(item) for item in items]
    if not condition:
        return []
    return expensive_values

# ✅ Efficient - Lazy evaluation
def process_data(items, condition):
    if not condition:
        return []
    return [expensive_calculation(item) for item in items]
```

### 5. Deep Copying When Unnecessary

**Problem**: Making full copies of large data structures when references suffice.

```python
# ❌ Inefficient - Deep copies large dictionary
import copy
def read_only_operation(data):
    local_data = copy.deepcopy(data)  # Unnecessary copy
    return sum(local_data.values())

# ✅ Efficient - Uses reference
def read_only_operation(data):
    return sum(data.values())
```

---

## Profiling and Benchmarking

### Identify Bottlenecks Before Optimizing

**"Premature optimization is the root of all evil"** - Donald Knuth

Always measure before optimizing:

#### Python
```python
import cProfile
import pstats

# Profile your code
profiler = cProfile.Profile()
profiler.enable()
your_function()
profiler.disable()

# View results
stats = pstats.Stats(profiler)
stats.sort_stats('cumulative')
stats.print_stats(10)
```

#### JavaScript/Node.js
```javascript
console.time('operation');
yourFunction();
console.timeEnd('operation');

// Or use performance API
const { performance } = require('perf_hooks');
const start = performance.now();
yourFunction();
const end = performance.now();
console.log(`Execution time: ${end - start}ms`);
```

#### Java
```java
long startTime = System.nanoTime();
yourMethod();
long endTime = System.nanoTime();
long duration = (endTime - startTime) / 1_000_000;  // Convert to milliseconds
System.out.println("Execution time: " + duration + "ms");
```

---

## Algorithm Optimization

### Time Complexity Matters

Choose algorithms with better time complexity:

| Complexity | Example Operations | Performance |
|------------|-------------------|-------------|
| O(1) | Hash table lookup, array access | Excellent |
| O(log n) | Binary search, balanced tree operations | Good |
| O(n) | Linear search, single loop | Acceptable |
| O(n log n) | Efficient sorting (merge sort, quick sort) | Acceptable for sorting |
| O(n²) | Nested loops, bubble sort | Poor for large datasets |
| O(2ⁿ) | Recursive fibonacci, brute force solutions | Very poor |

### Example: Improve from O(n²) to O(n)

```python
# ❌ O(n²) - Finding duplicates
def has_duplicates_slow(items):
    for i in range(len(items)):
        for j in range(i + 1, len(items)):
            if items[i] == items[j]:
                return True
    return False

# ✅ O(n) - Using set
def has_duplicates_fast(items):
    seen = set()
    for item in items:
        if item in seen:
            return True
        seen.add(item)
    return False
```

---

## Data Structure Selection

Choose the right data structure for your use case:

### Arrays vs. Linked Lists
- **Arrays**: Fast random access O(1), slow insertion/deletion O(n)
- **Linked Lists**: Slow random access O(n), fast insertion/deletion O(1)

### Hash Tables vs. Trees
- **Hash Tables**: O(1) average lookup, unordered
- **Trees (BST)**: O(log n) lookup, maintains order

### Example: Choosing the Right Structure

```python
# ❌ Using list for frequent membership tests
class UserManager:
    def __init__(self):
        self.active_users = []  # O(n) for 'in' check
    
    def is_active(self, user_id):
        return user_id in self.active_users

# ✅ Using set for O(1) membership tests
class UserManager:
    def __init__(self):
        self.active_users = set()  # O(1) for 'in' check
    
    def is_active(self, user_id):
        return user_id in self.active_users
```

---

## Memory Management

### 1. Avoid Memory Leaks

```javascript
// ❌ Memory leak - event listeners not removed
class Component {
    constructor() {
        window.addEventListener('resize', this.handleResize);
    }
    // Missing cleanup!
}

// ✅ Proper cleanup
class Component {
    constructor() {
        this.handleResize = this.handleResize.bind(this);
        window.addEventListener('resize', this.handleResize);
    }
    
    destroy() {
        window.removeEventListener('resize', this.handleResize);
    }
}
```

### 2. Use Generators for Large Datasets

```python
# ❌ Loads entire dataset into memory
def process_large_file(filename):
    with open(filename) as f:
        lines = f.readlines()  # Loads all into memory
        return [process_line(line) for line in lines]

# ✅ Processes one line at a time
def process_large_file(filename):
    with open(filename) as f:
        for line in f:  # Generator - one line at a time
            yield process_line(line)
```

---

## Database and I/O Optimization

### 1. Use Batch Operations

```python
# ❌ Individual inserts
for record in records:
    db.execute("INSERT INTO table VALUES (?)", record)

# ✅ Batch insert
db.executemany("INSERT INTO table VALUES (?)", records)
```

### 2. Add Indexes to Frequently Queried Columns

```sql
-- ❌ Slow query on unindexed column
SELECT * FROM users WHERE email = 'user@example.com';

-- ✅ Create index for faster queries
CREATE INDEX idx_users_email ON users(email);
SELECT * FROM users WHERE email = 'user@example.com';
```

### 3. Use Connection Pooling

```python
# ❌ Creates new connection each time
def query_database():
    conn = create_connection()
    result = conn.query("SELECT ...")
    conn.close()
    return result

# ✅ Use connection pool
from sqlalchemy import create_engine, pool

engine = create_engine('postgresql://...', 
                       poolclass=pool.QueuePool,
                       pool_size=10)

def query_database():
    with engine.connect() as conn:
        return conn.execute("SELECT ...")
```

---

## Concurrency and Parallelization

### When to Use Parallelization

- **CPU-bound tasks**: Use multiprocessing
- **I/O-bound tasks**: Use async/await or threading

```python
# ❌ Sequential I/O operations
def fetch_all_urls(urls):
    results = []
    for url in urls:
        results.append(fetch_url(url))  # Blocks for each request
    return results

# ✅ Parallel I/O operations
import asyncio
import aiohttp

async def fetch_all_urls(urls):
    async with aiohttp.ClientSession() as session:
        tasks = [fetch_url(session, url) for url in urls]
        return await asyncio.gather(*tasks)

async def fetch_url(session, url):
    async with session.get(url) as response:
        return await response.text()
```

---

## Caching Strategies

### 1. Memoization

```python
# ❌ Recalculates same values
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# ✅ Cached results
from functools import lru_cache

@lru_cache(maxsize=None)
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)
```

### 2. Application-Level Caching

```python
# ❌ Queries database every time
def get_user_permissions(user_id):
    return db.query(f"SELECT * FROM permissions WHERE user_id = {user_id}")

# ✅ Caches results
from functools import lru_cache
from datetime import datetime, timedelta

cache = {}
CACHE_TTL = timedelta(minutes=5)

def get_user_permissions(user_id):
    now = datetime.now()
    if user_id in cache:
        cached_time, result = cache[user_id]
        if now - cached_time < CACHE_TTL:
            return result
    
    result = db.query(f"SELECT * FROM permissions WHERE user_id = {user_id}")
    cache[user_id] = (now, result)
    return result
```

---

## Language-Specific Optimizations

### Python

1. **Use list comprehensions instead of loops**
   ```python
   # ❌ Slower
   result = []
   for i in range(100):
       result.append(i * 2)
   
   # ✅ Faster
   result = [i * 2 for i in range(100)]
   ```

2. **Use built-in functions** (implemented in C)
   ```python
   # ❌ Slower
   total = 0
   for x in numbers:
       total += x
   
   # ✅ Faster
   total = sum(numbers)
   ```

### JavaScript

1. **Avoid repeated DOM access**
   ```javascript
   // ❌ Queries DOM repeatedly
   for (let i = 0; i < 100; i++) {
       document.getElementById('container').innerHTML += '<div>' + i + '</div>';
   }
   
   // ✅ Builds string first
   let html = '';
   for (let i = 0; i < 100; i++) {
       html += '<div>' + i + '</div>';
   }
   document.getElementById('container').innerHTML = html;
   ```

2. **Use const/let instead of var** (better scoping and optimization)
   ```javascript
   // ❌ Slower
   for (var i = 0; i < 1000; i++) { }
   
   // ✅ Faster
   for (let i = 0; i < 1000; i++) { }
   ```

### Java

1. **Use StringBuilder for string concatenation in loops**
   ```java
   // ❌ Creates many String objects
   String result = "";
   for (int i = 0; i < 1000; i++) {
       result += i;
   }
   
   // ✅ Efficient
   StringBuilder sb = new StringBuilder();
   for (int i = 0; i < 1000; i++) {
       sb.append(i);
   }
   String result = sb.toString();
   ```

2. **Use appropriate collection sizes**
   ```java
   // ❌ Multiple resizes
   ArrayList<String> list = new ArrayList<>();
   for (int i = 0; i < 10000; i++) {
       list.add("item");
   }
   
   // ✅ Avoids resizes
   ArrayList<String> list = new ArrayList<>(10000);
   for (int i = 0; i < 10000; i++) {
       list.add("item");
   }
   ```

---

## Performance Checklist

Before considering your optimization complete, verify:

- [ ] Profiled the code to identify actual bottlenecks
- [ ] Chose algorithms with appropriate time complexity
- [ ] Selected optimal data structures for use cases
- [ ] Minimized database queries (batch operations, proper indexing)
- [ ] Implemented caching where appropriate
- [ ] Avoided premature optimization
- [ ] Measured performance improvements
- [ ] Maintained code readability
- [ ] Added comments explaining complex optimizations
- [ ] Considered edge cases and large datasets
- [ ] Verified no memory leaks introduced
- [ ] Benchmarked before and after changes

---

## Further Resources

- [Big O Cheat Sheet](http://bigocheatsheet.com/)
- [Database Index Performance](https://use-the-index-luke.com/)
- [Python Performance Tips](https://wiki.python.org/moin/PythonSpeed/PerformanceTips)
- [JavaScript Performance Best Practices](https://developer.mozilla.org/en-US/docs/Web/Performance)
- [Java Performance Tuning Guide](https://docs.oracle.com/javase/8/docs/technotes/guides/vm/performance-enhancements.html)

---

## Conclusion

Remember:
1. **Measure first** - Don't optimize without profiling
2. **Focus on algorithms** - O(n²) to O(n log n) beats micro-optimizations
3. **Choose the right data structure** - It can make orders of magnitude difference
4. **Cache wisely** - Balance memory usage with computation savings
5. **Keep it maintainable** - Clear code is easier to optimize later

