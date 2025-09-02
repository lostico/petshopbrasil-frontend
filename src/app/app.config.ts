import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { 
  LucideAngularModule,
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Check,
  X,
  Eye,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-angular';

import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    importProvidersFrom(
      LucideAngularModule.pick({
        Plus,
        Edit,
        Trash2,
        ArrowLeft,
        ArrowRight,
        Check,
        X,
        Eye,
        Settings,
        ChevronLeft,
        ChevronRight,
        ChevronsLeft,
        ChevronsRight
      })
    )
  ]
};
