import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { NgbdOverviewSection } from './overview';
import { RouterLink } from '@angular/router';
import { NgbdFragment } from '../fragment/fragment.directive';

@Component({
	selector: 'ngbd-overview-section',
	standalone: true,
	imports: [RouterLink, NgbdFragment],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'd-block',
	},
	template: `
		<h2 [id]="section.fragment">
			<a class="title-fragment" routerLink="." [fragment]="section.fragment">
				<i class="bi bi-link-45deg" style="font-size: 1.75rem; color: var(--bs-heading-color)"></i>
			</a>
			{{ section.title }}
		</h2>

		<ng-content></ng-content>
	`,
})
export class NgbdOverviewSectionComponent {
	@Input() section: NgbdOverviewSection;
}
