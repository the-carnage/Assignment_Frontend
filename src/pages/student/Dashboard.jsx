import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import { LogOut, ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { format } from 'date-fns';

const StudentDashboard = () => {
  const dispatch = useDispatch();
  const [assignments, setAssignments] = useState([]);
  const [mySubmissions, setMySubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [assignRes, subRes] = await Promise.all([
          api.get('/assignments'),
          api.get('/submissions/my')
        ]);
        setAssignments(assignRes.data);
        setMySubmissions(subRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getSubmissionStatus = (assignmentId) => {
    return mySubmissions.find(s => s.assignment_id === assignmentId);
  };

  // Pagination calculated exactly like teacher side
  const totalPages = Math.ceil(assignments.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = assignments.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
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
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Available Assignments ({assignments.length})</h2>
        </div>

        {loading ? (
          <p className="text-center text-gray-500 py-10">Loading assignments...</p>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {currentItems.length === 0 ? (
                <li className="px-6 py-10 text-center text-gray-500">No assignments currently published.</li>
              ) : (
                currentItems.map((assignment) => {
                  const submission = getSubmissionStatus(assignment.id);
                  const isPastDue = new Date() > new Date(assignment.due_date);

                  return (
                    <li key={assignment.id} className="transition duration-150 ease-in-out hover:shadow-md hover:bg-blue-50">
                      <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-lg font-medium text-blue-600 truncate">{assignment.title}</p>
                          <p className="mt-1 text-sm text-gray-500 truncate">{assignment.description}</p>
                          <div className="mt-2 text-sm text-gray-500">
                            Due: {format(new Date(assignment.due_date), 'PPP p')}
                            {isPastDue && !submission && (
                              <span className="ml-2 text-red-500 font-medium">(Past Due)</span>
                            )}
                          </div>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          {submission ? (
                            <div className="flex flex-col items-end">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mb-2">
                                <CheckCircle className="h-4 w-4 mr-1" /> Submitted
                              </span>
                              <Link
                                to={`/student/assignments/${assignment.id}`}
                                className="text-sm text-blue-600 hover:text-blue-800"
                              >
                                View Submission <ArrowRight className="inline h-4 w-4" />
                              </Link>
                            </div>
                          ) : (
                            <Link
                              to={`/student/assignments/${assignment.id}`}
                              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                isPastDue
                                  ? 'bg-gray-400 cursor-not-allowed'
                                  : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                              }`}
                              style={{ pointerEvents: isPastDue ? 'none' : 'auto' }}
                            >
                              Attempt
                            </Link>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })
              )}
            </ul>
             {/* Pagination Controls */}
             {totalPages > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                      <span className="font-medium">{Math.min(indexOfLastItem, assignments.length)}</span> of{' '}
                      <span className="font-medium">{assignments.length}</span> results
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

export default StudentDashboard;
