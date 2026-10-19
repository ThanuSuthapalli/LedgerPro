'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { DataTable, Column } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Edit2, Plus } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  description: string;
  usageCount: number;
  status: 'active' | 'inactive';
}

const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Travel',
    description: 'Flight, hotel, and transportation expenses',
    usageCount: 45,
    status: 'active',
  },
  {
    id: '2',
    name: 'Meals & Entertainment',
    description: 'Business meals and client entertainment',
    usageCount: 32,
    status: 'active',
  },
  {
    id: '3',
    name: 'Office Supplies',
    description: 'Supplies for office operations',
    usageCount: 28,
    status: 'active',
  },
  {
    id: '4',
    name: 'Training & Development',
    description: 'Courses, conferences, and certifications',
    usageCount: 15,
    status: 'active',
  },
  {
    id: '5',
    name: 'Equipment',
    description: 'Office equipment and technology',
    usageCount: 8,
    status: 'active',
  },
];

export default function AdminCategoriesPage() {
  const [sortColumn, setSortColumn] = useState<string>();
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  
  // Modal state
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formStatus, setFormStatus] = useState<'active' | 'inactive'>('active');

  const handleOpenAddCategory = () => {
    setEditCategory(null);
    setFormName('');
    setFormDescription('');
    setFormStatus('active');
    setIsAddCategoryOpen(true);
  };

  const handleOpenEditCategory = (cat: Category) => {
    setEditCategory(cat);
    setFormName(cat.name);
    setFormDescription(cat.description);
    setFormStatus(cat.status);
    setIsAddCategoryOpen(true);
  };

  const handleDeleteCategory = (id: string) => {
    if (confirm(`Are you sure you want to delete category ${id}?`)) {
      setCategories(prev => prev.filter(c => c.id !== id));
      alert('Deleted category successfully.');
    }
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formDescription.trim()) {
      alert('Name and Description are required.');
      return;
    }

    if (editCategory) {
      setCategories(prev => prev.map(c => c.id === editCategory.id ? {
        ...c,
        name: formName,
        description: formDescription,
        status: formStatus
      } : c));
      alert('Category details updated successfully.');
    } else {
      const newCat: Category = {
        id: String(categories.length + 1),
        name: formName,
        description: formDescription,
        usageCount: 0,
        status: formStatus
      };
      setCategories(prev => [...prev, newCat]);
      alert('New category created successfully.');
    }

    setIsAddCategoryOpen(false);
    setEditCategory(null);
  };

  const handleSort = (accessor: any, direction: 'asc' | 'desc') => {
    setSortColumn(typeof accessor === 'string' ? accessor : accessor.toString());
    setSortDirection(direction);
  };

  const sortedCategories = [...categories].sort((a, b) => {
    if (!sortColumn) return 0;
    const aValue = (a as any)[sortColumn];
    const bValue = (b as any)[sortColumn];

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const columns: Column<Category>[] = [
    {
      header: 'Category Name',
      accessor: 'name',
      sortable: true,
    },
    {
      header: 'Description',
      accessor: 'description',
      sortable: true,
    },
    {
      header: 'Usage Count',
      accessor: 'usageCount',
      sortable: true,
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (value) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            value === 'active'
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
          }`}
        >
          {value === 'active' ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: (item: Category) => item.id,
      cell: (id, item) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="h-8" onClick={() => handleOpenEditCategory(item)}>
            <Edit2 className="w-3 h-3" />
          </Button>
          <Button size="sm" variant="outline" className="h-8 text-accent" onClick={() => handleDeleteCategory(item.id)}>
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Expense Categories"
        description="Manage expense categories for your organization"
        actions={
          <Button size="sm" className="bg-primary hover:bg-primary/90" onClick={handleOpenAddCategory}>
            <Plus className="w-4 h-4 mr-2" />
            New Category
          </Button>
        }
      />

      <div className="p-6">
        <DataTable<Category>
          columns={columns}
          data={sortedCategories}
          onSort={handleSort}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          emptyMessage="No categories found"
        />
      </div>

      {/* Add / Edit Category Modal */}
      {isAddCategoryOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg shadow-xl max-w-md w-full border border-border p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">
              {editCategory ? 'Edit Category' : 'Create New Category'}
            </h3>
            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-foreground">Category Name</label>
                <Input
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Travel, Software licensing"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground">Description</label>
                <Input
                  required
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="e.g. Flight tickets, lodging, daily allowances"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground">Status</label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as 'active' | 'inactive')}
                  className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-card text-foreground text-sm"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setIsAddCategoryOpen(false);
                    setEditCategory(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">
                  {editCategory ? 'Save Changes' : 'Create'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
