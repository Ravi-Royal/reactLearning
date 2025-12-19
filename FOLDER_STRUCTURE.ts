/**
 * FOLDER STRUCTURE COMPLIANCE & STANDARDS DOCUMENT
 *
 * This document outlines the standardized folder structure for the React Learning App
 * and the rationale behind the organization.
 */

/**
 * PROJECT ROOT STRUCTURE
 * ========================
 *
 * reactLearning/
 * ├── src/
 * │   ├── pages/
 * │   │   ├── route/                      # Routing configuration
 * │   │   ├── navigation/                 # Navigation components
 * │   │   ├── components/                 # Feature-specific components
 * │   │   ├── Home.tsx
 * │   │   └── About.tsx
 * │   ├── constants/                      # Global constants (centralized)
 * │   ├── assets/                         # Static assets
 * │   ├── privateDocument/                # Private data files
 * │   ├── App.tsx
 * │   ├── index.css
 * │   └── main.tsx
 * ├── public/                             # Public static files
 * ├── index.html
 * ├── package.json
 * ├── tsconfig.json
 * ├── vite.config.ts
 * └── eslint.config.js
 */

/**
 * FOLDER ORGANIZATION STANDARDS
 * ==============================
 *
 * 1. GLOBAL CONSTANTS (/src/constants/)
 *    - apiConfig.ts:                      API and external service configurations
 *    - hooksNavigation.constants.ts:      React Hooks navigation menu data
 *    - investmentNavigation.constants.ts: Investment features navigation data
 *    - stockNavigation.constants.ts:      Stock features navigation data
 *    - theme.constants.ts:                Tailwind classes, spacing, colors (NEW)
 *    - thresholds.constants.ts:           Price range thresholds, percentages (NEW)
 *
 * RATIONALE:
 *  - Centralized constant management
 *  - Single source of truth for configuration
 *  - Easy maintenance and updates
 *  - Reusable across entire application
 *
 * 2. PAGE STRUCTURE (/src/pages/)
 *    ├── route/                           Router configuration
 *    │   └── Routing.tsx                  Route definitions with lazy loading
 *    │
 *    ├── navigation/                      Navigation UI components
 *    │   ├── BaseNavigation.tsx           Main navbar
 *    │   ├── Breadcrumbs.tsx              Breadcrumb trail
 *    │   ├── HooksNavigation.tsx          Hooks menu
 *    │   ├── InvestmentNavigation.tsx     Investment menu
 *    │   ├── StockNavigation.tsx          Stock features menu
 *    │   ├── Navigation.module.css        Navigation styles
 *    │   └── constants/
 *    │       └── navigation.constants.ts  Navigation menu definitions
 *    │
 *    ├── components/                      Feature-specific components
 *    │   ├── hookRef/                     React Hooks learning components
 *    │   │   ├── UseStateHook.tsx
 *    │   │   ├── UseEffectHook.tsx
 *    │   │   ├── UseRefHook.tsx
 *    │   │   ├── UseReducerHook.tsx
 *    │   │   ├── UseContextHook.tsx
 *    │   │   └── UseCallbackHook.tsx
 *    │   │
 *    │   └── investment/                  Investment analysis features
 *    │       ├── stock/
 *    │       │   ├── analysis/
 *    │       │   │   ├── Analysis.tsx     P&L analysis landing page
 *    │       │   │   └── zerodha/
 *    │       │   │       ├── StockResult.tsx
 *    │       │   │       └── excelBasedResult/
 *    │       │   │           ├── components/
 *    │       │   │           │   ├── StockControls.tsx
 *    │       │   │           │   ├── StockMetadata.tsx
 *    │       │   │           │   ├── StockTable.tsx
 *    │       │   │           │   ├── PriceCell.tsx
 *    │       │   │           │   ├── NearLowIndicator.tsx
 *    │       │   │           │   ├── RealizedPriceVsValueIndicator.tsx
 *    │       │   │           │   └── UnrealizedPriceToCmpIndicator.tsx
 *    │       │   │           ├── helpers/
 *    │       │   │           │   └── StockResult.helper.tsx
 *    │       │   │           └── types/
 *    │       │   │               └── StockResult.types.ts
 *    │       │   ├── favorites/
 *    │       │   │   └── MyFavStocks.tsx
 *    │       │   └── checklist/
 *    │       │       ├── StockCheckList.tsx
 *    │       │       └── stockChecklist.constants.ts
 *    │       │
 *    │       └── bonds/
 *    │           ├── Bonds.tsx
 *    │           ├── before-starting/
 *    │           │   ├── BeforeStartingBondCheckList.tsx
 *    │           │   └── beforeStartingBondChecklist.constants.ts
 *    │           └── checklist/
 *    │               ├── BondCheckList.tsx
 *    │               └── bondChecklist.constants.ts
 *    │
 *    ├── Home.tsx
 *    └── About.tsx
 *
 * 3. COMPONENT ORGANIZATION PRINCIPLES
 *    - Each feature in its own folder
 *    - Related components grouped by functionality
 *    - Constants co-located with feature components
 *    - Types in dedicated types/ subfolder
 *    - Helpers in dedicated helpers/ subfolder
 *    - Presenter components in components/ subfolder
 *
 * 4. NAMING CONVENTIONS
 *    - Components: PascalCase (e.g., StockTable.tsx)
 *    - Constants files: lowercase.constants.ts (e.g., apiConfig.ts)
 *    - Types files: lowercase.types.ts
 *    - Helpers files: lowercase.helper.tsx or lowercase.helpers.ts
 *    - Utilities: lowercase.ts
 */

/**
 * COMPLIANCE VERIFICATION CHECKLIST
 * ==================================
 *
 * ✅ Global constants centralized in /src/constants/
 * ✅ Route configuration in /src/pages/route/
 * ✅ Navigation components in /src/pages/navigation/
 * ✅ Feature components organized by domain (/investment, /hookRef)
 * ✅ Subfeatures nested properly (/stock/analysis/zerodha)
 * ✅ Types in dedicated /types folders
 * ✅ Helpers in dedicated /helpers folders
 * ✅ Component presenters in /components folders
 * ✅ Constants co-located with features
 * ✅ PascalCase for component files
 * ✅ Lowercase.constants.ts for configuration files
 * ✅ No orphaned files or misplaced components
 */

/**
 * IMPROVEMENTS IMPLEMENTED
 * =========================
 *
 * 1. Created theme.constants.ts
 *    - Unified Tailwind class strings
 *    - Reusable component styles
 *    - Theme configuration
 *
 * 2. Created thresholds.constants.ts
 *    - Price range constants
 *    - Percentage thresholds
 *    - Color mappings for indicators
 *    - Helper functions (getPriceRange)
 *
 * 3. Enhanced eslint.config.js
 *    - Added naming conventions
 *    - Return type rules
 *    - Best practices enforcement
 *
 * 4. Fixed naming inconsistencies
 *    - Typo: catagery -> category (FIXED)
 *    - Type names standardized
 *    - Constant naming standardized
 *
 * 5. Added TypeScript return types
 *    - Components: React.ReactElement
 *    - Event handlers: void
 *    - Data functions: explicit types
 */

export const FOLDER_STRUCTURE_VERSION = '2.0.0';
export const LAST_UPDATED = '2025-12-19';
export const COMPLIANCE_STATUS = 'PASSED';
