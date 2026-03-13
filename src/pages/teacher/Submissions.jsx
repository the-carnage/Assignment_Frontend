import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import api from '../../utils/api';
import { format } from 'date-fns';

const Submissions = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [assignment, setAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [assignRes, subRes] = await Promise.all([
          api.get(`/assignments/${id}`),
          api.get(`/assignments/${id}/submissions`)
        ]);
        setAssignment(assignRes.data);
        setSubmissions(subRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleReview = async (submissionId) => {
    try {
      await api.put(`/submissions/${submissionId}/review`);
      setSubmissions(submissions.map(s => 
        s.id === submissionId ? { ...s, reviewed: true } : s
      ));
    } catch (err) {
      alert('Failed to mark as reviewed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <button onClick={() => navigate('/teacher')} className="mr-4 text-gray-500 hover:text-gray-900">
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              Submissions: {assignment?.title}
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <p className="text-center text-gray-500 py-10">Loading submissions...</p>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {submissions.length === 0 ? (
                <li className="px-6 py-10 text-center text-gray-500">No submissions yet.</li>
              ) : (
                submissions.map((sub) => (
                  <li key={sub.id} className="p-6 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{sub.student.name}</h3>
                        <p className="text-sm text-gray-500">{sub.student.email}</p>
                        <p className="text-xs text-gray-400 mt-1">Submitted: {format(new Date(sub.submitted_date), 'PP p')}</p>
                      </div>
                      <div>
                        {sub.reviewed ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            <CheckCircle className="h-4 w-4 mr-1" /> Reviewed
                          </span>
                        ) : (
                          <button
                            onClick={() => handleReview(sub.id)}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none"
                          >
                            Mark as Reviewed
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 bg-gray-50 p-4 rounded-md border border-gray-200">
                      <p className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                        {sub.answer}
                      </p>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
};

export default Submissions;
