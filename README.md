# Sort File Imports

## Description
Boost your TypeScript project's code quality effortlessly with sort-file-imports. 
This tool automatically arranges your import statements, maintaining code consistency and enhancing readability. 
Spend less time on manual sorting and more on productive coding.

### Usage
You can use sort-file-imports by providing a directory or a single TypeScript file as a parameter. If no parameter is provided, the tool will default to using the "src" directory.
Additionally, the tool will prompt you to choose between ascending (ASC) or descending (DESC) sorting, with descending being the default option.

You can install the package:
```bash
$ npm install sort-file-imports
```
or use it directly without installing it locally:
```bash
$ npx sort-file-imports [options]
```

If you don't provide [options] then the default is **src** directory.

### Example

**Example 1**: Sort imports in a directory (defaulting to "src"):
```bash
$ npx sort-file-imports
```

**Example 2**: Sort imports in a single TypeScript file [provide correct path]:
```bash
$ npx sort-file-imports src/controllers/my-file.ts
```

**Example 3**: Sort imports in a directory:
```bash
$ npx sort-file-imports src/services
```

## About


**sort-file-imports** is actively managed by **Blend Mehani**, 
driven by a strong commitment to enhancing your TypeScript development workflow for a smoother and more efficient experience.

**Happy coding!**