import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';
import { primitive, radius, semantic, typography } from '@public-sector/tokens';

const publicSectorPreset = {
  primitive: {
    blue: primitive.blue,
    slate: primitive.slate,
    rose: primitive.rose,
    green: primitive.green,
  },
  semantic: {
    primary: {
      50: '{blue.50}',
      100: '{blue.100}',
      200: '{blue.200}',
      300: '{blue.300}',
      400: '{blue.400}',
      500: '{blue.500}',
      600: '{blue.600}',
      700: '{blue.700}',
      800: '{blue.800}',
      900: '{blue.900}',
      950: '{blue.950}',
    },
    colorScheme: {
      light: {
        surface: primitive.slate,
        primary: {
          color: semantic.light.primaryBackground,
          inverseColor: semantic.light.primaryForeground,
          hoverColor: primitive.blue[700],
          activeColor: primitive.blue[800],
        },
        text: {
          color: semantic.light.textPrimary,
          mutedColor: semantic.light.textSecondary,
        },
        content: {
          background: semantic.light.surfaceCard,
          borderColor: semantic.light.surfaceBorder,
        },
      },
      dark: {
        surface: primitive.slate,
        primary: {
          color: semantic.dark.primaryBackground,
          inverseColor: semantic.dark.primaryForeground,
          hoverColor: primitive.blue[300],
          activeColor: primitive.blue[200],
        },
        text: {
          color: semantic.dark.textPrimary,
          mutedColor: semantic.dark.textSecondary,
        },
        content: {
          background: semantic.dark.surfaceCard,
          borderColor: semantic.dark.surfaceBorder,
        },
      },
    },
    focusRing: {
      width: '2px',
      style: 'solid',
      color: '{primary.color}',
      offset: '2px',
    },
    borderRadius: {
      none: '0',
      xs: radius.sm,
      sm: radius.sm,
      md: radius.md,
      lg: radius.lg,
      xl: radius.xl,
    },
    typography: {
      fontFamily: typography.fontFamily,
    },
  },
  components: {
    card: {
      root: {
        borderRadius: radius.lg,
      },
    },
    datatable: {
      headerCell: {
        background: '{surface.100}',
      },
    },
  },
};

const preset = definePreset(Aura, publicSectorPreset as Parameters<typeof definePreset>[1]);

export default preset;
