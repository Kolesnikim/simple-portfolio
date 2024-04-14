import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'addressEllipsis',
  standalone: true,
})
export class AddressEllipsisPipe implements PipeTransform {
  transform(value?: string): string {
    return `${value?.slice(0, 6)}...${value?.slice(-4)}`;
  }
}
