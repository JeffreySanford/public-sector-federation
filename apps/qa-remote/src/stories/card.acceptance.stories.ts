import { Component } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'public-card-acceptance-story',
  standalone: true,
  imports: [ButtonModule, CardModule, TagModule],
  template: `
    <section class="acceptance-story">
      <header>
        <p-tag value="Acceptance: Card" severity="info" />
        <h1>Card acceptance states</h1>
        <p>Proves PrimeNG cards as supporting content without making them the only route-critical wrapper.</p>
      </header>

      <div class="story-grid">
        <p-card header="Metric card" subheader="Operational snapshot">
          <strong class="metric">94%</strong>
          <p>SLA compliance over the trailing 30 days.</p>
          <p-tag value="On track" severity="success" />
        </p-card>

        <p-card header="Long-content card" subheader="Projection and wrapping">
          <p>
            This card intentionally includes longer body copy to check spacing, line-height,
            text wrapping, and content projection under the PrimeNG styled preset.
          </p>
          <p-button label="Review details" icon="pi pi-arrow-right" [outlined]="true" />
        </p-card>

        <p-card header="Empty state card" subheader="Supporting route content">
          <div class="empty-state">
            <i class="pi pi-inbox" aria-hidden="true"></i>
            <strong>No pending reviews</strong>
            <p>Route-critical copy should exist outside or alongside the card until this pattern is proven.</p>
          </div>
        </p-card>
      </div>

      <article>
        <h2>Acceptance checks</h2>
        <ul>
          <li>Card header, subheader, body, and action content render internal PrimeNG DOM.</li>
          <li>Long copy wraps without clipping or low contrast.</li>
          <li>Cards are used as supporting surfaces, not the only visible route content.</li>
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
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 1rem;
    }

    .metric {
      display: block;
      margin-bottom: 0.35rem;
      font-size: clamp(2rem, 5vw, 3.5rem);
      letter-spacing: -0.06em;
    }

    .empty-state {
      display: grid;
      gap: 0.5rem;
      justify-items: center;
      padding: 1.5rem;
      border: 1px dashed var(--p-content-border-color);
      border-radius: 1rem;
      text-align: center;
    }

    .empty-state i {
      color: var(--ps-action-text);
      font-size: 2rem;
    }

    @media (max-width: 1000px) {
      .story-grid {
        grid-template-columns: 1fr;
      }
    }
  `,
})
class CardAcceptanceStoryComponent {}

const meta: Meta<CardAcceptanceStoryComponent> = {
  title: 'Design System/Acceptance/Card',
  component: CardAcceptanceStoryComponent,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<CardAcceptanceStoryComponent>;

export const SupportingSurfaces: Story = {};

export const LongContentAndEmpty: Story = {
  name: 'Long content and empty state',
};

