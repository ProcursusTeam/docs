# HAS_COMMAND

Determine the existence of a command and if yes, returns 1.

## Arguments

| Index | Status | Description |
|-------|--------|-------------|
| 1 | Required | The command to test for existence |

# Example

```makefile
ifneq ($(call HAS_COMMAND,wget),1)
$(error Install wget)
endif
```
