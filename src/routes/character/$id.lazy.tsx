import { createLazyFileRoute, Link, useParams } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { 
  ArrowLeft, 
  User, 
  MapPin, 
  Calendar,
  Tv,
  Heart,
  Skull,
  HelpCircle
} from 'lucide-react';
import { fetchCharacter } from '../../api/rickAndMorty';

export const Route = createLazyFileRoute('/character/$id')({
  component: CharacterDetail,
});

function CharacterDetail() {
  const { id } = useParams({ from: '/character/$id' });
  
  const {
    data: character,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['character', id],
    queryFn: () => fetchCharacter(id),
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-6 h-6 bg-gray-200 rounded"></div>
            <div className="h-6 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/3">
                <div className="w-full aspect-square bg-gray-200 rounded-lg"></div>
              </div>
              <div className="w-full md:w-2/3 space-y-6">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="space-y-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <div className="w-5 h-5 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Character</h2>
          <p className="text-red-600 mb-4">{error.message}</p>
          <Link
            to="/"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Characters</span>
          </Link>
        </div>
      </div>
    );
  }

  if (!character) {
    return null;
  }

  const statusConfig = {
    Alive: { icon: Heart, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    Dead: { icon: Skull, color: 'text-red-600', bg: 'bg-red-100' },
    unknown: { icon: HelpCircle, color: 'text-gray-600', bg: 'bg-gray-100' },
  };

  const StatusIcon = statusConfig[character.status].icon;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        to="/"
        className="inline-flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Characters</span>
      </Link>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                <img
                  src={character.image}
                  alt={character.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <User className="w-24 h-24 text-gray-400 hidden" />
              </div>
            </div>

            <div className="w-full md:w-2/3">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">{character.name}</h1>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${statusConfig[character.status].bg}`}>
                      <StatusIcon className={`w-5 h-5 ${statusConfig[character.status].color}`} />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">Status</div>
                      <div className="text-gray-900">{character.status}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">Species</div>
                      <div className="text-gray-900">{character.species}</div>
                    </div>
                  </div>

                  {character.type && (
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <User className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-500">Type</div>
                        <div className="text-gray-900">{character.type}</div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-pink-100 rounded-lg">
                      <User className="w-5 h-5 text-pink-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">Gender</div>
                      <div className="text-gray-900">{character.gender}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <MapPin className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">Origin</div>
                      <div className="text-gray-900">{character.origin.name}</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <MapPin className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">Last Known Location</div>
                      <div className="text-gray-900">{character.location.name}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <Tv className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">Episodes</div>
                      <div className="text-gray-900">{character.episode.length} episodes</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Calendar className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">Created</div>
                      <div className="text-gray-900">
                        {new Date(character.created).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}