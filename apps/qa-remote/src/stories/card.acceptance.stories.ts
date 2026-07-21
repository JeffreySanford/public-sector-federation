import { Component } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { PublicCardComponent, PublicTagComponent } from '@public-sector/ui-patterns';

@Component({
  selector: 'public-card-acceptance-story',
  standalone: true,
  imports: [PublicCardComponent, PublicTagComponent],
  template: `
    <main class="storybook-shell">
      <header><ps-tag value="Acceptance: Card" tone="info" /><h1>Card supporting surfaces</h1></header>
      <section class="card-grid">
        <ps-card header="Metric card" subheader="Operational snapshot"><strong class="metric">94%</strong><p>SLA compliance over the trailing 30 days.</p><ps-tag value="On track" tone="success" /></ps-card>
        <ps-card header="Long-content card" subheader="Projection and wrapping"><p>This card includes longer body copy to check spacing, line-height, wrapping, and projected content under shared tokens.</p></ps-card>
        <ps-card header="Empty state card" subheader="Supporting route content"><div class="empty"><i class="pi pi-inbox"></i><strong>No pending reviews</strong><p>Fallback copy exists outside card-only layouts.</p></div></ps-card>
      </section>
    </main>
  `,
  styles: `.storybook-shell{display:grid;gap:1rem;max-width:72rem;margin:0 auto}.card-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1rem}.metric{font-size:2rem}.empty{display:grid;gap:.5rem}`,
})
class CardAcceptanceStoryComponent {}

const meta: Meta<CardAcceptanceStoryComponent> = {
  title: 'Design System/Interaction Stories/Card',
  component: CardAcceptanceStoryComponent,
  render: () => ({ moduleMetadata: { imports: [CardAcceptanceStoryComponent] }, template: '<public-card-acceptance-story />' }),
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<CardAcceptanceStoryComponent>;
export const SupportingSurfaces: Story = {};
export const LongContentAndEmpty: Story = { args: {} };
