import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { items } = await request.json();
    
    // Path to the Excel file
    const filePath = path.join(process.cwd(), 'public', 'data', 'MM_data.xlsx');
    
    // Convert items to Excel format
    const worksheetData = items.map((item: any) => ({
      City: item.city,
      Category: item.category,
      Subcategory: item.subcategory || '',
      Name: item.name,
      Details: item.details || '',
      Location: item.location || '',
      Status: item.status || 'pending',
      Priority: item.priority || '',
      Rating: item.rating || '',
      UserNotes: item.userNotes || '',
      SortOrder: item.sortOrder || 0,
      IsPinned: item.isPinned ? 'Yes' : 'No',
      IsAdminAdded: item.isAdminAdded ? 'Yes' : 'No',
    }));
    
    // Create workbook and worksheet
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    
    // Write to buffer
    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    
    // Save file
    await fs.writeFile(filePath, excelBuffer);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Excel file updated successfully',
      itemCount: items.length 
    });
    
  } catch (error) {
    console.error('Error updating Excel:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update Excel file' },
      { status: 500 }
    );
  }
}
