/**
 * Memoization Standards & Best Practices
 *
 * This file documents when and how to use React memoization techniques.
 */

import { memo, useMemo, useCallback } from 'react';

/**
 * RULE 1: Use React.memo for components that:
 * - Render expensive UI calculations
 * - Receive the same props frequently
 * - Are leaf components in the tree
 *
 * Example:
 */
interface ExpensiveComponentProps {
  data: Array<{ id: number; name: string }>;
  onItemClick: (id: number) => void;
}

export const ExpensiveComponent = memo<ExpensiveComponentProps>(({ data, onItemClick }) => {
  return (
    <div>
      {data.map((item) => (
        <button key={item.id} type="button" onClick={() => onItemClick(item.id)} className="item-button">
          {item.name}
        </button>
      ))}
    </div>
  );
});

ExpensiveComponent.displayName = 'ExpensiveComponent';

/**
 * RULE 2: Use useMemo for:
 * - Expensive calculations/transformations
 * - Object/array references that shouldn't change
 * - Derived state that's costly to compute
 *
 * Example:
 */
export function DataProcessor({ rawData }: { rawData: number[] }) {
  // ✅ GOOD: Expensive calculation memoized
  const processedData = useMemo(() => {
    return rawData
      .filter((n) => n > 0)
      .map((n) => n * 2)
      .reduce((sum, n) => sum + n, 0);
  }, [rawData]);

  // ❌ BAD: Don't memoize cheap operations
  // const doubledValue = useMemo(() => value * 2, [value]);

  return <div>Result: {processedData}</div>;
}

/**
 * RULE 3: Use useCallback for:
 * - Functions passed to memoized child components
 * - Functions used in dependency arrays
 * - Event handlers in expensive components
 *
 * Example:
 */
export function ParentComponent() {
  const [items, setItems] = useState<Array<{ id: number; name: string }>>([]);

  // ✅ GOOD: Callback memoized for child component
  const handleItemClick = useCallback((id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []); // Empty deps because setItems is stable

  return <ExpensiveComponent data={items} onItemClick={handleItemClick} />;
}

/**
 * ANTI-PATTERNS TO AVOID:
 *
 * ❌ 1. Over-memoization (premature optimization)
 * const sum = useMemo(() => a + b, [a, b]); // Too simple!
 *
 * ❌ 2. Memoizing with unstable dependencies
 * const fn = useCallback(() => doSomething(obj), [obj]); // obj changes every render
 *
 * ❌ 3. Wrapping all components in memo
 * export const TinyComponent = memo(() => <div>Hi</div>); // No benefit
 *
 * ✅ BEST PRACTICES:
 * 1. Profile first, optimize later
 * 2. Memoize at boundaries (parent-child transitions)
 * 3. Use React DevTools Profiler to identify bottlenecks
 * 4. Keep dependency arrays minimal and stable
 */

// Example: When to use what
export function MemoizationGuide() {
  /*
   * Use React.memo:
   * - Component with expensive render
   * - Props change infrequently
   * - Pure component (same props = same output)
   */

  /*
   * Use useMemo:
   * - Expensive calculations (>50ms)
   * - Large data transformations
   * - Creating stable object references
   */

  /*
   * Use useCallback:
   * - Functions passed to React.memo components
   * - Functions in useEffect/useMemo deps
   * - Preventing child re-renders
   */

  return null;
}
