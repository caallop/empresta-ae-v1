import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Star, User, Package, CheckCircle2, XCircle } from 'lucide-react';

import { AppHeader } from '@/components/ui/app-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { loansService } from '@/services/loans';
import { cn } from '@/lib/utils';

import type { Loan } from '@/services/loans';

interface LoanWithItemDetails extends Loan {
  item?: {
    id: string;
    title: string;
    description: string;
    price: number;
    images: string[];
    category?: {
      name: string;
      icon: string;
      color: string;
    };
  };
  owner?: {
    id: string;
    name: string;
    avatar?: string;
    rating?: number;
  };
}

export function MyReservationsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [reservations, setReservations] = useState<LoanWithItemDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReservations = async () => {
      if (!user) {
        navigate('/auth');
        return;
      }

      try {
        setLoading(true);
        const userLoans = await loansService.getUserLoans();
        setReservations(userLoans as LoanWithItemDetails[]);
      } catch (err) {
        console.error('Erro ao carregar reservas:', err);
        setError('Não foi possível carregar suas reservas');
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar suas reservas.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [user, navigate]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800' },
      approved: { label: 'Aprovado', color: 'bg-green-100 text-green-800' },
      active: { label: 'Ativo', color: 'bg-blue-100 text-blue-800' },
      completed: { label: 'Concluído', color: 'bg-gray-100 text-gray-800' },
      cancelled: { label: 'Cancelado', color: 'bg-red-100 text-red-800' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

    return (
      <Badge className={cn('text-xs font-medium', config.color)}>
        {config.label}
      </Badge>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader
          showBackButton
          onBack={() => navigate(-1)}
          title="Minhas Reservas"
          user={user ? {
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          } : null}
        />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Carregando suas reservas...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader
          showBackButton
          onBack={() => navigate(-1)}
          title="Minhas Reservas"
          user={user ? {
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          } : null}
        />
        <div className="container mx-auto px-4 py-8">
          <Card className="mx-auto max-w-md">
            <CardContent className="p-6 text-center">
              <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Erro ao carregar</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Tentar novamente
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        showBackButton
        onBack={() => navigate(-1)}
        title="Minhas Reservas"
        user={user ? {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        } : null}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Minhas Reservas</h1>
          <p className="text-gray-600">
            {reservations.length === 0 
              ? 'Você ainda não fez nenhuma reserva.'
              : `Você tem ${reservations.length} reserva${reservations.length !== 1 ? 's' : ''}.`
            }
          </p>
        </div>

        {reservations.length === 0 ? (
          <Card className="mx-auto max-w-md">
            <CardContent className="p-8 text-center">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma reserva encontrada</h3>
              <p className="text-gray-600 mb-6">
                Você ainda não fez nenhuma reserva. Explore os itens disponíveis e faça sua primeira reserva!
              </p>
              <Button onClick={() => navigate('/')} className="w-full">
                Explorar Itens
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {reservations.map((reservation) => (
              <Card key={reservation.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(reservation.status)}
                      <div>
                        <CardTitle className="text-lg">
                          {reservation.item?.title || 'Item não encontrado'}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          {getStatusBadge(reservation.status)}
                          <span className="text-sm text-gray-500">
                            Reservado em {formatDate(reservation.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-primary">
                        {formatCurrency(reservation.totalAmount)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {reservation.dailyRate && `${formatCurrency(reservation.dailyRate)}/dia`}
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Informações do Item */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {formatDate(reservation.startDate)} - {formatDate(reservation.endDate)}
                        </span>
                      </div>
                      
                      {reservation.notes && (
                        <div className="text-sm text-gray-600">
                          <strong>Motivo:</strong> {reservation.notes}
                        </div>
                      )}

                      {reservation.item?.category && (
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {reservation.item.category.name}
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Informações do Proprietário */}
                    <div className="space-y-3">
                      {reservation.owner && (
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            Proprietário: {reservation.owner.name}
                          </span>
                          {reservation.owner.rating && (
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs text-gray-500">
                                {reservation.owner.rating.toFixed(1)}
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>Localização disponível após confirmação</span>
                      </div>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex gap-2 mt-4 pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/items/${reservation.itemId}`)}
                    >
                      Ver Item
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/chat/${reservation.itemId}`)}
                    >
                      Conversar
                    </Button>
                    {reservation.status === 'pending' && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={async () => {
                          try {
                            await loansService.updateLoanStatus(reservation.id, 'cancelled');
                            toast({
                              title: 'Reserva cancelada',
                              description: 'Sua reserva foi cancelada com sucesso.',
                            });
                            // Recarregar a página
                            window.location.reload();
                          } catch (err) {
                            toast({
                              title: 'Erro',
                              description: 'Não foi possível cancelar a reserva.',
                              variant: 'destructive',
                            });
                          }
                        }}
                      >
                        Cancelar
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
