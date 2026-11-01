import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderPortalComponent } from '../header-portal.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { PredefinedService } from '../../domain/services/predefined/predefined.service';

@Component({
  selector: 'app-predefined',
  imports: [CommonModule,
    FormsModule, HeaderPortalComponent, MatFormFieldModule, MatSelectModule],
  templateUrl: './predefined.component.html',
  styleUrl: './predefined.component.css',
  standalone: true,
})
export class PredefinedComponent {
  
     private predefinedService = inject(PredefinedService);
     protected predefined = this.predefinedService.predefined



selectedOption = this.predefined[0]?.value ?? '';


onPredefinedChange(value: string): void {
  const selected = this.predefined.find(item => item.value === value);
  if (!selected) return;
  selected.run();

}
 
}


