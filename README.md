# LittleBoys

## Usage

## Engineering Structure

```md
.
|--- .vscode
|--- dist
|--- plugins
| |--- buildPlugin.ts - build package plugin for vite.
| |--- devPlugin.ts - develop plugin for vite
| └──
|
|--- release - to place the finally generated install package
| |---
| └──
|
|--- resource - included some external source, such as: icon, third-partly library
|--- src
| |--- common
| |--- main - codes for main process
| |--- model - mode files for application, such as: message class, session class, user settings etc.
| |--- renderer - codes for render process
| | |---
| |
| |
| |---
| |---
| |---
| └──
|
|--- .gitignore
|--- index.html - entry page for render process
|--- package.json
|--- README.md
|--- tsconfig.json
|--- tsconfig.node.json
|--- vite.config.ts - configurations for vite
|--- yarn.lock
```
