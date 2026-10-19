'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { DataTable, Column } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { AddManagerModal, ManagerFormData } from '@/components/add-manager-modal';

interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  manager: string;
  status: 'active' | 'inactive';
}

const mockEmployees: Employee[] = [
  {
    id: 'EMP001',
    name: 'John Doe',
    email: 'john.doe@company.com',
    department: 'Engineering',
    role: 'Senior Developer',
    manager: 'Sarah Johnson',
    status: 'active',
  },
  {
    id: 'EMP002',
    name: 'Jane Smith',
    email: 'jane.smith@company.com',
    department: 'Finance',
    role: 'Finance Manager',
    manager: 'Michael Brown',
    status: 'active',
  },
  {
    id: 'EMP003',
    name: 'Bob Johnson',
    email: 'bob.johnson@company.com',
    department: 'Engineering',
    role: 'Developer',
    manager: 'Sarah Johnson',
    status: 'active',
  },
  {
    id: 'EMP004',
    name: 'Alice Brown',
    email: 'alice.brown@company.com',
    department: 'HR',
    role: 'HR Specialist',
    manager: 'Emily Davis',
    status: 'active',
  },
];

export default function AdminEmployeesPage() {
  const [sortColumn, setSortColumn] = useState<string>();
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [isAddManagerModalOpen, setIsAddManagerModalOpen] = useState(false);
  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formDepartment, setFormDepartment] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formManager, setFormManager] = useState('');

  const handleAddManager = (managerData: ManagerFormData) => {
    // Treat as an employee addition for mock database
    const newEmp: Employee = {
      id: `MGR${String(employees.length + 1).padStart(3, '0')}`,
      name: managerData.name,
      email: managerData.email,
      department: managerData.department,
      role: 'Manager',
      manager: 'Direct Admin',
      status: 'active',
    };
    setEmployees(prev => [newEmp, ...prev]);
    setIsAddManagerModalOpen(false);
    alert(`Manager ${managerData.name} added successfully!`);
  };

  const handleOpenAddEmployee = () => {
    setEditEmployee(null);
    setFormName('');
    setFormEmail('');
    setFormDepartment('');
    setFormRole('');
    setFormManager('');
    setIsAddEmployeeModalOpen(true);
  };

  const handleOpenEditEmployee = (emp: Employee) => {
    setEditEmployee(emp);
    setFormName(emp.name);
    setFormEmail(emp.email);
    setFormDepartment(emp.department);
    setFormRole(emp.role);
    setFormManager(emp.manager);
    setIsAddEmployeeModalOpen(true);
  };

  const handleDeleteEmployee = (id: string) => {
    if (confirm(`Are you sure you want to delete employee ${id}?`)) {
      setEmployees(prev => prev.filter(emp => emp.id !== id));
      alert(`Deleted employee ${id} successfully.`);
    }
  };

  const handleSaveEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim() || !formDepartment.trim() || !formRole.trim() || !formManager.trim()) {
      alert('All fields are required.');
      return;
    }

    if (editEmployee) {
      // Editing
      setEmployees(prev => prev.map(emp => emp.id === editEmployee.id ? {
        ...emp,
        name: formName,
        email: formEmail,
        department: formDepartment,
        role: formRole,
        manager: formManager,
      } : emp));
      alert(`Updated employee ${editEmployee.id} details successfully.`);
    } else {
      // Adding
      const newEmp: Employee = {
        id: `EMP${String(employees.length + 1).padStart(3, '0')}`,
        name: formName,
        email: formEmail,
        department: formDepartment,
        role: formRole,
        manager: formManager,
        status: 'active',
      };
      setEmployees(prev => [newEmp, ...prev]);
      alert(`Added new employee ${newEmp.id} successfully.`);
    }

    setIsAddEmployeeModalOpen(false);
    setEditEmployee(null);
  };

  const handleSort = (accessor: any, direction: 'asc' | 'desc') => {
    setSortColumn(typeof accessor === 'string' ? accessor : accessor.toString());
    setSortDirection(direction);
  };

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
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

  const columns: Column<Employee>[] = [
    {
      header: 'Employee ID',
      accessor: 'id',
      sortable: true,
    },
    {
      header: 'Name',
      accessor: 'name',
      sortable: true,
    },
    {
      header: 'Email',
      accessor: 'email',
      sortable: true,
    },
    {
      header: 'Department',
      accessor: 'department',
      sortable: true,
    },
    {
      header: 'Role',
      accessor: 'role',
      sortable: true,
    },
    {
      header: 'Manager',
      accessor: 'manager',
      sortable: true,
    },
    {
      header: 'Actions',
      accessor: (item: Employee) => item.id,
      cell: (id, item) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="h-8" onClick={() => handleOpenEditEmployee(item)}>
            <Edit2 className="w-3 h-3" />
          </Button>
          <Button size="sm" variant="outline" className="h-8 text-accent" onClick={() => handleDeleteEmployee(item.id)}>
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Employee Management"
        description="Manage employee profiles, roles, and departments"
        actions={
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsAddManagerModalOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Manager
            </Button>
            <Button size="sm" className="bg-primary hover:bg-primary/90" onClick={handleOpenAddEmployee}>
              <Plus className="w-4 h-4 mr-2" />
              Add Employee
            </Button>
          </div>
        }
      />

      <div className="p-6 space-y-6">
        {/* Search */}
        <div className="bg-card rounded-lg border border-border p-4">
          <Input
            placeholder="Search by name, ID, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        {/* Table */}
        <DataTable<Employee>
          columns={columns}
          data={sortedEmployees}
          onSort={handleSort}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          emptyMessage="No employees found"
        />
      </div>

      {/* Add / Edit Employee Modal */}
      {isAddEmployeeModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-border p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">
              {editEmployee ? 'Edit Employee Details' : 'Add New Employee'}
            </h3>
            <form onSubmit={handleSaveEmployee} className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-foreground">Name</label>
                <Input
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground">Email</label>
                <Input
                  type="email"
                  required
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="e.g. rahul@company.com"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground">Department</label>
                <Input
                  required
                  value={formDepartment}
                  onChange={(e) => setFormDepartment(e.target.value)}
                  placeholder="e.g. Engineering"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground">Role</label>
                <Input
                  required
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value)}
                  placeholder="e.g. QA Engineer"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground">Manager</label>
                <Input
                  required
                  value={formManager}
                  onChange={(e) => setFormManager(e.target.value)}
                  placeholder="e.g. Sarah Johnson"
                  className="mt-1"
                />
              </div>
              <div className="flex gap-3 pt-4 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setIsAddEmployeeModalOpen(false);
                    setEditEmployee(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">
                  {editEmployee ? 'Save Changes' : 'Add Employee'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Manager Modal */}
      <AddManagerModal
        isOpen={isAddManagerModalOpen}
        onClose={() => setIsAddManagerModalOpen(false)}
        onAddManager={handleAddManager}
      />
    </div>
  );
}
