import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ToastConfig, ToastVariant } from '../components/toast/toast.component';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<ToastConfig[]>([]);
  public toasts$: Observable<ToastConfig[]> = this.toastsSubject.asObservable();

  private toastIdCounter = 0;

  /**
   * Exibe um toast de sucesso
   */
  success(title: string, message: string, duration: number = 5000): string {
    return this.show({
      id: this.generateId(),
      title,
      message,
      variant: 'success',
      duration
    });
  }

  /**
   * Exibe um toast de erro
   */
  error(title: string, message: string, duration: number = 7000): string {
    return this.show({
      id: this.generateId(),
      title,
      message,
      variant: 'error',
      duration
    });
  }

  /**
   * Exibe um toast de aviso
   */
  warning(title: string, message: string, duration: number = 6000): string {
    return this.show({
      id: this.generateId(),
      title,
      message,
      variant: 'warning',
      duration
    });
  }

  /**
   * Exibe um toast de informação
   */
  info(title: string, message: string, duration: number = 5000): string {
    return this.show({
      id: this.generateId(),
      title,
      message,
      variant: 'info',
      duration
    });
  }

  /**
   * Exibe um toast customizado
   */
  show(config: ToastConfig): string {
    const toasts = this.toastsSubject.value;
    toasts.push(config);
    this.toastsSubject.next([...toasts]);
    return config.id;
  }

  /**
   * Remove um toast específico
   */
  remove(toastId: string): void {
    const toasts = this.toastsSubject.value.filter(toast => toast.id !== toastId);
    this.toastsSubject.next(toasts);
  }

  /**
   * Remove todos os toasts
   */
  clear(): void {
    this.toastsSubject.next([]);
  }

  /**
   * Gera um ID único para o toast
   */
  private generateId(): string {
    return `toast-${++this.toastIdCounter}-${Date.now()}`;
  }

  /**
   * Métodos de conveniência para operações comuns
   */
  
  /**
   * Toast para operação de sucesso
   */
  showSuccess(message: string, title: string = 'Sucesso!'): string {
    return this.success(title, message);
  }

  /**
   * Toast para operação de erro
   */
  showError(message: string, title: string = 'Erro!'): string {
    return this.error(title, message);
  }

  /**
   * Toast para atualização de status
   */
  showStatusUpdate(serviceName: string, isActive: boolean): string {
    const action = isActive ? 'ativado' : 'desativado';
    const title = 'Status Atualizado';
    const message = `O serviço "${serviceName}" foi ${action} com sucesso.`;
    
    return this.success(title, message);
  }

  /**
   * Toast para criação de serviço
   */
  showServiceCreated(serviceName: string): string {
    const title = 'Serviço Criado';
    const message = `O serviço "${serviceName}" foi criado com sucesso.`;
    
    return this.success(title, message);
  }

  /**
   * Toast para atualização de serviço
   */
  showServiceUpdated(serviceName: string): string {
    const title = 'Serviço Atualizado';
    const message = `O serviço "${serviceName}" foi atualizado com sucesso.`;
    
    return this.success(title, message);
  }

  /**
   * Toast para exclusão de serviço
   */
  showServiceDeleted(serviceName: string): string {
    const title = 'Serviço Excluído';
    const message = `O serviço "${serviceName}" foi excluído com sucesso.`;
    
    return this.success(title, message);
  }
}
