# PACK

This functions creates a Debian package with ``dpkg`` or ``dm.pl`` for a given project. The table below showcases all parameters required for the function to work

## Arguments

| Index | Description |
|-------|-------------|
| 1 | Folder name where a control file might reside in for the project |
| 2 | Version variable that is in the control file that will be replaced |

The function looks for package files in ``build_dist``, and puts them accordingly, while also changing the package's control file, where specific variables are replaced, such as the maintainer of the package, and the version number

## Example

    YOUTUBE_DL_VERSION := 2021.06.06
    DEB_YOUTUBE_DL_V ?= $(YOUTUBE_DL_VERSION)

    $(call PACK,youtube-dl,DEB_YOUTUBE_DL_V)

The example above packs files relating to ``youtube-dl`` (which would be in ``build_dist/youtube-dl``), and replaces ``DEB_YOUTUBE_DL_V`` in the control file with the version number assigned to that variable.
