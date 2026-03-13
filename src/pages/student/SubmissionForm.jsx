import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import api from '../../utils/api';
import { format } from 'date-fns';

const SubmissionForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [assignment, setAssignment] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [assignRes, subRes] = await Promise.all([
          api.get(`/assignments/${id}`),
          api.get('/submissions/my')
        ]);
        setAssignment(assignRes.data);
        const existingSub = subRes.data.find(s => s.assignment_id === id);
        if (existingSub) {
          setSubmission(existingSub);
          setAnswer(existingSub.answer);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load assignment data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!answer.trim()) {
      setError('Answer cannot be empty.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const { data } = await api.post('/submissions', {
        assignment_id: id,
        answer
      });
      setSubmission(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit answer');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="min-h-screen bg-gray-50 py-10 px-4 text-center">
        <p className="text-red-500">Assignment not found or inaccessible.</p>
        <button onClick={() => navigate('/student')} className="mt-4 text-blue-600 underline">Back to Dashboard</button>
      </div>
    );
  }

  const isPastDue = new Date() > new Date(assignment.due_date);
  const canSubmit = !submission && !isPastDue && assignment.status === 'Published';

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center">
          <button onClick={() => navigate('/student')} className="mr-4 text-gray-500 hover:text-gray-900">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Assignment Details</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {assignment.title}
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Teacher: {assignment.teacher?.name}
              </p>
            </div>
            {submission && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                <CheckCircle className="h-4 w-4 mr-1" /> Submitted
              </span>
            )}
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Due Date</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {format(new Date(assignment.due_date), 'PPP p')}
                  {isPastDue && !submission && <span className="ml-2 text-red-500 font-medium">(Past Due)</span>}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Description</dt>
                <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{assignment.description}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Your Submission</h3>
            
            {error && <div className="mb-4 text-red-600 bg-red-50 p-3 rounded text-sm">{error}</div>}
            
            <form onSubmit={handleSubmit}>
              <div>
                <textarea
                  rows={8}
                  name="answer"
                  required
                  placeholder={canSubmit ? "Type your answer here..." : ""}
                  className={`mt-1 py-3 px-4 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md border ${
                    !canSubmit ? 'bg-gray-100' : ''
                  }`}
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  disabled={!canSubmit}
                />
              </div>
              
              {canSubmit && (
                <div className="mt-5 flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm disabled:opacity-50"
                  >
                    {submitting ? 'Submitting...' : 'Submit Answer'}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SubmissionForm;
