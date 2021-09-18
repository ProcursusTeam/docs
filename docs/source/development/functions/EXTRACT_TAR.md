# `EXTRACT_TAR`

This function is used to extract a tarball downloaded through `wget` or
[`GITHUB_ARCHIVE`](GITHUB_ARCHIVE).

## Arguments

The following table documents specific arguments of the function

```{note}
None of the function arguments take direct paths.
```

| Index | Status | Description |
|-------|--------|-------------|
| 1 | Required | Name of the downloaded tarball |
| 2 | Required | Name of the folder extracted from the downloaded tarball |
| 3 | Required | Folder name where tarball files should be copied to |

## Example

    APPUNINST_VERSION := 1.0.0
    
    $(call GITHUB_ARCHIVE,quiprr,appuninst,$(APPUNINST_VERSION),v$(APPUNINST_VERSION))
    $(call EXTRACT_TAR,appuninst-$(APPUNINST_VERSION).tar.gz,appuninst-$(APPUNINST_VERSION),appuninst)

The example above extracts the tarball downloaded from Github into
`build_source/appuninst-$(APPUNINST_VERSION)` — then, those files are
copied to `build_work/appuninst`.
