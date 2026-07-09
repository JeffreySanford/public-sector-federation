import {
  AfterViewInit,
  Component,
  ElementRef,
  Renderer2,
  ViewChild,
  effect,
  signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RemoteKey, loadRemoteElement } from './remote-manifest';

@Component({
  selector: 'public-remote-host',
  standalone: true,
  template: `
    <section class="remote-frame" #host></section>

    @if (!elementName()) {
      <section class="remote-frame remote-frame--loading">
        Loading remote experience...
      </section>
    }
  `,
})
export class RemoteHostComponent implements AfterViewInit {
  readonly elementName = signal<string | undefined>(undefined);

  @ViewChild('host', { static: true })
  private host?: ElementRef<HTMLElement>;

  private hasView = false;

  constructor(
    private readonly renderer: Renderer2,
    private readonly route: ActivatedRoute,
  ) {
    effect(async () => {
      const remote = this.route.snapshot.data['remote'] as RemoteKey;
      const definition = await loadRemoteElement(remote);
      this.elementName.set(definition.elementName);
      this.renderElement();
    });
  }

  ngAfterViewInit(): void {
    this.hasView = true;
    this.renderElement();
  }

  private renderElement(): void {
    const tagName = this.elementName();

    if (!this.hasView || !this.host || !tagName) {
      return;
    }

    const host = this.host.nativeElement;
    host.replaceChildren();
    this.renderer.appendChild(host, this.renderer.createElement(tagName));
  }
}
