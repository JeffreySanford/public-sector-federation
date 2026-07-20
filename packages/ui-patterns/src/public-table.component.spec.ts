import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PublicTableComponent } from './public-table.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

@Component({
  standalone: true,
  imports: [PublicTableComponent],
  template: `
    <ps-table
      [columns]="[{ key: 'name', header: 'Name', sortable: true }, { key: 'status', header: 'Status' }]"
      [empty]="empty"
      ariaLabel="Case queue"
    >
      <tr>
        <td>Jordan Avery</td>
        <td>Review</td>
      </tr>
    </ps-table>
  `,
})
class TableHostComponent {
  empty = false;
}

describe('PublicTableComponent', () => {
  let fixture: ComponentFixture<TableHostComponent>;
  let compiled: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TableHostComponent);
    compiled = fixture.debugElement;
    fixture.detectChanges();
  });

  describe('Initialization', () => {
    it('should create the component', () => {
      expect(fixture.componentInstance).toBeTruthy();
    });
  });

  describe('Template Structure', () => {
    it('should render a header cell per column', () => {
      const headers = compiled.queryAll(By.css('th'));
      expect(headers.length).toBe(2);
    });

    it('should render a sort button only for sortable columns', () => {
      const sortButtons = compiled.queryAll(By.css('.ps-table__sort-button'));
      expect(sortButtons.length).toBe(1);
    });

    it('should project row content into tbody', () => {
      const projectedCell = compiled.query(By.css('td'));
      expect(projectedCell.nativeElement.textContent).toContain('Jordan Avery');
    });

    it('should render the empty message instead of projected content when empty', () => {
      fixture.componentInstance.empty = true;
      fixture.detectChanges();
      const emptyCell = compiled.query(By.css('.ps-table__empty'));
      expect(emptyCell).toBeTruthy();
      expect(emptyCell.nativeElement.getAttribute('colspan')).toBe('2');
    });
  });
});
