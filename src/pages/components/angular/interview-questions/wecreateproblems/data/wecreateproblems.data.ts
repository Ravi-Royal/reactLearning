import type { AngularQuestion, QuestionCategory } from '../../../shared/types';

export const WCP_CATEGORIES: QuestionCategory[] = [
  { id: 'basics', label: 'Angular Basics', icon: '🏁' },
  { id: 'components', label: 'Components', icon: '🧩' },
  { id: 'binding', label: 'Data Binding', icon: '🔗' },
  { id: 'services', label: 'Services & DI', icon: '⚙️' },
  { id: 'forms', label: 'Forms', icon: '📋' },
  { id: 'routing', label: 'Routing & Guards', icon: '🔀' },
  { id: 'rxjs', label: 'RxJS & HTTP', icon: '🌐' },
  { id: 'performance', label: 'Performance', icon: '⚡' },
  { id: 'advanced', label: 'Advanced Topics', icon: '🚀' },
];

export const WCP_QUESTIONS: AngularQuestion[] = [
  {
    id: 1,
    question: 'What is Angular and what are its key features?',
    answer: `Angular is a platform and framework for building single-page client applications using HTML and TypeScript, developed by Google.

Key features:
• Component-Based Architecture — modular, reusable UI blocks
• Two-Way Data Binding — automatic sync between model and view
• Dependency Injection — built-in DI system for loose coupling
• Routing — powerful router for SPA navigation
• RxJS & Observables — reactive async programming
• Directives — extend HTML with custom behaviour
• Pipes — transform data for display
• Forms — template-driven and reactive forms
• AOT Compilation — compile at build time for performance
• Angular CLI — automation and project scaffolding`,
    category: 'basics',
    difficulty: 'beginner',
  },
  {
    id: 2,
    question: 'What is TypeScript and why does Angular use it?',
    answer: `TypeScript is a statically typed superset of JavaScript developed by Microsoft. Angular uses it because:

• Static typing — catches type errors at compile time
• Better IDE support — autocompletion, refactoring, intellisense
• Object-Oriented features — classes, interfaces, generics, decorators
• Decorators — @Component, @Injectable, @NgModule used by Angular
• Compiles to JavaScript — works in any JS environment
• Better maintainability for large codebases`,
    code: `// TypeScript interfaces and decorators in Angular
interface User {
  id: number;
  name: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private users: User[] = [];

  findById(id: number): User | undefined {
    return this.users.find(u => u.id === id);
  }
}`,
    category: 'basics',
    difficulty: 'beginner',
  },
  {
    id: 3,
    question: 'What are the different types of data binding in Angular?',
    answer: `Angular supports four types of data binding:

1. Interpolation {{ }} — one-way, component → template, displays values
2. Property Binding [property] — one-way, sets DOM/directive properties
3. Event Binding (event) — one-way, view → component, handles user events
4. Two-Way Binding [(ngModel)] — combines property + event binding`,
    code: `@Component({
  selector: 'app-binding-demo',
  template: \`
    <!-- 1. Interpolation -->
    <h1>Hello {{ userName }}!</h1>

    <!-- 2. Property Binding -->
    <img [src]="avatarUrl" [alt]="userName">
    <button [disabled]="isLoading">Submit</button>

    <!-- 3. Event Binding -->
    <button (click)="onSave()">Save</button>
    <input (keyup.enter)="onSearch()">

    <!-- 4. Two-Way Binding -->
    <input [(ngModel)]="searchTerm" placeholder="Search...">
    <p>Searching for: {{ searchTerm }}</p>
  \`
})
export class BindingDemoComponent {
  userName = 'John';
  avatarUrl = '/assets/avatar.png';
  isLoading = false;
  searchTerm = '';
}`,
    category: 'binding',
    difficulty: 'beginner',
  },
  {
    id: 4,
    question: 'What is the difference between ngOnInit and the constructor?',
    answer: `Constructor:
• Part of TypeScript/JavaScript class instantiation
• Called first, before any Angular lifecycle
• Use ONLY for dependency injection (constructor parameters)
• @Input properties are NOT yet set

ngOnInit:
• Angular lifecycle hook, part of OnInit interface
• Called after all @Input properties are set
• Ideal for: API calls, data initialisation, subscriptions
• Runs after first change detection pass`,
    code: `@Component({ selector: 'app-user', template: '...' })
export class UserComponent implements OnInit {
  @Input() userId!: string;
  user: User | null = null;

  constructor(private userService: UserService) {
    // ✅ OK: inject service
    // ❌ BAD: this.userId is undefined here!
  }

  ngOnInit(): void {
    // ✅ this.userId is now available
    this.userService.getUser(this.userId).subscribe(
      u => this.user = u
    );
  }
}`,
    category: 'components',
    difficulty: 'beginner',
  },
  {
    id: 5,
    question: 'What is the purpose of @Input and @Output decorators?',
    answer: `@Input — allows parent components to pass data INTO a child component (one-way, parent → child).
@Output — allows child components to emit events to the parent (one-way, child → parent). Uses EventEmitter.

Together they form the primary parent-child communication mechanism.`,
    code: `// Child component
@Component({
  selector: 'app-product-card',
  template: \`
    <div class="card">
      <h3>{{ product.name }}</h3>
      <p>{{ product.price | currency }}</p>
      <button (click)="addToCart()">Add to Cart</button>
    </div>
  \`
})
export class ProductCardComponent {
  @Input() product!: { name: string; price: number; id: number };
  @Output() cartAdd = new EventEmitter<number>();

  addToCart() {
    this.cartAdd.emit(this.product.id);
  }
}

// Parent template
<app-product-card
  [product]="selectedProduct"
  (cartAdd)="handleCartAdd($event)">
</app-product-card>`,
    category: 'components',
    difficulty: 'beginner',
  },
  {
    id: 6,
    question: 'What is dependency injection and how is it used in Angular?',
    answer: `Dependency Injection is a design pattern where a class receives its dependencies from an external source rather than creating them internally.

Angular's DI framework:
• Providers register services (how to create them)
• Injectors manage and serve instances
• Classes declare dependencies via constructor parameters
• The DI system resolves and injects them automatically

Levels: root (global), module, component/directive/pipe`,
    code: `// 1. Create an injectable service
@Injectable({ providedIn: 'root' }) // root = singleton
export class NotificationService {
  private messages: string[] = [];

  notify(msg: string) {
    this.messages.push(msg);
    console.log('Notification:', msg);
  }
}

// 2. Inject into a component (via constructor)
@Component({ ... })
export class CheckoutComponent {
  constructor(
    private notifications: NotificationService,
    private cart: CartService
  ) {}

  checkout() {
    this.cart.processOrder().subscribe(() => {
      this.notifications.notify('Order placed successfully!');
    });
  }
}

// 3. Modern inject() function (Angular 14+)
export class ModernComponent {
  private notifications = inject(NotificationService);
}`,
    category: 'services',
    difficulty: 'intermediate',
  },
  {
    id: 7,
    question: 'What is the difference between template-driven and reactive forms?',
    answer: `Template-Driven Forms:
• Form structure defined in HTML template using directives
• Simple, good for basic use cases
• Asynchronous (uses NgModel, directives)
• Less control, harder to test

Reactive Forms:
• Form model defined in the TypeScript class
• Uses FormControl, FormGroup, FormArray, FormBuilder
• Synchronous, predictable, testable
• Best for complex, dynamic forms with custom validation`,
    code: `// Template-Driven
<form #loginForm="ngForm" (ngSubmit)="login(loginForm.value)">
  <input name="email" ngModel required email>
  <input name="password" ngModel required minlength="6" type="password">
  <button [disabled]="loginForm.invalid">Login</button>
</form>

// Reactive
@Component({ ... })
export class LoginComponent {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ])
  });

  login() {
    if (this.form.valid) {
      this.authService.login(this.form.value);
    }
  }
}
// Template
<form [formGroup]="form" (ngSubmit)="login()">
  <input formControlName="email">
  <span *ngIf="form.get('email')?.errors?.['email']">Invalid email</span>
  <input formControlName="password" type="password">
  <button [disabled]="form.invalid">Login</button>
</form>`,
    category: 'forms',
    difficulty: 'intermediate',
  },
  {
    id: 8,
    question: 'What is Angular routing and how do you configure it?',
    answer: `Angular's Router enables navigation between views. It maps URL paths to components and manages the navigation history.

Configuration:
1. Define Routes array with path→component mappings
2. Import RouterModule.forRoot(routes) in AppModule
3. Place <router-outlet> where components should render
4. Use routerLink for declarative navigation`,
    code: `// 1. Define routes
export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'products/:id', component: ProductDetailComponent },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    canActivate: [authGuard]
  },
  { path: '**', component: PageNotFoundComponent }
];

// 2. Template navigation
<nav>
  <a routerLink="/home" routerLinkActive="active">Home</a>
  <a [routerLink]="['/products', product.id]">View</a>
</nav>
<router-outlet></router-outlet>

// 3. Programmatic navigation
constructor(private router: Router) {}
goToProduct(id: number) {
  this.router.navigate(['/products', id], { queryParams: { ref: 'home' } });
}`,
    category: 'routing',
    difficulty: 'intermediate',
  },
  {
    id: 9,
    question: 'What are Angular Guards and when do you use them?',
    answer: `Guards are interfaces/functions that control navigation:

• canActivate — protect route from unauthorised access
• canActivateChild — protect all child routes
• canDeactivate — prevent navigation away (e.g. unsaved changes)
• canMatch — conditionally match a route pattern
• resolve — pre-fetch data before the route activates`,
    code: `// Auth guard (functional, Angular 14+)
export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.isAuthenticated()
    ? true
    : router.createUrlTree(['/login'], {
        queryParams: { returnUrl: state.url }
      });
};

// CanDeactivate guard
export interface CanComponentDeactivate {
  canDeactivate(): boolean;
}

export const unsavedChangesGuard: CanDeactivateFn<CanComponentDeactivate> =
  (component) => {
    return component.canDeactivate()
      || confirm('You have unsaved changes. Leave anyway?');
  };`,
    category: 'routing',
    difficulty: 'intermediate',
  },
  {
    id: 10,
    question: 'What is an Observable and how does it differ from a Promise?',
    answer: `Observable:
• Can emit multiple values over time (stream)
• Lazy — nothing happens until subscribe()
• Cancellable via subscription.unsubscribe()
• Rich operator ecosystem (map, filter, retry, debounce...)
• Part of RxJS library

Promise:
• Emits exactly one value then completes
• Eager — starts immediately on creation
• Not cancellable
• Limited API (.then, .catch, .finally)
• Built into JavaScript`,
    code: `import { Observable, of, from } from 'rxjs';
import { map, filter, delay } from 'rxjs/operators';

// Observable: multiple values
const numbers$ = new Observable<number>(observer => {
  observer.next(1);
  observer.next(2);
  observer.next(3);
  observer.complete();
});

numbers$.pipe(
  filter(n => n > 1),
  map(n => n * 10)
).subscribe(console.log); // 20, 30

// HTTP example - Observable
this.http.get<User[]>('/api/users').pipe(
  map(users => users.filter(u => u.active)),
  catchError(err => of([]))
).subscribe(users => this.users = users);`,
    category: 'rxjs',
    difficulty: 'intermediate',
  },
  {
    id: 11,
    question: 'What is an Angular interceptor?',
    answer: `HTTP Interceptors intercept and modify HTTP requests/responses globally.

Common use cases:
• Add authentication tokens to headers
• Log all HTTP traffic
• Handle errors centrally (401 → redirect to login)
• Show/hide a global loading indicator
• Cache responses
• Transform request/response data`,
    code: `@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = this.auth.getToken();

    // Clone request (requests are immutable)
    const authReq = token
      ? req.clone({ setHeaders: { Authorization: \`Bearer \${token}\` } })
      : req;

    return next.handle(authReq).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          console.log('Response:', event.status);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) this.auth.logout();
        return throwError(() => error);
      })
    );
  }
}`,
    category: 'rxjs',
    difficulty: 'advanced',
  },
  {
    id: 12,
    question: 'What is ChangeDetectionStrategy.OnPush?',
    answer: `OnPush is a change detection strategy that tells Angular to only check a component when:
1. An @Input() property receives a new reference
2. An event (click, input) originates from the component/its children
3. An Observable via async pipe emits a new value
4. ChangeDetectorRef.markForCheck() is called

Benefits: significantly reduces unnecessary check cycles in large apps.`,
    code: `@Component({
  selector: 'app-order-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div class="order">
      <span>{{ order.product }}</span>
      <span>{{ order.quantity }}</span>
      <span>{{ order.total | currency }}</span>
    </div>
  \`
})
export class OrderItemComponent {
  @Input() order!: Order;
  // Checked only when order reference changes

  // For non-input updates:
  constructor(private cdr: ChangeDetectorRef) {}

  updateFromWebSocket(data: Order) {
    this.order = data; // new reference triggers re-check
    // OR:
    this.cdr.markForCheck();
  }
}`,
    category: 'performance',
    difficulty: 'advanced',
  },
  {
    id: 13,
    question: 'How do you optimise the performance of an Angular application?',
    answer: `Key optimisation techniques:

Build time:
• Use AOT compilation (default in production)
• Enable tree shaking and minification (ng build --prod)
• Optimise bundle with source-map-explorer

Runtime:
• Use OnPush change detection on components
• Lazy load feature modules (loadChildren)
• Use trackBy in *ngFor loops
• Use async pipe (auto-unsubscribe)
• Avoid complex expressions in templates
• Use pure pipes for data transformation
• Virtual scrolling for large lists (@angular/cdk)
• Memoize expensive computations
• Avoid unnecessary subscriptions (use takeUntilDestroyed)`,
    category: 'performance',
    difficulty: 'advanced',
  },
  {
    id: 14,
    question: 'What is Angular AOT (Ahead-of-Time) compilation?',
    answer: `AOT compiles Angular templates and TypeScript code into JavaScript during the build phase rather than at runtime (JIT).

Benefits:
• Faster rendering — browser downloads pre-compiled code
• Fewer async requests — no need to download Angular compiler
• Detects template errors at build time
• Better security — HTML and components are compiled before serving
• Smaller Angular framework size (compiler not included)

Default in ng build for production since Angular 9.`,
    category: 'performance',
    difficulty: 'advanced',
  },
  {
    id: 15,
    question: 'What is the Angular Service Worker and PWA support?',
    answer: `Angular's @angular/pwa package configures a service worker that turns your app into a Progressive Web App.

Features:
• Asset caching (HTML, CSS, JS, images)
• API response caching
• Offline support — serves cached content when offline
• Push notifications support
• Background sync

Setup: ng add @angular/pwa generates ngsw-config.json and registers the service worker in the app module.`,
    code: `// ngsw-config.json (simplified)
{
  "index": "/index.html",
  "assetGroups": [{
    "name": "app",
    "installMode": "prefetch",
    "resources": {
      "files": ["/favicon.ico", "/index.html", "/*.css", "/*.js"]
    }
  }],
  "dataGroups": [{
    "name": "api-freshness",
    "urls": ["/api/**"],
    "cacheConfig": {
      "strategy": "freshness",
      "maxSize": 100,
      "maxAge": "1d"
    }
  }]
}`,
    category: 'advanced',
    difficulty: 'advanced',
  },
  {
    id: 16,
    question: 'How do you handle state management in Angular applications?',
    answer: `Angular state management options (in order of complexity):

1. Component State — local properties for simple, isolated state
2. Services (BehaviorSubject) — shared state between components
3. Angular Signals (v16+) — reactive primitives for local/shared state
4. NgRx — Redux pattern for complex, large-scale apps
5. Akita / NGXS — alternative state management libraries`,
    code: `// Service-based state with BehaviorSubject
@Injectable({ providedIn: 'root' })
export class CartStateService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItems.asObservable();
  cartCount$ = this.cartItems$.pipe(
    map(items => items.reduce((sum, i) => sum + i.quantity, 0))
  );

  addItem(item: CartItem) {
    const current = this.cartItems.getValue();
    this.cartItems.next([...current, item]);
  }

  removeItem(id: number) {
    this.cartItems.next(
      this.cartItems.getValue().filter(i => i.id !== id)
    );
  }
}

// Signal-based state (Angular 16+)
@Injectable({ providedIn: 'root' })
export class SignalCartService {
  items = signal<CartItem[]>([]);
  count = computed(() => this.items().length);

  add(item: CartItem) { this.items.update(prev => [...prev, item]); }
}`,
    category: 'advanced',
    difficulty: 'advanced',
  },
  {
    id: 17,
    question: 'What is NgZone and when would you use it?',
    answer: `Zone.js is a library that patches async APIs (setTimeout, XHR, Promises, events) so Angular knows when to run change detection. NgZone is Angular's service to interact with Zone.js.

runOutsideAngular() — runs code outside Angular's zone (no change detection triggered), useful for performance-heavy operations (canvas animations, WebSockets).

run() — brings code back into Angular's zone to trigger change detection after outside-zone operations.`,
    code: `@Component({ template: '<canvas #canvas></canvas>' })
export class AnimationComponent implements OnInit {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  constructor(private ngZone: NgZone) {}

  ngOnInit() {
    // Run animation outside Angular zone (no change detection)
    this.ngZone.runOutsideAngular(() => {
      const animate = () => {
        this.drawFrame();
        requestAnimationFrame(animate);
      };
      animate();
    });

    // WebSocket messages outside zone
    this.ngZone.runOutsideAngular(() => {
      this.ws.onmessage = (msg) => {
        // Only re-enter Angular zone when you need UI update
        this.ngZone.run(() => {
          this.message = msg.data;
        });
      };
    });
  }
}`,
    category: 'advanced',
    difficulty: 'advanced',
  },
  {
    id: 18,
    question: 'What is the role of the Angular Ivy compiler?',
    answer: `Ivy is Angular's default compilation and rendering pipeline (since Angular 9). Key characteristics:

• Locality — each component is compiled independently
• Tree-shaking — unused Angular features are excluded from bundles
• Better debugging — readable stack traces and component names
• Faster incremental builds
• Smaller bundle sizes
• Enables lazy-loading of individual components (standalone)
• Foundation for upcoming zoneless Angular`,
    category: 'advanced',
    difficulty: 'advanced',
  },
  {
    id: 19,
    question: 'How do you implement authentication in Angular?',
    answer: `A typical Angular authentication implementation involves:

1. AuthService — manages login/logout/token
2. HTTP Interceptor — attaches JWT to every request
3. Route Guard — protects authenticated routes
4. Refresh token logic via interceptor
5. Store token in localStorage or memory (not cookies unless HttpOnly)`,
    code: `@Injectable({ providedIn: 'root' })
export class AuthService {
  private loggedIn = signal(false);
  isLoggedIn = this.loggedIn.asReadonly();

  constructor(private http: HttpClient, private router: Router) {
    this.loggedIn.set(!!localStorage.getItem('token'));
  }

  login(credentials: { email: string; password: string }) {
    return this.http.post<{ token: string }>('/api/auth/login', credentials).pipe(
      tap(({ token }) => {
        localStorage.setItem('token', token);
        this.loggedIn.set(true);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.loggedIn.set(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}`,
    category: 'advanced',
    difficulty: 'advanced',
  },
  {
    id: 20,
    question: 'What are dynamic components in Angular?',
    answer: `Dynamic components are loaded and created at runtime rather than declared in a template. Used for: modals, toasts, dashboards, drag-and-drop interfaces.

Since Angular 13, use ViewContainerRef.createComponent() directly — no need for ComponentFactoryResolver.`,
    code: `@Component({
  selector: 'app-modal-host',
  template: '<ng-container #modalContainer></ng-container>'
})
export class ModalHostComponent {
  @ViewChild('modalContainer', { read: ViewContainerRef })
  container!: ViewContainerRef;

  openModal<T>(component: Type<T>, data?: Partial<T>) {
    this.container.clear();

    const ref = this.container.createComponent(component);

    // Pass data to the dynamic component
    if (data) {
      Object.assign(ref.instance as object, data);
    }

    // Listen for close event
    (ref.instance as any).closed?.subscribe(() => {
      ref.destroy();
    });

    return ref;
  }
}

// Usage
this.modalHost.openModal(ConfirmDialogComponent, {
  title: 'Delete Item?',
  message: 'This action cannot be undone.'
});`,
    category: 'advanced',
    difficulty: 'advanced',
  },
  {
    id: 21,
    question: 'How do you optimize an Angular application using trackBy?',
    answer: `When using \`*ngFor\` to iterate over a collection, Angular re-renders the entire DOM tree for that collection if any item is added, removed, or changed. This is highly inefficient.

By using a \`trackBy\` function, you tell Angular how to uniquely identify items (e.g., by an \`id\`). Angular will then only re-render the specific items that have changed, significantly improving performance for large lists.`,
    code: `// Component
export class ItemListComponent {
  items = [{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }];

  trackByItemId(index: number, item: any): number {
    return item.id;
  }
}

// Template
<ul>
  <li *ngFor="let item of items; trackBy: trackByItemId">
    {{ item.name }}
  </li>
</ul>

// Angular 17+ control flow uses 'track' natively
@for (item of items; track item.id) {
  <li>{{ item.name }}</li>
}`,
    category: 'performance',
    difficulty: 'intermediate',
  },
  {
    id: 22,
    question: 'What is the purpose of the AsyncPipe?',
    answer: `The \`AsyncPipe\` (\`| async\`) subscribes to an \`Observable\` or \`Promise\` and returns the latest value it has emitted.

Key benefits:
1.  **Automatic Unsubscription**: When the component is destroyed, the \`AsyncPipe\` automatically unsubscribes, preventing memory leaks.
2.  **Cleaner Code**: You don't need to manually subscribe, store the value in a property, and implement \`ngOnDestroy\` to unsubscribe.
3.  **OnPush Change Detection**: It seamlessly works with \`ChangeDetectionStrategy.OnPush\` by automatically calling \`markForCheck()\` when a new value arrives.`,
    code: `// Component
export class UserComponent {
  user$ = this.http.get<User>('/api/user/1');
  constructor(private http: HttpClient) {}
}

// Template
<div *ngIf="user$ | async as user">
  <p>Name: {{ user.name }}</p>
  <p>Email: {{ user.email }}</p>
</div>`,
    category: 'rxjs',
    difficulty: 'intermediate',
  },
  {
    id: 23,
    question: 'What are pure and impure pipes?',
    answer: `*   **Pure Pipes (Default)**: Angular executes a pure pipe only when it detects a *pure change* to the input value. A pure change is a change to a primitive input value (String, Number, Boolean) or a changed object reference (Date, Array, Object). It is very fast and highly optimized.
*   **Impure Pipes**: Angular executes an impure pipe during *every single component change detection cycle*. This is resource-intensive. Impure pipes are needed if the data mutates internally (e.g., an array gets a new item pushed to it, but the array reference doesn't change).`,
    code: `import { Pipe, PipeTransform } from '@angular/core';

// Pure Pipe
@Pipe({ name: 'purePipe' }) 
export class PurePipe implements PipeTransform {
  transform(value: any) { /* ... */ }
}

// Impure Pipe
@Pipe({ name: 'impurePipe', pure: false }) 
export class ImpurePipe implements PipeTransform {
  transform(value: any) { /* ... */ }
}`,
    category: 'binding',
    difficulty: 'intermediate',
  },
  {
    id: 24,
    question: 'Explain the difference between Subject and BehaviorSubject.',
    answer: `Both are types of Observables from RxJS used to multicast values to multiple Observers.

*   **Subject**: Does not hold an initial value. Observers only receive values emitted *after* they subscribe.
*   **BehaviorSubject**: Requires an initial value. Whenever an Observer subscribes, it immediately receives the *current* (most recent) value, even if it was emitted before the subscription.`,
    code: `import { Subject, BehaviorSubject } from 'rxjs';

// Subject
const subject = new Subject<number>();
subject.subscribe(val => console.log('Subject:', val));
subject.next(1); // Prints "Subject: 1"

// BehaviorSubject
const bSubject = new BehaviorSubject<number>(0); // Initial value 0
bSubject.subscribe(val => console.log('BehaviorSubject:', val)); // Immediately prints "BehaviorSubject: 0"
bSubject.next(1); // Prints "BehaviorSubject: 1"`,
    category: 'rxjs',
    difficulty: 'intermediate',
  },
  {
    id: 25,
    question: 'How do you dynamically load a component in Angular?',
    answer: `You can dynamically load components using \`ViewContainerRef\` and the \`createComponent()\` method. This is useful for modals, tooltips, or dynamic dashboards.

*(Note: Prior to Angular 13, \`ComponentFactoryResolver\` was required, but it is now deprecated in favor of a simpler API).*`,
    code: `import { Component, ViewChild, ViewContainerRef, ComponentRef } from '@angular/core';
import { DynamicComponent } from './dynamic.component';

@Component({
  selector: 'app-host',
  template: \`<ng-container #dynamicContainer></ng-container>\`
})
export class HostComponent {
  @ViewChild('dynamicContainer', { read: ViewContainerRef }) container!: ViewContainerRef;
  componentRef!: ComponentRef<DynamicComponent>;

  loadComponent() {
    this.container.clear();
    // Dynamically create and render the component
    this.componentRef = this.container.createComponent(DynamicComponent);
    
    // Pass data via @Input
    this.componentRef.instance.data = 'Hello Dynamic World';
  }

  ngOnDestroy() {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }
}`,
    category: 'advanced',
    difficulty: 'advanced',
  },
  {
    id: 26,
    question: 'What is the purpose of the CanActivate guard?',
    answer: `The \`CanActivate\` guard determines whether a route can be activated (i.e., whether a user can navigate to that route). It is commonly used for authentication and authorization.

If the guard returns \`true\`, navigation continues. If it returns \`false\` or a \`UrlTree\` (e.g., to redirect to a login page), navigation is cancelled or redirected.`,
    code: `import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

// Functional Guard (Angular 14+)
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Redirect to login page
  return router.parseUrl('/login');
};

// Usage in Routes
// { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] }`,
    category: 'routing',
    difficulty: 'intermediate',
  },
  {
    id: 27,
    question: 'What is the difference between switchMap and mergeMap?',
    answer: `Both are RxJS higher-order mapping operators used commonly with HTTP requests.

*   **switchMap**: Cancels the previous inner observable and subscribes to the new one. Use it when you only care about the *latest* request (e.g., a search typeahead). If a user types "A" then "B", the request for "A" is cancelled.
*   **mergeMap**: Keeps all inner observables alive and merges their outputs concurrently. Use it when you want *all* requests to complete and you don't care about the order (e.g., uploading multiple files in parallel).`,
    code: `import { fromEvent } from 'rxjs';
import { switchMap, mergeMap } from 'rxjs/operators';

// switchMap (Search box)
fromEvent(searchInput, 'input').pipe(
  // If user types again before API returns, previous request is CANCELLED
  switchMap(event => this.api.search(event.target.value))
).subscribe(results => console.log(results));

// mergeMap (Bulk actions)
of(1, 2, 3).pipe(
  // All 3 requests happen concurrently
  mergeMap(id => this.api.getUserDetails(id))
).subscribe(details => console.log(details));`,
    category: 'rxjs',
    difficulty: 'advanced',
  },
  {
    id: 28,
    question: 'How do you define default values in Reactive Forms?',
    answer: `You define default values when initializing the \`FormControl\` instances within your \`FormGroup\` or \`FormBuilder\`. You can also update them later using \`patchValue()\` or \`setValue()\`.`,
    code: `import { FormBuilder, FormGroup } from '@angular/forms';

export class MyFormComponent {
  myForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.myForm = this.fb.group({
      // Provide default value 'John Doe'
      name: ['John Doe'],
      // Provide default value 25
      age: [25],
      // Provide default value with validators
      email: ['test@test.com', [Validators.required, Validators.email]]
    });
  }

  resetToDefaults() {
    // Resetting the form can also restore default values
    this.myForm.reset({
      name: 'Jane Doe',
      age: 30,
      email: ''
    });
  }
}`,
    category: 'forms',
    difficulty: 'beginner',
  },
  {
    id: 29,
    question: 'What is the safe navigation operator?',
    answer: `The safe navigation operator (\`?\`) in Angular templates prevents null reference exceptions when trying to access a property of an object that might be null or undefined.

If the object is null/undefined, it simply returns null instead of throwing an error.`,
    code: `<!-- If 'user' is null, this will THROW AN ERROR -->
<p>{{ user.profile.firstName }}</p>

<!-- Using Safe Navigation Operator -->
<!-- If 'user' or 'user.profile' is null, it gracefully returns empty string -->
<p>{{ user?.profile?.firstName }}</p>

<!-- Can also be used with methods -->
<p>{{ user?.getFullName() }}</p>`,
    category: 'binding',
    difficulty: 'beginner',
  },
  {
    id: 30,
    question: 'Explain the concept of Tree Shaking in Angular.',
    answer: `Tree shaking is a dead code elimination step performed by the build tool (like Webpack or Rollup) during the production build.

It analyzes the codebase to determine which modules and code paths are actually used and imported. Any code that is imported but never used is "shaken" out of the final bundle, resulting in significantly smaller bundle sizes.

Angular's \`providedIn: 'root'\` syntax for services was specifically designed to make services tree-shakable.`,
    code: `// This service IS tree-shakable. If no component injects it, 
// it will NOT be included in the final JS bundle.
@Injectable({
  providedIn: 'root'
})
export class TreeShakableService {
  /* ... */
}

// Old way (NOT tree-shakable if added to NgModule providers array)
@Injectable()
export class OldService {
  /* ... */
}`,
    category: 'performance',
    difficulty: 'intermediate',
  },
  {
    id: 31,
    question: 'How do you handle global error handling in Angular?',
    answer: `Global error handling is typically achieved by implementing Angular's \`ErrorHandler\` class. By default, Angular logs errors to the console, but you can override this behavior to send errors to a logging service (like Sentry) or show a global UI notification.`,
    code: `import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: any) {
    // 1. Log to console
    console.error('An unexpected error occurred:', error);
    
    // 2. Send to a remote logging service (e.g., Sentry)
    // this.loggingService.log(error);
    
    // 3. Show a generic error notification to the user
    // this.toastService.showError('Something went wrong. Please try again.');
  }
}

// In app.module.ts (or app.config.ts)
providers: [
  { provide: ErrorHandler, useClass: GlobalErrorHandler }
]`,
    category: 'core',
    difficulty: 'advanced',
  },
  {
    id: 32,
    question: 'What is the purpose of the ng-container tag?',
    answer: `\`<ng-container>\` is a logical container that groups elements but **is not rendered in the DOM**. 

It is incredibly useful when you need to apply a structural directive (like \`*ngIf\` or \`*ngFor\`) to a block of HTML without adding extra wrapper elements (like a \`<div>\`) which might break CSS styling (like Flexbox or Grid). It's also required because Angular doesn't allow two structural directives on the same element.`,
    code: `<!-- Problem: Cannot put *ngIf and *ngFor on the same element -->
<!-- <div *ngIf="isLoaded" *ngFor="let item of items">{{ item }}</div> -->

<!-- Solution: Use ng-container -->
<ng-container *ngIf="isLoaded">
  <div *ngFor="let item of items">
    {{ item }}
  </div>
</ng-container>

<!-- Another Use Case: Avoid breaking CSS Grids -->
<div class="grid-container">
  <!-- This won't render an extra div to ruin the grid -->
  <ng-container *ngIf="showExtraCells">
    <div class="grid-cell">A</div>
    <div class="grid-cell">B</div>
  </ng-container>
</div>`,
    category: 'templates',
    difficulty: 'beginner',
  },
  {
    id: 33,
    question: 'Explain ContentChild and ContentChildren.',
    answer: `While \`ViewChild\` queries elements within the component's *own* template, \`ContentChild\` queries elements that are projected *into* the component from a parent using \`<ng-content>\`.

*   **\`@ContentChild\`**: Returns the first projected element matching the selector.
*   **\`@ContentChildren\`**: Returns a \`QueryList\` of all projected elements matching the selector.`,
    code: `import { Component, ContentChild, ElementRef, AfterContentInit } from '@angular/core';

@Component({
  selector: 'app-card',
  template: \`
    <div class="card-wrapper">
      <ng-content></ng-content>
    </div>
  \`
})
export class CardComponent implements AfterContentInit {
  // Queries for an element with the #header ref passed via content projection
  @ContentChild('header') headerEl!: ElementRef;

  ngAfterContentInit() {
    if (this.headerEl) {
      console.log('Projected header text:', this.headerEl.nativeElement.innerText);
    }
  }
}

// Parent Usage
// <app-card>
//   <h1 #header>Welcome</h1>
// </app-card>`,
    category: 'components',
    difficulty: 'advanced',
  },
  {
    id: 34,
    question: 'What are Route Resolvers and when should you use them?',
    answer: `A Route Resolver is a data provider class (or function in newer Angular) used with the Router to fetch data *before* a route is activated and the component is rendered.

If the data fetch fails, or the resolver returns an empty/false observable, the navigation is cancelled. This prevents rendering an empty component shell while waiting for critical data.`,
    code: `import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ApiService } from './api.service';

// Functional Resolver (Angular 15+)
export const userResolver: ResolveFn<User> = (route, state) => {
  const api = inject(ApiService);
  const id = route.paramMap.get('id')!;
  return api.getUser(id); // Returns an Observable
};

// Routing Config
// { path: 'user/:id', component: UserComponent, resolve: { userData: userResolver } }

// Component
export class UserComponent implements OnInit {
  user!: User;
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // Data is immediately available!
    this.user = this.route.snapshot.data['userData'];
  }
}`,
    category: 'routing',
    difficulty: 'intermediate',
  },
  {
    id: 35,
    question: 'How do you handle forms with dynamic numbers of inputs (FormArray)?',
    answer: `In Reactive Forms, you use a \`FormArray\` to manage an indeterminate number of form controls (e.g., adding multiple phone numbers or a list of skills). It provides methods to \`push()\`, \`insert()\`, and \`removeAt()\` controls dynamically.`,
    code: `import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

export class ProfileFormComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      skills: this.fb.array([]) // Initialize empty FormArray
    });
  }

  get skills() {
    return this.form.get('skills') as FormArray;
  }

  addSkill() {
    this.skills.push(this.fb.control(''));
  }

  removeSkill(index: number) {
    this.skills.removeAt(index);
  }
}

// Template
// <div formArrayName="skills">
//   <div *ngFor="let skill of skills.controls; let i=index">
//     <input [formControlName]="i">
//     <button (click)="removeSkill(i)">X</button>
//   </div>
// </div>`,
    category: 'forms',
    difficulty: 'advanced',
  },
  {
    id: 36,
    question: 'What is the purpose of RxJS combineLatest?',
    answer: `\`combineLatest\` is an RxJS operator that combines multiple Observables. 

It waits for *all* input Observables to emit at least one value. Once they all have, it emits an array containing the *latest* values from each. If *any* of the Observables subsequently emits a new value, \`combineLatest\` re-emits a new array with the updated combination.`,
    code: `import { combineLatest, BehaviorSubject } from 'rxjs';

const search$ = new BehaviorSubject('angular');
const filter$ = new BehaviorSubject('active');

combineLatest([search$, filter$]).subscribe(([search, filter]) => {
  // Runs initially when both have emitted once.
  // Runs again every time either search$ OR filter$ emits a new value.
  console.log(\`Searching for \${search} with filter \${filter}\`);
  // Trigger API call here
});`,
    category: 'rxjs',
    difficulty: 'intermediate',
  },
  {
    id: 37,
    question: 'How do you use environment variables in Angular?',
    answer: `Angular provides an \`environments\` folder containing files like \`environment.ts\` (for development) and \`environment.prod.ts\` (for production). 

During the build process, Angular CLI's file replacement feature automatically swaps \`environment.ts\` with the production version (or other configurations defined in \`angular.json\`).`,
    code: `// environment.ts (Development)
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};

// environment.prod.ts (Production)
export const environment = {
  production: true,
  apiUrl: 'https://api.myproduction.com/v1'
};

// Component or Service
import { environment } from '../environments/environment';

export class ApiService {
  constructor(private http: HttpClient) {}
  
  getUsers() {
    // Automatically uses the correct URL based on the build target
    return this.http.get(\`\${environment.apiUrl}/users\`);
  }
}`,
    category: 'core',
    difficulty: 'beginner',
  },
  {
    id: 38,
    question: 'Explain the distinctUntilChanged operator.',
    answer: `\`distinctUntilChanged\` is an RxJS operator that suppresses consecutive duplicate emissions. It only lets a value pass through if it is strictly different (\`===\`) from the *immediately preceding* value.

It is highly useful for optimizing input fields or state streams where identical subsequent events should not trigger heavy computations or network requests.`,
    code: `import { of } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

// Emits 1, 2, 3, 2
of(1, 1, 2, 2, 2, 3, 2).pipe(
  distinctUntilChanged()
).subscribe(console.log);

// With objects, you must provide a custom comparison function
of(
  { id: 1, name: 'A' },
  { id: 1, name: 'A' },
  { id: 2, name: 'B' }
).pipe(
  // Compare based on 'id'
  distinctUntilChanged((prev, curr) => prev.id === curr.id)
).subscribe(console.log);`,
    category: 'rxjs',
    difficulty: 'intermediate',
  },
  {
    id: 39,
    question: 'What are Angular Standalone Components (v14+)?',
    answer: `Standalone Components provide a simplified way to build Angular applications without needing \`NgModules\`. 

By setting \`standalone: true\` in the \`@Component\` decorator, the component directly imports the dependencies (other components, directives, pipes, modules) it needs, making the application structure flatter and easier to learn.`,
    code: `import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Replaces BrowserModule
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-standalone-example',
  standalone: true,
  // Directly import what this component needs
  imports: [CommonModule, RouterModule], 
  template: \`
    <h1 *ngIf="show">Standalone Component!</h1>
    <a routerLink="/home">Go Home</a>
  \`
})
export class StandaloneExampleComponent {
  show = true;
}`,
    category: 'core',
    difficulty: 'intermediate',
  },
  {
    id: 40,
    question: 'How do you optimize bundle size in an Angular app?',
    answer: `Bundle size optimization strategies:
1.  **Lazy Loading**: Split the app into lazy-loaded routes so users only download what they need.
2.  **Tree Shaking**: Ensure services use \`providedIn: 'root'\` and avoid importing heavy, non-shakable third-party libraries (import specific operators from RxJS, specific icons from libraries).
3.  **Production Build**: Always build with \`ng build --configuration production\` (enables minification, AOT, and dead-code elimination).
4.  **Deferrable Views (\`@defer\`)**: In Angular 17+, use \`@defer\` to lazily load chunks of a component's template.
5.  **Analyze Bundles**: Use \`webpack-bundle-analyzer\` or Angular CLI's \`source-map-explorer\` to find large dependencies.`,
    category: 'performance',
    difficulty: 'advanced',
  },
  {
    id: 41,
    question: 'What is the purpose of ngOnChanges?',
    answer: `\`ngOnChanges\` is a lifecycle hook that is called *before* \`ngOnInit\` and whenever one or more data-bound input properties (\`@Input\`) change.

It receives a \`SimpleChanges\` object containing the previous and current values of the changed inputs. It's the ideal place to perform logic that must react specifically to input changes.`,
    code: `import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({...})
export class UserCardComponent implements OnChanges {
  @Input() userRole!: string;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['userRole']) {
      console.log('Role changed from', changes['userRole'].previousValue, 'to', changes['userRole'].currentValue);
      // Execute logic based on the new role
    }
  }
}`,
    category: 'core',
    difficulty: 'intermediate',
  },
  {
    id: 42,
    question: 'How do you pass data via the Router?',
    answer: `Data can be passed through the Router in several ways:
1.  **Route Parameters**: Passed in the URL path (e.g., \`/user/:id\`). Read via \`ActivatedRoute.paramMap\`.
2.  **Query Parameters**: Passed in the URL query string (e.g., \`/search?q=angular\`). Read via \`ActivatedRoute.queryParamMap\`.
3.  **Route Data**: Static data defined in the route config. Read via \`ActivatedRoute.data\`.
4.  **Navigation State**: Hidden state passed during navigation, not visible in the URL. Read via \`Router.getCurrentNavigation()?.extras.state\`.`,
    code: `// 1. Sending State during navigation
this.router.navigate(['/success'], { state: { transactionId: 12345 } });

// 2. Reading State in the destination component
export class SuccessComponent implements OnInit {
  txId: number;

  constructor(private router: Router) {
    // State is ONLY available in the constructor during navigation!
    const navigation = this.router.getCurrentNavigation();
    this.txId = navigation?.extras.state?.['transactionId'];
  }
}`,
    category: 'routing',
    difficulty: 'intermediate',
  },
  {
    id: 43,
    question: 'What is the Host element in Angular?',
    answer: `The "Host element" is the DOM element that an Angular component or directive is attached to. 

For a component \`<app-user></app-user>\`, that tag itself is the host element. You can style the host element using the \`:host\` pseudo-class selector in CSS, and bind to its properties/events using \`@HostBinding\` and \`@HostListener\`.`,
    code: `/* user.component.css */
/* Targets the <app-user> tag itself, not its internal template */
:host {
  display: block;
  border: 1px solid gray;
  padding: 10px;
}

/* Targets the host ONLY if it has the 'active' class */
:host(.active) {
  background-color: lightblue;
}`,
    category: 'components',
    difficulty: 'beginner',
  },
  {
    id: 44,
    question: 'How do you test an Angular Component with dependencies?',
    answer: `To test a component that injects services, you use Angular's \`TestBed\` to configure a testing module. You should provide **mocks or spies** instead of real services to isolate the component's logic and prevent real network requests.`,
    code: `import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyComponent } from './my.component';
import { ApiService } from './api.service';
import { of } from 'rxjs';

describe('MyComponent', () => {
  let component: MyComponent;
  let fixture: ComponentFixture<MyComponent>;
  let apiSpy: jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    // Create a mock object
    const spy = jasmine.createSpyObj('ApiService', ['getData']);
    // Setup the mock to return an Observable
    spy.getData.and.returnValue(of(['Mock Data']));

    TestBed.configureTestingModule({
      declarations: [ MyComponent ],
      providers: [
        { provide: ApiService, useValue: spy }
      ]
    });

    fixture = TestBed.createComponent(MyComponent);
    component = fixture.componentInstance;
    apiSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
  });

  it('should fetch data on init', () => {
    fixture.detectChanges(); // triggers ngOnInit
    expect(apiSpy.getData).toHaveBeenCalled();
    expect(component.items).toEqual(['Mock Data']);
  });
});`,
    category: 'testing',
    difficulty: 'advanced',
  },
  {
    id: 45,
    question: 'What is the purpose of the ngAfterViewInit lifecycle hook?',
    answer: `\`ngAfterViewInit\` is called once after Angular has fully initialized a component's view and its child views. 

It is the correct place to access DOM elements or child components via \`@ViewChild\` or \`@ViewChildren\`. If you try to access them in \`ngOnInit\`, they will be \`undefined\`.`,
    category: 'core',
    difficulty: 'intermediate',
  },
  {
    id: 46,
    question: 'Explain the difference between a Component and a Directive.',
    answer: `*   **Component**: An Angular class decorated with \`@Component\`. It *must* have a template (HTML view) and styles. It creates a UI block. Under the hood, a Component is actually just a Directive with a template.
*   **Directive**: An Angular class decorated with \`@Directive\`. It *does not* have a template. Its purpose is to add behavior, manipulate the DOM, or change the appearance of an existing host element (like \`ngClass\`, \`ngStyle\`, or a custom hover effect).`,
    category: 'core',
    difficulty: 'beginner',
  },
  {
    id: 47,
    question: 'What are Angular Deferrable Views (@defer)?',
    answer: `Introduced in Angular 17, \`@defer\` allows declarative lazy-loading of a block of template code, including all components, directives, and pipes used within that block.

It replaces complex routing-based lazy loading for components. You can trigger the loading based on conditions (e.g., when the element enters the viewport, on click, on hover).`,
    code: `@Component({
  template: \`
    <button #loadBtn>Load Heavy Chart</button>

    <!-- The ChartComponent is ONLY downloaded and rendered when loadBtn is clicked -->
    @defer (on interaction(loadBtn)) {
      <app-heavy-chart></app-heavy-chart>
    } @placeholder {
      <p>Chart will appear here...</p>
    } @loading {
      <p>Loading chart code...</p>
    } @error {
      <p>Failed to load the chart.</p>
    }
  \`
})
export class DashboardComponent {}`,
    category: 'performance',
    difficulty: 'advanced',
  },
  {
    id: 48,
    question: 'How do you handle unhandled exceptions in RxJS?',
    answer: `If an error is thrown inside an RxJS stream and is not caught by a \`catchError\` operator, the Observable immediately terminates. The \`error\` callback of the Observer (the second argument of \`.subscribe()\`) will handle it.

However, once an Observable errors, it "dies" and cannot emit further values. If you need a stream (like a search input) to survive errors, you must place \`catchError\` *inside* the inner observable (e.g., inside \`switchMap\`).`,
    code: `import { fromEvent, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

// Correct pattern to keep the main stream alive
fromEvent(searchInput, 'input').pipe(
  switchMap(event => 
    this.api.search(event.target.value).pipe(
      // Catching HERE allows the outer fromEvent stream to continue working
      catchError(err => of([])) // Return empty array on failure
    )
  )
).subscribe(results => console.log(results));`,
    category: 'rxjs',
    difficulty: 'advanced',
  },
  {
    id: 49,
    question: 'What is the purpose of the keyvalue pipe?',
    answer: `The \`keyvalue\` pipe is used to iterate over the properties of an Object or a Map using \`*ngFor\` (or \`@for\`), since structural directives normally only work on Arrays or Iterables.`,
    code: `// Component
export class DemoComponent {
  userMap = {
    name: 'Alice',
    age: 30,
    role: 'Admin'
  };
}

// Template
<ul>
  <!-- The pipe converts the object into an array of {key, value} objects -->
  <li *ngFor="let item of userMap | keyvalue">
    <strong>{{ item.key }}</strong>: {{ item.value }}
  </li>
</ul>`,
    category: 'binding',
    difficulty: 'beginner',
  },
  {
    id: 50,
    question: 'Explain the difference between NgForm and FormGroup.',
    answer: `*   **\`NgForm\`**: A directive automatically attached by Angular to a \`<form>\` tag when importing \`FormsModule\` (Template-Driven forms). It acts as a top-level container, tracking the validity of all \`ngModel\` directives inside it.
*   **\`FormGroup\`**: A class used in \`ReactiveFormsModule\`. It aggregates the values and validity of multiple \`FormControl\` instances into a single object. You explicitly create and manage it in the component class.`,
    category: 'forms',
    difficulty: 'intermediate',
  },
  {
    id: 51,
    question: 'How do you prevent memory leaks when listening to DOM events in Angular?',
    answer: `When using \`Renderer2.listen()\` or native \`addEventListener\` inside an Angular component, the listener stays active even after the component is destroyed, leading to memory leaks.

To prevent this:
1.  **Renderer2**: \`listen()\` returns an unlisten function. Call this function in \`ngOnDestroy\`.
2.  **RxJS fromEvent**: Use \`takeUntil\` with a subject that emits in \`ngOnDestroy\`.
3.  **HostListener**: This is automatically cleaned up by Angular, so no manual action is needed.`,
    code: `import { Component, Renderer2, ElementRef, OnInit, OnDestroy } from '@angular/core';

@Component({...})
export class EventComponent implements OnInit, OnDestroy {
  private unlisten!: () => void;

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  ngOnInit() {
    // Renderer2.listen returns a function you can call to remove the listener
    this.unlisten = this.renderer.listen(this.el.nativeElement, 'click', (event) => {
      console.log('Clicked!', event);
    });
  }

  ngOnDestroy() {
    if (this.unlisten) {
      this.unlisten(); // Cleans up the event listener
    }
  }
}`,
    category: 'performance',
    difficulty: 'intermediate',
  },
  {
    id: 52,
    question: 'What is the purpose of the ng-template tag?',
    answer: `\`<ng-template>\` is an Angular element used for rendering HTML. It is **never displayed directly**. Instead, Angular uses it to define template content that can be stamped out later dynamically (via \`*ngIf\`, \`*ngFor\`, \`*ngTemplateOutlet\`, or ViewContainerRef).`,
    code: `<!-- 1. Using with *ngIf else clause -->
<div *ngIf="isLoggedIn; else loginBlock">
  Welcome back, User!
</div>

<!-- This block is invisible until referenced by the *ngIf above -->
<ng-template #loginBlock>
  <button>Please Login</button>
</ng-template>

<!-- 2. Reusing a template with ngTemplateOutlet -->
<ng-template #card let-title="title">
  <div class="card">
    <h2>{{ title }}</h2>
  </div>
</ng-template>

<ng-container *ngTemplateOutlet="card; context: { title: 'First Card' }"></ng-container>
<ng-container *ngTemplateOutlet="card; context: { title: 'Second Card' }"></ng-container>`,
    category: 'templates',
    difficulty: 'intermediate',
  },
  {
    id: 53,
    question: 'Explain the difference between CanActivate and CanActivateChild.',
    answer: `Both are Route Guards used to control access.

*   **\`CanActivate\`**: Prevents access to a *specific route*. If applied to a parent route, it runs only when navigating to the parent itself.
*   **\`CanActivateChild\`**: Prevents access to *all child routes* of a parent route. It runs every time navigation attempts to enter any of the child routes.`,
    code: `const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard], // Protects /admin
    canActivateChild: [RoleGuard], // Protects /admin/users, /admin/settings, etc.
    children: [
      { path: 'users', component: UsersComponent },
      { path: 'settings', component: SettingsComponent }
    ]
  }
];`,
    category: 'routing',
    difficulty: 'intermediate',
  },
  {
    id: 54,
    question: 'What is lazy loading and how is it configured in Angular?',
    answer: `Lazy loading defers the loading of a module or component until the user actually navigates to its route. This drastically reduces the initial bundle size (Main bundle) and speeds up the initial page load time.

It is configured using the \`loadChildren\` (for modules) or \`loadComponent\` (for standalone components) property in the route definition using dynamic \`import()\`.`,
    code: `const routes: Routes = [
  // Eagerly loaded (loaded immediately)
  { path: 'home', component: HomeComponent },
  
  // Lazy Loaded Module
  { 
    path: 'dashboard', 
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) 
  },
  
  // Lazy Loaded Standalone Component (Angular 14+)
  { 
    path: 'profile', 
    loadComponent: () => import('./profile/profile.component').then(c => c.ProfileComponent) 
  }
];`,
    category: 'performance',
    difficulty: 'intermediate',
  },
  {
    id: 55,
    question: 'What is the purpose of map vs tap in RxJS?',
    answer: `*   **\`map\`**: Used to transform the data emitted by the Observable. It returns a new value which is passed down the stream.
*   **\`tap\`**: Used to perform side effects (like logging, setting external variables) *without* modifying the data. It returns the exact same value it received.`,
    code: `import { map, tap } from 'rxjs/operators';

this.http.get<any[]>('/api/users').pipe(
  // Use tap for side-effects (logging)
  tap(users => console.log(\`Fetched \${users.length} users\`)),
  
  // Use map for transformation (extracting names)
  map(users => users.map(u => u.name))
).subscribe(names => {
  console.log('User names:', names);
});`,
    category: 'rxjs',
    difficulty: 'beginner',
  },
  {
    id: 56,
    question: 'What is the difference between Angular Template-driven forms and Reactive forms?',
    answer: `*   **Template-Driven Forms**: The form logic and structure are defined directly in the HTML template using directives like \`ngModel\`. They are asynchronous, mutable, and good for simple scenarios. Testing is harder because it requires a DOM.
*   **Reactive Forms**: The form logic, structure, and validation are defined synchronously in the component class using \`FormControl\` and \`FormGroup\`. The template simply binds to these objects. They are robust, immutable, scalable, and highly testable without needing a DOM.`,
    category: 'forms',
    difficulty: 'intermediate',
  },
  {
    id: 57,
    question: 'How do you share data between unrelated components in Angular?',
    answer: `To share data between components that do not have a parent-child relationship, you use a **Shared Service**.

Typically, this service uses an RxJS \`BehaviorSubject\` to hold the current state, allowing any component to push new data to it, and any other component to subscribe and react to changes.`,
    code: `import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DataService {
  // Hold the current data, initialize with null
  private dataSubject = new BehaviorSubject<string | null>(null);
  
  // Expose as an observable for components to subscribe to
  currentData$ = this.dataSubject.asObservable();

  // Method to update the data
  updateData(newData: string) {
    this.dataSubject.next(newData);
  }
}

// Component A (Sender)
this.dataService.updateData('New Value from A');

// Component B (Receiver)
this.dataService.currentData$.subscribe(data => console.log(data));`,
    category: 'services',
    difficulty: 'intermediate',
  },
  {
    id: 58,
    question: 'What is the difference between markForCheck() and detectChanges()?',
    answer: `Both are methods of \`ChangeDetectorRef\` used to manually trigger change detection, usually when using \`OnPush\` strategy.

*   **\`markForCheck()\`**: Does NOT trigger change detection immediately. It simply marks the component and all its parents as "dirty". Angular will check them during the *next* normal change detection cycle.
*   **\`detectChanges()\`**: Triggers change detection **synchronously and immediately** for the component and its children. Use this sparingly, typically in unit tests or highly specific edge cases.`,
    code: `import { Component, ChangeDetectorRef } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`<p>{{ data }}</p>\`
})
export class PushComponent {
  data = 'Old';

  constructor(private cdr: ChangeDetectorRef) {
    // External event (e.g., WebSocket or third-party JS)
    setTimeout(() => {
      this.data = 'New';
      
      // Tell Angular to check this component on the next cycle
      this.cdr.markForCheck(); 
    }, 1000);
  }
}`,
    category: 'performance',
    difficulty: 'advanced',
  },
  {
    id: 59,
    question: 'What are HttpErrorResponse and catchError?',
    answer: `When an HTTP request fails in Angular, it returns an \`HttpErrorResponse\` object containing the status code, message, and error details.

\`catchError\` is an RxJS operator used in the pipe to catch and handle this error gracefully. It must return a new Observable (often \`throwError\` to pass the error to the subscriber, or \`of()\` to provide a fallback value).`,
    code: `import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export class ApiService {
  constructor(private http: HttpClient) {}

  getData() {
    return this.http.get('/api/data').pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMsg = 'Unknown error!';
        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMsg = \`Error: \${error.error.message}\`;
        } else {
          // Server-side error
          errorMsg = \`Error Code: \${error.status}, Message: \${error.message}\`;
        }
        console.error(errorMsg);
        
        // Pass error to the component
        return throwError(() => new Error(errorMsg)); 
      })
    );
  }
}`,
    category: 'rxjs',
    difficulty: 'intermediate',
  },
  {
    id: 60,
    question: 'What is the purpose of the keyvalue pipe?',
    answer: `The \`keyvalue\` pipe is used to iterate over the properties of an Object or a Map using \`*ngFor\` (or \`@for\`), since structural directives normally only work on Arrays or Iterables.`,
    code: `// Component
export class DemoComponent {
  userMap = {
    name: 'Alice',
    age: 30,
    role: 'Admin'
  };
}

// Template
<ul>
  <!-- The pipe converts the object into an array of {key, value} objects -->
  <li *ngFor="let item of userMap | keyvalue">
    <strong>{{ item.key }}</strong>: {{ item.value }}
  </li>
</ul>`,
    category: 'binding',
    difficulty: 'beginner',
  },
  {
    id: 61,
    question: 'How do you detect changes to a specific input property in ngOnChanges?',
    answer: `The \`ngOnChanges\` lifecycle hook receives a \`SimpleChanges\` object. This object has keys matching the names of the input properties that changed. You can check if a specific key exists to know if that property was updated.`,
    code: `import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({...})
export class UserProfileComponent implements OnChanges {
  @Input() userId!: number;
  @Input() theme!: string;

  ngOnChanges(changes: SimpleChanges) {
    // Only fetch data if the userId specifically changed
    if (changes['userId'] && !changes['userId'].firstChange) {
      this.fetchUserDetails(this.userId);
    }
    
    if (changes['theme']) {
      this.applyTheme(this.theme);
    }
  }

  fetchUserDetails(id: number) { /* ... */ }
  applyTheme(theme: string) { /* ... */ }
}`,
    category: 'core',
    difficulty: 'intermediate',
  },
  {
    id: 62,
    question: 'What is the purpose of the AsyncValidator interface?',
    answer: `While standard validators (like \`Validators.required\`) run synchronously, \`AsyncValidator\` is used when validation requires an asynchronous operation, such as an HTTP request to check if a username or email is already taken. It must return an Observable or Promise.`,
    code: `import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError, delay } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UniqueUsernameValidator implements AsyncValidator {
  constructor(private api: ApiService) {}

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    return this.api.checkUsername(control.value).pipe(
      map(isTaken => (isTaken ? { uniqueUsername: true } : null)),
      catchError(() => of(null)) // Handle errors gracefully
    );
  }
}

// Usage in FormBuilder
// username: ['', [Validators.required], [this.uniqueUsernameValidator.validate.bind(this.uniqueUsernameValidator)]]`,
    category: 'forms',
    difficulty: 'advanced',
  },
  {
    id: 63,
    question: 'Explain the concept of Structural Directives.',
    answer: `Structural Directives are responsible for HTML layout. They shape or reshape the DOM's structure, typically by adding, removing, or manipulating elements.

They always start with an asterisk (\`*\`), which is syntactic sugar that Angular unwraps into an \`<ng-template>\`.
Examples: \`*ngIf\`, \`*ngFor\`, \`*ngSwitch\`.`,
    code: `<!-- Using Syntactic Sugar (The asterisk) -->
<div *ngIf="hero" class="name">{{ hero.name }}</div>

<!-- How Angular interprets it internally (Desugared) -->
<ng-template [ngIf]="hero">
  <div class="name">{{ hero.name }}</div>
</ng-template>`,
    category: 'directives',
    difficulty: 'beginner',
  },
  {
    id: 64,
    question: 'How do you define a Wildcard Route, and why does order matter?',
    answer: `A Wildcard Route (\`**\`) catches any URL that hasn't matched a preceding route. It's commonly used to display a 404 Not Found page.

**Order matters critically:** The Angular Router uses a first-match-wins strategy. If you place the wildcard route at the top of your routes array, it will match *every* URL, and none of your other routes will ever be reached. It must be placed at the very bottom.`,
    code: `import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  
  // MUST BE LAST!
  { path: '**', component: PageNotFoundComponent } 
];`,
    category: 'routing',
    difficulty: 'intermediate',
  },
  {
    id: 65,
    question: 'What is the difference between @ViewChild(..., { static: true }) and static: false?',
    answer: `The \`static\` flag determines *when* the view query is resolved.

*   **\`static: true\`**: Resolves the query *before* change detection runs (specifically, before \`ngOnInit\`). Use this only if the element is always present in the template (not hidden by \`*ngIf\`).
*   **\`static: false\` (Default)**: Resolves the query *after* change detection runs (specifically, before \`ngAfterViewInit\`). Use this if the element might be rendered dynamically via \`*ngIf\` or \`*ngFor\`.`,
    code: `import { Component, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';

@Component({
  template: \`<input #myInput type="text">\`
})
export class MyComponent implements OnInit, AfterViewInit {
  // Available in ngOnInit!
  @ViewChild('myInput', { static: true }) input1!: ElementRef; 
  
  // Available only in ngAfterViewInit!
  @ViewChild('myInput', { static: false }) input2!: ElementRef;

  ngOnInit() {
    console.log(this.input1); // Defined
    console.log(this.input2); // Undefined
  }

  ngAfterViewInit() {
    console.log(this.input2); // Defined
  }
}`,
    category: 'components',
    difficulty: 'advanced',
  },
  {
    id: 66,
    question: 'What are HttpParams and how do you use them?',
    answer: `\`HttpParams\` is an immutable class used to define HTTP query parameters for an \`HttpClient\` request. Because it is immutable, methods like \`.set()\` or \`.append()\` return a *new* instance of \`HttpParams\`, so you must reassign it.`,
    code: `import { HttpClient, HttpParams } from '@angular/common/http';

export class ApiService {
  constructor(private http: HttpClient) {}

  searchUsers(query: string, page: number) {
    // Correct way to build immutable params
    let params = new HttpParams()
      .set('search', query)
      .set('page', page.toString())
      .set('limit', '10');

    // Generates: /api/users?search=John&page=1&limit=10
    return this.http.get('/api/users', { params });
  }
}`,
    category: 'services',
    difficulty: 'beginner',
  },
  {
    id: 67,
    question: 'What is the pathMatch property in routing?',
    answer: `\`pathMatch\` dictates how the router matches the URL against the \`path\` property.

*   **\`prefix\` (Default)**: Matches if the URL *starts* with the defined path.
*   **\`full\`**: Matches only if the URL is an *exact* match.

\`pathMatch: 'full'\` is almost always required when defining an empty path (\`path: ''\`) for a redirect, otherwise the empty path acts as a prefix to *every* URL, causing infinite redirect loops.`,
    code: `const routes: Routes = [
  // If 'full' was omitted, this would match '/dashboard', '/user', etc.,
  // causing an infinite redirect loop.
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  
  { path: 'home', component: HomeComponent }
];`,
    category: 'routing',
    difficulty: 'intermediate',
  },
  {
    id: 68,
    question: 'How do you create a feature module?',
    answer: `A Feature Module is an \`NgModule\` that encapsulates a specific set of functionality, isolating it from the main \`AppModule\`. It typically contains its own components, directives, pipes, and routing file.

This keeps the codebase organized and allows the feature to be lazy-loaded.`,
    code: `// admin.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; // Use CommonModule, NOT BrowserModule
import { AdminRoutingModule } from './admin-routing.module';
import { AdminDashboardComponent } from './admin-dashboard.component';

@NgModule({
  declarations: [
    AdminDashboardComponent
  ],
  imports: [
    CommonModule, // Provides *ngIf, *ngFor
    AdminRoutingModule
  ]
})
export class AdminModule { }`,
    category: 'core',
    difficulty: 'intermediate',
  },
  {
    id: 69,
    question: 'Explain the RxJS filter operator.',
    answer: `The \`filter\` operator evaluates each value emitted by the source Observable against a predicate function. If the function returns \`true\`, the value is passed down the stream. If \`false\`, the value is ignored.`,
    code: `import { from } from 'rxjs';
import { filter } from 'rxjs/operators';

const numbers$ = from([1, 2, 3, 4, 5, 6]);

// Only let even numbers pass through
numbers$.pipe(
  filter(num => num % 2 === 0)
).subscribe(evenNum => {
  console.log(evenNum); // Outputs: 2, 4, 6
});`,
    category: 'rxjs',
    difficulty: 'beginner',
  },
  {
    id: 70,
    question: 'What is AOT Compilation?',
    answer: `AOT (Ahead-of-Time) compilation compiles your Angular HTML templates and TypeScript code into highly optimized JavaScript code *during the build phase*, before the browser downloads it.

Benefits:
1.  **Faster Rendering**: The browser doesn't have to compile the app, so it renders instantly.
2.  **Smaller Bundle**: The Angular Compiler itself isn't shipped to the browser.
3.  **Template Errors Caught Early**: HTML template binding errors are caught at build time instead of runtime.
4.  **Better Security**: Evaluates HTML safely, reducing injection attacks.`,
    category: 'performance',
    difficulty: 'intermediate',
  },
  {
    id: 71,
    question: 'How do you test an Angular Service that has HTTP dependencies?',
    answer: `When testing services that use \`HttpClient\`, you use the \`HttpClientTestingModule\` and \`HttpTestingController\`. These allow you to mock HTTP requests and responses, ensuring your tests run instantly without hitting a real backend.`,
    code: `import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Replaces HttpClient
      providers: [ApiService]
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no outstanding requests
  });

  it('should fetch data', () => {
    const mockData = { name: 'Test' };

    service.getData().subscribe(data => {
      expect(data).toEqual(mockData);
    });

    // Expect a GET request and return the mock data
    const req = httpMock.expectOne('/api/data');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });
});`,
    category: 'testing',
    difficulty: 'advanced',
  },
  {
    id: 72,
    question: 'Explain the switchMap operator in RxJS.',
    answer: `\`switchMap\` maps an emitted value to a new Observable. Crucially, if a new value arrives from the source *before* the inner Observable completes, \`switchMap\` **cancels** the previous inner Observable and switches to the new one.

This is perfect for search typeaheads where you only care about the results of the *latest* keystroke and want to cancel pending HTTP requests for older keystrokes.`,
    code: `import { fromEvent } from 'rxjs';
import { switchMap } from 'rxjs/operators';

const searchInput = document.getElementById('search');

fromEvent(searchInput, 'input').pipe(
  // If user types 'a' then 'b' quickly:
  // 'a' triggers search('a').
  // 'b' arrives. search('a') is CANCELLED. search('ab') begins.
  switchMap(event => this.api.search(event.target.value))
).subscribe(results => {
  console.log('Results:', results);
});`,
    category: 'rxjs',
    difficulty: 'advanced',
  },
  {
    id: 73,
    question: 'What is a Pure Pipe and an Impure Pipe?',
    answer: `*   **Pure Pipe (Default)**: Angular only executes a pure pipe when it detects a *pure change* to the input value (e.g., a primitive value changes like String or Number, or an object *reference* changes). If you mutate an array (push a new item), a pure pipe will *not* detect it. They are highly performant.
*   **Impure Pipe**: Angular executes an impure pipe during *every single component change detection cycle*, regardless of whether the input changed. This can cause massive performance issues. Used for things like async pipes or sorting mutable arrays.`,
    code: `import { Pipe, PipeTransform } from '@angular/core';

// Pure Pipe
@Pipe({
  name: 'purePipe',
  pure: true // Default behavior
})
export class PurePipe implements PipeTransform {
  transform(value: any): any { return value; }
}

// Impure Pipe (Executes continuously)
@Pipe({
  name: 'impurePipe',
  pure: false
})
export class ImpurePipe implements PipeTransform {
  transform(value: any): any { return value; }
}`,
    category: 'directives',
    difficulty: 'intermediate',
  },
  {
    id: 74,
    question: 'How do you handle animations in Angular?',
    answer: `Angular has its own animation module (\`@angular/animations\`). You define states (like 'open' and 'closed'), transitions between those states, and the CSS styles for each state.`,
    code: `import { trigger, state, style, animate, transition } from '@angular/animations';
import { Component } from '@angular/core';

@Component({
  selector: 'app-anim',
  template: \`<button [@openClose]="isOpen ? 'open' : 'closed'" (click)="isOpen = !isOpen">Toggle</button>\`,
  animations: [
    trigger('openClose', [
      state('open', style({
        height: '200px',
        opacity: 1,
        backgroundColor: 'yellow'
      })),
      state('closed', style({
        height: '100px',
        opacity: 0.5,
        backgroundColor: 'green'
      })),
      // Animation duration
      transition('open => closed', [ animate('1s') ]),
      transition('closed => open', [ animate('0.5s') ]),
    ])
  ]
})
export class AnimComponent {
  isOpen = true;
}`,
    category: 'core',
    difficulty: 'advanced',
  },
  {
    id: 75,
    question: 'What is the purpose of the AsyncPipe?',
    answer: `The \`AsyncPipe\` (\`| async\`) subscribes to an \`Observable\` or \`Promise\` directly in the HTML template and returns the latest value it has emitted. 

Crucially, when the component is destroyed, the \`AsyncPipe\` automatically unsubscribes, preventing memory leaks. It also marks the component for change detection when a new value arrives.`,
    code: `// Component
export class UserComponent {
  // Dollar sign indicates it's an Observable stream
  user$: Observable<User> = this.api.getUser(1);
}

// Template
<!-- Automatically subscribes and unwraps the value -->
<div *ngIf="user$ | async as user">
  <p>{{ user.name }}</p>
  <p>{{ user.email }}</p>
</div>`,
    category: 'directives',
    difficulty: 'beginner',
  },
  {
    id: 76,
    question: 'What are Angular Signals?',
    answer: `Introduced in Angular 16, Signals are a new reactive primitive that tracks state. A Signal holds a value and notifies consumers (like templates or computed signals) when the value changes.
    
Unlike RxJS, Signals are synchronously readable, don't require subscriptions/unsubscriptions, and allow Angular to pinpoint exactly which part of the UI needs updating (Zone-less change detection).`,
    code: `import { Component, signal, computed, effect } from '@angular/core';

@Component({
  template: \`
    <p>Count: {{ count() }}</p>
    <p>Double: {{ doubleCount() }}</p>
    <button (click)="increment()">Add</button>
  \`
})
export class CounterComponent {
  // Create a writable signal
  count = signal(0);

  // Create a computed signal (automatically updates when count changes)
  doubleCount = computed(() => this.count() * 2);

  constructor() {
    // Effect: Runs whenever a signal it reads changes
    effect(() => console.log(\`Count is now \${this.count()}\`));
  }

  increment() {
    // Update the signal value
    this.count.update(val => val + 1);
  }
}`,
    category: 'performance',
    difficulty: 'intermediate',
  },
  {
    id: 77,
    question: 'Explain the take operator in RxJS.',
    answer: `The \`take(n)\` operator allows only the first \`n\` values emitted by the source Observable to pass through. After the \`n\`th value is emitted, the Observable immediately completes and unsubscribes.`,
    code: `import { interval } from 'rxjs';
import { take } from 'rxjs/operators';

// Emits a number every 1 second (0, 1, 2, 3...)
const source$ = interval(1000);

source$.pipe(
  take(3) // Only take the first 3 values
).subscribe({
  next: val => console.log(val),
  complete: () => console.log('Done!') 
});
// Output: 
// 0
// 1
// 2
// Done!`,
    category: 'rxjs',
    difficulty: 'beginner',
  },
  {
    id: 78,
    question: 'What is a Resolver in Angular Routing?',
    answer: `A Resolver is used to pre-fetch data before a route is activated. It prevents a component from loading with empty data while an API call is in progress. Navigation is paused until the resolver's Observable completes.`,
    code: `// functional resolver
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';

export const productResolver: ResolveFn<Product> = (route) => {
  const api = inject(ProductService);
  return api.getProduct(route.paramMap.get('id')!);
};

// routing
const routes = [
  { path: 'product/:id', component: ProductComponent, resolve: { data: productResolver } }
]

// component
export class ProductComponent {
  constructor(private route: ActivatedRoute) {
    console.log(this.route.snapshot.data['data']);
  }
}`,
    category: 'routing',
    difficulty: 'intermediate',
  },
  {
    id: 79,
    question: 'How do you dynamically load a component in Angular?',
    answer: `Historically done via \`ComponentFactoryResolver\`, modern Angular (v13+) allows dynamic component creation simply using \`ViewContainerRef.createComponent()\`. You use an \`<ng-template>\` as an anchor point to inject the component.`,
    code: `import { Component, ViewChild, ViewContainerRef, ComponentRef } from '@angular/core';
import { AlertComponent } from './alert.component';

@Component({
  template: \`
    <button (click)="loadAlert()">Show Alert</button>
    <!-- Anchor point -->
    <ng-template #alertContainer></ng-template>
  \`
})
export class ParentComponent {
  @ViewChild('alertContainer', { read: ViewContainerRef }) container!: ViewContainerRef;
  alertRef!: ComponentRef<AlertComponent>;

  loadAlert() {
    this.container.clear();
    // Dynamically create and render the component
    this.alertRef = this.container.createComponent(AlertComponent);
    // Pass inputs
    this.alertRef.instance.message = 'Dynamically Loaded!';
  }

  destroyAlert() {
    this.alertRef.destroy();
  }
}`,
    category: 'components',
    difficulty: 'advanced',
  },
  {
    id: 80,
    question: 'What are Angular Interceptors?',
    answer: `\`HttpInterceptors\` act as middleware for HTTP requests. They can intercept and modify incoming or outgoing HTTP requests globally.

Common use cases include:
1.  Attaching Authentication tokens to outgoing headers.
2.  Global error handling.
3.  Showing/hiding a global loading spinner.`,
    code: `import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Clone the request and add the auth header
    const authReq = req.clone({
      headers: req.headers.set('Authorization', 'Bearer my-token-123')
    });
    
    // Pass the cloned request to the next handler
    return next.handle(authReq);
  }
}`,
    category: 'services',
    difficulty: 'advanced',
  },
  {
    id: 81,
    question: 'Explain the mergeMap operator in RxJS.',
    answer: `\`mergeMap\` maps each value to an Observable, then flattens all of these inner Observables into a single stream. Unlike \`switchMap\` (which cancels old streams) and \`concatMap\` (which queues them sequentially), \`mergeMap\` executes them all **in parallel**.`,
    code: `import { of } from 'rxjs';
import { mergeMap, delay } from 'rxjs/operators';

const userIds$ = of(1, 2, 3);

userIds$.pipe(
  // If api.getUser takes 2 seconds, all 3 requests fire simultaneously.
  // The total time taken will be 2 seconds, not 6 seconds.
  mergeMap(id => this.api.getUser(id))
).subscribe(user => console.log(user));`,
    category: 'rxjs',
    difficulty: 'advanced',
  },
  {
    id: 82,
    question: 'How do you implement Route Guards for unauthenticated users?',
    answer: `You create a guard implementing \`CanActivate\` (or use a functional guard in modern Angular) that checks an Auth Service. If authenticated, it returns \`true\`. If not, it uses the Router to redirect to the login page and returns \`false\`.`,
    code: `// Functional Guard (Angular 15+)
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  } else {
    // Redirect to login
    router.navigate(['/login']);
    return false;
  }
};

// Usage in routing
// { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] }`,
    category: 'routing',
    difficulty: 'intermediate',
  },
  {
    id: 83,
    question: 'What are the main differences between Component and Directive?',
    answer: `*   **Component**: An Angular class decorated with \`@Component\`. It *must* have a template (HTML view) and styles. It creates a UI block. Under the hood, a Component is actually just a Directive with a template.
*   **Directive**: An Angular class decorated with \`@Directive\`. It *does not* have a template. Its purpose is to add behavior, manipulate the DOM, or change the appearance of an existing host element (like \`ngClass\`, \`ngStyle\`, or a custom hover effect).`,
    category: 'core',
    difficulty: 'beginner',
  },
  {
    id: 84,
    question: 'How does Angular handle Cross-Site Request Forgery (CSRF)?',
    answer: `Angular's \`HttpClient\` provides built-in CSRF protection. 

By default, it looks for a cookie named \`XSRF-TOKEN\` set by the server. If found, on every state-modifying request (POST/PUT/DELETE), Angular automatically reads that cookie and attaches its value to a header named \`X-XSRF-TOKEN\`. The server then verifies the header matches the cookie.`,
    category: 'services',
    difficulty: 'advanced',
  },
  {
    id: 85,
    question: 'What is the purpose of the ngDoCheck lifecycle hook?',
    answer: `\`ngDoCheck\` is triggered every time Angular runs change detection, regardless of whether any inputs actually changed. 

It is used to implement custom change detection logic for scenarios where Angular's default change detection fails to detect a change (like when a nested property of an object changes without the object reference itself changing). Because it runs so frequently, heavy logic here will destroy performance.`,
    category: 'performance',
    difficulty: 'advanced',
  },
  {
    id: 86,
    question: 'How do you create custom form controls that work with ngModel or formControlName?',
    answer: `To make a custom component integrate with Angular Forms, you must implement the \`ControlValueAccessor\` interface and provide it in the component's \`providers\` array using the \`NG_VALUE_ACCESSOR\` token.`,
    code: `import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-custom-input',
  template: \`<input [value]="val" (input)="onChange($event)">\`,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CustomInputComponent),
    multi: true
  }]
})
export class CustomInputComponent implements ControlValueAccessor {
  val: string = '';
  onChangeFn = (v: any) => {};
  onTouchedFn = () => {};

  // Called when user types in the input
  onChange(event: Event) {
    this.val = (event.target as HTMLInputElement).value;
    this.onChangeFn(this.val); // Notify Angular form of change
  }

  // 1. Angular writes a new value to the component
  writeValue(value: any): void { this.val = value; }

  // 2. Angular registers a callback for when the component changes
  registerOnChange(fn: any): void { this.onChangeFn = fn; }

  // 3. Angular registers a callback for when the component is touched
  registerOnTouched(fn: any): void { this.onTouchedFn = fn; }
}`,
    category: 'forms',
    difficulty: 'advanced',
  },
  {
    id: 87,
    question: 'What is the difference between RouterLink and href?',
    answer: `*   **\`RouterLink\`**: Intercepts the click, prevents the browser's default behavior, and updates the URL using the HTML5 History API. The page does not reload, preserving SPA state and performance.
*   **\`href\`**: Causes the browser to execute a full page reload, contacting the server and destroying all current application state.`,
    code: `<!-- Good: Fast, preserves state -->
<a routerLink="/dashboard">Dashboard</a>

<!-- Bad: Causes a full page reload -->
<a href="/dashboard">Dashboard</a>`,
    category: 'routing',
    difficulty: 'beginner',
  },
  {
    id: 88,
    question: 'Explain the withLatestFrom operator.',
    answer: `\`withLatestFrom\` combines a source Observable with the latest values from other Observables. 

Crucially, it **only emits when the source Observable emits**. If the other Observables emit, nothing happens until the source emits again.`,
    code: `import { fromEvent, interval } from 'rxjs';
import { withLatestFrom } from 'rxjs/operators';

const clicks$ = fromEvent(document, 'click');
const timer$ = interval(1000);

clicks$.pipe(
  // Every time you click, it grabs the LATEST value from the timer
  withLatestFrom(timer$)
).subscribe(([clickEvent, timerValue]) => {
  console.log(\`Clicked at second: \${timerValue}\`);
});`,
    category: 'rxjs',
    difficulty: 'intermediate',
  },
  {
    id: 89,
    question: 'What are Angular Modules (NgModules) and what are they used for?',
    answer: `\`NgModule\` is a container that groups related components, directives, pipes, and services. It dictates the compilation context for its components.

Key properties:
*   \`declarations\`: Things that belong to this module.
*   \`imports\`: Other modules whose exported components are needed by this module's components.
*   \`exports\`: Things this module makes available to other modules.
*   \`providers\`: Services created and injected by this module.`,
    category: 'core',
    difficulty: 'beginner',
  },
  {
    id: 90,
    question: 'How do you optimize an Angular application?',
    answer: `Key optimization techniques:
1.  **Lazy Loading**: Split routes into separate bundles.
2.  **OnPush Change Detection**: Prevent Angular from checking components whose inputs haven't changed.
3.  **trackBy**: Use with \`*ngFor\` to prevent DOM recreation.
4.  **Pure Pipes**: Use pure pipes for data transformation instead of calling functions directly in templates.
5.  **Unsubscribe**: Clean up RxJS subscriptions using \`AsyncPipe\` or \`takeUntil\` to prevent memory leaks.
6.  **AOT Compilation**: Ensure Production build is used.`,
    category: 'performance',
    difficulty: 'advanced',
  },
  {
    id: 91,
    question: 'What is APP_INITIALIZER and how is it used?',
    answer: `\`APP_INITIALIZER\` is a built-in injection token used to execute a function when the Angular application starts. 

If the provided function returns a Promise or an Observable, Angular will **pause the application bootstrap process** until it resolves. It is commonly used for loading configuration files before the app renders.`,
    code: `import { APP_INITIALIZER, NgModule } from '@angular/core';

export function initializeApp(configService: ConfigService) {
  // Returns a Promise. Angular waits for this to finish.
  return () => configService.loadConfig().toPromise();
}

@NgModule({
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [ConfigService],
      multi: true // Essential! Allows multiple initializers.
    }
  ]
})
export class AppModule { }`,
    category: 'core',
    difficulty: 'advanced',
  },
  {
    id: 92,
    question: 'What are Deferrable Views (@defer) in Angular?',
    answer: `Introduced in Angular 17, \`@defer\` allows you to lazily load a component, directive, or pipe directly in the template. 

It handles chunking and lazy-loading at the compiler level, replacing the need to manually write complex \`import()\` statements or use routing to achieve lazy loading for specific components on a page.`,
    code: `<!-- 
  The HeavyGraphComponent is NOT loaded on page load.
  It is only downloaded when the user scrolls it into the viewport.
-->
@defer (on viewport) {
  <app-heavy-graph />
} @placeholder {
  <div>Graph will load here when you scroll down...</div>
} @loading (minimum 1s) {
  <div class="spinner">Loading...</div>
} @error {
  <p>Failed to load the graph.</p>
}`,
    category: 'performance',
    difficulty: 'intermediate',
  },
  {
    id: 93,
    question: 'How do you enforce that an @Input property is required?',
    answer: `In Angular 16+, you can explicitly mark an \`@Input()\` as required by passing an object \`{ required: true }\` to the decorator. 

If the parent component fails to provide this input, the Angular compiler will throw a **build-time error**, preventing runtime crashes.`,
    code: `import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-card',
  template: \`<p>{{ user.name }}</p>\`
})
export class UserCardComponent {
  // Build will fail if parent does not pass [user]="..."
  @Input({ required: true }) user!: User;
  
  // Optional input
  @Input() theme: string = 'light';
}`,
    category: 'components',
    difficulty: 'beginner',
  },
  {
    id: 94,
    question: 'Explain the difference between viewProviders and providers in @Component.',
    answer: `*   **\`providers\`**: Services declared here are available to the component, its view (template), AND any projected content (\`<ng-content>\`).
*   **\`viewProviders\`**: Services declared here are available to the component and its view, but **NOT** to projected content. It effectively hides internal services from components passed in by the parent.`,
    category: 'services',
    difficulty: 'advanced',
  },
  {
    id: 95,
    question: 'How can you make an HTTP request that bypasses all HttpInterceptors?',
    answer: `If you have global interceptors (like adding an Auth Token) but need to make a specific request without them (e.g., reaching out to a public third-party API), you inject \`HttpBackend\` instead of \`HttpClient\`.

You then instantiate a new \`HttpClient\` using that backend.`,
    code: `import { Injectable } from '@angular/core';
import { HttpClient, HttpBackend } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class PublicApiService {
  private directHttpClient: HttpClient;

  constructor(private handler: HttpBackend) {
    // This client bypasses all interceptors
    this.directHttpClient = new HttpClient(this.handler);
  }

  getPublicData() {
    return this.directHttpClient.get('https://public.api.com/data');
  }
}`,
    category: 'services',
    difficulty: 'advanced',
  },
  {
    id: 96,
    question: 'Explain the shareReplay operator in RxJS.',
    answer: `\`shareReplay\` is an extremely powerful operator used to cache data and prevent redundant HTTP requests or expensive calculations.

When multiple subscribers subscribe to an Observable piped with \`shareReplay(1)\`, only the **first** subscriber triggers the source (e.g., the HTTP call). The result is cached, and all subsequent subscribers instantly receive the cached value.`,
    code: `import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { shareReplay } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CacheService {
  // We use the $ suffix for Observables
  config$ = this.http.get('/api/config').pipe(
    shareReplay(1) // Cache the 1 most recent value
  );

  constructor(private http: HttpClient) {}
}

// In Component A:
// this.cacheService.config$.subscribe(...) -> Triggers HTTP request

// In Component B (later):
// this.cacheService.config$.subscribe(...) -> NO HTTP request! Returns cached data instantly.`,
    category: 'rxjs',
    difficulty: 'advanced',
  },
  {
    id: 97,
    question: 'What is NgTemplateOutlet and how do you pass context to it?',
    answer: `\`*ngTemplateOutlet\` is a structural directive used to instantiate an \`<ng-template>\` dynamically. 

You can pass data into the template using the \`context\` object. The template receives this data using the \`let-\` syntax.`,
    code: `<!-- 1. Define the Template -->
<ng-template #userTemplate let-name="name" let-role="userRole">
  <div class="user-badge">
    <strong>{{ name }}</strong> ({{ role }})
  </div>
</ng-template>

<!-- 2. Render it multiple times with different data -->
<ng-container 
  *ngTemplateOutlet="userTemplate; context: { name: 'Alice', userRole: 'Admin' }">
</ng-container>

<ng-container 
  *ngTemplateOutlet="userTemplate; context: { name: 'Bob', userRole: 'Editor' }">
</ng-container>`,
    category: 'templates',
    difficulty: 'intermediate',
  },
  {
    id: 98,
    question: 'How do you create a factory provider using an InjectionToken?',
    answer: `A Factory Provider is used when you need to dynamically construct a dependency or conditionally decide which dependency to provide based on runtime conditions (like environment variables or user roles).`,
    code: `import { InjectionToken } from '@angular/core';

export const LOGGER_TOKEN = new InjectionToken<Logger>('LoggerToken');

export function loggerFactory(envService: EnvironmentService) {
  // Conditionally provide the correct class
  return envService.isProd() ? new ProductionLogger() : new ConsoleLogger();
}

// In app.module.ts or component providers:
providers: [
  {
    provide: LOGGER_TOKEN,
    useFactory: loggerFactory,
    deps: [EnvironmentService] // Dependencies required by the factory function
  }
]`,
    category: 'services',
    difficulty: 'advanced',
  },
  {
    id: 99,
    question: 'What does ChangeDetectorRef.detach() do?',
    answer: `Calling \`.detach()\` on a component's \`ChangeDetectorRef\` completely disconnects that component (and its children) from the Angular change detection tree. 

Angular will **never** check this component for changes again, no matter what happens, until you explicitly call \`.reattach()\` or manually trigger \`.detectChanges()\`. It is used for ultimate performance control over heavy UI elements.`,
    category: 'performance',
    difficulty: 'advanced',
  },
  {
    id: 100,
    question: 'What are Functional Interceptors in Angular 15+?',
    answer: `Instead of writing class-based Interceptors, Angular now supports Functional Interceptors. They are simpler, require less boilerplate, and leverage the \`inject()\` function for dependency injection.`,
    code: `import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.getToken();

  if (token) {
    const cloned = req.clone({
      setHeaders: { Authorization: \`Bearer \${token}\` }
    });
    return next(cloned);
  }
  
  return next(req);
};

// Registered in bootstrapApplication:
// provideHttpClient(withInterceptors([authInterceptor]))`,
    category: 'services',
    difficulty: 'intermediate',
  },
  {
    id: 101,
    question: 'What is a RouteReuseStrategy?',
    answer: `By default, when you navigate to a new route, Angular destroys the old component and creates a new one. 

Implementing a custom \`RouteReuseStrategy\` allows you to tell Angular to keep specific components alive in the background (like caching a complex search results page) so that when the user hits the "Back" button, the component renders instantly without losing state or scrolling position.`,
    category: 'routing',
    difficulty: 'advanced',
  },
  {
    id: 102,
    question: 'Explain Angular Universal Non-Destructive Hydration.',
    answer: `In earlier versions, Angular SSR would render HTML on the server, but when the browser downloaded the JavaScript, Angular would completely destroy the server HTML and recreate it from scratch (causing flicker).

With non-destructive hydration (Angular 16+), Angular reuses the existing DOM nodes created by the server, attaches event listeners, and brings the page "to life" without flickering or rebuilding the DOM.`,
    category: 'performance',
    difficulty: 'advanced',
  },
  {
    id: 103,
    question: 'Why is ::ng-deep considered bad practice, and what is the alternative?',
    answer: `\`::ng-deep\` breaks View Encapsulation, causing styles to bleed globally across your application. It is officially deprecated.

**Alternatives:**
1.  **Global Styles**: Put the styles in \`styles.css\` instead.
2.  **ViewEncapsulation.None**: Turn off encapsulation for that specific component (if intentional).
3.  **CSS Custom Properties (Variables)**: Provide CSS variables in the child component that the parent can hook into.`,
    category: 'components',
    difficulty: 'intermediate',
  },
  {
    id: 104,
    question: 'What is the difference between @HostBinding and @HostListener?',
    answer: `Both interact with the "host" element the directive/component is attached to.
*   **\`@HostBinding\`**: Binds a class property to a DOM property or attribute of the host element (e.g., dynamically changing the class or styling).
*   **\`@HostListener\`**: Listens for DOM events on the host element and triggers a class method (e.g., listening for a click or keydown).`,
    code: `import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({ selector: '[appHover]' })
export class HoverDirective {
  // Bind the 'active' class to this property
  @HostBinding('class.active') isHovering = false;

  // Listen for mouse enter
  @HostListener('mouseenter') onEnter() {
    this.isHovering = true;
  }

  // Listen for mouse leave
  @HostListener('mouseleave') onLeave() {
    this.isHovering = false;
  }
}`,
    category: 'directives',
    difficulty: 'beginner',
  },
  {
    id: 105,
    question: 'What is runInInjectionContext?',
    answer: `The \`inject()\` function can normally only be used in constructor contexts. 

If you need to use \`inject()\` dynamically inside a function that runs *outside* the constructor phase, you must wrap the execution in \`runInInjectionContext\`, providing it the \`Injector\` instance.`,
    code: `import { Injector, runInInjectionContext, inject } from '@angular/core';

export function myHelperFunction(injector: Injector) {
  // This would throw an error without runInInjectionContext
  runInInjectionContext(injector, () => {
    const http = inject(HttpClient);
    // Do something with http...
  });
}`,
    category: 'services',
    difficulty: 'advanced',
  },
  {
    id: 106,
    question: 'Explain the difference between Default and OnPush Change Detection.',
    answer: `*   **Default**: Angular checks the component and all its children every time *any* event occurs in the application, even if the event had nothing to do with this component.
*   **OnPush**: Angular assumes the component is a pure function. It will *only* check the component if:
    1.  An \`@Input\` reference changes.
    2.  An event originates directly from the component or its children.
    3.  An \`AsyncPipe\` emits a new value.
    4.  It is manually triggered via \`ChangeDetectorRef\`.`,
    category: 'performance',
    difficulty: 'intermediate',
  },
  {
    id: 107,
    question: 'What is the difference between combineLatest and zip in RxJS?',
    answer: `Both combine multiple Observables, but in different ways:
*   **\`combineLatest\`**: Emits an array of the *most recent* values from all Observables whenever *any* of them emits. It waits for all to emit at least once before firing.
*   **\`zip\`**: Emits an array of values strictly in pairs. It waits for all Observables to emit their 1st value, then fires. It waits for all to emit their 2nd value, then fires. If one Observable emits 10 times and the other only 2 times, \`zip\` only fires twice.`,
    category: 'rxjs',
    difficulty: 'advanced',
  },
  {
    id: 108,
    question: 'What are Angular Control Value Accessors (CVA) used for?',
    answer: `The \`ControlValueAccessor\` interface acts as the bridge between the Angular forms API and a native element or custom component in the DOM. 

If you are building a custom UI component (like a custom dropdown, a star rater, or a rich text editor) and want it to play nicely with \`[(ngModel)]\` or \`formControlName\`, you MUST implement this interface.`,
    category: 'forms',
    difficulty: 'intermediate',
  },
  {
    id: 109,
    question: 'How do you prevent a Route Guard from completing until an HTTP request finishes?',
    answer: `A route guard (\`CanActivate\`) can return a boolean, a \`Promise<boolean>\`, or an \`Observable<boolean>\`.

To wait for an HTTP request, simply return the Observable from the \`HttpClient\`. Angular's router is smart enough to subscribe to it and wait for it to complete. Use the \`map\` operator to transform the HTTP response into a boolean.`,
    code: `canActivate(): Observable<boolean> {
  return this.http.get<User>('/api/me').pipe(
    map(user => {
      // If user is admin, allow route (true)
      return user.role === 'admin';
    }),
    catchError(() => {
      // If HTTP fails (e.g. 401), deny route (false)
      this.router.navigate(['/login']);
      return of(false);
    })
  );
}`,
    category: 'routing',
    difficulty: 'intermediate',
  },
  {
    id: 110,
    question: 'What is the track property in Angular 17 @for loops?',
    answer: `Unlike \`*ngFor\` where \`trackBy\` was optional, the new \`@for\` control flow block in Angular 17+ **forces** you to provide a \`track\` expression. 

This ensures that developers do not accidentally cause massive performance drops by omitting it. You can track by a property (\`track item.id\`) or by the index (\`track $index\`).`,
    code: `<!-- Tracking by an object property (Best practice) -->
@for (user of users; track user.id) {
  <div class="user-card">{{ user.name }}</div>
}

<!-- Tracking by primitive identity -->
@for (name of stringArray; track $index) {
  <li>{{ name }}</li>
}`,
    category: 'performance',
    difficulty: 'beginner',
  },
  {
    id: 111,
    question: 'How do you test a Component that relies on Angular Router navigation?',
    answer: `When testing a component that interacts with the Router, you should not use the real \`RouterModule\`. Instead, you use the \`RouterTestingModule\`. 

This module provides a mock router that simulates routing without actually changing the browser URL, allowing you to easily test navigation events.`,
    code: `import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { MyComponent } from './my.component';

describe('MyComponent', () => {
  let component: MyComponent;
  let fixture: ComponentFixture<MyComponent>;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])], // Mock Router
      declarations: [MyComponent]
    });
    fixture = TestBed.createComponent(MyComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  it('should navigate on click', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.goHome(); // Method that calls this.router.navigate(['/home'])
    expect(navigateSpy).toHaveBeenCalledWith(['/home']);
  });
});`,
    category: 'testing',
    difficulty: 'intermediate',
  },
  {
    id: 112,
    question: 'What is the purpose of ViewEncapsulation.ShadowDom?',
    answer: `By default, Angular uses \`ViewEncapsulation.Emulated\` to scope CSS styles to the component.

If you change it to \`ViewEncapsulation.ShadowDom\`, Angular will use the browser's native **Shadow DOM** API to completely isolate the component's HTML and CSS from the rest of the application. Global styles (like Bootstrap) will not affect this component, and its styles will not leak out.`,
    code: `import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-isolated-widget',
  template: \`<div class="card">Strictly isolated</div>\`,
  styles: [\`.card { background: red; }\`],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class IsolatedWidgetComponent {}`,
    category: 'components',
    difficulty: 'advanced',
  },
  {
    id: 113,
    question: 'How do you pass data between routes without putting it in the URL?',
    answer: `If you want to pass complex objects between routes without exposing them in query parameters, you can pass data through the Router's \`state\` object during navigation.

Note that this state is ephemeral; if the user hard-refreshes the target page, the state will be lost.`,
    code: `// 1. Sender Component
export class ListComponent {
  constructor(private router: Router) {}

  viewDetails(user: any) {
    this.router.navigate(['/details'], { 
      state: { userData: user } // Pass full object in background
    });
  }
}

// 2. Receiver Component
export class DetailsComponent {
  user: any;

  constructor(private router: Router) {
    // Must be retrieved in constructor, NOT ngOnInit
    const navigation = this.router.getCurrentNavigation();
    this.user = navigation?.extras.state?.['userData'];
  }
}`,
    category: 'routing',
    difficulty: 'intermediate',
  },
  {
    id: 114,
    question: 'Explain the debounce operator in RxJS.',
    answer: `Unlike \`debounceTime\` (which waits a specific amount of time), \`debounce\` waits for a duration determined by **another Observable**.

When the source emits, \`debounce\` subscribes to a duration Observable. If the source emits again before the duration Observable emits/completes, the previous value is dropped.`,
    code: `import { fromEvent, interval } from 'rxjs';
import { debounce } from 'rxjs/operators';

const clicks = fromEvent(document, 'click');

// Drop clicks unless 1 full second has passed since the last click
const result = clicks.pipe(
  debounce(() => interval(1000))
);

result.subscribe(x => console.log('Click processed!'));`,
    category: 'rxjs',
    difficulty: 'advanced',
  },
  {
    id: 115,
    question: 'How do you lazily load a standalone component in the new Angular Router?',
    answer: `In modern Angular (v14+), you no longer need an \`NgModule\` to lazy load a route. You can use the \`loadComponent\` property in your route definition and point it directly to the standalone component file.`,
    code: `import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'admin',
    // Lazy loads the component directly. No NgModule needed!
    loadComponent: () => import('./admin/admin.component').then(m => m.AdminComponent)
  }
];`,
    category: 'routing',
    difficulty: 'beginner',
  },
  {
    id: 116,
    question: 'What is the NgComponentOutlet directive?',
    answer: `\`NgComponentOutlet\` is a structural directive used for dynamic component creation. 

It provides a declarative way to load a component dynamically into a template based on a variable in your TypeScript class. It is much easier to use than manually instantiating components using \`ViewContainerRef\`.`,
    code: `import { Component } from '@angular/core';
import { WidgetAComponent } from './widget-a.component';
import { WidgetBComponent } from './widget-b.component';

@Component({
  template: \`
    <button (click)="loadA()">Load A</button>
    <button (click)="loadB()">Load B</button>
    
    <!-- Dynamically renders whatever component class is assigned -->
    <ng-container *ngComponentOutlet="dynamicComponent"></ng-container>
  \`
})
export class ContainerComponent {
  dynamicComponent: any = null;

  loadA() { this.dynamicComponent = WidgetAComponent; }
  loadB() { this.dynamicComponent = WidgetBComponent; }
}`,
    category: 'components',
    difficulty: 'advanced',
  },
  {
    id: 117,
    question: 'How does Angular handle memory leaks in HostListeners?',
    answer: `Unlike manual \`document.addEventListener\` calls, Angular automatically manages the lifecycle of \`@HostListener\` events. 

When the component or directive containing the \`@HostListener\` is destroyed, Angular automatically removes the event listener from the DOM. You do NOT need to write manual cleanup code in \`ngOnDestroy\` for HostListeners.`,
    category: 'core',
    difficulty: 'intermediate',
  },
  {
    id: 118,
    question: 'Explain the exhaustMap operator in RxJS.',
    answer: `\`exhaustMap\` maps an emitted value to a new Observable.

Crucially, while the inner Observable is running, **all subsequent values from the source are completely ignored**. The source can only emit again once the inner Observable completes. 
This is the perfect operator for a "Submit" button to prevent duplicate API calls if the user rapidly double-clicks the button.`,
    code: `import { fromEvent } from 'rxjs';
import { exhaustMap } from 'rxjs/operators';

const submitButton = document.getElementById('submit');

fromEvent(submitButton, 'click').pipe(
  // If the user clicks 5 times rapidly, the API call only fires ONCE.
  // The next 4 clicks are ignored until the API call finishes.
  exhaustMap(() => this.api.saveData())
).subscribe(res => console.log('Saved!', res));`,
    category: 'rxjs',
    difficulty: 'advanced',
  },
  {
    id: 119,
    question: 'What is the inject() function and when should you use it?',
    answer: `Introduced in Angular 14, \`inject()\` is a function that retrieves a dependency from the current Injector.

It serves as an alternative to Constructor Injection. It allows you to inject services into regular functions, Route Guards, Interceptors, and Base Classes without having to pass the service down through \`super()\` calls in inheritance chains.`,
    code: `import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  template: \`<button (click)="go()">Go</button>\`
})
export class HomeComponent {
  // Property-based injection using inject() instead of constructor
  private router = inject(Router);

  go() {
    this.router.navigate(['/about']);
  }
}`,
    category: 'core',
    difficulty: 'intermediate',
  },
  {
    id: 120,
    question: 'How do you create a custom validator for cross-field validation?',
    answer: `To validate fields that depend on each other (like "Password" and "Confirm Password"), you cannot apply the validator to the individual \`FormControl\`. 

Instead, you must apply the validator to the parent \`FormGroup\`.`,
    code: `import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  // 'control' here is the FormGroup
  const password = control.get('password');
  const confirm = control.get('confirmPassword');

  if (password && confirm && password.value !== confirm.value) {
    // Add error to the confirm control specifically
    confirm.setErrors({ passwordMismatch: true });
    return { passwordMismatch: true }; // Form is invalid
  }
  return null; // Form is valid
};

// Usage:
// this.form = this.fb.group({ ... }, { validators: passwordMatchValidator });`,
    category: 'forms',
    difficulty: 'advanced',
  },
  {
    id: 121,
    question: 'What is the difference between ViewChild and ContentChild?',
    answer: `*   **\`@ViewChild\`**: Queries the DOM elements and components that are defined directly within the component's **own template**.
*   **\`@ContentChild\`**: Queries the DOM elements and components that are projected into the component from a parent using **\`<ng-content>\`**.`,
    code: `// Parent Component: Projects <p> into Child
<app-child>
  <p #projectedText>Projected from Parent</p>
</app-child>

// Child Component
@Component({
  selector: 'app-child',
  template: \`
    <h1 #internalText>Internal Text</h1>
    <ng-content></ng-content>
  \`
})
export class ChildComponent {
  // Queries its own template
  @ViewChild('internalText') internal!: ElementRef; 
  
  // Queries the content passed from the parent
  @ContentChild('projectedText') projected!: ElementRef; 
}`,
    category: 'components',
    difficulty: 'intermediate',
  },
  {
    id: 122,
    question: 'Explain the map vs pluck operator in RxJS.',
    answer: `*   **\`map\`**: The standard way to transform an emitted value using a callback function (e.g., \`map(user => user.name)\`).
*   **\`pluck\`**: A utility operator to extract a specific property from an object. However, **\`pluck\` is deprecated** in modern RxJS (v7+) in favor of using \`map\` with optional chaining, as \`map\` provides much better TypeScript type inference.`,
    code: `import { of } from 'rxjs';
import { map, pluck } from 'rxjs/operators';

const user$ = of({ id: 1, profile: { name: 'Alice' } });

// Old way (Deprecated)
user$.pipe(pluck('profile', 'name')).subscribe(n => console.log(n));

// Modern way (Preferred & Type Safe)
user$.pipe(map(u => u?.profile?.name)).subscribe(n => console.log(n));`,
    category: 'rxjs',
    difficulty: 'beginner',
  },
  {
    id: 123,
    question: 'What is Angular Environment configuration and how do you use it?',
    answer: `Angular provides environment files (e.g., \`environment.ts\`, \`environment.prod.ts\`) to manage configuration variables that change based on the build target (like API URLs).

During the build process (\`ng build --configuration production\`), the Angular CLI replaces the contents of the default \`environment.ts\` with the contents of the specified target file.`,
    code: `// environment.ts (Development)
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};

// environment.prod.ts (Production)
export const environment = {
  production: true,
  apiUrl: 'https://api.mycompany.com'
};

// In a Service (Always import from the default file!)
import { environment } from '../environments/environment';

export class ApiService {
  url = environment.apiUrl; 
}`,
    category: 'core',
    difficulty: 'beginner',
  },
  {
    id: 124,
    question: 'How do you handle unhandled promise rejections or global errors in Angular?',
    answer: `You can catch all unhandled errors globally by implementing the \`ErrorHandler\` interface and providing it in your root module. 

This prevents the application from failing silently and allows you to log errors to an external monitoring service (like Sentry or Datadog).`,
    code: `import { ErrorHandler, Injectable, NgModule } from '@angular/core';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: any): void {
    console.error('GLOBAL ERROR CAUGHT:', error.message);
    // TODO: Send to external logging service
  }
}

@NgModule({
  providers: [
    // Override the default Angular ErrorHandler
    { provide: ErrorHandler, useClass: GlobalErrorHandler } 
  ]
})
export class AppModule { }`,
    category: 'services',
    difficulty: 'advanced',
  },
  {
    id: 125,
    question: 'What is a resolver and why is it preferred over ngOnInit for initial data fetching?',
    answer: `While fetching data in \`ngOnInit\` is common, it causes the component to render immediately (often in an empty or "loading" state) until the data arrives.

A **Resolver** fetches the data *during* the routing process. The Router will not activate the target component until the Resolver's Observable completes. This guarantees that when the component renders, its data is fully available immediately, preventing UI flickering.`,
    category: 'routing',
    difficulty: 'intermediate',
  },
  {
    id: 126,
    question: 'What is the purpose of NgZone?',
    answer: `\`NgZone\` is a wrapper around \`Zone.js\`. It provides an execution context that allows Angular to know when asynchronous tasks begin and end.

Angular relies on \`NgZone\` to trigger Change Detection automatically. If third-party libraries run tasks outside of this zone, Angular won't know about them, and the UI won't update until you manually re-enter the zone using \`NgZone.run()\`.`,
    category: 'performance',
    difficulty: 'advanced',
  },
  {
    id: 127,
    question: 'Explain the tap operator in RxJS and its most common use cases.',
    answer: `\`tap\` (formerly \`do\`) is an operator used for **side-effects**. It transparently passes values through the stream without modifying them.

Common use cases:
1.  **Logging / Debugging**: Inspecting values at a certain point in a pipe.
2.  **State Mutation**: Setting a loading spinner to \`false\` when an HTTP request finishes.
3.  **Caching**: Saving the response of an HTTP request to a local variable or service state.`,
    code: `this.http.get('/api/users').pipe(
  tap(users => {
    // Side effect: Log the data
    console.log('Fetched users', users);
    // Side effect: Stop the loading spinner
    this.isLoading = false; 
  }),
  // Data continues unmodified to the subscriber
).subscribe(users => this.users = users);`,
    category: 'rxjs',
    difficulty: 'beginner',
  },
  {
    id: 128,
    question: 'What is the difference between Angular Template syntax [()] and ()?',
    answer: `*   **\`()\` (Event Binding)**: Data flows from the View (Template) to the Component class. Used for user interactions (e.g., \`(click)="save()"\`).
*   **\`[]\` (Property Binding)**: Data flows from the Component class to the View. Used for setting element properties (e.g., \`[disabled]="isBusy"\`).
*   **\`[()]\` (Two-Way Binding)**: "Banana in a box". Combines both. Data flows in both directions simultaneously. When the component changes, the view updates. When the view changes (e.g., typing in an input), the component updates.`,
    category: 'binding',
    difficulty: 'beginner',
  },
  {
    id: 129,
    question: 'How do you test a Component with an AsyncPipe in the template?',
    answer: `To test a component that relies on an \`AsyncPipe\`, you can mock the Observable property in the component with an RxJS \`Subject\`.

In your test, you call \`.next()\` on the Subject to emit data, call \`fixture.detectChanges()\`, and then assert that the template rendered the emitted data correctly.`,
    code: `it('should display user name from observable', () => {
  // 1. Create a mock stream
  const userSubject = new BehaviorSubject<any>(null);
  component.user$ = userSubject.asObservable(); // Override component stream
  
  // 2. Emit data
  userSubject.next({ name: 'Testing Hero' });
  
  // 3. Trigger change detection (AsyncPipe will unwrap the value)
  fixture.detectChanges();
  
  // 4. Assert
  const el = fixture.debugElement.query(By.css('.user-name')).nativeElement;
  expect(el.textContent).toContain('Testing Hero');
});`,
    category: 'testing',
    difficulty: 'advanced',
  },
  {
    id: 130,
    question: 'What is Dependency Injection (DI) hoisting?',
    answer: `If Angular cannot find a requested dependency in the current component's injector, it "hoists" the request up the component tree to the parent component, and then to the grandparent, all the way up to the root Module Injector.

If it reaches the absolute root and still cannot find a provider for the token, Angular throws a \`NullInjectorError\`.`,
    category: 'core',
    difficulty: 'intermediate',
  },
  {
    id: 131,
    question: 'How do you implement a simple State Management system using RxJS?',
    answer: `You can use a Service with a \`BehaviorSubject\` to store state. Components can then observe changes via an observable and update the state via a setter method.`,
    code: `@Injectable({ providedIn: 'root' })
export class StoreService {
  private state$ = new BehaviorSubject({ users: [], loading: false });

  selectUsers() {
    return this.state$.asObservable().pipe(map(s => s.users));
  }

  setUsers(users: any[]) {
    this.state$.next({ ...this.state$.value, users });
  }
}`,
    category: 'state-management',
    difficulty: 'intermediate',
  },
  {
    id: 132,
    question: 'What is the purpose of the take operator in RxJS?',
    answer: `The \`take(n)\` operator allows an observable to emit only the first \`n\` values and then completes. This is useful for one-time fetches (like from a configuration service) where you don't need a persistent subscription.`,
    code: `this.configService.getConfig().pipe(
  take(1) // Only get the first value and complete
).subscribe(config => this.config = config);`,
    category: 'rxjs',
    difficulty: 'beginner',
  },
  {
    id: 133,
    question: 'How do you handle route guards in a standalone application?',
    answer: `Functional guards are the standard in modern Angular. They are simple functions that can inject services and return a boolean or a \`UrlTree\`.`,
    code: `export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isLoggedIn() ? true : router.parseUrl('/login');
};

// In routes
{ path: 'admin', component: AdminComponent, canActivate: [authGuard] }`,
    category: 'routing',
    difficulty: 'intermediate',
  },
  {
    id: 134,
    question: 'What is the withDebugTracing() option in provideRouter?',
    answer: `This option enables logging of all internal router events to the console, which is invaluable for debugging complex navigation issues or guard logic.`,
    code: `provideRouter(routes, withDebugTracing())`,
    category: 'routing',
    difficulty: 'advanced',
  },
  {
    id: 135,
    question: 'What is the difference between @ViewChildren and @ContentChildren?',
    answer: `* **@ViewChildren**: Returns a \`QueryList\` of elements, components, or directives that are in the component's template.
* **@ContentChildren**: Returns a \`QueryList\` of elements, components, or directives that are projected into the component via \`<ng-content>\`.`,
    category: 'core',
    difficulty: 'intermediate',
  },
  {
    id: 136,
    question: 'How do you implement infinite scrolling using RxJS?',
    answer: `You can listen to the scroll event, use \`throttleTime\` to limit calls, and check the scroll position to trigger a data fetch when the user reaches the bottom of the container.`,
    code: `fromEvent(window, 'scroll').pipe(
  throttleTime(200),
  map(() => window.scrollY + window.innerHeight),
  filter(pos => pos >= document.body.offsetHeight - 500),
  switchMap(() => this.dataService.fetchMore())
).subscribe(newData => this.items.push(...newData));`,
    category: 'rxjs',
    difficulty: 'advanced',
  },
  {
    id: 137,
    question: 'What is the purpose of the ng-container element?',
    answer: `\`ng-container\` is a logical wrapper that does not render as a DOM element. It is commonly used to apply multiple structural directives (like \`*ngIf\` and \`*ngFor\`) without creating unnecessary HTML tags.`,
    code: `<ng-container *ngIf="items$ | async as items">
  <div *ngFor="let item of items">{{ item.name }}</div>
</ng-container>`,
    category: 'templates',
    difficulty: 'beginner',
  },
  {
    id: 138,
    question: 'What are custom elements in Angular (Angular Elements)?',
    answer: `Angular Elements allows you to package Angular components as standards-compliant Web Components (Custom Elements). These can then be used in any HTML page or non-Angular framework.`,
    code: `const el = createCustomElement(MyComponent, { injector: this.injector });
customElements.define('my-element', el);`,
    category: 'advanced',
    difficulty: 'advanced',
  },
  {
    id: 139,
    question: 'How do you test a component with @Input() and @Output()?',
    answer: `You can test a component by setting the \`@Input()\` property directly on the component instance and spying on the \`@Output()\` EventEmitter.`,
    code: `it('should emit event on click', () => {
  spyOn(component.clicked, 'emit');
  component.onBtnClick();
  expect(component.clicked.emit).toHaveBeenCalled();
});`,
    category: 'testing',
    difficulty: 'beginner',
  },
  {
    id: 140,
    question: 'What is the purpose of the concatMap operator?',
    answer: `\`concatMap\` maps values to inner observables and waits for each inner observable to complete before starting the next one. It maintains the order of emissions.`,
    category: 'rxjs',
    difficulty: 'intermediate',
  },
  {
    id: 141,
    question: 'How do you implement a breadcrumb system in Angular?',
    answer: `You can build a breadcrumb system by subscribing to the router's \`events\` and filtering for \`NavigationEnd\`. You can then traverse the activated route tree to gather data defined in each route configuration.`,
    category: 'routing',
    difficulty: 'intermediate',
  },
  {
    id: 142,
    question: 'What is the difference between providing a service in root vs. in a component?',
    answer: `* **In root**: The service is a singleton shared by the entire app and is tree-shakable.
* **In component**: The service is scoped to that specific component instance and its children. A new instance is created every time the component is instantiated.`,
    category: 'services',
    difficulty: 'intermediate',
  },
  {
    id: 143,
    question: 'What is the purpose of the Renderer2 service?',
    answer: `\`Renderer2\` is an abstraction for DOM manipulation. It is safer than direct DOM access because it allows Angular to work in environments without a browser DOM (like server-side rendering with Universal or Web Workers).`,
    code: `constructor(private renderer: Renderer2, private el: ElementRef) {}

ngOnInit() {
  this.renderer.setStyle(this.el.nativeElement, 'color', 'red');
}`,
    category: 'core',
    difficulty: 'intermediate',
  },
  {
    id: 144,
    question: 'What is the purpose of the AsyncValidator interface?',
    answer: `\`AsyncValidator\` is used for form validations that require an asynchronous check, such as checking if a username is already taken via an API call.`,
    code: `validate(control: AbstractControl): Observable<ValidationErrors | null> {
  return this.api.checkUser(control.value).pipe(
    map(res => res.exists ? { userExists: true } : null)
  );
}`,
    category: 'forms',
    difficulty: 'advanced',
  },
  {
    id: 145,
    question: 'How do you implement feature-based lazy loading?',
    answer: `You can lazy load a feature by using \`loadChildren\` in your route configuration. In modern Angular, you use a dynamic import to load the routes or the module.`,
    code: `{ path: 'admin', loadChildren: () => import('./admin/admin.routes').then(r => r.ADMIN_ROUTES) }`,
    category: 'routing',
    difficulty: 'intermediate',
  },
  {
    id: 146,
    question: 'What is the purpose of the @Host decorator?',
    answer: `The \`@Host()\` decorator tells Angular to look for a provider in the local injector of the host component. If it's not found there, it stops looking and throws an error (unless \`@Optional()\` is also used).`,
    category: 'core',
    difficulty: 'advanced',
  },
  {
    id: 147,
    question: 'How do you use the keyvalue pipe?',
    answer: `The \`keyvalue\` pipe transforms an object or map into an array of key-value pairs, which can then be used in an \`*ngFor\` loop.`,
    code: `<div *ngFor="let item of myObject | keyvalue">
  {{ item.key }}: {{ item.value }}
</div>`,
    category: 'pipes',
    difficulty: 'beginner',
  },
  {
    id: 148,
    question: 'What is the exhaustMap operator used for?',
    answer: `\`exhaustMap\` maps values to inner observables but ignores new values from the source observable while an inner observable is still running. It is perfect for preventing multiple form submissions.`,
    category: 'rxjs',
    difficulty: 'advanced',
  },
  {
    id: 149,
    question: 'What is Angular Universal?',
    answer: `Angular Universal is the process of Server-Side Rendering (SSR) your Angular application. It renders the app on the server into static HTML, which is then sent to the client, improving SEO and initial load performance.`,
    category: 'advanced',
    difficulty: 'intermediate',
  },
  {
    id: 150,
    question: 'What is the difference between constructor and ngOnInit?',
    answer: `* **Constructor**: A standard JavaScript class feature used for initializing the class and injecting dependencies. Input properties are not available here.
* **ngOnInit**: An Angular lifecycle hook called after Angular has initialized all data-bound properties. This is the correct place to start data fetching or initialization logic.`,
    category: 'core',
    difficulty: 'beginner',
  },
  {
    id: 151,
    question: 'How do you perform a cross-field validation in Reactive Forms?',
    answer: `To perform cross-field validation, you add a validator to the \`FormGroup\` instead of an individual \`FormControl\`. The validator function receives the \`FormGroup\` as an argument and can access all its controls.`,
    code: `this.form = this.fb.group({
  password: ['', Validators.required],
  confirmPassword: ['', Validators.required]
}, { validators: passwordMatchValidator });

function passwordMatchValidator(group: FormGroup): ValidationErrors | null {
  const pass = group.get('password')?.value;
  const confirm = group.get('confirmPassword')?.value;
  return pass === confirm ? null : { mismatch: true };
}`,
    category: 'forms',
    difficulty: 'intermediate',
  },
  {
    id: 152,
    question: 'How do you handle dynamically added form controls?',
    answer: `You use the \`FormArray\` class to manage a dynamic list of \`FormControl\`, \`FormGroup\`, or even other \`FormArray\` instances.`,
    code: `this.form = this.fb.group({
  aliases: this.fb.array([
    this.fb.control('')
  ])
});

get aliases() {
  return this.form.get('aliases') as FormArray;
}

addAlias() {
  this.aliases.push(this.fb.control(''));
}`,
    category: 'forms',
    difficulty: 'intermediate',
  },
  {
    id: 153,
    question: 'What is the purpose of the registerOnChange and registerOnTouched methods in ControlValueAccessor?',
    answer: `* **registerOnChange**: Registers a callback function that is called when the value changes in the UI.
* **registerOnTouched**: Registers a callback function that is called when the control is "touched" (e.g., on blur).`,
    category: 'forms',
    difficulty: 'advanced',
  },
  {
    id: 154,
    question: 'How do you implement a custom form control using ControlValueAccessor?',
    answer: `You implement the \`ControlValueAccessor\` interface in your component and provide it using the \`NG_VALUE_ACCESSOR\` token.`,
    code: `@Component({
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MyCounterComponent),
    multi: true
  }]
})
export class MyCounterComponent implements ControlValueAccessor {
  writeValue(value: any) { this.value = value; }
  registerOnChange(fn: any) { this.onChange = fn; }
  registerOnTouched(fn: any) { this.onTouched = fn; }
}`,
    category: 'forms',
    difficulty: 'advanced',
  },
  {
    id: 155,
    question: 'What is the difference between path and pathMatch: full in routing?',
    answer: `* **path**: Matches the URL if it *starts* with the specified path.
* **pathMatch: 'full'**: Matches the URL only if the *entire* URL matches the path exactly. Essential for empty paths to avoid matching every route.`,
    category: 'routing',
    difficulty: 'beginner',
  },
  {
    id: 156,
    question: 'How do you protect routes using CanActivate?',
    answer: `You implement the \`CanActivate\` interface (or use a functional guard) and return \`true\`, \`false\`, or a \`UrlTree\`.`,
    code: `canActivate(): boolean {
  if (this.auth.isLoggedIn()) return true;
  this.router.navigate(['/login']);
  return false;
}`,
    category: 'routing',
    difficulty: 'beginner',
  },
  {
    id: 157,
    question: 'What is the purpose of the CanDeactivate guard?',
    answer: `\`CanDeactivate\` is used to prevent the user from navigating away from a route, typically used to warn about unsaved changes in a form.`,
    category: 'routing',
    difficulty: 'intermediate',
  },
  {
    id: 158,
    question: 'What is the difference between CanActivate and CanActivateChild?',
    answer: `* **CanActivate**: Decides if a specific route can be activated.
* **CanActivateChild**: Decides if the children of a specific route can be activated.`,
    category: 'routing',
    difficulty: 'beginner',
  },
  {
    id: 159,
    question: 'What is the purpose of the CanLoad guard?',
    answer: `\`CanLoad\` is used to prevent the entire module from being loaded if the user is not authorized. Unlike \`CanActivate\`, it stops the lazy-loaded bundle from being downloaded.`,
    category: 'routing',
    difficulty: 'intermediate',
  },
  {
    id: 160,
    question: 'How do you handle query parameters in routing?',
    answer: `You can pass query parameters in the \`navigate\` method and retrieve them using the \`queryParams\` observable in \`ActivatedRoute\`.`,
    code: `// Navigation
this.router.navigate(['/search'], { queryParams: { q: 'angular' } });

// Retrieval
this.route.queryParams.subscribe(params => console.log(params['q']));`,
    category: 'routing',
    difficulty: 'beginner',
  },
  {
    id: 161,
    question: 'What is the purpose of the queryParamsHandling option?',
    answer: `It decides how to handle existing query parameters when navigating. Options include \`merge\` (combine new and old) and \`preserve\` (keep existing parameters).`,
    category: 'routing',
    difficulty: 'intermediate',
  },
  {
    id: 162,
    question: 'How do you use the routerLinkActive directive?',
    answer: `\`routerLinkActive\` adds a CSS class to an element when its associated \`routerLink\` becomes active.`,
    code: `<a routerLink="/home" routerLinkActive="active">Home</a>`,
    category: 'routing',
    difficulty: 'beginner',
  },
  {
    id: 163,
    question: 'What is the difference between navigate and navigateByUrl?',
    answer: `* **navigate**: Takes an array of commands (e.g., \`['/user', 1]\`).
* **navigateByUrl**: Takes a complete string URL (e.g., \`'/user/1'\`). It is always absolute.`,
    category: 'routing',
    difficulty: 'intermediate',
  },
  {
    id: 164,
    question: 'How do you handle page not found (404) in routing?',
    answer: `You define a wildcard route (\`**\`) at the very end of your route configuration.`,
    code: `{ path: '**', component: PageNotFoundComponent }`,
    category: 'routing',
    difficulty: 'beginner',
  },
  {
    id: 165,
    question: 'What is the purpose of the primary and secondary outlets?',
    answer: `Angular supports multiple \`<router-outlet>\` elements. The default is the primary outlet. Named outlets (secondary) allow you to display multiple routes simultaneously (e.g., a side panel or a modal).`,
    code: `<router-outlet name="sidebar"></router-outlet>`,
    category: 'routing',
    difficulty: 'advanced',
  },
  {
    id: 166,
    question:
      'What is the difference between providing a service in an @NgModule vs. @Injectable({ providedIn: "root" })?',
    answer: `* **@NgModule**: The service is created when the module is loaded. It is NOT tree-shakable.
* **providedIn: "root"**: The service is a singleton and IS tree-shakable (removed from the bundle if not used).`,
    category: 'services',
    difficulty: 'intermediate',
  },
  {
    id: 167,
    question: 'What is the purpose of the @Optional decorator?',
    answer: `The \`@Optional()\` decorator allows a dependency to be null if it is not provided in the injector, preventing the application from crashing.`,
    code: `constructor(@Optional() private logger: LoggerService) { }`,
    category: 'core',
    difficulty: 'beginner',
  },
  {
    id: 168,
    question: 'What is the purpose of the @Self decorator?',
    answer: `The \`@Self()\` decorator tells Angular to only look for the dependency in the local injector of the current component or directive.`,
    category: 'core',
    difficulty: 'intermediate',
  },
  {
    id: 169,
    question: 'What is the purpose of the @SkipSelf decorator?',
    answer: `The \`@SkipSelf()\` decorator tells Angular to start looking for the dependency in the parent injector, skipping the local one.`,
    category: 'core',
    difficulty: 'intermediate',
  },
  {
    id: 170,
    question: 'How do you use the factory provider (useFactory)?',
    answer: `\`useFactory\` allows you to create a dependency using a custom function. This is useful when the dependency's creation logic depends on other services or configurations.`,
    code: `{ 
  provide: LoggerService, 
  useFactory: (config: Config) => config.isDev ? new DevLogger() : new ProdLogger(),
  deps: [Config]
}`,
    category: 'core',
    difficulty: 'advanced',
  },
  {
    id: 171,
    question: 'What is the purpose of the useValue provider?',
    answer: `\`useValue\` allows you to provide a static value (e.g., a configuration object or a constant) as a dependency.`,
    category: 'core',
    difficulty: 'beginner',
  },
  {
    id: 172,
    question: 'What is the purpose of the useClass provider?',
    answer: `\`useClass\` allows you to substitute one class for another (e.g., providing a mock service during testing).`,
    category: 'core',
    difficulty: 'beginner',
  },
  {
    id: 173,
    question: 'What is the purpose of the useExisting provider?',
    answer: `\`useExisting\` creates an alias for an existing provider. This ensures that both tokens resolve to the same instance.`,
    category: 'core',
    difficulty: 'intermediate',
  },
  {
    id: 174,
    question: 'What is an InjectionToken?',
    answer: `An \`InjectionToken\` is used to provide dependencies that don't have a class representation (e.g., interfaces or string values), as interfaces are removed during compilation.`,
    code: `export const API_URL = new InjectionToken<string>('api.url');`,
    category: 'core',
    difficulty: 'intermediate',
  },
  {
    id: 175,
    question: 'How do you handle circular dependencies in Angular?',
    answer: `Circular dependencies occur when two services depend on each other. You can solve this by:
1. Moving shared logic to a third service.
2. Using the \`forwardRef()\` function.
3. Redesigning the architecture to remove the cycle.`,
    category: 'core',
    difficulty: 'advanced',
  },
  {
    id: 176,
    question: 'How do you perform a multi-provider injection (multi: true)?',
    answer: `Setting \`multi: true\` in a provider allows you to provide multiple values for the same token. Angular then injects an array of all provided values.`,
    code: `{ provide: APP_INITIALIZER, useValue: initFn, multi: true }`,
    category: 'core',
    difficulty: 'advanced',
  },
  {
    id: 177,
    question: 'What is the purpose of the APP_INITIALIZER token?',
    answer: `\`APP_INITIALIZER\` is an injection token that allows you to run a function during application startup (e.g., to load configuration data). If the function returns a promise, Angular waits for it to resolve before finishing initialization.`,
    category: 'core',
    difficulty: 'advanced',
  },
  {
    id: 178,
    question: 'How do you implement an HTTP Interceptor?',
    answer: `You implement the \`HttpInterceptor\` interface and its \`intercept()\` method. Interceptors can modify both outgoing requests and incoming responses.`,
    code: `intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  const authReq = req.clone({ setHeaders: { Authorization: 'Bearer ' + token } });
  return next.handle(authReq);
}`,
    category: 'http',
    difficulty: 'intermediate',
  },
  {
    id: 179,
    question: 'What is the difference between HttpInterceptor and HttpInterceptorFn?',
    answer: `* **HttpInterceptor**: Class-based interceptor (older style).
* **HttpInterceptorFn**: Function-based interceptor (introduced in v15). It is more lightweight and aligns with functional programming patterns.`,
    category: 'http',
    difficulty: 'intermediate',
  },
  {
    id: 180,
    question: 'How do you handle HTTP errors using an Interceptor?',
    answer: `You can use the \`catchError\` operator in the interceptor's \`intercept()\` method to handle errors globally.`,
    code: `return next.handle(req).pipe(
  catchError((error: HttpErrorResponse) => {
    if (error.status === 401) {
      // Redirect to login
    }
    return throwError(error);
  })
);`,
    category: 'http',
    difficulty: 'intermediate',
  },
  {
    id: 181,
    question: 'What is the purpose of the withInterceptors() function?',
    answer: `\`withInterceptors()\` is used in \`provideHttpClient()\` to register functional interceptors.`,
    code: `provideHttpClient(withInterceptors([authInterceptor]))`,
    category: 'http',
    difficulty: 'intermediate',
  },
  {
    id: 182,
    question: 'How do you make parallel HTTP requests using RxJS?',
    answer: `You use the \`forkJoin\` operator to wait for multiple HTTP requests to complete.`,
    code: `forkJoin([this.http.get('/api/1'), this.http.get('/api/2')]).subscribe();`,
    category: 'http',
    difficulty: 'beginner',
  },
  {
    id: 183,
    question: 'What is the difference between forkJoin and combineLatest?',
    answer: `* **forkJoin**: Waits for all observables to complete and then emits their final values.
* **combineLatest**: Emits whenever any of the observables emits a value (requires each to have emitted at least once).`,
    category: 'rxjs',
    difficulty: 'intermediate',
  },
  {
    id: 184,
    question: 'How do you cancel an HTTP request?',
    answer: `HTTP requests in Angular are observables. You can cancel a request by unsubscribing from the observable before it completes.`,
    category: 'http',
    difficulty: 'beginner',
  },
  {
    id: 185,
    question: 'What is the purpose of the withCredentials option in HttpClient?',
    answer: `Setting \`withCredentials: true\` tells the browser to include cookies and authorization headers in cross-site requests.`,
    category: 'http',
    difficulty: 'intermediate',
  },
  {
    id: 186,
    question: 'How do you upload a file using HttpClient?',
    answer: `You use the \`post()\` method with a \`FormData\` object. You can also track the progress using \`reportProgress: true\`.`,
    code: `const formData = new FormData();
formData.append('file', file);
this.http.post('/api/upload', formData, { reportProgress: true, observe: 'events' }).subscribe();`,
    category: 'http',
    difficulty: 'intermediate',
  },
  {
    id: 187,
    question: 'What is the purpose of the HttpParams class?',
    answer: `\`HttpParams\` is used to represent URL query parameters in a type-safe way. It is immutable, so each modification returns a new instance.`,
    code: `const params = new HttpParams().set('page', '1');
this.http.get('/api', { params }).subscribe();`,
    category: 'http',
    difficulty: 'beginner',
  },
  {
    id: 188,
    question: 'What is the purpose of the HttpHeaders class?',
    answer: `\`HttpHeaders\` is used to represent HTTP request or response headers. Like \`HttpParams\`, it is immutable.`,
    category: 'http',
    difficulty: 'beginner',
  },
  {
    id: 189,
    question: 'How do you handle JSONP requests in Angular?',
    answer: `You can use the \`jsonp()\` method in \`HttpClient\` after providing \`withJsonpSupport()\` in \`provideHttpClient()\`.`,
    category: 'http',
    difficulty: 'intermediate',
  },
  {
    id: 190,
    question: 'What is the difference between a Template and a View?',
    answer: `* **Template**: A blueprint for the UI, defined in HTML.
* **View**: A live instantiation of a template, managed by Angular. A component has a "host view", and can have "embedded views" (e.g., from \`ng-template\`).`,
    category: 'core',
    difficulty: 'advanced',
  },
  {
    id: 191,
    question: 'What is the purpose of the @ViewChild decorator?',
    answer: `\`@ViewChild\` allows you to access a child component, directive, or DOM element from the parent component class.`,
    code: `@ViewChild('myInput') input!: ElementRef;`,
    category: 'core',
    difficulty: 'beginner',
  },
  {
    id: 192,
    question: 'What is the difference between { static: true } and { static: false } in @ViewChild?',
    answer: `* **static: true**: The element is available during \`ngOnInit\`. Use this for elements not wrapped in structural directives like \`*ngIf\`.
* **static: false**: The element is available during \`ngAfterViewInit\`. This is the default.`,
    category: 'core',
    difficulty: 'intermediate',
  },
  {
    id: 193,
    question: 'How do you access multiple children using @ViewChildren?',
    answer: `\`@ViewChildren\` returns a \`QueryList\` of all matching children. You can subscribe to the \`changes\` observable of the \`QueryList\` to react to additions or removals.`,
    category: 'core',
    difficulty: 'intermediate',
  },
  {
    id: 194,
    question: 'What is Content Projection?',
    answer: `Content projection allows you to insert (project) HTML content from a parent component into a child component using the \`<ng-content>\` element.`,
    code: `<!-- Child -->
<div>
  <ng-content></ng-content>
</div>

<!-- Parent -->
<app-child>
  <p>This content is projected!</p>
</app-child>`,
    category: 'core',
    difficulty: 'beginner',
  },
  {
    id: 195,
    question: 'How do you use named slots in content projection?',
    answer: `You use the \`select\` attribute on \`<ng-content>\` to project content into specific slots based on CSS selectors.`,
    code: `<!-- Child -->
<ng-content select="header"></ng-content>
<ng-content select=".body"></ng-content>`,
    category: 'core',
    difficulty: 'intermediate',
  },
  {
    id: 196,
    question: 'What is the purpose of the @ContentChild decorator?',
    answer: `\`@ContentChild\` allows you to access a projected child component, directive, or element from the child component class.`,
    category: 'core',
    difficulty: 'intermediate',
  },
  {
    id: 197,
    question: 'What is the difference between ngAfterViewInit and ngAfterContentInit?',
    answer: `* **ngAfterContentInit**: Called after Angular projects external content into the component's view.
* **ngAfterViewInit**: Called after Angular initializes the component's views and child views.`,
    category: 'core',
    difficulty: 'intermediate',
  },
  {
    id: 198,
    question: 'What is a View Container?',
    answer: `A view container is a special DOM element where Angular can dynamically attach views. It is represented by the \`ViewContainerRef\` class.`,
    category: 'core',
    difficulty: 'advanced',
  },
  {
    id: 199,
    question: 'How do you dynamically create a component?',
    answer: `In modern Angular, you use the \`createComponent()\` method of \`ViewContainerRef\`.`,
    code: `constructor(private vcr: ViewContainerRef) {}

create() {
  const componentRef = this.vcr.createComponent(MyDynamicComponent);
}`,
    category: 'core',
    difficulty: 'advanced',
  },
  {
    id: 200,
    question: 'What is the purpose of the ComponentRef object?',
    answer: `\`ComponentRef\` is a reference to a dynamically created component. It allows you to access the component instance, change its inputs, and destroy it.`,
    category: 'core',
    difficulty: 'advanced',
  },
];
