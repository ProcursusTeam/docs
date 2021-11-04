# How to make a makefile

A makefile in Procursus generally should download, build and pack a project.

## Before setup

All makefiles must start with

```makefile
ifneq ($(PROCURSUS),1)
$(error Use the main Makefile)
endif

```

For a makefile that builds `foo`, it must have the following targets:

- `foo-setup` which download, extracts and optionally patch the source code
- `foo` which builds the actual thing and install it to build_stage
- `foo-package` which sign and make debs

Before writing the rules of the targets, we first need to
add the name of your project to either `SUBPROJECTS` (you should use this),
or `STRAPPROJECTS` which will be included in the base bootstrap. This document
will only discuss a `SUBPROJECTS` addition.

For example, for `foo.mk`,

```makefile
SUBPROJECTS += foo
```

Declare the version,

```makefile
FOO_VERSION := 4.20.69
```

Declare the actual version of the .debs

```makefile
DEB_FOO_V ?= $(FOO_VERSION)
```

Your makefile should look something like this:

```makefile
ifneq ($(PROCURSUS),1)
$(error Use the main Makefile)
endif

SUBPROJECTS  += foo
FOO_VERSION  := 4.20.69
DEB_FOO_V    ?= $(FOO_VERSION)
```

## Setup

Declare the `foo-setup` target, which must depend on the `setup` target.

```makefile
foo-setup: setup
```

We need to download the source code from a URL to build_source.

```makefile
foo-setup:
	wget -q -nc -P$(BUILD_SOURCE) https://example.com/foo/foo-$(FOO_VERSION).tar.gz
```

Next, we will use the `EXTRACT_TAR` function to extract it. Note that if you
need to extract it using some other method, it must be extracted to inside of
`$(BUILD_WORK)/project-name`

```makefile
foo-setup:
	wget -q -nc -P$(BUILD_SOURCE) https://example.com/foo/foo-$(FOO_VERSION).tar.gz
	$(call EXTRACT_TAR,foo-$(FOO_VERSION).tar.gz,foo-$(FOO_VERSION),foo)
```

The first argument is the downloaded tarball name in build_source, second
argument is the folder extracted from the tarball, while the third argument
is the folder name where tarball files are copied to under `$(BUILD_WORK)`

The makefile now look something like this:

```makefile
ifneq ($(PROCURSUS),1)
$(error Use the main Makefile)
endif

SUBPROJECTS  += foo
FOO_VERSION  := 4.20.69
DEB_FOO_V    ?= $(FOO_VERSION)

foo-setup:
	wget -q -nc -P$(BUILD_SOURCE) https://example.com/foo/foo-$(FOO_VERSION).tar.gz
	$(call EXTRACT_TAR,foo-$(FOO_VERSION).tar.gz,foo-$(FOO_VERSION),foo)
```

# Build

The name of the target that actual builds the project is the name of the project.
It should depend on project_name-setup *first* then the project names of the build
depends.

Let's say that `foo` needs `libbar` to be built, and `libbar` is already in Procursus:

The target will look something like this:

```makefile
foo: foo-setup libbar
```

This target should compile the project and install it inside of
 `$(BUILD_STAGE)/project_name`, then call `$(call AFTER_BUILD)`. If the project contains
libraries, it should call `$(call AFTER_BUILD,copy)` instead so that the libraries
could be used by something else in Procursus when building.

In Procursus, `$(MEMO_PREFIX)` is equivalent to `/` while `$(MEMO_SUB_PREFIX)` is
equivalent to `/usr`.

[Default flags/variables](./Variables.md) are available for common build systems
which will handle it for you.

Assuming that `foo` uses autotools, and contains shared libraries and tools, we first

configure it

```makefile
foo: foo-setup libbar
	cd $(BUILD_WORK)/foo && ./configure -C \
		$(DEFAULT_CONFIGURE_FLAGS)
```

build it

```makefile
foo: foo-setup libbar
	cd $(BUILD_WORK)/foo && ./configure -C \
		$(DEFAULT_CONFIGURE_FLAGS)
	+$(MAKE) -C $(BUILD_WORK)/foo
```

install it to `$(BUILD_STAGE)/foo`

```makefile
foo: foo-setup libbar
	cd $(BUILD_WORK)/foo && ./configure -C \
		$(DEFAULT_CONFIGURE_FLAGS)
	+$(MAKE) -C $(BUILD_WORK)/foo
	+$(MAKE) -C $(BUILD_WORK)/foo install \
		DESTDIR="$(BUILD_STAGE)/foo"
```

call `AFTER_BUILD` and therefore copy to `BUILD_BASE`

```makefile
foo: foo-setup libbar
	cd $(BUILD_WORK)/foo && ./configure -C \
		$(DEFAULT_CONFIGURE_FLAGS)
	+$(MAKE) -C $(BUILD_WORK)/foo
	+$(MAKE) -C $(BUILD_WORK)/foo install \
		DESTDIR="$(BUILD_STAGE)/foo"
	$(call AFTER_BUILD,copy)
```

The `copy` argument makes the contents of `$(BUILD_STAGE)/foo` to be copied to
`$(BUILD_BASE)`

The makefile should now be:

```makefile
ifneq ($(PROCURSUS),1)
$(error Use the main Makefile)
endif

SUBPROJECTS  += foo
FOO_VERSION  := 4.20.69
DEB_FOO_V    ?= $(FOO_VERSION)

foo-setup:
	wget -q -nc -P$(BUILD_SOURCE) https://example.com/foo/foo-$(FOO_VERSION).tar.gz
	$(call EXTRACT_TAR,foo-$(FOO_VERSION).tar.gz,foo-$(FOO_VERSION),foo)
foo: foo-setup libbar
	cd $(BUILD_WORK)/foo && ./configure -C \
		$(DEFAULT_CONFIGURE_FLAGS)
	+$(MAKE) -C $(BUILD_WORK)/foo
	+$(MAKE) -C $(BUILD_WORK)/foo install \
		DESTDIR="$(BUILD_STAGE)/foo"
	$(call AFTER_BUILD,copy)
```

## Packaging

### Debianization (Debianisation)

Please follow how Debian packages something. Even if they don't have
something, follow their convection.

Find out how they do it for `<SOMETHING>` by visiting
`https://packages.debian.org/search?keywords=<SOMETHING>&searchon=sourcenames&suite=unstable&section=all`

For example, for `libcdio` the search will be:
`https://packages.debian.org/search?keywords=libcdio&searchon=sourcenames&suite=unstable&section=all`

### Control files

To package, you also need [control](https://www.debian.org/doc/debian-policy/ch-controlfields.html) files which are basically information for
the debs created.

`@SOMETHING@`s will be replaced with their actual value when making debs via
the `PACK` function.

A control file for `foo` for Procursus could look like this:

```
Package: foo
Maintainer: @DEB_MAINTAINER@
Architecture: @DEB_ARCH@
Version: @DEB_FOO_V@
Depends: libbar1 (>= 3.2), libfoo2 (>= 4.1)
Replaces: libfoo1
Section: Utilities
Description: a short single line description
 This is the extended description, it can contain multiple lines. It should
 begin with a space on every line like this. In order to increase readability,
 the text should be wrapped. In order to make a paragraph, use a line with 
 only a space and a dot like this:
 .
 Each line must contain a non-whitespace character and you should not use
 TAB characters as they have unpredictable effects. Do not make lines
 containing a space, a dot and some more characters either.
  In order to make something to be displayed verbatim, indent it with two o
  r more spaces. If the display cannot be panned horizontally, the displayi
  ng program will line wrap them “hard” (i.e., without taking account of wo
  rd breaks). If it can they will be allowed to trail off to the right.
```

### Making .debs with makefile

This is the task of the `project_name-package:` target. It must depend on
`project_name`

For `foo`, it will be

```makefile
foo-package: foo
```

Let's say that foo has the following paths under `$(BUILD_STAGE)/foo`:

```makefile
$(MEMO_PREFIX)/
$(MEMO_PREFIX)/etc
$(MEMO_PREFIX)/etc/foo.conf
$(MEMO_PREFIX)$(MEMO_SUB_PREFIX)
$(MEMO_PREFIX)$(MEMO_SUB_PREFIX)/bin
$(MEMO_PREFIX)$(MEMO_SUB_PREFIX)/bin/foo
$(MEMO_PREFIX)$(MEMO_SUB_PREFIX)/include
$(MEMO_PREFIX)$(MEMO_SUB_PREFIX)/include/foo.h
$(MEMO_PREFIX)$(MEMO_SUB_PREFIX)/lib
$(MEMO_PREFIX)$(MEMO_SUB_PREFIX)/lib/libfoo.dylib -> libfoo.2.dylib
$(MEMO_PREFIX)$(MEMO_SUB_PREFIX)/lib/libfoo.2.dylib
$(MEMO_PREFIX)$(MEMO_SUB_PREFIX)/lib/libfoo.a
$(MEMO_PREFIX)$(MEMO_SUB_PREFIX)/share
$(MEMO_PREFIX)$(MEMO_SUB_PREFIX)/share/man
$(MEMO_PREFIX)$(MEMO_SUB_PREFIX)/share/man1
$(MEMO_PREFIX)$(MEMO_SUB_PREFIX)/share/man/man1/foo.1.zst
```

(`AFTER_BUILD` changes man page compression to zst)

Note that comments are required for this target.

Cleanup & create directories of package names under `$(BUILD_DIST)`

```makefile
	# foo.mk Package Structure
	rm -rf $(BUILD_DIST)/{foo,libfoo{1,-dev}}
	mkdir -p $(BUILD_DIST)/{foo,libfoo{1,-dev}}/$(MEMO_PREFIX)$(MEMO_SUB_PREFIX)
	mkdir -p $(BUILD_DIST)/libfoo{1,-dev}/$(MEMO_PREFIX)$(MEMO_SUB_PREFIX)/lib
```

Copy files

```makefile
	# foo.mk Prep foo
	cp -a $(BUILD_STAGE)/foo/$(MEMO_PREFIX)/etc $(BUILD_DIST)/foo/$(MEMO_PREFIX)
	cp -a $(BUILD_STAGE)/foo/$(MEMO_PREFIX)$(MEMO_SUB_PREFIX)/{bin,share} $(BUILD_DIST)/foo/$(MEMO_PREFIX)$(MEMO_SUB_PREFIX)
	
	# foo.mk Prep libfoo2
	cp -a $(BUILD_STAGE)/foo/$(MEMO_PREFIX)$(MEMO_SUB_PREFIX)/libfoo.2.dylib $(BUILD_DIST)/libfoo2/$(MEMO_PREFIX)$(MEMO_SUB_PREFIX)/lib
	
	# foo.mk Prep libfoo-dev
	cp -a $(BUILD_STAGE)/foo/$(MEMO_PREFIX)$(MEMO_SUB_PREFIX)/libfoo.{a,dylib} $(BUILD_DIST)/libfoo-dev/$(MEMO_PREFIX)$(MEMO_SUB_PREFIX)/lib 
	cp -a $(BUILD_STAGE)/foo/$(MEMO_PREFIX)$(MEMO_SUB_PREFIX)/include $(BUILD_DIST)/libfoo-dev/$(MEMO_PREFIX)$(MEMO_SUB_PREFIX)
	
```

Next, we need to sign for any packages that contain Mach-O binaries. In
this case it is `foo` and `libfoo2`. The `SIGN` function is used. The
first argument is the directory name under $(BUILD_DIST)  and the second
argument is the entitlement file under `$(BUILD_MISC)/entitlements`

```makefile
	# foo.mk Sign
	$(call SIGN,foo,general.xml)
	$(call SIGN,libfoo2,general.xml)
```

Now, make the actual .debs! The `PACK` function takes two arguments:
The first argument is the directory name under `$(BUILD_DIST)` while
the second argument is the name of the variable that holds the
package version. (`DEB_FOO_V` in this case)

```makefile
	# foo.mk Make .debs
	$(call PACK,foo,DEB_FOO_V)
	$(call PACK,libfoo2,DEB_FOO_V)
	$(call PACK,libfoo-dev,DEB_FOO_V)
	
```

Clean up.

```makefile
	# foo.mk Build Cleanup
	rm -rf $(BUILD_DIST)/{foo,libfoo{1,-dev}}

```

Add a `.PHONY` line.

```makefile
.PHONY foo foo-package
```

Then, well technically you are done.

The makefile now looks like:

```makefile
ifneq ($(PROCURSUS),1)
$(error Use the main Makefile)
endif

SUBPROJECTS  += foo
FOO_VERSION  := 4.20.69
DEB_FOO_V    ?= $(FOO_VERSION)

foo-setup:
	wget -q -nc -P$(BUILD_SOURCE) https://example.com/foo/foo-$(FOO_VERSION).tar.gz
	$(call EXTRACT_TAR,foo-$(FOO_VERSION).tar.gz,foo-$(FOO_VERSION),foo)
foo: foo-setup libbar
	cd $(BUILD_WORK)/foo && ./configure -C \
		$(DEFAULT_CONFIGURE_FLAGS)
	+$(MAKE) -C $(BUILD_WORK)/foo
	+$(MAKE) -C $(BUILD_WORK)/foo install \
	        DESTDIR="$(BUILD_STAGE)/foo"
	$(call AFTER_BUILD,copy)

foo-package: foo
	# foo.mk Package Structure
	rm -rf $(BUILD_DIST)/{foo,libfoo{1,-dev}}
	mkdir -p $(BUILD_DIST)/{foo,libfoo{1,-dev}}/$(MEMO_PREFIX)$(MEMO_SUB_PREFIX)
	mkdir -p $(BUILD_DIST)/libfoo{1,-dev}/$(MEMO_PREFIX)$(MEMO_SUB_PREFIX)/lib
	
	# foo.mk Prep foo
	cp -a $(BUILD_STAGE)/foo/$(MEMO_PREFIX)/etc $(BUILD_DIST)/foo/$(MEMO_PREFIX)
	cp -a $(BUILD_STAGE)/foo/$(MEMO_PREFIX)$(MEMO_SUB_PREFIX)/{bin,share} $(BUILD_DIST)/foo/$(MEMO_PREFIX)$(MEMO_SUB_PREFIX)
	
	# foo.mk Prep libfoo2
	cp -a $(BUILD_STAGE)/foo/$(MEMO_PREFIX)$(MEMO_SUB_PREFIX)/libfoo.2.dylib $(BUILD_DIST)/libfoo2/$(MEMO_PREFIX)$(MEMO_SUB_PREFIX)/lib
	
	# foo.mk Prep libfoo-dev
	cp -a $(BUILD_STAGE)/foo/$(MEMO_PREFIX)$(MEMO_SUB_PREFIX)/libfoo.{a,dylib} $(BUILD_DIST)/libfoo-dev/$(MEMO_PREFIX)$(MEMO_SUB_PREFIX)/lib
	cp -a $(BUILD_STAGE)/foo/$(MEMO_PREFIX)$(MEMO_SUB_PREFIX)/include $(BUILD_DIST)/libfoo-dev/$(MEMO_PREFIX)$(MEMO_SUB_PREFIX)
	
	# foo.mk Sign
	$(call SIGN,foo,general.xml)
	$(call SIGN,libfoo2,general.xml)
	
	# foo.mk Make .debs
	$(call PACK,foo,DEB_FOO_V)
	$(call PACK,libfoo2,DEB_FOO_V)
	$(call PACK,libfoo-dev,DEB_FOO_V)
	
	# foo.mk Build Cleanup
	rm -rf $(BUILD_DIST)/{foo,libfoo{1,-dev}}
	
.PHONY: foo foo-package
```
