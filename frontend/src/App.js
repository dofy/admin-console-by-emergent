import React, { useState, useEffect } from 'react';
import './App.css';

// Mock data for users
const initialUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin', status: 'active', createdAt: '2024-01-15', lastLogin: '2025-03-10' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user', status: 'active', createdAt: '2024-02-20', lastLogin: '2025-03-09' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'guest', status: 'inactive', createdAt: '2024-03-10', lastLogin: '2025-03-08' },
  { id: 4, name: 'Alice Wilson', email: 'alice@example.com', role: 'user', status: 'active', createdAt: '2024-01-05', lastLogin: '2025-03-07' },
  { id: 5, name: 'Charlie Brown', email: 'charlie@example.com', role: 'admin', status: 'active', createdAt: '2024-02-28', lastLogin: '2025-03-06' },
];

function App() {
  const [users, setUsers] = useState(initialUsers);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'add', 'edit', 'view', 'delete'
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // Filter users based on search and role
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Get user statistics
  const getUserStats = () => {
    const total = users.length;
    const active = users.filter(u => u.status === 'active').length;
    const inactive = users.filter(u => u.status === 'inactive').length;
    const admins = users.filter(u => u.role === 'admin').length;
    const regularUsers = users.filter(u => u.role === 'user').length;
    const guests = users.filter(u => u.role === 'guest').length;
    
    return { total, active, inactive, admins, regularUsers, guests };
  };

  const handleAddUser = (userData) => {
    const newUser = {
      id: Date.now(),
      ...userData,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      lastLogin: 'Never'
    };
    setUsers([...users, newUser]);
    setShowModal(false);
  };

  const handleEditUser = (userData) => {
    setUsers(users.map(user => 
      user.id === selectedUser.id ? { ...user, ...userData } : user
    ));
    setShowModal(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
    setShowModal(false);
    setSelectedUser(null);
  };

  const openModal = (type, user = null) => {
    setModalType(type);
    setSelectedUser(user);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setModalType('');
  };

  // Sidebar Navigation Component
  const Sidebar = () => (
    <div className="bg-gray-900 w-64 min-h-screen p-6 border-r border-gray-700">
      <div className="text-2xl font-bold text-white mb-8 flex items-center">
        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mr-3"></div>
        Admin Panel
      </div>
      
      <nav className="space-y-2">
        <button
          onClick={() => setCurrentPage('dashboard')}
          className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-all ${
            currentPage === 'dashboard' 
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' 
              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          }`}
        >
          <span className="text-xl">📊</span>
          <span>Dashboard</span>
        </button>
        
        <button
          onClick={() => setCurrentPage('users')}
          className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-all ${
            currentPage === 'users' 
              ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg' 
              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          }`}
        >
          <span className="text-xl">👥</span>
          <span>Users</span>
        </button>
      </nav>
    </div>
  );

  // Dashboard Component
  const Dashboard = () => {
    const stats = getUserStats();
    
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Total Users</p>
                <p className="text-3xl font-bold text-white">{stats.total}</p>
              </div>
              <div className="text-4xl text-purple-200">👥</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Active Users</p>
                <p className="text-3xl font-bold text-white">{stats.active}</p>
              </div>
              <div className="text-4xl text-green-200">✅</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-red-600 to-pink-600 p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">Inactive Users</p>
                <p className="text-3xl font-bold text-white">{stats.inactive}</p>
              </div>
              <div className="text-4xl text-red-200">❌</div>
            </div>
          </div>
        </div>

        {/* Role Distribution */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold text-white mb-4">User Roles Distribution</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl text-yellow-400 mb-2">👑</div>
              <p className="text-gray-300 text-sm">Admins</p>
              <p className="text-2xl font-bold text-yellow-400">{stats.admins}</p>
            </div>
            <div className="text-center">
              <div className="text-2xl text-blue-400 mb-2">👤</div>
              <p className="text-gray-300 text-sm">Users</p>
              <p className="text-2xl font-bold text-blue-400">{stats.regularUsers}</p>
            </div>
            <div className="text-center">
              <div className="text-2xl text-gray-400 mb-2">👁️</div>
              <p className="text-gray-300 text-sm">Guests</p>
              <p className="text-2xl font-bold text-gray-400">{stats.guests}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Users List Component
  const UsersList = () => (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Users Management</h1>
        <button
          onClick={() => openModal('add')}
          className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center space-x-2"
        >
          <span className="text-xl">➕</span>
          <span>Add User</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 bg-gray-800 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="bg-gray-800 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500"
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
          <option value="guest">Guest</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Created</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-white">{user.name}</div>
                      <div className="text-sm text-gray-400">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                      user.role === 'admin' ? 'bg-yellow-900 text-yellow-200' :
                      user.role === 'user' ? 'bg-blue-900 text-blue-200' :
                      'bg-gray-600 text-gray-200'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                      user.status === 'active' ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">{user.createdAt}</td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openModal('view', user)}
                        className="text-blue-400 hover:text-blue-300 text-xl"
                        title="View User"
                      >
                        👁️
                      </button>
                      <button
                        onClick={() => openModal('edit', user)}
                        className="text-green-400 hover:text-green-300 text-xl"
                        title="Edit User"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => openModal('delete', user)}
                        className="text-red-400 hover:text-red-300 text-xl"
                        title="Delete User"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-gray-400">No users found matching your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );

  // User Form Component
  const UserForm = ({ user, onSubmit, onCancel, title }) => {
    const [formData, setFormData] = useState({
      name: user?.name || '',
      email: user?.email || '',
      role: user?.role || 'user'
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(formData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gray-800 p-8 rounded-xl shadow-xl max-w-md w-full mx-4">
          <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
          
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500"
              >
                <option value="guest">Guest</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            
            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                {user ? 'Update' : 'Create'} User
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-500 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // User View Modal
  const UserViewModal = ({ user, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-8 rounded-xl shadow-xl max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-white mb-6">User Details</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">Name</label>
            <p className="text-white text-lg">{user.name}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300">Email</label>
            <p className="text-white text-lg">{user.email}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300">Role</label>
            <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${
              user.role === 'admin' ? 'bg-yellow-900 text-yellow-200' :
              user.role === 'user' ? 'bg-blue-900 text-blue-200' :
              'bg-gray-600 text-gray-200'
            }`}>
              {user.role}
            </span>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300">Status</label>
            <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${
              user.status === 'active' ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'
            }`}>
              {user.status}
            </span>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300">Created</label>
            <p className="text-white">{user.createdAt}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300">Last Login</label>
            <p className="text-white">{user.lastLogin}</p>
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="w-full mt-6 bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-500 transition-all"
        >
          Close
        </button>
      </div>
    </div>
  );

  // Delete Confirmation Modal
  const DeleteModal = ({ user, onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-8 rounded-xl shadow-xl max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-white mb-4">Delete User</h2>
        <p className="text-gray-300 mb-6">
          Are you sure you want to delete <strong className="text-white">{user.name}</strong>? 
          This action cannot be undone.
        </p>
        
        <div className="flex space-x-4">
          <button
            onClick={() => onConfirm(user.id)}
            className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Delete
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-500 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 flex">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        {currentPage === 'dashboard' && <Dashboard />}
        {currentPage === 'users' && <UsersList />}
      </div>

      {/* Modals */}
      {showModal && modalType === 'add' && (
        <UserForm
          title="Add New User"
          onSubmit={handleAddUser}
          onCancel={closeModal}
        />
      )}
      
      {showModal && modalType === 'edit' && selectedUser && (
        <UserForm
          user={selectedUser}
          title="Edit User"
          onSubmit={handleEditUser}
          onCancel={closeModal}
        />
      )}
      
      {showModal && modalType === 'view' && selectedUser && (
        <UserViewModal
          user={selectedUser}
          onClose={closeModal}
        />
      )}
      
      {showModal && modalType === 'delete' && selectedUser && (
        <DeleteModal
          user={selectedUser}
          onConfirm={handleDeleteUser}
          onCancel={closeModal}
        />
      )}
    </div>
  );
}

export default App;