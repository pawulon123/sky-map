import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
type CollisionKey = 'boundaries' | 'star-symbol' | string;

interface CollisionOption {
  key: CollisionKey; // np. "boundaries", "star-symbol"
  label: string; // tekst w UI
  checked: boolean;
}
@Component({
  selector: 'app-colision-label',
  imports: [MatCheckboxModule, CommonModule],
  templateUrl: './colision-label.component.html',
  styleUrl: './colision-label.component.css',
})
export class ColisionLabelComponent {
  @Output() updateColision = new EventEmitter();
  collisionsMain = true;

  collisionOptions: CollisionOption[] = [
    { key: 'boundaries', label: 'Granice konstelacji (boundaries)', checked: false },
    { key: 'star-symbol', label: 'Symbole gwiazd (star-symbol)', checked: false },
  ];

  // UWAGA: teraz może być array albo null
  collisionTargets: string[] | null = null;
  collisionsBoundaries = false;
  collisionsStarSymbol = false;

  onCollisionsMainChange(checked: boolean): void {
    this.collisionsMain = checked;

    if (!checked) {
      // wyłączenie -> odznaczyć podrzędne
      this.collisionOptions = this.collisionOptions.map((opt) => ({
        ...opt,
        checked: false,
      }));
    }

    this.updateCollisionTargets();
  }

  onChildCollisionChange(key: CollisionKey, checked: boolean): void {
    if (!this.collisionsMain) return;

    this.collisionOptions = this.collisionOptions.map((opt) => (opt.key === key ? { ...opt, checked } : opt));

    this.updateCollisionTargets();
  }

  private updateCollisionTargets(): void {
    this.collisionTargets = !this.collisionsMain
      ? null
      : this.collisionOptions.filter((opt) => opt.checked).map((opt) => opt.key);

    this.updateColision.emit({ colision: this.collisionTargets });
    // this.update('colision', this.collisionTargets);
  }
}
