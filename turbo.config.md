# Turbopack Configuration
# This file helps optimize Turbopack performance for your project

# File patterns to ignore during development
# These patterns help reduce filesystem overhead

patterns_to_ignore = [
  "**/.git/**",
  "**/node_modules/**",
  "**/.next/**",
  "**/convex/_generated/**",
  "**/.env*",
  "**/coverage/**",
  "**/build/**",
  "**/dist/**",
  "**/*.log",
  "**/.DS_Store",
  "**/Thumbs.db",
]

# Recommended file extensions for faster processing
optimized_extensions = [
  ".ts",
  ".tsx", 
  ".js",
  ".jsx",
  ".css",
  ".scss",
  ".sass",
  ".less",
  ".json",
]

# Performance tips:
# 1. Keep your project on a local SSD drive
# 2. Add project folder to antivirus exclusions
# 3. Use the --turbopack flag for faster builds
# 4. Consider using WSL2 for better I/O performance on Windows
