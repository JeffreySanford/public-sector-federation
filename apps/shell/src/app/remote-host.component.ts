import {
  AfterViewInit,
  Component,
  ElementRef,
  PLATFORM_ID,
  Renderer2,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
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
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  @ViewChild('host', { static: true })
  private host?: ElementRef<HTMLElement>;

  private hasView = false;
  private readonly routeSubscription: Subscription;

  constructor(
    private readonly renderer: Renderer2,
    private readonly route: ActivatedRoute,
  ) {
    this.routeSubscription = this.route.data.subscribe(async (data) => {
      if (!this.isBrowser) {
        return;
      }

      const remote = data['remote'] as RemoteKey;
      this.elementName.set(undefined);
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

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }
}
