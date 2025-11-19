import { FileText, Calendar } from 'lucide-react';
import { formatDate } from '../../utils/formatDate';

export default function Header() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-lg">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Nueva Factura</h1>
            <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
              <Calendar className="w-4 h-4" />
              {formatDate(new Date(), 'PPP')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
