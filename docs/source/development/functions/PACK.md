# `PACK`

This function creates a Debian package with `dpkg` or `dm.pl` for the
project that is being built.

The function packages files that relate to a specific project, and adds
required metadata about the package to its designated control file,
such as the version number.

## Arguments

The following table documents specific arguments of the funtion

| Index | Description |
|-------|-------------|
| 1 | Name of the project being packaged |
| 2 | Package version variable within the control file |

## Example

    YOUTUBE_DL_VERSION := 2021.06.06
    DEB_YOUTUBE_DL_V ?= $(YOUTUBE_DL_VERSION)

    $(call PACK,youtube-dl,DEB_YOUTUBE_DL_V)

The example above packs files relating to `youtube-dl` (which would be
in `build_dist/youtube-dl`), and replaces `DEB_YOUTUBE_DL_V` in the
control file with the version number assigned to that variable.
