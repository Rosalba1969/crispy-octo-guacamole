/**
 * Performance Optimization Examples - JavaScript/Node.js
 * =======================================================
 * 
 * This file demonstrates common performance issues in JavaScript
 * and their optimized solutions with benchmarks.
 * 
 * Run with: node performance_example.js
 */

const { performance } = require('perf_hooks');

/**
 * Benchmark decorator function
 */
function benchmark(func) {
    return function(...args) {
        const start = performance.now();
        const result = func(...args);
        const end = performance.now();
        const elapsed = end - start;
        console.log(`${func.name.padEnd(45)} took ${elapsed.toFixed(2).padStart(8)} ms`);
        return result;
    };
}

// =============================================================================
// Example 1: Array Operations
// =============================================================================

const arrayPushInefficient = benchmark(function arrayPushInefficient(n = 100000) {
    // ❌ Inefficient: Repeated array resizing
    const result = [];
    for (let i = 0; i < n; i++) {
        result.push(i);
    }
    return result;
});

const arrayPushEfficient = benchmark(function arrayPushEfficient(n = 100000) {
    // ✅ Efficient: Pre-allocated array
    const result = new Array(n);
    for (let i = 0; i < n; i++) {
        result[i] = i;
    }
    return result;
});

// =============================================================================
// Example 2: String Concatenation
// =============================================================================

const stringConcatInefficient = benchmark(function stringConcatInefficient(n = 10000) {
    // ❌ Inefficient: Creates new string each iteration
    let result = '';
    for (let i = 0; i < n; i++) {
        result += i.toString();
    }
    return result;
});

const stringConcatEfficient = benchmark(function stringConcatEfficient(n = 10000) {
    // ✅ Efficient: Use array and join
    const parts = [];
    for (let i = 0; i < n; i++) {
        parts.push(i.toString());
    }
    return parts.join('');
});

// =============================================================================
// Example 3: Object Lookup
// =============================================================================

const objectLookupArray = benchmark(function objectLookupArray(n = 10000) {
    // ❌ Inefficient: O(n) lookup
    const allowed = Array.from({ length: n }, (_, i) => i);
    let count = 0;
    for (let i = 0; i < n; i++) {
        if (allowed.includes(i)) {  // O(n) operation
            count++;
        }
    }
    return count;
});

const objectLookupSet = benchmark(function objectLookupSet(n = 10000) {
    // ✅ Efficient: O(1) lookup
    const allowed = new Set(Array.from({ length: n }, (_, i) => i));
    let count = 0;
    for (let i = 0; i < n; i++) {
        if (allowed.has(i)) {  // O(1) operation
            count++;
        }
    }
    return count;
});

// =============================================================================
// Example 4: DOM Manipulation (Simulated)
// =============================================================================

function simulateDOM() {
    return {
        innerHTML: '',
        elements: []
    };
}

const domManipulationInefficient = benchmark(function domManipulationInefficient(n = 1000) {
    // ❌ Inefficient: Multiple DOM updates
    const container = simulateDOM();
    for (let i = 0; i < n; i++) {
        container.innerHTML += `<div>${i}</div>`;  // Reflows on each iteration
    }
    return container;
});

const domManipulationEfficient = benchmark(function domManipulationEfficient(n = 1000) {
    // ✅ Efficient: Single DOM update
    const container = simulateDOM();
    let html = '';
    for (let i = 0; i < n; i++) {
        html += `<div>${i}</div>`;
    }
    container.innerHTML = html;  // Single update
    return container;
});

// =============================================================================
// Example 5: Array Filtering and Mapping
// =============================================================================

const filterMapInefficient = benchmark(function filterMapInefficient(n = 100000) {
    // ❌ Less efficient: Multiple passes
    const numbers = Array.from({ length: n }, (_, i) => i);
    const filtered = [];
    for (let i = 0; i < numbers.length; i++) {
        if (numbers[i] % 2 === 0) {
            filtered.push(numbers[i]);
        }
    }
    const result = [];
    for (let i = 0; i < filtered.length; i++) {
        result.push(filtered[i] * 2);
    }
    return result;
});

const filterMapEfficient = benchmark(function filterMapEfficient(n = 100000) {
    // ✅ More efficient: Single pass
    const numbers = Array.from({ length: n }, (_, i) => i);
    return numbers.reduce((acc, num) => {
        if (num % 2 === 0) {
            acc.push(num * 2);
        }
        return acc;
    }, []);
});

// =============================================================================
// Example 6: Object Property Access
// =============================================================================

const propertyAccessInefficient = benchmark(function propertyAccessInefficient(n = 1000000) {
    // ❌ Less efficient: Repeated property access
    const obj = { deeply: { nested: { value: 42 } } };
    let sum = 0;
    for (let i = 0; i < n; i++) {
        sum += obj.deeply.nested.value;
    }
    return sum;
});

const propertyAccessEfficient = benchmark(function propertyAccessEfficient(n = 1000000) {
    // ✅ More efficient: Cache property value
    const obj = { deeply: { nested: { value: 42 } } };
    const value = obj.deeply.nested.value;
    let sum = 0;
    for (let i = 0; i < n; i++) {
        sum += value;
    }
    return sum;
});

// =============================================================================
// Example 7: Function Calls
// =============================================================================

const functionCallsInefficient = benchmark(function functionCallsInefficient(n = 100000) {
    // ❌ Less efficient: Function call overhead
    function add(a, b) {
        return a + b;
    }
    let sum = 0;
    for (let i = 0; i < n; i++) {
        sum = add(sum, i);
    }
    return sum;
});

const functionCallsEfficient = benchmark(function functionCallsEfficient(n = 100000) {
    // ✅ More efficient: Inline operation
    let sum = 0;
    for (let i = 0; i < n; i++) {
        sum += i;
    }
    return sum;
});

// =============================================================================
// Example 8: Object Creation
// =============================================================================

const objectCreationInefficient = benchmark(function objectCreationInefficient(n = 100000) {
    // ❌ Inefficient: Creating objects in loop
    const results = [];
    for (let i = 0; i < n; i++) {
        results.push({ id: i, value: i * 2 });
    }
    return results;
});

const objectCreationEfficient = benchmark(function objectCreationEfficient(n = 100000) {
    // ✅ More efficient: Pre-allocated with constructor
    const results = new Array(n);
    for (let i = 0; i < n; i++) {
        results[i] = { id: i, value: i * 2 };
    }
    return results;
});

// =============================================================================
// Main Benchmark Runner
// =============================================================================

function runAllBenchmarks() {
    console.log('='.repeat(80));
    console.log('PERFORMANCE OPTIMIZATION EXAMPLES - JavaScript Benchmark Results');
    console.log('='.repeat(80));
    
    console.log('\n1. ARRAY OPERATIONS (100,000 items)');
    console.log('-'.repeat(80));
    arrayPushInefficient(100000);
    arrayPushEfficient(100000);
    
    console.log('\n2. STRING CONCATENATION (10,000 iterations)');
    console.log('-'.repeat(80));
    stringConcatInefficient(10000);
    stringConcatEfficient(10000);
    
    console.log('\n3. OBJECT LOOKUP (10,000 items, 10,000 lookups)');
    console.log('-'.repeat(80));
    objectLookupArray(10000);
    objectLookupSet(10000);
    
    console.log('\n4. DOM MANIPULATION (1,000 elements)');
    console.log('-'.repeat(80));
    domManipulationInefficient(1000);
    domManipulationEfficient(1000);
    
    console.log('\n5. FILTERING AND MAPPING (100,000 items)');
    console.log('-'.repeat(80));
    filterMapInefficient(100000);
    filterMapEfficient(100000);
    
    console.log('\n6. PROPERTY ACCESS (1,000,000 iterations)');
    console.log('-'.repeat(80));
    propertyAccessInefficient(1000000);
    propertyAccessEfficient(1000000);
    
    console.log('\n7. FUNCTION CALLS (100,000 iterations)');
    console.log('-'.repeat(80));
    functionCallsInefficient(100000);
    functionCallsEfficient(100000);
    
    console.log('\n8. OBJECT CREATION (100,000 objects)');
    console.log('-'.repeat(80));
    objectCreationInefficient(100000);
    objectCreationEfficient(100000);
    
    console.log('\n' + '='.repeat(80));
    console.log('KEY TAKEAWAYS:');
    console.log('='.repeat(80));
    console.log('1. Pre-allocate arrays when size is known');
    console.log('2. Use Set for O(1) lookups instead of Array.includes()');
    console.log('3. Minimize DOM manipulations - batch updates');
    console.log('4. Cache property lookups that are accessed repeatedly');
    console.log('5. Reduce function call overhead in tight loops');
    console.log('6. Use array methods wisely - they have overhead');
    console.log('='.repeat(80));
}

if (require.main === module) {
    runAllBenchmarks();
}

module.exports = {
    arrayPushInefficient,
    arrayPushEfficient,
    stringConcatInefficient,
    stringConcatEfficient,
    objectLookupArray,
    objectLookupSet
};
