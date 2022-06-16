# CHECKSUM_VERIFY

Verify whether a given file under `$(BUILD_SOURCE)` have a checksum that matches the given checksum.

This function errors on a checksum mismatch.

# Arguments

| Index | Status | Description |
|-------|--------|-------------|
| 1 | Required | The hash algorithm to use. `sha1`, `sha256` and `sha512` are supported. |
| 2 | Required | The file under `$(BUILD_SOURCE)` to verify |
| 3 | Optional | The expected hash. If omitted, then the hash is assumed to be stored in the first word of a file in `$(BUILD_SOURCE)/$(2).$(1)` |

# Example

## Checks `foo.tar.gz` with SHA1 checksum stored in the first word of a file named `foo.tar.gz.sha1`

```makefile
$(call CHECKSUM_VERIFY,sha1,foo.tar.gz)
```

## Checks `vlc-3.0.17.3.tar.xz` for a SHA256 checksum that is the third argument

```makefile
$(call CHECKSUM_VERIFY,sha256,vlc-3.0.17.3.tar.xz,6f7e90ef8973d31d96de64db817173e345150829717a94084b1bb8321cde2014)
```
