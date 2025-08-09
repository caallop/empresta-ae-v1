import { apiService } from './api';

export interface CreateLoanData {
  itemId: string;
  startDate: string;
  endDate: string;
  notes?: string;
}

export interface Loan {
  id: string;
  itemId: string;
  borrowerId: string;
  lenderId: string;
  startDate: string;
  endDate: string;
  dailyRate: number;
  totalAmount: number;
  status: 'pending' | 'approved' | 'active' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export const loansService = {
  // Criar solicitação de empréstimo
  async createLoan(data: CreateLoanData): Promise<Loan> {
    const response = await apiService.post<Loan>('/loans', {
      item_id: data.itemId,
      start_date: data.startDate,
      end_date: data.endDate,
      notes: data.notes,
    });
    return response;
  },

  // Buscar empréstimo por ID
  async getLoan(id: string): Promise<Loan> {
    return apiService.get<Loan>(`/loans/${id}`);
  },

  // Buscar empréstimos do usuário
  async getUserLoans(): Promise<Loan[]> {
    return apiService.get<Loan[]>('/loans/user');
  },

  // Buscar empréstimos como emprestador
  async getLoansAsLender(): Promise<Loan[]> {
    return apiService.get<Loan[]>('/loans/lender');
  },

  // Atualizar status do empréstimo
  async updateLoanStatus(id: string, status: Loan['status'], notes?: string): Promise<Loan> {
    return apiService.patch<Loan>(`/loans/${id}/status`, {
      status,
      notes,
    });
  },
};
