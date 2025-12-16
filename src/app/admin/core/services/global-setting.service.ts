import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { GlobalSetting } from '../models/global-setting.model';

@Injectable({
  providedIn: 'root'
})
export class GlobalSettingService {
  private mockSettings: GlobalSetting[] = [
    {
      id: '1',
      key: 'DEFAULT_CURRENCY',
      value: 'MAD',
      description: 'Default currency for the system',
      category: 'SYSTEM',
      isEncrypted: false,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01')
    },
    {
      id: '2',
      key: 'MAX_DAILY_TRANSFER',
      value: '50000',
      description: 'Maximum amount allowed for daily transfers',
      category: 'TRANSACTION',
      isEncrypted: false,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01')
    },
    {
      id: '3',
      key: 'MIN_TRANSFER_AMOUNT',
      value: '10',
      description: 'Minimum amount allowed for a transfer',
      category: 'TRANSACTION',
      isEncrypted: false,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01')
    },
    {
      id: '4',
      key: 'EMAIL_NOTIFICATION_ENABLED',
      value: 'true',
      description: 'Whether email notifications are enabled',
      category: 'NOTIFICATION',
      isEncrypted: false,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01')
    },
    {
      id: '5',
      key: 'SMS_NOTIFICATION_ENABLED',
      value: 'true',
      description: 'Whether SMS notifications are enabled',
      category: 'NOTIFICATION',
      isEncrypted: false,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01')
    },
    {
      id: '6',
      key: 'JWT_EXPIRY_TIME',
      value: '86400',
      description: 'JWT token expiry time in seconds (24 hours)',
      category: 'SECURITY',
      isEncrypted: false,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01')
    },
    {
      id: '7',
      key: 'PASSWORD_POLICY',
      value: 'min-length:8;require-uppercase:true;require-lowercase:true;require-number:true;require-special:true',
      description: 'Password policy settings',
      category: 'SECURITY',
      isEncrypted: false,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01')
    }
  ];

  constructor(private http: HttpClient) { }

  getAllSettings(): Observable<GlobalSetting[]> {
    // Mock implementation
    return of(this.mockSettings);
  }

  getSettingsByCategory(category: string): Observable<GlobalSetting[]> {
    // Mock implementation
    const filteredSettings = this.mockSettings.filter(s => s.category === category);
    return of(filteredSettings);
  }

  getSettingById(id: string): Observable<GlobalSetting | undefined> {
    // Mock implementation
    const setting = this.mockSettings.find(s => s.id === id);
    return of(setting);
  }

  getSettingByKey(key: string): Observable<GlobalSetting | undefined> {
    // Mock implementation
    const setting = this.mockSettings.find(s => s.key === key);
    return of(setting);
  }

  createSetting(setting: Omit<GlobalSetting, 'id' | 'createdAt' | 'updatedAt'>): Observable<GlobalSetting> {
    // Mock implementation
    const newSetting: GlobalSetting = {
      ...setting,
      id: (this.mockSettings.length + 1).toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.mockSettings.push(newSetting);
    return of(newSetting);
  }

  updateSetting(id: string, updates: Partial<GlobalSetting>): Observable<GlobalSetting | undefined> {
    // Mock implementation
    const index = this.mockSettings.findIndex(s => s.id === id);
    if (index !== -1) {
      this.mockSettings[index] = {
        ...this.mockSettings[index],
        ...updates,
        updatedAt: new Date()
      };
      return of(this.mockSettings[index]);
    }
    return of(undefined);
  }

  deleteSetting(id: string): Observable<boolean> {
    // Mock implementation
    const initialLength = this.mockSettings.length;
    this.mockSettings = this.mockSettings.filter(s => s.id !== id);
    return of(initialLength > this.mockSettings.length);
  }
}