import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbAccordion, NgbPanel, NgbPanelTitle, NgbPanelContent, NgbPanelHeader, NgbPanelToggle, NgbRefDirective } from './accordion';
import * as i0 from "@angular/core";
export { NgbAccordion, NgbPanel, NgbPanelTitle, NgbPanelContent, NgbPanelHeader, NgbPanelToggle } from './accordion';
export { NgbAccordionConfig } from './accordion-config';
const NGB_ACCORDION_DIRECTIVES = [NgbAccordion, NgbPanel, NgbPanelTitle, NgbPanelContent, NgbPanelHeader, NgbPanelToggle];
export class NgbAccordionModule {
}
NgbAccordionModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbAccordionModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
NgbAccordionModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbAccordionModule, declarations: [NgbRefDirective, NgbAccordion, NgbPanel, NgbPanelTitle, NgbPanelContent, NgbPanelHeader, NgbPanelToggle], imports: [CommonModule], exports: [NgbAccordion, NgbPanel, NgbPanelTitle, NgbPanelContent, NgbPanelHeader, NgbPanelToggle] });
NgbAccordionModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbAccordionModule, imports: [[CommonModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbAccordionModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [NgbRefDirective, ...NGB_ACCORDION_DIRECTIVES],
                    exports: NGB_ACCORDION_DIRECTIVES,
                    imports: [CommonModule]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWNjb3JkaW9uLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9hY2NvcmRpb24vYWNjb3JkaW9uLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3ZDLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUU3QyxPQUFPLEVBQ0wsWUFBWSxFQUNaLFFBQVEsRUFDUixhQUFhLEVBQ2IsZUFBZSxFQUNmLGNBQWMsRUFDZCxjQUFjLEVBQ2QsZUFBZSxFQUNoQixNQUFNLGFBQWEsQ0FBQzs7QUFFckIsT0FBTyxFQUNMLFlBQVksRUFDWixRQUFRLEVBQ1IsYUFBYSxFQUNiLGVBQWUsRUFFZixjQUFjLEVBRWQsY0FBYyxFQUNmLE1BQU0sYUFBYSxDQUFDO0FBQ3JCLE9BQU8sRUFBQyxrQkFBa0IsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBRXRELE1BQU0sd0JBQXdCLEdBQzFCLENBQUMsWUFBWSxFQUFFLFFBQVEsRUFBRSxhQUFhLEVBQUUsZUFBZSxFQUFFLGNBQWMsRUFBRSxjQUFjLENBQUMsQ0FBQztBQU83RixNQUFNLE9BQU8sa0JBQWtCOzsrR0FBbEIsa0JBQWtCO2dIQUFsQixrQkFBa0IsaUJBSmQsZUFBZSxFQUgzQixZQUFZLEVBQUUsUUFBUSxFQUFFLGFBQWEsRUFBRSxlQUFlLEVBQUUsY0FBYyxFQUFFLGNBQWMsYUFLL0UsWUFBWSxhQUxuQixZQUFZLEVBQUUsUUFBUSxFQUFFLGFBQWEsRUFBRSxlQUFlLEVBQUUsY0FBYyxFQUFFLGNBQWM7Z0hBTzlFLGtCQUFrQixZQUZwQixDQUFDLFlBQVksQ0FBQzsyRkFFWixrQkFBa0I7a0JBTDlCLFFBQVE7bUJBQUM7b0JBQ1IsWUFBWSxFQUFFLENBQUMsZUFBZSxFQUFFLEdBQUcsd0JBQXdCLENBQUM7b0JBQzVELE9BQU8sRUFBRSx3QkFBd0I7b0JBQ2pDLE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQztpQkFDeEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge05nTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XHJcblxyXG5pbXBvcnQge1xyXG4gIE5nYkFjY29yZGlvbixcclxuICBOZ2JQYW5lbCxcclxuICBOZ2JQYW5lbFRpdGxlLFxyXG4gIE5nYlBhbmVsQ29udGVudCxcclxuICBOZ2JQYW5lbEhlYWRlcixcclxuICBOZ2JQYW5lbFRvZ2dsZSxcclxuICBOZ2JSZWZEaXJlY3RpdmVcclxufSBmcm9tICcuL2FjY29yZGlvbic7XHJcblxyXG5leHBvcnQge1xyXG4gIE5nYkFjY29yZGlvbixcclxuICBOZ2JQYW5lbCxcclxuICBOZ2JQYW5lbFRpdGxlLFxyXG4gIE5nYlBhbmVsQ29udGVudCxcclxuICBOZ2JQYW5lbENoYW5nZUV2ZW50LFxyXG4gIE5nYlBhbmVsSGVhZGVyLFxyXG4gIE5nYlBhbmVsSGVhZGVyQ29udGV4dCxcclxuICBOZ2JQYW5lbFRvZ2dsZVxyXG59IGZyb20gJy4vYWNjb3JkaW9uJztcclxuZXhwb3J0IHtOZ2JBY2NvcmRpb25Db25maWd9IGZyb20gJy4vYWNjb3JkaW9uLWNvbmZpZyc7XHJcblxyXG5jb25zdCBOR0JfQUNDT1JESU9OX0RJUkVDVElWRVMgPVxyXG4gICAgW05nYkFjY29yZGlvbiwgTmdiUGFuZWwsIE5nYlBhbmVsVGl0bGUsIE5nYlBhbmVsQ29udGVudCwgTmdiUGFuZWxIZWFkZXIsIE5nYlBhbmVsVG9nZ2xlXTtcclxuXHJcbkBOZ01vZHVsZSh7XHJcbiAgZGVjbGFyYXRpb25zOiBbTmdiUmVmRGlyZWN0aXZlLCAuLi5OR0JfQUNDT1JESU9OX0RJUkVDVElWRVNdLFxyXG4gIGV4cG9ydHM6IE5HQl9BQ0NPUkRJT05fRElSRUNUSVZFUyxcclxuICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgTmdiQWNjb3JkaW9uTW9kdWxlIHtcclxufVxyXG4iXX0=