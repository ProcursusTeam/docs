# AFTER_BUILD

Carries out post-build operations.

This function should be specified at the end of the target that builds
(but not package) a project.

# Arguments

| Index | Status | Description |
|-------|--------|-------------|
| 1 | Optional | If equals to `copy`, copies the build_stage of the package to build_base. Specify this if this project provides libraries. |
| 2 | Optional | The name of the project directory under `$(BUILD_STAGE)`. If not specified, it is assumed to be `$@` (target name).                |

# Details

Specifically, this function:

- Fix library install names
- Strip the binaries, even if `DEBUG` equals to 1
- Decompress man pages and docs if they are compressed.
- Compress man pages and docs again unless `MEMO_NO_DOC_COMPRESS` is equal to 1
- Copy the build_stage of the package to build_base.
- Create the `.build_complete` file inside the build_work of the package, to indicate it has be built
- Deletes all `*.la` files
