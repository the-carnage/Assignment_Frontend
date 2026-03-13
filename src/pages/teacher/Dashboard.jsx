import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import { LogOut, Plus, Edit2, Eye, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { format } from 'date-fns';

const TeacherDashboard = () => {
  const dispatch = useDispatch();
  const [assignments, setAssignments] = parseInt([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/assignments');
      setAssignments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this draft?')) {
      try {
        await api.delete(`/assignments/${id}`);
        fetchAssignments();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete');
      }
    }
  };

  const filteredAssignments = assignments.filter((a) => {
    if (filter === 'All') return true;
    return a.status === filter;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredAssignments.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAssignments.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
          <button
            onClick={() => dispatch(logout())}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-2">
            {['All', 'Draft', 'Published', 'Completed'].map((status) => (
              <button
                key={status}
                onClick={() => { setFilter(status); setCurrentPage(1); }}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  filter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
          <Link
            to="/teacher/assignments/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Assignment
          </Link>
        </div>

        {loading ? (
          <p className="text-center text-gray-500 py-10">Loading assignments...</p>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {currentItems.length === 0 ? (
                <li className="px-6 py-10 text-center text-gray-500">No assignments found.</li>
              ) : (
                currentItems.map((assignment) => (
                  <li key={assignment.id}>
                    <div className="px-4 py-4 sm:px-6 hover:bg-gray-50 flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-lg font-medium text-blue-600 truncate">{assignment.title}</p>
                        <p className="mt-1 text-sm text-gray-500 truncate">{assignment.description}</p>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <span className="mr-4">Due: {format(new Date(assignment.due_date), 'PPP')}</span>
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              assignment.status === 'Draft'
                                ? 'bg-gray-100 text-gray-800'
                                : assignment.status === 'Published'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {assignment.status}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0 flex space-x-2">
                        {assignment.status !== 'Completed' && (
                           <Link
                             to={`/teacher/assignments/${assignment.id}/edit`}
                             className="p-2 text-gray-400 hover:text-blue-500 title"
                             title="Edit"
                           >
                             <Edit2 className="h-5 w-5" />
                           </Link>
                        )}
                        {assignment.status !== 'Draft' && (
                           <Link
                             to={`/teacher/assignments/${assignment.id}/submissions`}
                             className="p-2 text-gray-400 hover:text-indigo-500"
                             title="View Submissions"
                           >
                             <Eye className="h-5 w-5" />
                           </Link>
                        )}
                        {assignment.status === 'Draft' && (
                           <button
                             onClick={() => handleDelete(assignment.id)}
                             className="p-2 text-gray-400 hover:text-red-500"
                             title="Delete"
                           >
                             <Trash2 className="h-5 w-5" />
                           </button>
                        )}
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                      <span className="font-medium">{Math.min(indexOfLastItem, filteredAssignments.length)}</span> of{' '}
                      <span className="font-medium">{filteredAssignments.length}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default TeacherDashboard;
