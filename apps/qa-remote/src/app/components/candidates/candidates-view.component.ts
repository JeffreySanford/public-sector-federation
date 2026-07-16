import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, type SafeResourceUrl } from '@angular/platform-browser';
import {
  PublicButtonComponent,
  PublicTagComponent,
  PublicUpButtonComponent,
  type PublicUpButtonAppearance,
  type PublicUpButtonIcon,
  type PublicUpButtonIntent,
} from '@public-sector/ui-patterns';
import {
  PublicSectorThemeService,
  type PublicSectorThemeVariant,
} from '@public-sector/primeng-preset';
import {
  candidateLinks,
  UP_BUTTON_STORYBOOK_EMBED_URL,
  UP_BUTTON_STORYBOOK_URL,
} from './candidate-links';

type CandidateStatus = 'Complete' | 'In review' | 'Pending' | 'Blocked';
type ButtonImplementation = 'stable' | 'candidate';

interface ComparisonScenario {
  id: string;
  label: string;
  description: string;
  buttonLabel: string;
  icon?: PublicUpButtonIcon;
  intent: PublicUpButtonIntent;
  appearance: PublicUpButtonAppearance;
  disabled?: boolean;
  loading?: boolean;
}

interface LifecycleRow {
  evidence: string;
  currentState: string;
  status: CandidateStatus;
}

interface ThemeMatrixRow {
  variant: PublicSectorThemeVariant;
  mode: 'Light' | 'Dark';
  validation: string;
}

@Component({
  selector: 'public-candidates-view',
  standalone: true,
  imports: [
    CommonModule,
    PublicButtonComponent,
    PublicTagComponent,
    PublicUpButtonComponent,
  ],
  templateUrl: './candidates-view.component.html',
  styleUrl: './candidates-view.component.css',
})
export class CandidatesViewComponent {
  private readonly sanitizer = inject(DomSanitizer);
  readonly theme = inject(PublicSectorThemeService);

  readonly label = signal('Review application');
  readonly intent = signal<PublicUpButtonIntent>('primary');
  readonly appearance = signal<PublicUpButtonAppearance>('solid');
  readonly disabled = signal(false);
  readonly loading = signal(false);
  readonly stableActivations = signal(0);
  readonly candidateActivations = signal(0);
  readonly showStorybookPreview = signal(false);

  readonly intents: readonly PublicUpButtonIntent[] = ['primary', 'secondary', 'destructive'];

  readonly appearances: readonly PublicUpButtonAppearance[] = [
    'solid',
    'outlined',
    'text',
  ];

  readonly themeVariants: readonly PublicSectorThemeVariant[] = [
    'neutral',
    'vibrant',
    'pastel',
  ];

  readonly storybookUrl = UP_BUTTON_STORYBOOK_URL;
  readonly storybookEmbedUrl: SafeResourceUrl =
    this.sanitizer.bypassSecurityTrustResourceUrl(
      UP_BUTTON_STORYBOOK_EMBED_URL,
    );
  readonly links = candidateLinks;

  readonly scenarios: readonly ComparisonScenario[] = [
    {
      id: 'primary',
      label: 'Primary solid',
      description: 'Default high-emphasis action.',
      buttonLabel: 'Primary action',
      icon: 'check',
      intent: 'primary',
      appearance: 'solid',
    },
    {
      id: 'secondary',
      label: 'Secondary solid',
      description: 'Supporting action using the secondary treatment.',
      buttonLabel: 'Secondary action',
      icon: 'arrow-right',
      intent: 'secondary',
      appearance: 'solid',
    },
    {
      id: 'outlined',
      label: 'Outlined',
      description: 'Lower-emphasis action with a visible boundary.',
      buttonLabel: 'Download report',
      icon: 'download',
      intent: 'primary',
      appearance: 'outlined',
    },
    {
      id: 'text',
      label: 'Text',
      description: 'Lowest-emphasis action without a persistent boundary.',
      buttonLabel: 'View details',
      icon: 'info-circle',
      intent: 'secondary',
      appearance: 'text',
    },
    {
      id: 'disabled',
      label: 'Disabled',
      description: 'Unavailable action that cannot be activated.',
      buttonLabel: 'Unavailable action',
      icon: 'lock',
      intent: 'primary',
      appearance: 'solid',
      disabled: true,
    },
    {
      id: 'loading',
      label: 'Loading',
      description: 'In-progress action that prevents duplicate activation.',
      buttonLabel: 'Submitting',
      icon: 'send',
      intent: 'primary',
      appearance: 'solid',
      loading: true,
    },
    {
      id: 'long-label',
      label: 'Long label',
      description: 'Stress state for wrapping and responsive sizing.',
      buttonLabel:
        'Submit housing assistance eligibility review for North Region queue',
      icon: 'check',
      intent: 'primary',
      appearance: 'outlined',
    },
    {
      id: 'error',
      label: 'Error tone',
      description: 'Destructive or error-recovery action vocabulary.',
      buttonLabel: 'Resolve error',
      icon: 'times-circle',
      intent: 'destructive',
      appearance: 'solid',
    },
  ];

  readonly lifecycleRows: readonly LifecycleRow[] = [
    {
      evidence: 'Candidate wrapper',
      currentState: '`ps-up-button` exists in `@public-sector/ui-patterns`.',
      status: 'Complete',
    },
    {
      evidence: 'UP Button token values',
      currentState:
        'Sanitized/sample mappings are working; approved enterprise Button values are still required.',
      status: 'Blocked',
    },
    {
      evidence: 'Storybook variants',
      currentState:
        'Dedicated candidate stories, matrices, interaction harness, and comparison story exist.',
      status: 'Complete',
    },
    {
      evidence: 'QA direct remote',
      currentState:
        'Candidates view provides side-by-side runtime validation on port 4204.',
      status: 'In review',
    },
    {
      evidence: 'Shell-composed QA',
      currentState:
        'The same Candidates view must pass when mounted through the `/qa` shell route.',
      status: 'In review',
    },
    {
      evidence: 'Zeroheight Button page',
      currentState:
        'Portal is available; component-specific curated guidance is not yet published.',
      status: 'Pending',
    },
    {
      evidence: 'Figma Button source',
      currentState:
        'Approved UP Button component and variable URLs still need to be recorded.',
      status: 'Pending',
    },
    {
      evidence: 'Promotion decision',
      currentState:
        'Existing `ps-button` remains stable until design, API, accessibility, and runtime gates pass.',
      status: 'Blocked',
    },
  ];

  readonly themeMatrix: readonly ThemeMatrixRow[] = this.themeVariants.flatMap(
    (variant) => [
      {
        variant,
        mode: 'Light' as const,
        validation: 'Review stable and candidate Buttons with the light token mode.',
      },
      {
        variant,
        mode: 'Dark' as const,
        validation: 'Review stable and candidate Buttons with `.p-dark` enabled.',
      },
    ],
  );

  readonly definitionOfDone = [
    'Current ps-button remains unchanged and usable.',
    'Candidate ps-up-button renders beside the stable Button with identical comparison inputs.',
    'Neutral, vibrant, and pastel variants work in light and dark modes.',
    'Storybook comparison and source links remain available when the iframe is unavailable.',
    'Zeroheight and Figma publication states are visible without becoming runtime dependencies.',
    'Keyboard, focus, disabled, loading, long-label, and responsive behavior are reviewed.',
    'Direct QA remote and shell-composed Playwright checks pass.',
    'Promotion remains blocked until verified UP Button token values replace sample assumptions.',
  ] as const;

  setLabel(value: string): void {
    this.label.set(value.trimStart());
  }

  setIntent(value: string): void {
    if (this.intents.includes(value as PublicUpButtonIntent)) {
      this.intent.set(value as PublicUpButtonIntent);
    }
  }

  setAppearance(value: string): void {
    if (this.appearances.includes(value as PublicUpButtonAppearance)) {
      this.appearance.set(value as PublicUpButtonAppearance);
    }
  }

  setDisabled(disabled: boolean): void {
    this.disabled.set(disabled);
  }

  setLoading(loading: boolean): void {
    this.loading.set(loading);
  }

  setThemeVariant(variant: PublicSectorThemeVariant): void {
    this.theme.setVariant(variant);
  }

  setDarkMode(isDark: boolean): void {
    this.theme.setDarkMode(isDark);
  }

  recordActivation(implementation: ButtonImplementation): void {
    if (implementation === 'stable') {
      this.stableActivations.update((count) => count + 1);
      return;
    }

    this.candidateActivations.update((count) => count + 1);
  }

  toggleStorybookPreview(): void {
    this.showStorybookPreview.update((visible) => !visible);
  }

  statusClass(status: CandidateStatus): string {
    if (status === 'Complete') {
      return 'candidate-status--complete';
    }
    if (status === 'In review') {
      return 'candidate-status--review';
    }
    if (status === 'Blocked') {
      return 'candidate-status--blocked';
    }
    return 'candidate-status--pending';
  }
}
