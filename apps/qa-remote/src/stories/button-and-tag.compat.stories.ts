import { Component } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { PublicButtonComponent, PublicTagComponent } from '@public-sector/ui-patterns';

@Component({
  selector: 'public-button-and-tag-compat-story',
  standalone: true,
  imports: [PublicButtonComponent, PublicTagComponent],
  template: `
    <main class="storybook-shell">
      <header>
        <ps-tag value="Acceptance: Button / Tag" tone="info" />
        <h1>Button and tag states</h1>
      </header>
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
  styles: `
    .storybook-shell { display: grid; gap: 1rem; max-width: 72rem; margin: 0 auto; }
    .inline-row { display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: center; }
  `,
})
class ButtonAndTagCompatibilityStoryComponent {}

const meta: Meta<ButtonAndTagCompatibilityStoryComponent> = {
  title: 'Design System/Acceptance/Button and Tag',
  component: ButtonAndTagCompatibilityStoryComponent,
  render: () => ({
    moduleMetadata: { imports: [ButtonAndTagCompatibilityStoryComponent] },
    template: '<public-button-and-tag-compat-story />',
  }),
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<ButtonAndTagCompatibilityStoryComponent>;

export const States: Story = {};
