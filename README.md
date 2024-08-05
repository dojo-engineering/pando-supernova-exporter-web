# Your Exporter

This exporter will export design tokens for use in pando-web.

## Exporter Features

## Example of Output

This exporter will generate one output file for: color, density, and typography.

```ts
export const lightColor = {
  bg: {
    control: {
      default: "#fefefe",
      hover: "#fefefe",
      focus: "#fefefe",
      pressed: "#f1f1ec",
      disabled: "#f1f1ec",
      selected: {
        default: "#fefefe",
        hover: "#645e58",
        focus: "#ffc0cb",
        pressed: "#f1f1ec",
        disabled: "#f1f1ec",
        counter: "#e0e0dc",
      },
    },
  },
};
```

## To do

General tidy up of exporter
