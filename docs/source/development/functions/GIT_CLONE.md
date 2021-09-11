# `GIT_CLONE`

This function can clone just about any Git project. The function acts like [`GITHUB_ARCHIVE`](GITHUB_ARCHIVE), extending support for projects outside of Github.

Unlike other methods of getting tarballs, like using `wget`, this can be useful when the project authors/maintainers don't provide a download tarball, or their project isn't on Github.

## Arguments

The following table showcases documentation for specific arguments of the function

```{note}
The 3rd argument cannot be a direct path. The project can be cloned to any folder within `build_work`
```

| Index | Description |
|-------|-------------|
| 1 | Link of the project that will be cloned |
| 2 | Branch that should be checked out upon cloning |
| 3 | Folder name where the project should be clone to |

## Example

    AOM_VERSION := 3.1.0
    
    $(call GIT_CLONE,https://aomedia.googlesource.com/aom.git,v$(AOM_VERSION),aom)

The example above clones the project from the given URL to `build_work/aom` and checks out the branch assigned to `AOM_VERSION`.
