# Bare
iOS 18.3.2+ Bug with Firebase

## Dependencies
```
npm install
```
```
npx cap sync
```
> sudo or --force may be required for some installations.

## Reproduce Issue
1. Freshly install the app to a iOS 18.3.2+ Simulator device; try iPad Air (5th generation)
2. Enter email "khael@tyme.today" at Sign In, a .gif avatar should load in-place; bug detected if not rendered.
3. Close the app, re-open and attempt Sign In with "khael@tyme.today" email again.

## Run via XCode (iOS)
```
chmod u+x exec-ios.sh && ./exec-ios.sh
```
> Builds the app for iOS and opens it in Xcode.