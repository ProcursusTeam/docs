# `GITHUB_ARCHIVE`

This function is used to download a compressed tarball archive of any
Github repository (as long as it's public).

The compressed tarball can include files of a project, which can be
used to compile the project. The function is often used alongside
[`EXTRACT_TAR`](EXTRACT_TAR).

## Arguements

The following table showcases documentation for specific arguments of
the function

| Index | Status | Description |
|-------|--------|-------------|
| 1 | Required | Github user or organization from which the project comes from |
| 2 | Required | Project/repository name from which an archive will be made from. This is also used as the filename for the downloaded tarball unless a 5th argument is given |
| 3 | Required | Specific argument which appends the given version number to the downloaded tarball filename |
| 4 | Required | Release tag, branch name, or commit hash from which an archive will be made from |
| 5 | Not required | Specifies a different name for the downloaded tarball. Use this if the tarball name is different than the repository name specified in the 3rd argument |

## Examples

There are many ways in which you can manipulate this specific function
in your Makefile. The examples below showcase most instances

### Tag example

    APPUNINST_VERSION := 1.0.0

    $(call GITHUB_ARCHIVE,quiprr,appuninst,$(APPUNINST_VERSION),v$(APPUNINST_VERSION))

    # URL:     https://github.com/quiprr/appuninst/archive/v1.0.0.tar.gz
    # tarball: $(BUILD_SOURCE)/appuninst-1.0.0.tar.gz

### Commit example

    ZBRFIRMWARE_COMMIT := e4b7cf07bb491ecdbf08519063d7a9fa16aefdb8

    $(call GITHUB_ARCHIVE,zbrateam,Firmware,$(ZBRFIRMWARE_COMMIT),$(ZBRFIRMWARE_COMMIT))

    # URL:     https://github.com/zbrateam/Firmware/archive/e4b7cf07bb491ecdbf08519063d7a9fa16aefdb8.tar.gz
    # tarball: $(BUILD_SOURCE)/Firmware-e4b7cf07bb491ecdbf08519063d7a9fa16aefdb8.tar.gz

### Branch example

    $(call GITHUB_ARCHIVE,tihmstar,jssy,master,master)

    # URL:     https://github.com/tihmstar/jssy/archive/master.tar.gz
    # tarball: $(BUILD_SOURCE)/jssy-master.tar.gz

### Different tarball name example

    GHOSTBIN_COMMIT := 0e0a3b72c3379e51bf03fe676af3a74a01239a47

    $(call GITHUB_ARCHIVE,DHowett,spectre,v$(GHOSTBIN_COMMIT),$(GHOSTBIN_COMMIT),ghostbin)

    # URL:     https://github.com/DHowett/spectre/archive/0e0a3b72c3379e51bf03fe676af3a74a01239a47.tar.gz
    # tarball: $(BUILD_SOURCE)/ghostbin-v0e0a3b72c3379e51bf03fe676af3a74a01239a47.tar.gz
