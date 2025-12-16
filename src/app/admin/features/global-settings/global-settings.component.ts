import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalSettingService } from '../../core/services/global-setting.service';
import { GlobalSetting } from '../../core/models/global-setting.model';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faEdit, faTrash, faPlus, faTimes, faFilter, faSave } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-global-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FaIconComponent],
  templateUrl: './global-settings.component.html',
  styleUrls: ['./global-settings.component.css']
})
export class GlobalSettingsComponent implements OnInit {
  private globalSettingService = inject(GlobalSettingService);
  private fb = inject(FormBuilder);

  settings: GlobalSetting[] = [];
  categories: string[] = ['ALL', 'SECURITY', 'TRANSACTION', 'NOTIFICATION', 'SYSTEM', 'OTHER'];
  selectedCategory: string = 'ALL';
  isLoading: boolean = true;
  showForm: boolean = false;
  isEditing: boolean = false;
  currentSettingId: string | null = null;
  searchTerm: string = '';

  settingForm: FormGroup;

  // Icons
  faEdit = faEdit;
  faTrash = faTrash;
  faPlus = faPlus;
  faTimes = faTimes;
  faFilter = faFilter;
  faSave = faSave;

  constructor() {
    this.settingForm = this.fb.group({
      key: ['', [Validators.required, Validators.pattern('[A-Z0-9_]+')]],
      value: ['', [Validators.required]],
      description: ['', [Validators.required]],
      category: ['SYSTEM', [Validators.required]],
      isEncrypted: [false]
    });
  }

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings(): void {
    this.isLoading = true;
    this.globalSettingService.getAllSettings().subscribe(
      settings => {
        this.settings = settings;
        this.isLoading = false;
      },
      error => {
        console.error('Error loading settings:', error);
        this.isLoading = false;
      }
    );
  }

  onSubmit(): void {
    if (this.settingForm.invalid) return;

    const formValue = this.settingForm.value;

    if (this.isEditing && this.currentSettingId) {
      this.globalSettingService.updateSetting(this.currentSettingId, formValue).subscribe(
        updatedSetting => {
          const index = this.settings.findIndex(s => s.id === this.currentSettingId);
          if (index !== -1 && updatedSetting) {
            this.settings[index] = updatedSetting;
          }
          this.resetForm();
        },
        error => console.error('Error updating setting:', error)
      );
    } else {
      this.globalSettingService.createSetting(formValue).subscribe(
        newSetting => {
          this.settings.push(newSetting);
          this.resetForm();
        },
        error => console.error('Error creating setting:', error)
      );
    }
  }

  editSetting(setting: GlobalSetting): void {
    this.isEditing = true;
    this.currentSettingId = setting.id;
    this.showForm = true;

    this.settingForm.patchValue({
      key: setting.key,
      value: setting.value,
      description: setting.description,
      category: setting.category,
      isEncrypted: setting.isEncrypted
    });

    if (this.isEditing) {
      this.settingForm.get('key')?.disable();
    } else {
      this.settingForm.get('key')?.enable();
    }
  }

  deleteSetting(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce paramètre ?')) {
      this.globalSettingService.deleteSetting(id).subscribe(
        success => {
          if (success) {
            this.settings = this.settings.filter(s => s.id !== id);
          }
        },
        error => console.error('Error deleting setting:', error)
      );
    }
  }

  resetForm(): void {
    this.settingForm.reset({ category: 'SYSTEM', isEncrypted: false });
    this.isEditing = false;
    this.currentSettingId = null;
    this.showForm = false;
    this.settingForm.get('key')?.enable();
  }

  toggleForm(): void {
    if (this.showForm && this.isEditing) {
      this.resetForm();
    } else {
      this.showForm = !this.showForm;
      if (!this.showForm) {
        this.resetForm();
      }
    }
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
  }

  getFilteredSettings(): GlobalSetting[] {
    let result = this.settings;

    if (this.selectedCategory !== 'ALL') {
      result = result.filter(setting => setting.category === this.selectedCategory);
    }

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(setting =>
        setting.key.toLowerCase().includes(term) ||
        setting.value.toLowerCase().includes(term) ||
        setting.description.toLowerCase().includes(term)
      );
    }

    return result;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }
}
