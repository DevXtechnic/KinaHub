import { useEffect, useState } from 'react';
import { apiRequest } from '../lib/api';
import { useAuth } from '../context/AuthContext';

interface Ticket {
  id: number;
  customer_email: string;
  subject: string;
  status: string;
  priority: string;
  created_at: string;
}

export default function CRMPage() {
  const { token } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    apiRequest<Ticket[]>('/crm/tickets/', { token })
      .then(setTickets)
      .catch(() => setTickets([]));
  }, [token]);

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-border bg-surface p-6">
        <h1 className="text-2xl font-black tracking-tight">CRM workspace</h1>
        <p className="mt-2 text-secondary">Customer records, seller records, leads, tickets, messages, notifications, and activity logs are backed by API modules.</p>
      </section>

      <section className="rounded-lg border border-border bg-surface p-6">
        <h2 className="text-lg font-bold">Support tickets</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[620px] text-left text-sm">
            <thead className="text-secondary">
              <tr>
                <th className="py-2">Subject</th>
                <th className="py-2">Customer</th>
                <th className="py-2">Priority</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="border-t border-border">
                  <td className="py-3 font-semibold">{ticket.subject}</td>
                  <td className="py-3">{ticket.customer_email}</td>
                  <td className="py-3 capitalize">{ticket.priority}</td>
                  <td className="py-3 capitalize">{ticket.status}</td>
                </tr>
              ))}
              {tickets.length === 0 && (
                <tr className="border-t border-border">
                  <td className="py-4 text-secondary" colSpan={4}>No tickets yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
