# GIT_CLONE
Like ``GITHUB_ARCHIVE``, except this function extends support for projects that are outside of Github or don't provide any release tarballs. Below is more documentation about specific parameters

## Arguments

| Index | Status | Description |
|-------|--------|-------------|
| 1 | Required | Link of the project that should be cloned |
| 2 | Required | Branch that will be checkout upon cloning |
| 3 | Required | Name of the folder where the project should be cloned to |

The folder where the files are cloned will always in ``build_work``, since the function doesn't take direct paths as arguments.

## Example

    AOM_VERSION := 3.1.0

    $(call GIT_CLONE,https://aomedia.googlesource.com/aom.git,v$(AOM_VERSION),aom) 
