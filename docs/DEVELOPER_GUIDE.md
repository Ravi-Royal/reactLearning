# Quick Reference Guide: Standardized Workspace

## For Developers Working on This Project

### 🎯 Core Principles
1. **No Hardcoded Strings** - All text must be in constants files
2. **No Console Statements** - Use logger utility instead
3. **No Alert Dialogs** - Use toast notifications
4. **Environment-Aware** - Code behaves differently in dev vs production

---

## 📝 Creating Constants

### Step 1: Create Constants File
```typescript
// src/pages/components/[feature]/constants/[componentName].constants.ts

export const COMPONENT_NAME_TEXTS = {
  LABELS: {
    FIELD_NAME: 'User-visible label',
  },
  PLACEHOLDERS: {
    FIELD_NAME_PLACEHOLDER: 'e.g., 100',
  },
  MESSAGES: {
    SUCCESS: 'Operation completed successfully',
    ERROR: 'Something went wrong',
  },
} as const;
```

### Step 2: Import and Use in Component
```typescript
import { COMPONENT_NAME_TEXTS } from './constants/componentName.constants';

// In JSX
<input placeholder={COMPONENT_NAME_TEXTS.PLACEHOLDERS.FIELD_NAME_PLACEHOLDER} />
<label>{COMPONENT_NAME_TEXTS.LABELS.FIELD_NAME}</label>
```

---

## 🔍 Logging Best Practices

### Import the Logger
```typescript
import { logger, logSuccess, logApiFailure } from '../../../utils/logger';
```

### Usage Examples

#### Development Logging
```typescript
// ❌ NEVER DO THIS
console.log('User data:', userData);
console.warn('API slow response');
console.error('Failed to fetch', error);

// ✅ DO THIS INSTEAD
logger.info('User data:', userData);
logger.warn('API slow response');
logger.error('Failed to fetch', error);
```

#### Success Messages
```typescript
// After successful operations
logSuccess('Data saved successfully');
```

#### API Failures
```typescript
// When API calls fail
try {
  const data = await fetchData();
} catch (error) {
  logApiFailure('CoinGecko API', error, { 
    symbol: 'BTC',
    endpoint: '/prices'
  });
}
```

#### Environment Behavior
```typescript
// In development: Logs to console
logger.info('Debug info'); // Appears in console

// In production: Silent (except errors)
logger.info('Debug info'); // Does nothing
logger.error('Critical error'); // Sent to error tracking service
```

---

## 🔔 Toast Notifications

### Import Toast
```typescript
import { toast } from '../../../utils/toast';
```

### Usage Examples

#### Success Notifications
```typescript
// After successful save
toast.success('Data saved successfully!');

// After successful copy
toast.success('Copied to clipboard!');
```

#### Error Notifications
```typescript
// On validation error
toast.error('Please enter a valid amount');

// On API failure
toast.error('Failed to load data. Please try again.');
```

#### Info Notifications
```typescript
// General information
toast.info('Loading data from server...');
```

#### Warning Notifications
```typescript
// Non-critical warnings
toast.warning('No data available to save');
```

#### Custom Duration
```typescript
// Default: success/info/warning = 3s, error = 4s
toast.success('Quick message!', 2000); // 2 seconds
toast.error('Important error!', 6000); // 6 seconds
```

---

## 🎨 Component Structure

### Standard Calculator Component Pattern
```typescript
// 1. Imports
import { useState } from 'react';
import { logger, logSuccess } from '../../../utils/logger';
import { toast } from '../../../utils/toast';
import { CALCULATOR_TEXTS } from './constants/calculator.constants';

// 2. Component
export function Calculator() {
  // 3. State
  const [value, setValue] = useState('');

  // 4. Handlers
  const handleCalculate = () => {
    try {
      // Calculation logic
      logSuccess('Calculation completed');
      toast.success('Results ready!');
    } catch (error) {
      logger.error('Calculation failed:', error);
      toast.error('Failed to calculate. Please check inputs.');
    }
  };

  // 5. Render
  return (
    <div>
      <input 
        placeholder={CALCULATOR_TEXTS.PLACEHOLDERS.VALUE}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button onClick={handleCalculate}>
        {CALCULATOR_TEXTS.BUTTONS.CALCULATE}
      </button>
    </div>
  );
}
```

---

## 🚫 Common Mistakes to Avoid

### ❌ Hardcoded Strings
```typescript
// WRONG
<input placeholder="e.g., 100" />
<h1>Stock Calculator</h1>
alert('Saved!');
```

### ✅ Using Constants
```typescript
// CORRECT
<input placeholder={TEXTS.PLACEHOLDERS.AMOUNT} />
<h1>{TEXTS.TITLES.CALCULATOR}</h1>
toast.success(TEXTS.MESSAGES.SAVED);
```

### ❌ Direct Console Usage
```typescript
// WRONG
console.log('Data:', data);
console.warn('Slow API');
console.error('Failed:', err);
```

### ✅ Using Logger
```typescript
// CORRECT
logger.info('Data:', data);
logger.warn('Slow API');
logger.error('Failed:', err);
```

### ❌ Alert Dialogs
```typescript
// WRONG
alert('Operation completed!');
alert('Error: ' + errorMessage);
```

### ✅ Toast Notifications
```typescript
// CORRECT
toast.success('Operation completed!');
toast.error(`Error: ${errorMessage}`);
```

---

## 📁 File Organization

### Constants Location Pattern
```
src/pages/components/
├── investment/
│   ├── stock/
│   │   ├── average-calculator/
│   │   │   ├── AverageCalculator.tsx
│   │   │   └── constants/
│   │   │       └── averageCalculator.constants.ts
│   │   └── profit-calculator/
│   │       ├── StockProfitCalculator.tsx
│   │       └── constants/
│   │           └── profitCalculator.constants.ts
│   └── mutual-fund/
│       └── calculator/
│           ├── MutualFundCalculator.tsx
│           └── constants/
│               └── mutualFundCalculator.constants.ts
```

### Constants File Naming
- **Pattern**: `[componentName].constants.ts`
- **Examples**:
  - `averageCalculator.constants.ts`
  - `profitCalculator.constants.ts`
  - `mutualFundCalculator.constants.ts`
  - `stockResult.constants.ts`

---

## 🔧 Utility Functions

### Logger Functions
```typescript
logger.log(message, ...args)    // General logging
logger.info(message, ...args)   // Information
logger.warn(message, ...args)   // Warnings
logger.error(message, ...args)  // Errors
logger.debug(message, ...args)  // Debug info

logSuccess(message)             // Success operations
logApiFailure(api, error, ctx)  // API failures
```

### Toast Functions
```typescript
toast.success(message, duration?)  // Success notification
toast.error(message, duration?)    // Error notification
toast.info(message, duration?)     // Info notification
toast.warning(message, duration?)  // Warning notification
toast.dismiss(id)                  // Dismiss specific toast
```

---

## 🧪 Testing Your Changes

### Before Committing
1. **Check for hardcoded strings**
   ```bash
   # Search for common hardcoded patterns
   grep -r "placeholder=\"e\.g\." src/
   grep -r "placeholder='e\.g\." src/
   ```

2. **Check for console statements**
   ```bash
   # Find remaining console.* (exclude logger.ts)
   grep -r "console\." src/ | grep -v "logger.ts"
   ```

3. **Check for alert dialogs**
   ```bash
   grep -r "alert(" src/
   ```

4. **Run TypeScript check**
   ```bash
   npm run type-check
   ```

5. **Run linting**
   ```bash
   npm run lint
   ```

---

## 📚 References

### Documentation Files
- [STANDARDIZATION_SUMMARY.md](./STANDARDIZATION_SUMMARY.md) - Complete standardization overview
- [PRODUCTION_READY_AUDIT.md](./PRODUCTION_READY_AUDIT.md) - Production audit report
- [AUDIT_REPORT.md](./AUDIT_REPORT.md) - Workspace audit report

### Key Files
- [src/utils/logger.ts](./src/utils/logger.ts) - Logger utility
- [src/utils/toast.ts](./src/utils/toast.ts) - Toast notification utility
- [src/pages/components/common/ToastContainer.tsx](./src/pages/components/common/ToastContainer.tsx) - Toast UI component

---

## 💡 Tips

### IntelliSense Support
All constants are typed with `as const`, giving you autocomplete:
```typescript
// Type: 'e.g., 100'
TEXTS.PLACEHOLDERS.AMOUNT
        ↑
  Auto-completes!
```

### Organizing Constants
Group by purpose:
```typescript
export const COMPONENT_TEXTS = {
  // User-facing labels
  LABELS: { ... },
  
  // Input placeholders
  PLACEHOLDERS: { ... },
  
  // Button texts
  BUTTONS: { ... },
  
  // Status messages
  MESSAGES: { ... },
  
  // Error messages
  ERRORS: { ... },
} as const;
```

### Logger Levels
Choose appropriate level:
- `logger.debug()` - Detailed debugging (dev only)
- `logger.info()` - General information (dev only)
- `logger.warn()` - Warnings that need attention (dev only)
- `logger.error()` - Errors (dev + production tracking)

---

## ❓ FAQ

**Q: When should I create a new constants file?**
A: Create one per major component/feature. If a component has 3+ text strings, it deserves its own constants file.

**Q: Can I use console.log for quick debugging?**
A: During development, yes. But remove before committing. Use `logger.debug()` instead.

**Q: What if I need a temporary alert for testing?**
A: Use `toast.info()` instead - it's non-blocking and easier to remove.

**Q: How do I handle dynamic messages?**
A: Use template literals:
```typescript
toast.success(`${userName} logged in successfully`);
logger.info(`Loaded ${count} records from ${source}`);
```

**Q: What about error objects in toast?**
A: Keep toast messages user-friendly, log details:
```typescript
logger.error('API call failed:', error);
toast.error('Failed to load data. Please try again.');
```

---

**Last Updated**: January 31, 2026
**Maintained By**: Development Team
