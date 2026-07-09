import { Component } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'public-button-tag-acceptance-story',
  standalone: true,
  imports: [ButtonModule, TagModule],
  template: `
    <section class="acceptance-story">
      <header>
        <p-tag value="Acceptance: Button / Tag" severity="info" />
        <h1>Button and tag acceptance states</h1>
        <p>Proves action hierarchy, icon spacing, severity labels, disabled states, and focusable controls.</p>
      </header>

      <div class="story-grid">
        <article>
          <h2>Action hierarchy</h2>
          <div class="inline-row">
            <p-button label="Primary action" icon="pi pi-check" />
            <p-button label="Outlined action" icon="pi pi-download" [outlined]="true" />
            <p-button label="Text action" icon="pi pi-info-circle" [text]="true" />
            <p-button label="Disabled action" icon="pi pi-lock" [disabled]="true" />
          </div>
        </article>

        <article>
          <h2>Status language</h2>
          <div class="inline-row">
            <p-tag value="On track" severity="success" />
            <p-tag value="Watch" severity="warn" />
            <p-tag value="Delayed" severity="danger" />
            <p-tag value="Draft" severity="secondary" />
          </div>
        </article>
      </div>

      <article>
        <h2>Acceptance checks</h2>
        <ul>
          <li>Icons and labels keep visible spacing.</li>
          <li>Filled and outlined actions keep contrast in all theme modes.</li>
          <li>Status labels use meaningful text, not color alone.</li>
          <li>Disabled actions remain visibly disabled without disappearing.</li>
        </ul>
      </article>
    </section>
  `,
  styles: `
    .acceptance-story {
      display: grid;
      gap: 1rem;
      max-width: 72rem;
      margin: 0 auto;
      color: var(--p-text-color);
    }

    header,
    article {
      padding: 1.25rem;
      border: 1px solid var(--p-content-border-color);
      border-radius: 1.25rem;
      background: var(--p-content-background);
      box-shadow: 0 1rem 2.5rem color-mix(in srgb, var(--ps-text-primary) 7%, transparent);
    }

    h1,
    h2 {
      margin: 0 0 0.5rem;
      letter-spacing: -0.03em;
    }

    p,
    li {
      color: var(--p-text-muted-color);
      line-height: 1.55;
    }

    .story-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1rem;
    }

    .inline-row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      align-items: center;
    }

    @media (max-width: 900px) {
      .story-grid {
        grid-template-columns: 1fr;
      }
    }
  `,
})
class ButtonTagAcceptanceStoryComponent {}

const meta: Meta<ButtonTagAcceptanceStoryComponent> = {
  title: 'Design System/Acceptance/Button and Tag',
  component: ButtonTagAcceptanceStoryComponent,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<ButtonTagAcceptanceStoryComponent>;

export const States: Story = {};

@Component({
  selector: 'public-button-tag-stress-story',
  standalone: true,
  imports: [ButtonModule, TagModule],
  template: `
    <section class="acceptance-story">
      <header>
        <p-tag value="Stress: Button / Tag" severity="warn" />
        <h1>Long labels and dense status language</h1>
        <p>Checks wrapping, overflow, and contrast when labels exceed typical action width.</p>
      </header>

      <article>
        <h2>Long action labels</h2>
        <div class="inline-row">
          <p-button
            label="Submit housing assistance eligibility review for North Region queue"
            icon="pi pi-check"
          />
          <p-button
            label="Download quarterly public-sector reporting export with audit metadata"
            icon="pi pi-download"
            [outlined]="true"
          />
        </div>
      </article>

      <article>
        <h2>Dense status labels</h2>
        <div class="inline-row">
          <p-tag value="Awaiting supervisor review after document resubmission" severity="warn" />
          <p-tag value="Delayed due to upstream identity verification backlog" severity="danger" />
        </div>
      </article>
    </section>
  `,
  styles: `
    .acceptance-story {
      display: grid;
      gap: 1rem;
      max-width: 72rem;
      margin: 0 auto;
      color: var(--p-text-color);
    }

    header,
    article {
      padding: 1.25rem;
      border: 1px solid var(--p-content-border-color);
      border-radius: 1.25rem;
      background: var(--p-content-background);
    }

    h1,
    h2 {
      margin: 0 0 0.5rem;
      letter-spacing: -0.03em;
    }

    p {
      color: var(--p-text-muted-color);
      line-height: 1.55;
    }

    .inline-row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      align-items: center;
    }
  `,
})
class ButtonTagStressStoryComponent {}

export const LongLabelsAndDenseText: StoryObj<ButtonTagStressStoryComponent> = {
  render: () => ({
    template: '<public-button-tag-stress-story />',
    moduleMetadata: {
      imports: [ButtonTagStressStoryComponent],
    },
  }),
};

