import designTokens from './design-tokens.json';
import zeroheightTokens from './zeroheight-tokens.json';

type TokenLeaf = {
  $value: string;
};

type TokenValueTree<T> = T extends TokenLeaf
  ? string
  : T extends Record<string, unknown>
    ? { readonly [K in keyof T]: TokenValueTree<T[K]> }
    : never;

const valueOf = (token: TokenLeaf): string => token.$value;

const isTokenLeaf = (value: unknown): value is TokenLeaf =>
  typeof value === 'object' &&
  value !== null &&
  '$value' in value &&
  typeof (value as TokenLeaf).$value === 'string';

const valuesOf = <T extends Record<string, unknown>>(tokens: T): TokenValueTree<T> =>
  Object.fromEntries(
    Object.entries(tokens).map(([name, token]) => [
      name,
      isTokenLeaf(token) ? valueOf(token) : valuesOf(token as Record<string, unknown>),
    ]),
  ) as TokenValueTree<T>;

const neutralLight = designTokens.theme['neutral-light'].ps;
const neutralDark = designTokens.theme['neutral-dark'].ps;

export { designTokens, zeroheightTokens };

export const primitive = {
  ...valuesOf(designTokens.primitive.color),
} as const;

export const semantic = {
  light: {
    surfaceBackground: valueOf(neutralLight.surface.background),
    surfaceCard: valueOf(neutralLight.surface.card),
    surfaceBorder: valueOf(neutralLight.surface.border),
    textPrimary: valueOf(neutralLight.text.primary),
    textSecondary: valueOf(neutralLight.text.secondary),
    primaryBackground: valueOf(neutralLight.primary.background),
    primaryForeground: valueOf(neutralLight.primary.foreground),
    focusRingColor: valueOf(neutralLight.focus.ring.color),
    dangerColor: valueOf(neutralLight.danger.color),
    successColor: valueOf(neutralLight.success.color),
  },
  dark: {
    surfaceBackground: valueOf(neutralDark.surface.background),
    surfaceCard: valueOf(neutralDark.surface.card),
    surfaceBorder: valueOf(neutralDark.surface.border),
    textPrimary: valueOf(neutralDark.text.primary),
    textSecondary: valueOf(neutralDark.text.secondary),
    primaryBackground: valueOf(neutralDark.primary.background),
    primaryForeground: valueOf(neutralDark.primary.foreground),
    focusRingColor: valueOf(neutralDark.focus.ring.color),
    dangerColor: valueOf(neutralDark.danger.color),
    successColor: valueOf(neutralDark.success.color),
  },
} as const;

export const spacing = {
  ...valuesOf(designTokens.primitive.space),
} as const;

export const radius = {
  sm: valueOf(designTokens.primitive.radius.md),
  md: valueOf(designTokens.primitive.radius.md),
  lg: valueOf(designTokens.primitive.radius.lg),
  xl: valueOf(designTokens.primitive.radius.lg),
} as const;

export const typography = {
  fontFamily: valueOf(designTokens.primitive.typography.fontFamily),
} as const;

export default designTokens;
