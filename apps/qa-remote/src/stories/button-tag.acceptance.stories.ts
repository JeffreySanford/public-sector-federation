import { Component } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { PublicButtonComponent, PublicTagComponent } from '@public-sector/ui-patterns';

@Component({
  selector: 'public-button-tag-acceptance-story',
  standalone: true,
  imports: [PublicButtonComponent, PublicTagComponent],
  template: `
    <main class="storybook-shell">
      <header><ps-tag value="Acceptance: Button / Tag" tone="info" /><h1>Button and tag states</h1></header>
      <section class="inline-row">
        <ps-button label="Primary action" icon="pi pi-check" />
        <ps-button label="Outlined action" icon="pi pi-download" [outlined]="true" />
        <ps-button label="Text action" icon="pi pi-info-circle" [text]="true" />
        <ps-button label="Disabled action" icon="pi pi-lock" [disabled]="true" />
      </section>
      <section class="inline-row">
        <ps-tag value="On track" tone="success" />
        <ps-tag value="Watch" tone="warn" />
        <ps-tag value="Delayed" tone="danger" />
        <ps-tag value="Draft" tone="secondary" />
      </section>
    </main>
  `,
  styles: `.storybook-shell{display:grid;gap:1rem;max-width:72rem;margin:0 auto}.inline-row{display:flex;flex-wrap:wrap;gap:.75rem;align-items:center}`,
})
class ButtonTagAcceptanceStoryComponent {}

@Component({
  selector: 'public-button-tag-stress-story',
  standalone: true,
  imports: [PublicButtonComponent, PublicTagComponent],
  template: `
    <main class="storybook-shell">
      <header><ps-tag value="Stress: Button / Tag" tone="warn" /><h1>Long labels and dense text</h1></header>
      <section class="inline-row">
        <ps-button label="Submit housing assistance eligibility review for North Region queue" icon="pi pi-check" [outlined]="true" />
        <ps-tag value="Awaiting supervisor review after document resubmission" tone="warn" />
        <ps-tag value="Delayed due to upstream identity verification backlog" tone="danger" />
      </section>
    </main>
  `,
  styles: `.storybook-shell{display:grid;gap:1rem;max-width:72rem;margin:0 auto}.inline-row{display:flex;flex-wrap:wrap;gap:.75rem;align-items:center}`,
})
class ButtonTagStressStoryComponent {}

@Component({
  selector: 'public-button-contract-story',
  standalone: true,
  imports: [PublicButtonComponent],
  template: `
    <main class="storybook-shell">
      <h1>Stable Button contract migration</h1>
      <section>
        <h2>Preferred API</h2>
        <ps-button label="Save changes" intent="primary" appearance="solid" (activated)="preferred = preferred + 1" />
        <ps-button label="Cancel" intent="secondary" appearance="text" />
        <ps-button label="Delete record" intent="destructive" appearance="outlined" />
        <output>Preferred activations: {{ preferred }}</output>
      </section>
      <section>
        <h2>Deprecated compatibility API</h2>
        <ps-button label="Legacy outlined" tone="warning" [outlined]="true" (buttonClick)="legacy = legacy + 1" />
        <output>Legacy activations: {{ legacy }}</output>
      </section>
    </main>
  `,
  styles: `.storybook-shell{display:grid;gap:1.5rem;max-width:72rem;margin:0 auto}.storybook-shell section{display:flex;flex-wrap:wrap;gap:.75rem;align-items:center}`,
})
class ButtonContractStoryComponent {
  preferred = 0;
  legacy = 0;
}

const meta: Meta<ButtonTagAcceptanceStoryComponent> = {
  title: 'Design System/Acceptance/Button Tag',
  render: () => ({ moduleMetadata: { imports: [ButtonTagAcceptanceStoryComponent] }, template: '<public-button-tag-acceptance-story />' }),
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<ButtonTagAcceptanceStoryComponent>;
export const States: Story = {};
export const LongLabelsAndDenseText: StoryObj<ButtonTagStressStoryComponent> = {
  render: () => ({ moduleMetadata: { imports: [ButtonTagStressStoryComponent] }, template: '<public-button-tag-stress-story />' }),
};
export const PreferredAndLegacyContracts: StoryObj<ButtonContractStoryComponent> = {
  render: () => ({ moduleMetadata: { imports: [ButtonContractStoryComponent] }, template: '<public-button-contract-story />' }),
};
