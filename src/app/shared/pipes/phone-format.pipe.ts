import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneFormat',
  standalone: true
})
export class PhoneFormatPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) {
      return '';
    }

    // Remove todos os caracteres não numéricos
    const numbers = value.replace(/\D/g, '');

    // Verifica se tem 10 ou 11 dígitos (com DDD)
    if (numbers.length === 10) {
      // Formato: (11) 9999-9999
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    } else if (numbers.length === 11) {
      // Formato: (11) 99999-9999
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
    } else if (numbers.length === 8) {
      // Formato: 9999-9999 (sem DDD)
      return `${numbers.slice(0, 4)}-${numbers.slice(4)}`;
    } else if (numbers.length === 9) {
      // Formato: 99999-9999 (sem DDD)
      return `${numbers.slice(0, 5)}-${numbers.slice(5)}`;
    }

    // Se não conseguir formatar, retorna o valor original
    return value;
  }
}
