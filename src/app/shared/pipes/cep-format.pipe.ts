import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cepFormat',
  standalone: true
})
export class CepFormatPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) {
      return '';
    }

    // Remove todos os caracteres não numéricos
    const numbers = value.replace(/\D/g, '');

    // Verifica se tem 8 dígitos (CEP válido)
    if (numbers.length === 8) {
      // Formato: 99999-999
      return `${numbers.slice(0, 5)}-${numbers.slice(5)}`;
    }

    // Se não conseguir formatar, retorna o valor original
    return value;
  }
}
