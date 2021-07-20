# EXTRACT_TAR

This function is used to extract a tarball downloaded through ``wget`` or ``GITHUB_ARCHIVE``. The table below documents the 3 arguments that this function requires

## Arguments

| Index | Status | Description |
|-------|--------|-------------|
| 1 | Required | Name of the downloaded tarball |
| 2 | Required | Name of the folder extracted from downloaded tarball |
| 3 | Required | Folder name where tarball files should be copied to |

The function does not take direct paths; the first argument looks for tarballs in ``build_source``, extracts the contents in that same directory, and then copies them over to ``build_work``.

## Example

    APPUNINST_VERSION := 1.0.0

    $(call GITHUB_ARCHIVE,quiprr,appuninst,$(APPUNINST_VERSION),v$(APPUNINST_VERSION))
    $(call EXTRACT_TAR,appuninst-$(APPUNINST_VERSION).tar.gz,appuninst-$(APPUNINST_VERSION),appuninst)

The example above extracts the tarball downloaded from GitHub into ``build_source/appuninst-$(APPUNINST_VERSION)`` — then, those files are copied to ``build_work/appuninst``.
