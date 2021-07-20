# Makefile Variables
This page documents specific build flags that can be used in order to build the packages on Procursus, and can all be found within the main ``Makefile``. The table below showcases build flags you can pass as options when using Procursus build commands. 

| Variable | Required | Function | Example |
|----------|----------|----------|---------|
| ``MEMO_TARGET`` | Yes | Specific architecture type that packages are built in | ``iphoneos-arm64`` | 
| ``MEMO_CFVER`` | Yes | CoreFoundation value of the minimum *OS version to compile for | ``1700``, which represents the CoreFoundation version that corresponds to iOS 14 |
| ``NO_PGP`` | No | Specifies whether GPG signature checks on tarballs should be skipped. Set this option to 1 to enable it | ``NO_PGP=1`` |
| ``MEMO_QUIET`` | No | Allows unnecessary warnings to be silenced. Set this option to 1 to enable it | ``MEMO_QUIET=1`` |
| ``TARGET_SYSROOT`` | Yes | Specifies the ``PATH`` of your iOS SDK. Check the ``Makefile`` to see what each supported build system defaults to | ``/usr/share/SDKs/iPhoneOS.sdk`` on iOS |
| ``MACOSX_SYSROOT`` | Yes | Specifies the ``PATH`` of your macOS SDK. Check the ``Makefile`` to see what each supported build system defaults to | ``/usr/share/SDKs/MacOSX.sdk`` on iOS |
| ``BUILD_ROOT`` | No | Allows for specific packages or architecture suits to sent to a different place once compiled, rather than within the Git respository itself | This can be any path, as long as the directory exists |
| ``MEMO_FORCE_LTO`` | No | On macOS, LTO is enabled automatically, however on Linux and FreeBSD, it must be explicitly enabled in cctools-port. | ``MEMO_FORCE_LTO=1`` |
| ``MEMO_ALT_LTO_LIB`` | No | Specify an alternative libLTO.{so,dylib} path that will be passed to the linker with ``-lto_library``. | ``/usr/local/llvm11/lib/libLTO.so`` |
