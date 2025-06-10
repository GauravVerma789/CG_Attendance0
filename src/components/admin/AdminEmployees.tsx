import { useState } from 'react';
import { mockUsers } from '../../data/mockData';
import EmployeeDetailsDashboard from './EmployeeDetailsDashboard';
// No need for User icon here as we're using initials

const AdminEmployees = () => {
  const employees = mockUsers.filter(user => user.role === 'staff');
  const [selectedEmployee, setSelectedEmployee] = useState<any | null>(null);

  const handleEmployeeClick = (employee: any) => {
    setSelectedEmployee(employee);
  };

  const handleCloseEmployeeDetails = () => {
    setSelectedEmployee(null);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary">Employees</h1>
        <p className="text-text-secondary">View and manage employee records</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.map(employee => (
          <div key={employee.id} className="edusync-glass-card p-6 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xl mr-4">
                  {employee.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text-primary">{employee.name}</h3>
                  <p className="text-sm text-text-secondary">ID: emp{employee.id}</p>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => handleEmployeeClick(employee)}
                className="btn btn-primary w-full"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedEmployee && (
        <EmployeeDetailsDashboard
          employee={selectedEmployee}
          onClose={handleCloseEmployeeDetails}
        />
      )}
    </div>
  );
};

export default AdminEmployees; 