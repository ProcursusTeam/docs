# Makefile functions

```{toctree}
:hidden:

functions/SIGN.md
functions/PACK.md
functions/DO_PATCH.md
functions/GITHUB_ARCHIVE.md
functions/GIT_CLONE.md
functions/EXTRACT_TAR.md
```

This specific page documents functions used in all Procursus packages, each having its purpose.

The table below showcases current functions across all Procursus projects, and where to use them when creating a new package.

| Function | Description | Used in |
|----------|-------------|---------|
| [`SIGN`](./functions/SIGN) | Recursively signs Mach-O libraries and binaries with `ldid` or `codesign` | Package stage rule (`(tool)-package`) |
| [`PACK`](./functions/PACK) | Creates a Debian package with `dpkg` or `dm.pl` for the given project | Package stage rule (`(tool)-package`) |
| [`DO_PATCH`](./functions/DO_PATCH) | Applies patches needed for a project to function | Package setup rule (`(tool)-setup`) |
| [`GITHUB_ARCHIVE`](./functions/GITHUB_ARCHIVE) | Downloads an archive tarball of any Github project | Package setup rule (`(tool)-setup`) |
| [`GIT_CLONE`](./functions/GIT_CLONE) | Provides similar function as [`GITHUB_ARCHIVE`](./functions/GITHUB_ARCHIVE), but works for any Git project | Package setup rule (`(tool)-setup`) |
| [`EXTRACT_TAR`](./functions/EXTRACT_TAR) | Extracts a tarball from `build_source` to `build_work` | Package setup rule (`(tool)-setup`) |
