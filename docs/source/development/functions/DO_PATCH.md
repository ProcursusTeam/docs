# `DO_PATCH`

This function applies patches necessary for a project to function on a
specific platform.

The function takes project-specific patches, often within `build_patch`
and applies them to that project (that has been extracted to
`build_work`)

## Arguments

The following table documents specific arguments required for the
function to work

```{note}
The last argument of the function is undocumented, as it's generally
the same across all projects.
```

| Index | Description |
|-------|-------------|
| 1 | Folder mame where project-specific patches are located |
| 2 | Folder name where patches should be applied to |

## Example

    $(call DO_PATCH,youtube-dl,youtube-dl,-p1)

The example above looks for patches inside `build_patch/youtube-dl` and
applies each patch (or diff) found to the project, `youtube-dl` (which
can be found in `build_work/youtube-dl`).

Patches are generally a good idea when dealing with a big project that
requires specific changes (that can't be put on the project's
repository or isn't part of the project's upstream yet) for a specific
platform.
