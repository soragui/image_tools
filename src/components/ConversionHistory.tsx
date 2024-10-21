import React from 'react';
import { Clock, Download } from 'lucide-react';

const ConversionHistory: React.FC = () => {
  // TODO: Fetch actual conversion history from the backend
  const mockHistory = [
    { id: 1, filename: 'image1.jpg', action: 'Resize', date: '2023-04-01' },
    { id: 2, filename: 'image2.png', action: 'Convert to WebP', date: '2023-04-02' },
    { id: 3, filename: 'image3.gif', action: 'Resize', date: '2023-04-03' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Conversion History</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left">Filename</th>
              <th className="py-2 px-4 text-left">Action</th>
              <th className="py-2 px-4 text-left">Date</th>
              <th className="py-2 px-4 text-left">Download</th>
            </tr>
          </thead>
          <tbody>
            {mockHistory.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="py-2 px-4">{item.filename}</td>
                <td className="py-2 px-4">{item.action}</td>
                <td className="py-2 px-4">
                  <Clock className="inline-block mr-2" size={16} />
                  {item.date}
                </td>
                <td className="py-2 px-4">
                  <button className="text-blue-500 hover:text-blue-700">
                    <Download size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ConversionHistory;