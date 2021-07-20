# GITHUB_ARCHIVE
This function is used to download a Github archive of a specific project. The following table showcases documentation for parameters used by this function

## Arguments 

| Index | Status | Description |
|-------|--------|-------------|
| 1 | Required | Github user or organization from which the project comes from |
| 2 | Required | Project/repository name from which an archive will be made from. This is also used as the filename for the downloaded tarball unless paramater 5 is given |
| 3 | Required | Specific paramter which appends the given version number to the downloaded tarball filename |
| 4 | Required | Release tag, branch name, or git hash from which an archive will be made from |
| 5 | Not required | Specifies a different name for the downloaded tarball. Use this if the tarball name is different than the repository name specified in parameter 3 |

There many ways in which you can manipulate this specific function in your Makefile. The examples below showcase most instances

## Examples

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
