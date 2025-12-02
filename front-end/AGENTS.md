# AGENTS.md

## Project Overview

This is an Expo/React Native mobile application. Prioritize mobile-first patterns, performance, and cross-platform compatibility.

## Essential Commands

### Development

```bash
npx expo start                  # Start dev server
npx expo start --clear          # Clear cache and start dev server
npx expo install <package>      # Install packages with compatible versions
npx expo install --check        # Check which installed packages need to be updated
npx expo install --fix          # Automatically update any invalid package versions
```

### Building & Testing

```bash
npx expo prebuild               # Generate native projects
npx expo run:ios                # Build and run on iOS device
npx expo run:android            # Build and run on Android device
npx expo doctor                 # Check project health and dependencies
npm expo lint                   # Run ESLint
```

### Production

```bash
npx eas-cli@latest build --platform ios -s            # Use EAS to build for iOS platform and submit to App Store
npx eas-cli@latest build --platform android -s        # Use EAS to build for Android platform and submit to Google Play Store
npx expo export -p web && npx eas-cli@latest deploy   # Deploy web to EAS Hosting
```

## Development Principles

### Code Style & Standards

- **TypeScript First**: Use TypeScript for all new code with strict type checking
- **Naming Conventions**: Use meaningful, descriptive names for variables, functions, and components
- **Self-Documenting Code**: Write clear, readable code that explains itself; only add comments for complex business logic or design decisions
- **React 19 Patterns**: Follow modern React patterns including:
  - Function components with hooks
  - Enable React Compiler
  - Proper dependency arrays in useEffect
  - Memoization when appropriate (useMemo, useCallback)
  - Error boundaries for better error handling

### Architecture & Best Practices

#### Recommended Libraries

- **Navigation**: `expo-router` for navigation
- **Images**: `expo-image` for optimized image handling and caching
- **Animations**: `react-native-reanimated` for performant animations on native thread
- **Gestures**: `react-native-gesture-handler` for native gesture recognition
- **Storage**: Use `expo-sqlite` for persistent storage, `expo-sqlite/kv-store` for simple key-value storage

#### Data Persistence with Expo SQLite

**Overview**: Expo SQLite provides robust local data persistence with a SQLite database stored on the device. Data persists across app restarts, making it ideal for offline-first and local-first architectures.

**Key Features**:

- **Cross-Platform**: Works on Android, iOS, macOS, tvOS, and web (WASM)
- **Offline Support**: Local storage ensures data availability without network
- **Performance**: Faster than AsyncStorage for complex data structures
- **Familiar SQL API**: Standard SQL commands for data operations

**Installation & Setup**:

```bash
npx expo install expo-sqlite
```

**Basic Usage Pattern**:

```typescript
import { SQLiteProvider, useSQLiteContext } from "expo-sqlite";

// App wrapper with database provider
export default function App() {
  return (
    <SQLiteProvider databaseName="app.db">
      <MainApp />
    </SQLiteProvider>
  );
}

// Component using database
function MainApp() {
  const db = useSQLiteContext();

  // Initialize tables
  useEffect(() => {
    db.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE
      );
    `);
  }, []);

  // Insert data
  const addUser = async (name: string, email: string) => {
    await db.runAsync("INSERT INTO users (name, email) VALUES (?, ?)", name, email);
  };

  // Query data
  const getUsers = async () => {
    return await db.getAllAsync("SELECT * FROM users");
  };
}
```

**Advanced Features**:

- **Key-Value Store**: `expo-sqlite/kv-store` as AsyncStorage replacement
- **Binary Data**: Support for BLOB storage
- **Debugging**: Use Drizzle Studio plugin to inspect on-device database
- **localStorage API**: Web-compatible API for code sharing

**Best Practices**:

- Use transactions for multiple related operations
- Create indexes for frequently queried columns
- Handle database migrations properly
- Use prepared statements for security
- Consider using ORM like Drizzle for complex schemas

### Debugging & Development Tools

#### DevTools Integration

- **React Native DevTools**: Use MCP `open_devtools` command to launch debugging tools
- **Network Inspection**: Monitor API calls and network requests in DevTools
- **Element Inspector**: Debug component hierarchy and styles
- **Performance Profiler**: Identify performance bottlenecks
- **Logging**: Use `console.log` for debugging (remove before production), `console.warn` for deprecation notices, `console.error` for actual errors, and implement error boundaries for production error handling

### Testing & Quality Assurance

#### Automated Testing with MCP Tools

- **Component Testing**: Add `testID` props to components for automation
- **Visual Testing**: Use MCP `automation_take_screenshot` to verify UI appearance
- **Interaction Testing**: Use MCP `automation_tap_by_testid` to simulate user interactions
- **View Verification**: Use MCP `automation_find_view_by_testid` to validate component rendering
