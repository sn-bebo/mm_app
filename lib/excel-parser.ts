import * as XLSX from 'xlsx';
import { TravelItem, ExcelRow, CategoryType, SubcategoryType } from '@/types';

/**
 * Generate a UUID
 */
function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for environments without crypto.randomUUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Map Excel category strings to CategoryType
 */
function mapCategory(categoryStr: string): CategoryType {
  const normalized = categoryStr.toLowerCase().trim();
  
  if (normalized.includes('place') || normalized.includes('visit')) {
    return 'places';
  } else if (normalized.includes('shop')) {
    return 'shopping';
  } else if (normalized.includes('food')) {
    return 'food';
  }
  
  // Default to places if unclear
  return 'places';
}

/**
 * Detect subcategory from item name or details
 * Returns the subcategory string if detected, null otherwise
 */
function detectSubcategory(name: string, details: string): SubcategoryType {
  const combined = `${name} ${details}`.toLowerCase();
  
  // Check for common subcategories
  if (combined.includes('abaya') || combined.includes('thobe')) {
    return 'abaya-thobe';
  }
  
  if (combined.includes('historical') || combined.includes('history')) {
    return 'historical';
  }
  
  if (combined.includes('modern')) {
    return 'modern';
  }
  
  // Can add more subcategory detection logic here
  
  return null;
}

/**
 * Parse Excel file and convert to TravelItem array
 */
export async function parseExcelFile(filePath: string): Promise<TravelItem[]> {
  try {
    // Read the Excel file
    const response = await fetch(filePath);
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    
    // Get the first worksheet
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    
    // Convert to JSON
    const rawData: any[] = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
    
    // Skip header row and parse
    const items: TravelItem[] = [];
    let sortOrder = 0;
    
    for (let i = 1; i < rawData.length; i++) {
      const row = rawData[i];
      
      // Skip empty rows
      if (!row || !row[0]) continue;
      
      const city = String(row[0] || '').trim();
      const categoryRaw = String(row[1] || '').trim();
      const name = String(row[2] || '').trim();
      const details = String(row[3] || '').trim();
      const location = String(row[4] || '').trim();
      
      // Skip if essential fields are missing
      if (!city || !name) continue;
      
      const category = mapCategory(categoryRaw);
      const subcategory = detectSubcategory(name, details);
      
      const item: TravelItem = {
        id: generateId(),
        city,
        category,
        subcategory,
        name,
        details,
        location,
        status: 'pending',
        priority: null,
        rating: null,
        userNotes: '',
        sortOrder: sortOrder++,
        isAdminAdded: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      items.push(item);
    }
    
    return items;
  } catch (error) {
    console.error('Error parsing Excel file:', error);
    throw new Error('Failed to parse Excel file');
  }
}

/**
 * Parse Excel file from File object (for file upload)
 */
export async function parseExcelFileFromUpload(file: File): Promise<TravelItem[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const rawData: any[] = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
        
        const items: TravelItem[] = [];
        let sortOrder = 0;
        
        for (let i = 1; i < rawData.length; i++) {
          const row = rawData[i];
          
          if (!row || !row[0]) continue;
          
          const city = String(row[0] || '').trim();
          const categoryRaw = String(row[1] || '').trim();
          const name = String(row[2] || '').trim();
          const details = String(row[3] || '').trim();
          const location = String(row[4] || '').trim();
          
          if (!city || !name) continue;
          
          const category = mapCategory(categoryRaw);
          const subcategory = detectSubcategory(name, details);
          
          const item: TravelItem = {
            id: generateId(),
            city,
            category,
            subcategory,
            name,
            details,
            location,
            status: 'pending',
            priority: null,
            rating: null,
            userNotes: '',
            sortOrder: sortOrder++,
            isAdminAdded: false,
            createdAt: new Date(),
            updatedAt: new Date()
          };
          
          items.push(item);
        }
        
        resolve(items);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsBinaryString(file);
  });
}

/**
 * Export items to Excel format
 */
export function exportToExcel(items: TravelItem[]): void {
  // Prepare data for export
  const exportData = items.map(item => ({
    'City': item.city,
    'Category': item.category,
    'Subcategory': item.subcategory || '',
    'Name': item.name,
    'Details': item.details,
    'Location': item.location,
    'Status': item.status,
    'Priority': item.priority || '',
    'Rating': item.rating || '',
    'User Notes': item.userNotes,
    'Admin Added': item.isAdminAdded ? 'Yes' : 'No',
    'Last Updated': item.updatedAt.toISOString()
  }));
  
  // Create workbook
  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Travel Data');
  
  // Generate filename with timestamp
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `travel_data_${timestamp}.xlsx`;
  
  // Download
  XLSX.writeFile(workbook, filename);
}
