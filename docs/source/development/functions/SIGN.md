# `SIGN`

This function recursively signs Mach-O libraries and binaries with
`ldid` or `codesign`.

## Arguments

The following table documents specific arguments of the function

| Index | Description |
|-------|-------------|
| 1 | Name of the project binaries; always in `build_dist` |
| 2 | File name that includes specific entitlements for binaries |

The second argument can be any string, pointing to a XML file within
`build_misc/entitlements`.

## Example

    $(call SIGN,nano,general.xml)

The example above looks for binaries within `build_dist/nano` and signs
them with entitlements specified in `build_misc/entitlements/general.xml`, which is often used to apply general entitlements to binaries and
Macho-O libraries.

If your package requires specific entitlements, you'll need to add an
XML file to `build_misc/entitlements` and refer to it over `general.xml`.
