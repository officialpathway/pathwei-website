# Library Structure

- `animations/` - Animation presets, transition components, and motion configs
- `constants/` - Application constants and configuration data
- `styles/` - Global styles, fonts, and theme configurations
- `utils/` - Utility functions and helpers
- `types/` - TypeScript type definitions

Follow these import patterns:

```ts
// For animations
import { animationPresets } from '@/lib/animations';

// For constants
import { siteConfig } from '@/lib/constants';

// For styles
import { fonts } from '@/lib/styles';
