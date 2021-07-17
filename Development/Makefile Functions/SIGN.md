# SIGN

Recursively signs Mach-O libraries and binaries with `ldid` or `codesign`

## Arguments

| Index | Description |
|-------|-------------|
| 1     | Name of the project with binaries; always in `build_dist` |
| 2     | File name that includes specific entitlements for binaries |

The second argument can be any string, as long as the entitlements are within `build_misc/entitlements`.

## Example

```makefile
$(call SIGN,nano,general.xml)
```
