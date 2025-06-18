import { createLazyFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Link, useNavigate, useSearch } from '@tanstack/react-router';
import { RefreshCw, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { fetchCharacters } from '../api/rickAndMorty';
import { Character } from '../types/api';

const columnHelper = createColumnHelper<Character>();

const columns = [
  columnHelper.accessor('image', {
    header: '',
    cell: (info) => (
      <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
        <img
          src={info.getValue()}
          alt={info.row.original.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            target.nextElementSibling?.classList.remove('hidden');
          }}
        />
        <User className="w-8 h-8 text-gray-400 hidden" />
      </div>
    ),
    size: 80,
  }),
  columnHelper.accessor('name', {
    header: 'Name',
    cell: (info) => (
      <div className="font-semibold text-gray-900">{info.getValue()}</div>
    ),
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: (info) => {
      const status = info.getValue();
      const statusColors = {
        Alive: 'bg-emerald-100 text-emerald-800',
        Dead: 'bg-red-100 text-red-800',
        unknown: 'bg-gray-100 text-gray-800',
      };
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
          {status}
        </span>
      );
    },
  }),
  columnHelper.accessor('species', {
    header: 'Species',
    cell: (info) => (
      <div className="text-gray-600">{info.getValue()}</div>
    ),
  }),
  columnHelper.accessor('gender', {
    header: 'Gender',
    cell: (info) => (
      <div className="text-gray-600">{info.getValue()}</div>
    ),
  }),
  columnHelper.accessor('origin.name', {
    header: 'Origin',
    cell: (info) => (
      <div className="text-gray-600 max-w-32 truncate" title={info.getValue()}>
        {info.getValue()}
      </div>
    ),
  }),
];

export const Route = createLazyFileRoute('/')({
  validateSearch: (search): { page?: number } => ({
    page: Number(search.page) || 1,
  }),
  component: Index,
});

function Index() {
  const navigate = useNavigate({ from: '/' });
  const { page = 1 } = useSearch({ from: '/' });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['characters', page],
    queryFn: () => fetchCharacters(page),
  });

  const table = useReactTable({
    data: data?.results || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: data?.info.pages || 0,
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const handlePageChange = (newPage: number) => {
    navigate({
      to: '/',
      search: { page: newPage },
    });
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Characters</h2>
          <p className="text-red-600 mb-4">{error.message}</p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Characters</h1>
            {data && (
              <p className="text-gray-600">
                Showing {data.results.length} of {data.info.count} characters
              </p>
            )}
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
            className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="animate-pulse space-y-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/6"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : data ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => {
                        navigate({
                          to: '/character/$id',
                          params: { id: row.original.id.toString() },
                        });
                      }}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Page {page} of {data.info.pages}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={!data.info.prev}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={!data.info.next}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}