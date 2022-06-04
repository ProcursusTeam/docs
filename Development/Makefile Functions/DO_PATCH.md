# DO_PATCH

Patch a project under `$(BUILD_WORK)` with patches in `$(BUILD_PATCH)`

# Arguments

This function applies patches/changes necessary for a project to
function on a specific platform. The table below showcases all
parameters required for the function to work

| Index | Status | Description |
| ----- | ------ | ----------- |
| 1 | Required | Folder name where patches are located; generally inside `$(BUILD_PATCH)` |
| 2 | Required | Folder name where patches should be applied to. This generally matches the name of the first argument, and the folder must exist in `$(BUILD_WORK)` |
| 3 | Optional | Extra arguments to `patch`. Usually this is `-p1` |

# Example

```makefile
$(call DO_PATCH,youtube-dl,youtube-dl,-p1)
```

The example above looks for patches inside build_patch/youtube-dl and
applies each patch (or diff) found to the project, youtube-dl (which can
be found in build_work/youtube-dl).

Patches are generally a good idea when dealing with a big project that
requires specific changes (that can't be put on the project's repository
or isn't part of the project's upstream yet) for a specific platform.
