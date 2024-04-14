import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatFormField, MatLabel, MatPrefix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatFabButton } from '@angular/material/button';
import { InfoNotificationService } from '../../core/services/info-notification/info-notification.service';
import { Router } from '@angular/router';
import { AddressValidator } from '../../shared/utils/AddressValidator';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatFormField,
    MatInput,
    ReactiveFormsModule,
    MatPrefix,
    MatIcon,
    MatButton,
    MatFabButton,
  ],
})
export class SearchComponent {
  searchForm = this.fb.group({
    walletId: [''],
  });

  constructor(
    private fb: FormBuilder,
    private notificator: InfoNotificationService,
    private router: Router
  ) {}

  submitForm() {
    const { walletId } = this.searchForm.value;

    if (this.isValidAddress(walletId)) this.router.navigateByUrl(`/wallet/${walletId}`);
  }

  private isValidAddress(walletId?: string | null) {
    if (!AddressValidator.isValidWalletAddress(walletId)) {
      this.notificator.showNotification(
        'Entered address is invalid. Please, provide the valid address'
      );

      return false;
    }

    if (!AddressValidator.isNotEmpty(walletId)) {
      this.notificator.showNotification(
        'You provided an empty value. Please, provide the valid address'
      );

      return false;
    }

    return true;
  }
}
