import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cpfFormat',
  standalone: true
})
export class CpfFormatPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) {
      return '';
    }

    // Remove todos os caracteres não numéricos
    const numbers = value.replace(/\D/g, '');

    // Verifica se tem 11 dígitos (CPF válido)
    if (numbers.length === 11) {
      // Formato: 999.999.999-99
      return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9)}`;
    }

    // Se não conseguir formatar, retorna o valor original
    return value;
  }
}
