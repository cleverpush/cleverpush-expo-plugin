# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-28

### Added
- Initial release of CleverPush Expo Plugin
- iOS notification service extension support
- Android notification icon configuration
- Support for development and production APNs environments
- EAS Build compatibility
- Custom notification service extension file support
- TypeScript definitions
- Comprehensive documentation and examples

### Features
- **iOS Support:**
  - Automatic NSE (Notification Service Extension) setup
  - App Groups entitlements configuration
  - Background modes configuration
  - Podfile updates for CleverPush dependency
  - EAS managed credentials support
  
- **Android Support:**
  - Small and large notification icon generation
  - Notification accent color configuration
  - Automatic icon scaling for different densities
  
- **Plugin Configuration:**
  - Development/production mode configuration
  - Apple Team ID support
  - Custom iPhone deployment target
  - Extensive validation and error handling 