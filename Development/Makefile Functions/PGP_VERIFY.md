# PGP_VERIFY

Verify whether a given file under `$(BUILD_SOURCE)` has a valid GPG signature.
If `NO_PGP` is set to 1, this function does not do anything.

This function do not fail even if the key has expired or had been revoked.
It also tries to fetch any missing public keys from `keyserver.ubuntu.com`

# Arguments

| Index | Status | Description |
|-------|--------|-------------|
| 1 | Required | The file under `$(BUILD_SOURCE)` to be verified |
| 2 | Optional | The filename extension of the signature file, without the dot. If unspecified, this is assumed to be `sig` |

# Examples

## Verify `$(BUILD_SOURCE)/foo.tar.gz` with checksum file at `$(BUILD_SOURCE)/foo.tar.gz.sig`

```makefile
$(call PGP_VERIFY,foo.tar.gz)
```

## Verify `$(BUILD_SOURCE)/foo.tar.gz` with checksum file at `$(BUILD_SOURCE)/foo.tar.gz.asc`

```makefile
$(call PGP_VERIFY,foo.tar.gz,asc)
```
