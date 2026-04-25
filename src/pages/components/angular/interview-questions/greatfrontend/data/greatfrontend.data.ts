import type { AngularQuestion, QuestionCategory } from '../../../shared/types';

export const GREATFRONTEND_CATEGORIES: QuestionCategory[] = [
  { id: 'core', label: 'Core Concepts', icon: '🏗️' },
  { id: 'templates', label: 'Templates & Binding', icon: '📝' },
  { id: 'directives', label: 'Directives & Pipes', icon: '🎯' },
  { id: 'services', label: 'Services & DI', icon: '⚙️' },
  { id: 'forms', label: 'Forms', icon: '📋' },
  { id: 'routing', label: 'Routing', icon: '🔀' },
  { id: 'rxjs', label: 'HTTP & RxJS', icon: '🌐' },
  { id: 'performance', label: 'Change Detection', icon: '⚡' },
  { id: 'advanced', label: 'Advanced', icon: '🚀' },
];

export const GREATFRONTEND_QUESTIONS: AngularQuestion[] = [
  {
    id: 1,
    question: 'What is Angular and how is it different from AngularJS?',
    answer: `Angular is a modern, open-source framework by Google for building SPAs using TypeScript. It follows a component-based architecture with comprehensive tools for routing, forms, state management, and testing.

Key differences from AngularJS:
• Architecture: Angular uses component-based structure; AngularJS used MVC with controllers and scopes
• Language: Angular uses TypeScript; AngularJS used JavaScript
• Performance: Angular has AoT compilation and improved change detection
• Mobile: Angular was designed mobile-first from the start
• CLI: Angular ships with a powerful CLI tool`,
    category: 'core',
    difficulty: 'beginner',
  },
  {
    id: 2,
    question: 'How does an Angular application work?',
    answer: `An Angular app starts from main.ts which bootstraps the root module (AppModule). The root module declares components and bootstraps AppComponent.

Angular's compiler processes TypeScript and HTML during the build (using AoT), producing optimised JavaScript. The browser renders the root component template and Angular manages DOM updates via change detection. Dependency injection provides services throughout.`,
    category: 'core',
    difficulty: 'beginner',
  },
  {
    id: 3,
    question: 'What is Angular CLI?',
    answer: `The Angular CLI automates common tasks and enforces best practices.

Key commands:
• ng new my-app       — Create a new project
• ng generate component my-comp — Generate a component
• ng serve           — Serve locally for development
• ng build           — Compile for deployment
• ng test            — Run unit tests`,
    code: `# Install CLI globally
npm install -g @angular/cli

# Create new project
ng new my-app

# Serve locally
ng serve --open`,
    category: 'core',
    difficulty: 'beginner',
  },
  {
    id: 4,
    question: 'What are components?',
    answer: `Components are the fundamental building blocks of an Angular app. Each component has:
• A template (HTML) that defines the view
• A class (TypeScript) with data and logic
• Metadata via @Component decorator (selector, styles)

An Angular app is essentially a tree of nested components.`,
    code: `@Component({
  selector: 'app-hello',
  template: '<h1>Hello {{ name }}!</h1>',
  styles: ['h1 { color: crimson; }']
})
export class HelloComponent {
  name = 'Angular';
}`,
    category: 'core',
    difficulty: 'beginner',
  },
  {
    id: 5,
    question: 'What is an NgModule?',
    answer: `An NgModule groups related components, directives, pipes and services. Key @NgModule properties:
• declarations — components/directives/pipes belonging to this module
• imports — other modules whose exports are needed here
• providers — services the injector should create
• exports — items other modules can use

Standalone components (Angular 14+) reduce the need for NgModules.`,
    code: `@NgModule({
  declarations: [AppComponent, UserComponent],
  imports: [BrowserModule, FormsModule],
  providers: [UserService],
  bootstrap: [AppComponent]
})
export class AppModule {}`,
    category: 'core',
    difficulty: 'beginner',
  },
  {
    id: 6,
    question: 'What are decorators?',
    answer: `Decorators are TypeScript functions that add metadata to classes, methods, properties or parameters. Angular uses them extensively:
• @Component — marks class as a component with template/styles config
• @Injectable — marks class for dependency injection
• @Input — declares an input property (parent → child data)
• @Output — declares an output event (child → parent notification)
• @NgModule — configures a module`,
    code: `@Component({ selector: 'app-card', template: '...' })
export class CardComponent {
  @Input() title: string = '';
  @Output() clicked = new EventEmitter<void>();
}`,
    category: 'core',
    difficulty: 'beginner',
  },
  {
    id: 7,
    question: 'What is the difference between constructor and ngOnInit()?',
    answer: `constructor runs first when the class is instantiated — used for DI setup only.

ngOnInit is an Angular lifecycle hook that runs after Angular has set all @Input() properties. It's the recommended place for initialisation logic like API calls.

Order: constructor → ngOnChanges → ngOnInit`,
    code: `export class ExampleComponent implements OnInit {
  @Input() userId: string = '';
  userData: any;

  constructor(private userService: UserService) {
    // userId is NOT available here yet
  }

  ngOnInit() {
    // userId IS available here
    this.userService.getUser(this.userId).subscribe(
      data => this.userData = data
    );
  }
}`,
    category: 'core',
    difficulty: 'intermediate',
  },
  {
    id: 8,
    question: 'What are the component lifecycle hooks?',
    answer: `Angular calls these methods in order:
1. ngOnChanges — when @Input properties change
2. ngOnInit — once after first ngOnChanges
3. ngDoCheck — every change detection run
4. ngAfterContentInit — after projected content initialised
5. ngAfterContentChecked — after projected content checked
6. ngAfterViewInit — after component view initialised
7. ngAfterViewChecked — after component view checked
8. ngOnDestroy — just before component is destroyed`,
    category: 'core',
    difficulty: 'intermediate',
  },
  {
    id: 9,
    question: 'What is interpolation?',
    answer: `Interpolation is a one-way binding technique using double curly braces {{ }} to display component data in the template. Angular evaluates the expression, converts it to a string, and inserts it into the HTML. It automatically sanitises output to prevent XSS.`,
    code: `// component
export class AppComponent {
  name = 'Angular';
  version = 17;
  today = new Date();
}

// template
<h1>Hello {{ name }} v{{ version }}!</h1>
<p>Today is {{ today | date }}</p>
<p>2 + 2 = {{ 2 + 2 }}</p>`,
    category: 'templates',
    difficulty: 'beginner',
  },
  {
    id: 10,
    question: 'Explain data bindings and the different types.',
    answer: `Data binding synchronises data between the component class and template.

One-way (component → view):
• Interpolation {{ value }} — displays text
• Property binding [property]="value" — sets DOM property
• Attribute binding [attr.aria-label]="val"

One-way (view → component):
• Event binding (click)="handler()"

Two-way:
• [(ngModel)]="value" — requires FormsModule`,
    code: `<!-- Interpolation -->
<p>{{ title }}</p>

<!-- Property binding -->
<img [src]="imageUrl" [alt]="imageAlt">

<!-- Event binding -->
<button (click)="save()">Save</button>

<!-- Two-way binding -->
<input [(ngModel)]="username">`,
    category: 'templates',
    difficulty: 'beginner',
  },
  {
    id: 11,
    question: 'What is a template reference variable?',
    answer: `A template reference variable (#varName) gives a reference to a DOM element, component, directive, or NgTemplateOutlet within the template. You can use it directly in the template or access it from the class via @ViewChild.`,
    code: `<!-- In template -->
<input #nameInput type="text">
<button (click)="log(nameInput.value)">Log</button>

<!-- Access in class -->
export class AppComponent {
  @ViewChild('nameInput') inputRef!: ElementRef;

  ngAfterViewInit() {
    this.inputRef.nativeElement.focus();
  }
}`,
    category: 'templates',
    difficulty: 'intermediate',
  },
  {
    id: 12,
    question: 'What are directives and what are their types?',
    answer: `Directives add behaviour to DOM elements. Three types:

1. Component directives — directives with a template (most common)
2. Structural directives — change DOM layout by adding/removing elements. Prefixed with *: *ngIf, *ngFor, *ngSwitch
3. Attribute directives — change appearance or behaviour of an element: NgClass, NgStyle, custom directives`,
    code: `<!-- Structural: conditionally render -->
<div *ngIf="isLoggedIn">Welcome back!</div>

<!-- Structural: iterate -->
<li *ngFor="let item of items; trackBy: trackById">
  {{ item.name }}
</li>

<!-- Attribute: dynamic classes -->
<div [ngClass]="{ active: isActive, disabled: !isEnabled }">
  Content
</div>`,
    category: 'directives',
    difficulty: 'beginner',
  },
  {
    id: 13,
    question: 'What is Angular control flow (@if, @for, @switch)?',
    answer: `Available from Angular 17, built-in control flow replaces *ngIf, *ngFor, *ngSwitch with cleaner block syntax:

Benefits:
• Better performance (mandatory track in @for)
• Improved type checking
• Smaller bundle (compiler-level)
• No leading * required`,
    code: `<!-- @if / @else -->
@if (isLoggedIn) {
  <p>Welcome, {{ user.name }}!</p>
} @else {
  <a href="/login">Please log in</a>
}

<!-- @for with track -->
@for (item of items; track item.id) {
  <li>{{ item.name }}</li>
} @empty {
  <p>No items found</p>
}

<!-- @switch -->
@switch (status) {
  @case ('active') { <span class="green">Active</span> }
  @case ('inactive') { <span class="red">Inactive</span> }
  @default { <span>Unknown</span> }
}`,
    category: 'directives',
    difficulty: 'intermediate',
  },
  {
    id: 14,
    question: 'What are pipes and how are they used?',
    answer: `Pipes transform data for display in templates without changing the source data. Use the pipe operator |.

Built-in pipes: DatePipe, CurrencyPipe, DecimalPipe, UpperCasePipe, LowerCasePipe, JsonPipe, AsyncPipe.

Custom pipes implement PipeTransform interface.`,
    code: `<!-- Built-in pipes -->
{{ price | currency:'INR' }}
{{ today | date:'mediumDate' }}
{{ name | uppercase }}
{{ data$ | async }}

<!-- Custom pipe -->
@Pipe({ name: 'truncate' })
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit = 50): string {
    return value.length > limit
      ? value.slice(0, limit) + '...'
      : value;
  }
}

<!-- Usage -->
{{ longText | truncate:100 }}`,
    category: 'directives',
    difficulty: 'beginner',
  },
  {
    id: 15,
    question: 'What is a service and how do you create one?',
    answer: `A service encapsulates reusable logic, data fetching, or shared state — keeping components lean. Decorated with @Injectable and typically provided at root level (singleton throughout the app).

Create using CLI: ng generate service data`,
    code: `@Injectable({ providedIn: 'root' })
export class ProductService {
  private products: Product[] = [];

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>('/api/products');
  }
}

// Inject into component
export class ProductListComponent {
  products$ = this.productService.getProducts();

  constructor(private productService: ProductService) {}
}`,
    category: 'services',
    difficulty: 'beginner',
  },
  {
    id: 16,
    question: 'What is dependency injection in Angular?',
    answer: `DI is a design pattern where a class receives its dependencies from an external source rather than creating them itself. Angular's DI system uses:
• Injectors — containers managing dependency instances
• Providers — configure how to create a dependency
• The @Injectable decorator to mark injectable classes

Benefits: testability, maintainability, modularity.`,
    code: `// Define injectable service
@Injectable({ providedIn: 'root' })
export class LogService {
  log(msg: string) { console.log(msg); }
}

// Inject into component
@Component({ ... })
export class AppComponent {
  constructor(private logger: LogService) {
    this.logger.log('Component created');
  }
}

// In tests, inject a mock
TestBed.configureTestingModule({
  providers: [{ provide: LogService, useClass: MockLogService }]
});`,
    category: 'services',
    difficulty: 'intermediate',
  },
  {
    id: 17,
    question: 'What is the DI hierarchy in Angular?',
    answer: `Angular has a hierarchical injector tree mirroring the component tree. When a dependency is requested, Angular searches up the tree until it finds a provider.

• Root level (providedIn: 'root') — singleton for entire app
• Module level (lazy-loaded module providers) — singleton within that module
• Component/Directive level (@Component providers:[]) — new instance per component`,
    category: 'components',
    difficulty: 'advanced',
  },
  {
    id: 18,
    question: 'What is a singleton service?',
    answer: `A singleton service has only one instance throughout the app. Achieved by using providedIn: 'root' in @Injectable — Angular registers it with the root injector so all components and services share the same instance.`,
    code: `@Injectable({ providedIn: 'root' })
export class CartService {
  private items: CartItem[] = [];

  addItem(item: CartItem) { this.items.push(item); }
  getItems() { return this.items; }
  clear() { this.items = []; }
}`,
    category: 'services',
    difficulty: 'intermediate',
  },
  {
    id: 19,
    question: 'How does Angular handle forms? What are the two approaches?',
    answer: `Angular offers two form-handling approaches:

Template-driven forms:
• Logic defined in HTML using NgModel/NgForm directives
• Simpler, good for basic forms
• Asynchronous, harder to test

Reactive forms:
• Form model defined programmatically in the class
• Uses FormControl, FormGroup, FormArray
• Synchronous, predictable, excellent for complex/dynamic forms`,
    code: `// Reactive form example
export class LoginComponent {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)])
  });

  onSubmit() {
    if (this.form.valid) console.log(this.form.value);
  }
}

// Template
<form [formGroup]="form" (ngSubmit)="onSubmit()">
  <input formControlName="email">
  <input formControlName="password" type="password">
  <button type="submit" [disabled]="form.invalid">Login</button>
</form>`,
    category: 'forms',
    difficulty: 'intermediate',
  },
  {
    id: 20,
    question: 'How do you create custom validators in Angular?',
    answer: `Custom validators are functions accepting an AbstractControl and returning null (valid) or a ValidationErrors object (invalid).

• Synchronous: returns ValidationErrors | null
• Asynchronous: returns Observable/Promise of ValidationErrors | null`,
    code: `// Custom sync validator
function noSpaceValidator(control: AbstractControl): ValidationErrors | null {
  return control.value?.includes(' ')
    ? { noSpace: true }
    : null;
}

// Async validator (e.g. check email availability)
function emailTakenValidator(authService: AuthService): AsyncValidatorFn {
  return (control) =>
    authService.checkEmail(control.value).pipe(
      map(taken => taken ? { emailTaken: true } : null)
    );
}

// Apply to FormControl
email = new FormControl('', [
  Validators.required,
  noSpaceValidator
], [emailTakenValidator(this.authService)]);`,
    category: 'forms',
    difficulty: 'advanced',
  },
  {
    id: 21,
    question: 'What is Angular Routing and how do you set it up?',
    answer: `Angular Routing enables navigation between views in an SPA without full page reloads. Setup steps:
1. Define Routes array mapping paths to components
2. Use RouterModule.forRoot(routes) in AppModule
3. Add <router-outlet> in the main template
4. Use routerLink directive for navigation`,
    code: `// app-routing.module.ts
const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'products/:id', component: ProductDetailComponent },
  { path: 'admin', loadChildren: () =>
      import('./admin/admin.module').then(m => m.AdminModule),
    canActivate: [AuthGuard]
  },
  { path: '**', component: NotFoundComponent }
];

// Template navigation
<nav>
  <a routerLink="/home" routerLinkActive="active">Home</a>
  <a [routerLink]="['/products', product.id]">View Product</a>
</nav>
<router-outlet></router-outlet>`,
    category: 'routing',
    difficulty: 'intermediate',
  },
  {
    id: 22,
    question: 'What are Angular Guards?',
    answer: `Guards control navigation by deciding if a route can be activated, deactivated, or loaded. Types:
• canActivate — protect route from unauthorised access
• canActivateChild — protect child routes
• canDeactivate — prompt user before leaving (unsaved changes)
• canMatch — decide if route definition should match
• resolve — pre-fetch data before route activates`,
    code: `// Functional guard (Angular 14+)
export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn()) return true;

  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url }
  });
};

// Apply to route
const routes: Routes = [{
  path: 'dashboard',
  component: DashboardComponent,
  canActivate: [authGuard]
}];`,
    category: 'routing',
    difficulty: 'intermediate',
  },
  {
    id: 23,
    question: 'What is an Observable and how is it used in Angular?',
    answer: `An Observable represents a stream of values over time. It is lazy (nothing happens until you subscribe), supports multiple emissions, is cancellable, and has a rich operator ecosystem via RxJS.

Angular uses Observables for: HTTP requests, Router events, Form value changes, Custom event streams.`,
    code: `// HTTP returns Observable
this.http.get<User[]>('/api/users').subscribe({
  next: users => this.users = users,
  error: err => console.error(err),
  complete: () => console.log('Done')
});

// Use async pipe in template (auto-unsubscribes!)
users$ = this.http.get<User[]>('/api/users');

// Template
<ul>
  <li *ngFor="let user of users$ | async">{{ user.name }}</li>
</ul>`,
    category: 'rxjs',
    difficulty: 'intermediate',
  },
  {
    id: 24,
    question: 'What is the difference between Promise and Observable?',
    answer: `Promise:
• Emits a single value then completes
• Eager — starts immediately on creation
• Not cancellable
• Limited operators (.then, .catch, .finally)

Observable:
• Can emit multiple values over time
• Lazy — only starts on subscribe()
• Cancellable via unsubscribe()
• Rich RxJS operators (map, filter, debounceTime, switchMap...)
• Better error recovery with catchError, retry`,
    category: 'rxjs',
    difficulty: 'intermediate',
  },
  {
    id: 25,
    question: 'What is an RxJS Subject?',
    answer: `A Subject is both an Observable and an Observer — it can receive values (next/error/complete) and be subscribed to. It is multicast: all subscribers share one execution stream.

Variants:
• BehaviorSubject — emits last value to new subscribers
• ReplaySubject(n) — replays last n values to new subscribers
• AsyncSubject — emits only the last value on completion`,
    code: `import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private theme$ = new BehaviorSubject<'light' | 'dark'>('light');
  currentTheme$ = this.theme$.asObservable();

  setTheme(theme: 'light' | 'dark') {
    this.theme$.next(theme);
  }
}

// In component
this.themeService.currentTheme$.subscribe(
  theme => this.applyTheme(theme)
);`,
    category: 'rxjs',
    difficulty: 'intermediate',
  },
  {
    id: 26,
    question: 'What are HTTP interceptors?',
    answer: `Interceptors inspect and transform HTTP requests/responses globally. Common uses:
• Attach auth tokens to every request
• Log all requests and responses
• Handle errors centrally (401 redirect, retry logic)
• Show/hide loading spinner
• Cache responses`,
    code: `@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = this.auth.getToken();
    if (!token) return next.handle(req);

    const authReq = req.clone({
      headers: req.headers.set('Authorization', \`Bearer \${token}\`)
    });

    return next.handle(authReq).pipe(
      catchError(err => {
        if (err.status === 401) this.auth.logout();
        return throwError(() => err);
      })
    );
  }
}

// Register (multi: true allows multiple interceptors)
providers: [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
]`,
    category: 'rxjs',
    difficulty: 'advanced',
  },
  {
    id: 27,
    question: 'What is change detection in Angular and how does it work?',
    answer: `Change detection synchronises the data model with the DOM. Angular uses Zone.js to patch async APIs (events, timers, XHR) and detect when data might have changed. During each cycle, Angular traverses the component tree top-down, checks template expressions, and updates the DOM if changed.

OnPush strategy: component only checked when:
• An @Input reference changes
• An event originates within the component
• An async pipe emits a new value
• Explicitly triggered via ChangeDetectorRef`,
    code: `@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '{{ user.name }}'
})
export class UserCardComponent {
  @Input() user!: User; // Angular checks only when reference changes
}

// When using non-observable data, manually trigger:
constructor(private cdr: ChangeDetectorRef) {}

updateName() {
  this.user = { ...this.user, name: 'New Name' }; // new reference
  // OR:
  this.cdr.markForCheck();
}`,
    category: 'performance',
    difficulty: 'advanced',
  },
  {
    id: 28,
    question: 'What are Angular Signals?',
    answer: `Available from Angular 16, Signals are reactive primitives that wrap a value and notify consumers when it changes. They enable fine-grained reactivity without Zone.js and are the foundation for zoneless Angular.

Types:
• signal(value) — writable signal
• computed(() => expr) — derived signal (memoised)
• effect(() => ...) — side effects when signals change`,
    code: `import { signal, computed, effect } from '@angular/core';

@Component({ template: '<p>Count: {{ count() }} | Double: {{ double() }}</p>' })
export class CounterComponent {
  count = signal(0);
  double = computed(() => this.count() * 2);

  constructor() {
    effect(() => console.log('Count changed to:', this.count()));
  }

  increment() { this.count.update(n => n + 1); }
  reset()     { this.count.set(0); }
}`,
    category: 'performance',
    difficulty: 'advanced',
  },
  {
    id: 29,
    question: 'What is lazy loading and how do you use it in Angular?',
    answer: `Lazy loading loads feature module code only when the user navigates to that route, reducing initial bundle size and improving startup time. Use the loadChildren property with a dynamic import in the route configuration.`,
    code: `const routes: Routes = [
  { path: 'home', component: HomeComponent },
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.module').then(m => m.AdminModule)
  },
  // Standalone component lazy loading (Angular 14+)
  {
    path: 'settings',
    loadComponent: () =>
      import('./settings/settings.component').then(c => c.SettingsComponent)
  }
];`,
    category: 'routing',
    difficulty: 'intermediate',
  },
  {
    id: 30,
    question: 'What is a standalone component?',
    answer: `Standalone components (Angular 14+, default in Angular 17) can be used without being declared in an NgModule. Set standalone: true and import dependencies directly in the component's imports array. This simplifies the app structure by reducing the need for modules.`,
    code: `@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, RouterModule, HeroCardComponent],
  template: \`
    <app-hero-card *ngFor="let h of heroes" [hero]="h" />
    <a routerLink="/home">Back</a>
  \`
})
export class HeroListComponent {
  heroes = inject(HeroService).getAll();
}`,
    category: 'core',
    difficulty: 'intermediate',
  },
  {
    id: 31,
    question: 'What is Angular Universal?',
    answer: `Angular Universal enables Server-Side Rendering (SSR). The app runs on a Node.js server to generate static HTML for the initial page load, then hydrates into a fully interactive SPA in the browser.

Benefits:
• Better SEO — crawlers see full HTML content
• Faster perceived performance — content visible before JS loads
• Better experience on low-power devices

From Angular 16, full hydration preserves server-rendered DOM.`,
    category: 'advanced',
    difficulty: 'advanced',
  },
  {
    id: 32,
    question: 'What is Angular Ivy?',
    answer: `Ivy is Angular's default compilation and rendering pipeline (since Angular 9). It replaced the older View Engine.

Key advantages:
• Locality — components compiled independently (faster builds)
• Tree-shaking — unused framework code removed from bundle
• Smaller bundles and faster rendering
• Better debugging and stack traces`,
    category: 'advanced',
    difficulty: 'advanced',
  },
  {
    id: 33,
    question: 'What is content projection?',
    answer: `Content projection passes HTML from a parent component into a child component's template using <ng-content>. Similar to React's children prop or Vue's slots. The child defines placeholders; the parent fills them.`,
    code: `<!-- Card child component template -->
<div class="card">
  <div class="card-header">
    <ng-content select="[slot=header]"></ng-content>
  </div>
  <div class="card-body">
    <ng-content></ng-content>
  </div>
</div>

<!-- Parent usage -->
<app-card>
  <h2 slot="header">My Title</h2>
  <p>This is the card body content projected from parent.</p>
</app-card>`,
    category: 'templates',
    difficulty: 'intermediate',
  },
  {
    id: 34,
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
    id: 35,
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
    id: 36,
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
    id: 37,
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
    id: 38,
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
    id: 39,
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
    id: 40,
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
    id: 41,
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
    id: 42,
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
    id: 43,
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
    id: 44,
    question: 'How do you pass data from a Child to a Parent component?',
    answer: `Data is passed from Child to Parent using the \`@Output()\` decorator combined with an \`EventEmitter\`. The child emits an event containing the data, and the parent binds to that event in its template.`,
    code: `// Child Component
import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-child',
  template: \`<button (click)="send()">Send to Parent</button>\`
})
export class ChildComponent {
  @Output() dataEvent = new EventEmitter<string>();

  send() {
    this.dataEvent.emit('Hello from Child!');
  }
}

// Parent Component Template
// <app-child (dataEvent)="receiveData($event)"></app-child>

// Parent Component Class
export class ParentComponent {
  receiveData(message: string) {
    console.log(message); // "Hello from Child!"
  }
}`,
    category: 'components',
    difficulty: 'beginner',
  },
  {
    id: 45,
    question: 'What is the purpose of the ng-content select attribute?',
    answer: `The \`select\` attribute on an \`<ng-content>\` tag allows for "Multi-Slot Content Projection". It uses CSS selectors to determine *which* projected content belongs in *which* slot.`,
    code: `// Modal Component Template
<div class="modal">
  <div class="header">
    <ng-content select="[modal-header]"></ng-content>
  </div>
  <div class="body">
    <!-- Default slot for anything without a matching selector -->
    <ng-content></ng-content> 
  </div>
  <div class="footer">
    <ng-content select=".modal-footer"></ng-content>
  </div>
</div>

// Parent Usage
<app-modal>
  <h2 modal-header>Delete Warning</h2>
  
  <p>Are you sure you want to delete this?</p> <!-- Goes to default slot -->
  
  <div class="modal-footer">
    <button>Cancel</button>
    <button>Confirm</button>
  </div>
</app-modal>`,
    category: 'components',
    difficulty: 'intermediate',
  },
  {
    id: 46,
    question: 'How do you handle routing parameters in Angular?',
    answer: `You configure a parameter in the route definition using a colon (e.g., \`path: 'details/:id'\`). You retrieve the value in the component using the \`ActivatedRoute\` service.

You can read it via the \`snapshot\` (if the component won't be reused) or subscribe to \`paramMap\` (if the component stays on screen while the URL parameter changes).`,
    code: `import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({...})
export class DetailsComponent implements OnInit {
  id!: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // Method 1: Snapshot (Good for initial load)
    this.id = this.route.snapshot.paramMap.get('id')!;

    // Method 2: Observable (Required if navigating to the same component with a different ID)
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id')!;
      // Fetch new data based on new ID
    });
  }
}`,
    category: 'routing',
    difficulty: 'beginner',
  },
  {
    id: 47,
    question: 'What is the Elvis operator (Safe Navigation Operator)?',
    answer: `The safe navigation operator (\`?\`) ensures that Angular does not throw a "cannot read property of undefined" error in HTML templates if an object is null or undefined. It acts as a safety net when dealing with asynchronous data.`,
    code: `<!-- If 'user' is null, the app crashes -->
<h2>{{ user.profile.name }}</h2>

<!-- If 'user' or 'profile' is null, it gracefully returns nothing -->
<h2>{{ user?.profile?.name }}</h2>`,
    category: 'binding',
    difficulty: 'beginner',
  },
  {
    id: 48,
    question: 'Explain the difference between find and findIndex in arrays (TypeScript/JS).',
    answer: `While not strictly Angular-specific, they are heavily used when manipulating data.
*   **\`find()\`**: Returns the *value* of the first element in the array that satisfies the provided testing function. Returns \`undefined\` if not found.
*   **\`findIndex()\`**: Returns the *index* of the first element that satisfies the testing function. Returns \`-1\` if not found.`,
    code: `const users = [
  { id: 49, name: 'John' },
  { id: 50, name: 'Jane' }
];

// Returns the object: { id: 51, name: 'Jane' }
const user = users.find(u => u.name === 'Jane');

// Returns the index: 1
const index = users.findIndex(u => u.name === 'Jane');`,
    category: 'core',
    difficulty: 'beginner',
  },
  {
    id: 52,
    question: 'What is HostListener?',
    answer: `\`@HostListener\` is a decorator used to listen to DOM events on the host element of a directive or component. It provides a cleaner alternative to interacting directly with the native element via \`Renderer2\`.`,
    code: `import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appClickTracker]'
})
export class ClickTrackerDirective {
  
  // Listens to the click event on the element this directive is attached to
  @HostListener('click', ['$event'])
  onClick(event: Event) {
    console.log('Element clicked!', event.target);
  }

  // Can also listen to global window events
  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event) {
    console.log('Window scrolled');
  }
}`,
    category: 'directives',
    difficulty: 'intermediate',
  },
  {
    id: 53,
    question: 'What is a Subject in RxJS?',
    answer: `A \`Subject\` is a special type of Observable that acts as both an Observable and an Observer.
    
It allows values to be multicasted to many Observers (meaning multiple subscribers share the exact same execution). Since it is an Observer, it has the methods \`next(v)\`, \`error(e)\`, and \`complete()\`.`,
    code: `import { Subject } from 'rxjs';

const mySubject = new Subject<number>();

// Subscriber 1
mySubject.subscribe({
  next: (v) => console.log('ObserverA: ' + v)
});

// Subscriber 2
mySubject.subscribe({
  next: (v) => console.log('ObserverB: ' + v)
});

// Emit values
mySubject.next(1); 
// Output: ObserverA: 1, ObserverB: 1
mySubject.next(2);
// Output: ObserverA: 2, ObserverB: 2`,
    category: 'rxjs',
    difficulty: 'intermediate',
  },
  {
    id: 54,
    question: 'How do you create a singleton service in Angular?',
    answer: `A singleton service is an instance of a service that is created only once and shared across the entire application.

The recommended way to create a singleton service is to set the \`providedIn\` property of the \`@Injectable()\` decorator to \`'root'\`.`,
    code: `import { Injectable } from '@angular/core';

@Injectable({
  // This tells Angular to provide this service in the root injector,
  // making it a globally shared singleton.
  providedIn: 'root'
})
export class StateService {
  private userState: any;

  setUser(user: any) { this.userState = user; }
  getUser() { return this.userState; }
}`,
    category: 'services',
    difficulty: 'beginner',
  },
  {
    id: 55,
    question: 'What is the purpose of the ngClass directive?',
    answer: `\`ngClass\` is a built-in attribute directive used to dynamically add or remove CSS classes on an HTML element based on a condition or variable.`,
    code: `<!-- Method 1: String or Array -->
<div [ngClass]="['class1', 'class2']">Array</div>
<div [ngClass]="'class1 class2'">String</div>

<!-- Method 2: Object configuration (Most common) -->
<!-- Adds 'active' class if isActive is true, adds 'disabled' if isDisabled is true -->
<button [ngClass]="{
  'active': isActive,
  'disabled': isDisabled,
  'btn-primary': true 
}">
  Click Me
</button>

<!-- Alternative for single class: Class binding -->
<button [class.active]="isActive">Shorthand</button>`,
    category: 'binding',
    difficulty: 'beginner',
  },
  {
    id: 56,
    question: 'Explain the difference between pristine, dirty, touched, and untouched in Angular forms.',
    answer: `These are boolean properties available on \`FormControl\` and \`NgModel\` instances that describe the user's interaction with the input field.

*   **\`pristine\`**: The value has *not* been changed by the user.
*   **\`dirty\`**: The value *has* been changed by the user.
*   **\`untouched\`**: The user has *not* visited (focused and blurred) the field.
*   **\`touched\`**: The user *has* visited (blurred) the field.

These are heavily used to determine when to show validation error messages.`,
    code: `<!-- Typical validation pattern: Only show error if the user has interacted with it -->
<input formControlName="email">

<div *ngIf="form.get('email')?.invalid && (form.get('email')?.dirty || form.get('email')?.touched)" class="error">
  Please enter a valid email.
</div>`,
    category: 'forms',
    difficulty: 'intermediate',
  },
  {
    id: 57,
    question: 'What is the difference between markForCheck() and detectChanges() in ChangeDetectorRef?',
    answer: `Both are methods on \`ChangeDetectorRef\` used for manual change detection, typically when using \`OnPush\` strategy.

*   **\`markForCheck()\`**: Does *not* trigger change detection immediately. Instead, it marks the component and all its ancestors as "dirty". Angular will check them during the *next* normal change detection cycle.
*   **\`detectChanges()\`**: Triggers change detection *immediately* and synchronously for the current component and all of its children.`,
    code: `import { Component, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-manual-cd',
  template: \`<p>{{ data }}</p>\`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManualCdComponent {
  data = 'Initial';

  constructor(private cdr: ChangeDetectorRef) {}

  updateAsync() {
    setTimeout(() => {
      this.data = 'Updated via Timeout';
      // Required because setTimeout is a macro-task and we are OnPush
      this.cdr.markForCheck(); 
    }, 1000);
  }
}`,
    category: 'performance',
    difficulty: 'advanced',
  },
  {
    id: 58,
    question: 'Explain the difference between switchMap and mergeMap in RxJS.',
    answer: `Both are flattening operators that map values to an inner Observable.

*   **\`mergeMap\` (or \`flatMap\`)**: Subscribes to the inner Observable and merges all emitted values concurrently. If 5 source values arrive, 5 inner Observables run simultaneously.
*   **\`switchMap\`**: When a new source value arrives, it completely *cancels/unsubscribes* from the previous inner Observable and switches to a new one. It only ever maintains one active inner subscription.`,
    code: `import { fromEvent } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

// Perfect use case for switchMap: Search Typeahead
// If the user types 'A', then 'AP', then 'APP', we cancel the API 
// requests for 'A' and 'AP' if they haven't finished yet.
fromEvent(searchInput, 'input').pipe(
  switchMap(event => this.http.get(\`/api/search?q=\${event.target.value}\`))
).subscribe(results => console.log(results));`,
    category: 'rxjs',
    difficulty: 'advanced',
  },
  {
    id: 59,
    question: 'How do functional Interceptors work in modern Angular (v15+)?',
    answer: `In modern Angular, HTTP Interceptors no longer need to be class-based \`Injectable\` services implementing \`HttpInterceptor\`. 

They can be defined as simple functions of type \`HttpInterceptorFn\`. This reduces boilerplate and aligns with Angular's move towards functional, class-less APIs (like functional route guards).`,
    code: `import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService); // Use inject() function!
  const token = authService.getToken();

  if (token) {
    const cloned = req.clone({
      setHeaders: { Authorization: \`Bearer \${token}\` }
    });
    return next(cloned);
  }
  
  return next(req);
};

// In app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
};`,
    category: 'http',
    difficulty: 'intermediate',
  },
  {
    id: 60,
    question: 'What is the withComponentInputBinding() feature in Angular Router?',
    answer: `Introduced in Angular 16, \`withComponentInputBinding()\` automatically binds router data (query parameters, path parameters, and static route data) directly to \`@Input()\` properties in your routed component.

This completely eliminates the need to inject \`ActivatedRoute\` and manually subscribe to \`params\` or \`queryParams\`.`,
    code: `// 1. Enable it in your routing config
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding())
  ]
};

// 2. Route Definition: /user/:id?search=foo
const routes = [{ path: 'user/:id', component: UserComponent }];

// 3. Component
@Component({...})
export class UserComponent {
  // Automatically gets the ':id' from the path!
  @Input() id!: string; 
  
  // Automatically gets '?search=' from query params!
  @Input() search?: string; 
}`,
    category: 'routing',
    difficulty: 'intermediate',
  },
  {
    id: 61,
    question: 'What are Angular Signals and why were they introduced?',
    answer: `Signals (introduced in v16) are Angular's new reactive primitive. A Signal is a wrapper around a value that notifies interested consumers when that value changes.

They were introduced to provide fine-grained reactivity. Unlike Zone.js (which triggers a top-down check of the entire component tree when an event occurs), Signals allow Angular to know exactly *which* specific component (and even which specific DOM node) needs to update, paving the way for "Zone-less" Angular.`,
    code: `import { Component, signal, computed } from '@angular/core';

@Component({
  template: \`
    <p>Count: {{ count() }}</p>
    <p>Double: {{ double() }}</p>
    <button (click)="increment()">Add</button>
  \`
})
export class SignalComponent {
  // Writable Signal
  count = signal(0);
  
  // Computed Signal (automatically updates when 'count' changes)
  double = computed(() => this.count() * 2);

  increment() {
    this.count.update(c => c + 1);
  }
}`,
    category: 'core',
    difficulty: 'intermediate',
  },
  {
    id: 62,
    question: 'How do you prevent an Observable from emitting duplicate consecutive values?',
    answer: `You use the \`distinctUntilChanged()\` operator.

By default, it uses strict equality (\`===\`) to compare the current emission with the previous emission. If they are the same, the value is dropped. You can also provide a custom comparator function for comparing complex objects.`,
    code: `import { of } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

// Source: 1, 1, 2, 2, 1, 3
const source$ = of(1, 1, 2, 2, 1, 3);

source$.pipe(
  distinctUntilChanged()
).subscribe(console.log);

// Output: 1, 2, 1, 3
// Note that the second '1' is emitted because it is distinct 
// from the immediately preceding value ('2').`,
    category: 'rxjs',
    difficulty: 'beginner',
  },
  {
    id: 63,
    question: 'What is the purpose of the takeUntil operator?',
    answer: `\`takeUntil\` is used to automatically unsubscribe from an Observable when another "notifier" Observable emits a value.

This is the most common and robust pattern for managing subscriptions in Angular to prevent memory leaks. You create a Subject that emits in \`ngOnDestroy\`, and pipe \`takeUntil\` onto all your component's subscriptions.`,
    code: `import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({...})
export class PollingComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  ngOnInit() {
    interval(1000).pipe(
      takeUntil(this.destroy$) // Automatically unsubscribes on destroy
    ).subscribe(x => console.log(x));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}`,
    category: 'rxjs',
    difficulty: 'intermediate',
  },
  {
    id: 64,
    question: 'How does Dependency Injection work with Standalone Components?',
    answer: `With Standalone Components, the \`NgModule\` layer is removed. 

*   **Application-wide Services**: Provided using \`providedIn: 'root'\` or added to the \`providers\` array in \`bootstrapApplication()\`.
*   **Component-level Services**: Added directly to the \`providers\` array within the \`@Component\` decorator of the standalone component. These are scoped to that component and its children.`,
    code: `import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { GlobalLoggingService } from './global-logging.service';

// App-wide providers
bootstrapApplication(AppComponent, {
  providers: [
    GlobalLoggingService,
    provideHttpClient(),
    provideRouter(routes)
  ]
});`,
    category: 'core',
    difficulty: 'beginner',
  },
  {
    id: 65,
    question: 'What is a Pure Pipe and why is it important?',
    answer: `By default, all pipes in Angular are "Pure". 

A Pure Pipe is only re-evaluated by Angular when the *primitive value* or the *object reference* passed as input changes. It does not run on every single change detection cycle. This makes pure pipes highly performant. If you mutate an array (e.g., \`array.push()\`), a pure pipe will not detect the change; you must assign a new array reference.`,
    code: `@Pipe({
  name: 'expensiveCalc',
  pure: true // This is the default behavior
})
export class ExpensiveCalcPipe implements PipeTransform {
  transform(value: number): number {
    // Only runs when 'value' changes. 
    // Ignores other component state changes (like mouse movements).
    return this.heavyMath(value);
  }
}`,
    category: 'pipes',
    difficulty: 'intermediate',
  },
  {
    id: 66,
    question: 'Explain the difference between @HostBinding and @HostListener.',
    answer: `Both are decorators used inside Directives and Components to interact with the host element (the DOM element the directive/component is attached to).

*   **\`@HostBinding\`**: Binds a class property to a DOM property or attribute of the host element (e.g., setting the \`class\` or \`style\`).
*   **\`@HostListener\`**: Listens for a DOM event on the host element and triggers a class method (e.g., listening for \`click\` or \`mouseenter\`).`,
    code: `import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({ selector: '[appHighlight]' })
export class HighlightDirective {
  // Bind the host's background-color style to this property
  @HostBinding('style.backgroundColor') bgColor = 'transparent';

  // Listen to mouseover on the host element
  @HostListener('mouseover')
  onMouseOver() {
    this.bgColor = 'yellow';
  }

  // Listen to mouseleave on the host element
  @HostListener('mouseleave')
  onMouseLeave() {
    this.bgColor = 'transparent';
  }
}`,
    category: 'directives',
    difficulty: 'intermediate',
  },
  {
    id: 67,
    question: 'What is the Defer block in Angular templates?',
    answer: `Introduced in Angular 17, \`@defer\` provides declarative, template-based lazy loading.

It allows you to defer the loading of heavy components, directives, or pipes until a specific condition is met (like a button click, scrolling into the viewport, or a timer). Angular handles fetching the JavaScript bundle automatically.`,
    code: `<!-- 
  HeavyChartComponent is NOT loaded in the main bundle.
  It is fetched over the network ONLY when the user scrolls it into view.
-->
@defer (on viewport) {
  <app-heavy-chart [data]="metrics"></app-heavy-chart>
} 
@placeholder {
  <div>Scroll down to load chart...</div>
}
@loading {
  <div class="spinner">Loading bundle...</div>
}
@error {
  <div class="error">Failed to load chart</div>
}`,
    category: 'performance',
    difficulty: 'advanced',
  },
  {
    id: 68,
    question: 'How do you run code outside of Angulars Change Detection?',
    answer: `To prevent heavy, frequent events (like \`mousemove\`, \`scroll\`, or \`requestAnimationFrame\`) from triggering Angular's change detection hundreds of times a second, you use \`NgZone.runOutsideAngular()\`.`,
    code: `import { Component, NgZone, OnInit } from '@angular/core';

@Component({...})
export class TrackingComponent implements OnInit {
  constructor(private ngZone: NgZone) {}

  ngOnInit() {
    // Run outside Angular to prevent triggering CD on every mouse move
    this.ngZone.runOutsideAngular(() => {
      document.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        // Do heavy calculations here without lagging the UI
        
        if (x > 500) {
          // Re-enter Angular zone when you actually need to update the UI
          this.ngZone.run(() => {
            this.showWarning();
          });
        }
      });
    });
  }
}`,
    category: 'performance',
    difficulty: 'advanced',
  },
  {
    id: 69,
    question: 'What is the purpose of the AsyncPipe?',
    answer: `The \`AsyncPipe\` (\`| async\`) automatically subscribes to an Observable (or Promise) directly from the template and returns the latest emitted value. 

Critically, when the component is destroyed, the \`AsyncPipe\` automatically unsubscribes to prevent memory leaks. It also automatically marks the component for check when a new value arrives, making it perfect for \`OnPush\` components.`,
    code: `import { Component } from '@angular/core';
import { Observable, interval } from 'rxjs';

@Component({
  selector: 'app-timer',
  // No need to subscribe in TS. The pipe handles it.
  template: \`<p>Seconds passed: {{ timer$ | async }}</p>\`
})
export class TimerComponent {
  timer$: Observable<number> = interval(1000);
}`,
    category: 'pipes',
    difficulty: 'beginner',
  },
  {
    id: 70,
    question: 'Explain the map operator in RxJS.',
    answer: `The \`map\` operator is used to transform the items emitted by an Observable by applying a function to each item. It is identical in concept to the standard \`Array.prototype.map()\` function, but applied to a stream of values over time.`,
    code: `import { of } from 'rxjs';
import { map } from 'rxjs/operators';

const numbers$ = of(1, 2, 3);

// Transform 1, 2, 3 into 10, 20, 30
numbers$.pipe(
  map(x => x * 10)
).subscribe(result => console.log(result));`,
    category: 'rxjs',
    difficulty: 'beginner',
  },
  {
    id: 71,
    question: 'How do you handle multiple HTTP requests simultaneously in Angular?',
    answer: `You can handle parallel HTTP requests using the RxJS \`forkJoin\` operator. 

\`forkJoin\` takes an array (or dictionary) of Observables, waits for *all* of them to complete, and then emits a single array (or dictionary) containing the final emitted values from each stream. If any of the requests fail, the entire \`forkJoin\` errors out.`,
    code: `import { forkJoin } from 'rxjs';

export class DashboardComponent {
  constructor(private http: HttpClient) {}

  loadData() {
    const users$ = this.http.get('/api/users');
    const config$ = this.http.get('/api/config');
    const stats$ = this.http.get('/api/stats');

    // Wait for all 3 network calls to finish
    forkJoin([users$, config$, stats$]).subscribe({
      next: ([users, config, stats]) => {
        console.log('All data loaded!');
        this.render(users, config, stats);
      },
      error: (err) => console.error('One or more calls failed', err)
    });
  }
}`,
    category: 'http',
    difficulty: 'intermediate',
  },
  {
    id: 72,
    question: 'What is a control value accessor (CVA)?',
    answer: `\`ControlValueAccessor\` is an interface that acts as a bridge between the Angular Forms API (\`FormControl\`, \`NgModel\`) and a native DOM element or a custom UI component.

If you build a custom input component (like a custom star-rater or specialized date picker) and want it to work with \`formControlName\`, you must implement the \`ControlValueAccessor\` interface and provide it as \`NG_VALUE_ACCESSOR\`.`,
    category: 'forms',
    difficulty: 'advanced',
  },
  {
    id: 73,
    question: 'What is the purpose of the TrackBy function in ngFor?',
    answer: `By default, when an array changes, \`*ngFor\` destroys and recreates all DOM nodes associated with the list, which is highly inefficient for large lists.

By providing a \`trackBy\` function, you tell Angular how to uniquely identify each item (e.g., by ID). Angular will then only destroy or create DOM nodes for items that were actually added, removed, or changed, drastically improving performance.`,
    code: `import { Component } from '@angular/core';

@Component({
  template: \`
    <ul>
      <!-- Provide the trackBy function -->
      <li *ngFor="let user of users; trackBy: trackById">
        {{ user.name }}
      </li>
    </ul>
  \`
})
export class ListComponent {
  users = [{id: 1, name: 'Alice'}, {id: 2, name: 'Bob'}];

  // Angular passes the index and the item
  trackById(index: number, user: any): number {
    return user.id; 
  }
}`,
    category: 'performance',
    difficulty: 'intermediate',
  },
  {
    id: 74,
    question: 'What are Route Guards and name the different types available?',
    answer: `Route Guards are interfaces (or functions in modern Angular) that allow or deny navigation to or from a route based on certain conditions (like authentication status).

Types of Guards:
1.  **\`CanActivate\`**: Decides if a route can be navigated to.
2.  **\`CanActivateChild\`**: Decides if a child route can be navigated to.
3.  **\`CanDeactivate\`**: Decides if the user can navigate *away* from a route (useful for "You have unsaved changes" prompts).
4.  **\`CanMatch\`** (replaced \`CanLoad\`): Decides if a Route configuration should even be matched/considered by the Router.`,
    category: 'routing',
    difficulty: 'beginner',
  },
  {
    id: 75,
    question: 'Explain the difference between ViewChild with static: true and static: false.',
    answer: `*   **\`{ static: true }\`**: Angular resolves the query *before* change detection runs (specifically, before \`ngOnInit\`). Use this only if the queried element is always present in the template and NOT hidden behind an \`*ngIf\` or \`*ngFor\`.
*   **\`{ static: false }\`** (Default): Angular resolves the query *after* change detection runs (available in \`ngAfterViewInit\`). You MUST use this if the element is rendered dynamically via structural directives like \`*ngIf\`.`,
    category: 'components',
    difficulty: 'advanced',
  },
  {
    id: 76,
    question: 'How do you define a fallback (404) route?',
    answer: `You define a fallback route using the wildcard path \`**\`. 

Because the Angular Router evaluates routes in the order they are defined (from top to bottom), the wildcard route must always be placed at the very **end** of your routing array. If placed at the top, it will catch all routes, breaking the application.`,
    code: `const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  
  // Wildcard route MUST be last
  { path: '**', component: PageNotFoundComponent } 
];`,
    category: 'routing',
    difficulty: 'beginner',
  },
  {
    id: 77,
    question: 'How do you handle route parameters in Angular?',
    answer: `You can define route parameters in your routing configuration using a colon prefix (e.g., \`:id\`). In your component, you can access these parameters using the \`ActivatedRoute\` service, either through its \`snapshot\` or by subscribing to its \`paramMap\` observable.`,
    code: `// Route definition
{ path: 'user/:id', component: UserComponent }

// Component access
constructor(private route: ActivatedRoute) {}

ngOnInit() {
  const userId = this.route.snapshot.paramMap.get('id');
}`,
    category: 'routing',
    difficulty: 'beginner',
  },
  {
    id: 78,
    question: 'What is the purpose of the ActivatedRoute service?',
    answer: `\`ActivatedRoute\` provides access to information about the route associated with a component. This includes route parameters, query parameters, static data, and the route's path.`,
    category: 'routing',
    difficulty: 'beginner',
  },
  {
    id: 79,
    question: 'How do you navigate to a different route programmatically?',
    answer: `You can navigate programmatically using the \`Router\` service's \`navigate()\` or \`navigateByUrl()\` methods.`,
    code: `constructor(private router: Router) {}

goToUser(userId: number) {
  this.router.navigate(['/user', userId]);
}`,
    category: 'routing',
    difficulty: 'beginner',
  },
  {
    id: 80,
    question: 'What is the purpose of the RouterOutlet directive?',
    answer: `\`RouterOutlet\` is a placeholder in your template where the Angular Router renders the component associated with the current route.`,
    category: 'routing',
    difficulty: 'beginner',
  },
  {
    id: 81,
    question: 'How do you define child (nested) routes?',
    answer: `You can define child routes using the \`children\` property in a route configuration. The child components are then rendered inside the parent component's own \`router-outlet\`.`,
    code: `{
  path: 'parent',
  component: ParentComponent,
  children: [
    { path: 'child1', component: Child1Component },
    { path: 'child2', component: Child2Component }
  ]
}`,
    category: 'routing',
    difficulty: 'intermediate',
  },
  {
    id: 82,
    question: 'What is a route guard?',
    answer: `Route guards are used to protect routes from unauthorized access or to perform actions before or after navigating to or from a route. Common guards include \`CanActivate\`, \`CanActivateChild\`, \`CanDeactivate\`, and \`CanLoad\`.`,
    category: 'routing',
    difficulty: 'beginner',
  },
  {
    id: 83,
    question: 'How do you implement a simple CanActivate guard?',
    answer: `In modern Angular, you can use a functional guard that injects the necessary services and returns a boolean or a \`UrlTree\`.`,
    code: `export const authGuard: CanActivateFn = (route, state) => {
  return inject(AuthService).isLoggedIn() || inject(Router).parseUrl('/login');
};`,
    category: 'routing',
    difficulty: 'beginner',
  },
  {
    id: 84,
    question: 'What is the purpose of the CanDeactivate guard?',
    answer: `\`CanDeactivate\` is used to prevent a user from navigating away from a route, typically used to warn about unsaved changes.`,
    category: 'routing',
    difficulty: 'intermediate',
  },
  {
    id: 85,
    question: 'What is the difference between CanActivate and CanLoad?',
    answer: `* **CanActivate**: Prevents a route from being activated, but the module bundle is still downloaded.
* **CanLoad**: Prevents the entire lazy-loaded module bundle from being downloaded if the user is not authorized.`,
    category: 'routing',
    difficulty: 'intermediate',
  },
  {
    id: 86,
    question: 'How do you pass query parameters to a route?',
    answer: `You can pass query parameters using the \`queryParams\` property in the \`navigate()\` method or the \`routerLink\` directive.`,
    code: `<!-- Link -->
<a [routerLink]="['/search']" [queryParams]="{ q: 'angular' }">Search</a>

<!-- Programmatic -->
this.router.navigate(['/search'], { queryParams: { q: 'angular' } });`,
    category: 'routing',
    difficulty: 'beginner',
  },
  {
    id: 87,
    question: 'What is the purpose of the fragment property in navigation?',
    answer: `The \`fragment\` property allows you to navigate to a specific anchor tag on a page (e.g., \`/home#section1\`).`,
    category: 'routing',
    difficulty: 'beginner',
  },
  {
    id: 88,
    question: 'How do you resolve data before a route is activated?',
    answer: `You can use a resolver to fetch data before the component is loaded. This ensures that the component has all the necessary data ready as soon as it initializes.`,
    code: `{
  path: 'user/:id',
  component: UserComponent,
  resolve: { user: userResolver }
}`,
    category: 'routing',
    difficulty: 'intermediate',
  },
  {
    id: 89,
    question: 'What is the purpose of the primary and named outlets?',
    answer: `Angular allows multiple \`<router-outlet>\` elements. The default is the primary outlet. Named outlets allow you to display multiple routes simultaneously in different parts of the UI.`,
    category: 'routing',
    difficulty: 'advanced',
  },
  {
    id: 90,
    question: 'How do you handle route-based navigation events?',
    answer: `You can subscribe to the \`Router.events\` observable to track navigation progress (e.g., \`NavigationStart\`, \`NavigationEnd\`, \`NavigationError\`).`,
    category: 'routing',
    difficulty: 'intermediate',
  },
  {
    id: 91,
    question: 'What is the difference between path and pathMatch in routing?',
    answer: `* **path**: The URL segment to match.
* **pathMatch**: Defines how to match the path. \`'prefix'\` (default) matches if the URL starts with the path, while \`'full'\` matches if the entire URL matches the path exactly.`,
    category: 'routing',
    difficulty: 'beginner',
  },
  {
    id: 92,
    question: 'What is the purpose of the Location service?',
    answer: `The \`Location\` service provides an abstraction for interacting with the browser's URL and history. It's often used for back-button navigation.`,
    category: 'routing',
    difficulty: 'intermediate',
  },
  {
    id: 93,
    question: 'How do you use the routerLink directive?',
    answer: `\`routerLink\` is an attribute directive that enables navigation to a specific route when an element (usually an \`<a>\` tag) is clicked.`,
    code: `<a routerLink="/home">Home</a>`,
    category: 'routing',
    difficulty: 'beginner',
  },
  {
    id: 94,
    question: 'What is the purpose of the routerLinkActive directive?',
    answer: `\`routerLinkActive\` automatically adds a CSS class to an element when its associated \`routerLink\` route is active.`,
    category: 'routing',
    difficulty: 'beginner',
  },
  {
    id: 95,
    question: 'How do you lazy load a module in Angular?',
    answer: `You lazy load a module by using the \`loadChildren\` property in your route configuration with a dynamic import.`,
    code: `{
  path: 'admin',
  loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
}`,
    category: 'routing',
    difficulty: 'intermediate',
  },
  {
    id: 96,
    question: 'What is the difference between navigate() and navigateByUrl()?',
    answer: `* **navigate()**: Takes an array of route commands (e.g., \`['/user', 1]\`).
* **navigateByUrl()**: Takes a complete URL string (e.g., \`'/user/1'\`). It is always absolute and bypasses the array-based logic.`,
    category: 'routing',
    difficulty: 'intermediate',
  },
  {
    id: 97,
    question: 'How do you protect children of a route using CanActivateChild?',
    answer: `\`CanActivateChild\` works similarly to \`CanActivate\`, but it is applied to all child routes of the protected parent route.`,
    category: 'routing',
    difficulty: 'intermediate',
  },
  {
    id: 98,
    question: 'What is the purpose of the withEnabledBlockingInitialNavigation() feature?',
    answer: `This router feature (used in \`provideRouter\`) ensures that the initial navigation is completed before the application is bootstrapped, which is useful for preventing UI flicker in SSR scenarios.`,
    category: 'routing',
    difficulty: 'advanced',
  },
  {
    id: 99,
    question: 'How do you define optional parameters in a route?',
    answer: `Optional parameters are passed as matrix parameters (e.g., \`;key=value\`) and are not part of the route's path definition.`,
    code: `this.router.navigate(['/user', userId, { folder: 'inbox' }]);`,
    category: 'routing',
    difficulty: 'beginner',
  },
  {
    id: 100,
    question: 'What is the purpose of the UrlSerializer service?',
    answer: `\`UrlSerializer\` is responsible for converting a \`UrlTree\` into a URL string and vice versa. You can provide a custom serializer if you need a non-standard URL format.`,
    category: 'routing',
    difficulty: 'advanced',
  },
  {
    id: 101,
    question: 'What is the difference between a Component and a Directive?',
    answer: `* **Component**: A directive with a template.
* **Directive**: A class that modifies the behavior or structure of DOM elements but does not have its own template.`,
    category: 'core',
    difficulty: 'beginner',
  },
  {
    id: 102,
    question: 'How do you create a custom attribute directive?',
    answer: `You create a class decorated with \`@Directive\`, define a selector, and inject \`ElementRef\` to interact with the host element.`,
    code: `@Directive({ selector: '[appBold]' })
export class BoldDirective {
  constructor(private el: ElementRef) {
    this.el.nativeElement.style.fontWeight = 'bold';
  }
}`,
    category: 'directives',
    difficulty: 'beginner',
  },
  {
    id: 103,
    question: 'What is the purpose of the @HostBinding decorator?',
    answer: `\`@HostBinding\` allows you to bind a host element property to a property in your directive or component class.`,
    code: `@HostBinding('class.active') isActive = true;`,
    category: 'directives',
    difficulty: 'intermediate',
  },
  {
    id: 104,
    question: 'What is the purpose of the @HostListener decorator?',
    answer: `\`@HostListener\` allows you to subscribe to events emitted by the host element.`,
    code: `@HostListener('click') onClick() { console.log('Clicked!'); }`,
    category: 'directives',
    difficulty: 'intermediate',
  },
  {
    id: 105,
    question: 'How do you create a custom structural directive?',
    answer: `You create a class decorated with \`@Directive\`, inject \`TemplateRef\` (the content) and \`ViewContainerRef\` (where the content is rendered), and use logic to decide when to render the template.`,
    code: `@Directive({ selector: '[appMyIf]' })
export class MyIfDirective {
  @Input() set appMyIf(condition: boolean) {
    if (condition) {
      this.vcr.createEmbeddedView(this.templateRef);
    } else {
      this.vcr.clear();
    }
  }
  constructor(private templateRef: TemplateRef<any>, private vcr: ViewContainerRef) {}
}`,
    category: 'directives',
    difficulty: 'advanced',
  },
  {
    id: 106,
    question: 'What is the difference between a pipe and a directive?',
    answer: `* **Pipe**: Transforms data for display in the template.
* **Directive**: Modifies the behavior or structure of DOM elements.`,
    category: 'core',
    difficulty: 'beginner',
  },
  {
    id: 107,
    question: 'What are pure and impure pipes?',
    answer: `* **Pure Pipe**: Only re-executes when the input value or its reference changes.
* **Impure Pipe**: Re-executes on every change detection cycle.`,
    category: 'pipes',
    difficulty: 'intermediate',
  },
  {
    id: 108,
    question: 'How do you create a custom pipe?',
    answer: `You create a class decorated with \`@Pipe\`, define a name, and implement the \`PipeTransform\` interface's \`transform()\` method.`,
    code: `@Pipe({ name: 'multiply' })
export class MultiplyPipe implements PipeTransform {
  transform(value: number, exponent: number): number {
    return value * exponent;
  }
}`,
    category: 'pipes',
    difficulty: 'beginner',
  },
  {
    id: 109,
    question: 'How do you use the async pipe?',
    answer: `The \`async\` pipe subscribes to an observable or promise and returns the latest value. It also automatically unsubscribes on component destruction.`,
    code: `<div *ngIf="user$ | async as user">{{ user.name }}</div>`,
    category: 'pipes',
    difficulty: 'beginner',
  },
  {
    id: 110,
    question: 'What is the purpose of the HttpClient service?',
    answer: `\`HttpClient\` is used to perform HTTP requests (GET, POST, etc.) and interact with backend APIs. It returns RxJS observables.`,
    category: 'http',
    difficulty: 'beginner',
  },
  {
    id: 111,
    question: 'How do you handle HTTP errors?',
    answer: `You can handle errors using the \`catchError\` operator in the observable pipe.`,
    code: `this.http.get('/api').pipe(
  catchError(error => {
    console.error(error);
    return throwError(() => new Error('Failed'));
  })
).subscribe();`,
    category: 'http',
    difficulty: 'intermediate',
  },
  {
    id: 112,
    question: 'What is an HTTP Interceptor?',
    answer: `Interceptors allow you to inspect and transform HTTP requests and responses globally.`,
    category: 'http',
    difficulty: 'intermediate',
  },
  {
    id: 113,
    question: 'How do you implement a functional interceptor?',
    answer: `Functional interceptors are simple functions of type \`HttpInterceptorFn\`.`,
    code: `export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authReq = req.clone({ setHeaders: { Authorization: 'Bearer ' + token } });
  return next(authReq);
};`,
    category: 'http',
    difficulty: 'intermediate',
  },
  {
    id: 114,
    question: 'What is the difference between Observables and Promises?',
    answer: `* **Observable**: Can emit multiple values over time, is lazy (doesn't start until subscription), and is cancelable.
* **Promise**: Emits a single value, is eager (starts immediately), and is not cancelable.`,
    category: 'rxjs',
    difficulty: 'beginner',
  },
  {
    id: 115,
    question: 'What is the purpose of the tap operator?',
    answer: `\`tap\` is used to perform side effects (like logging) without modifying the emitted values.`,
    category: 'rxjs',
    difficulty: 'beginner',
  },
  {
    id: 116,
    question: 'How do you combine multiple observables?',
    answer: `Common operators include \`forkJoin\` (waits for all to complete), \`combineLatest\` (emits whenever any emits), and \`merge\` (emits as they occur).`,
    category: 'rxjs',
    difficulty: 'intermediate',
  },
  {
    id: 117,
    question: 'What is the purpose of the BehaviorSubject?',
    answer: `A \`BehaviorSubject\` is a subject that stores the current value and emits it to new subscribers immediately.`,
    category: 'rxjs',
    difficulty: 'beginner',
  },
  {
    id: 118,
    question: 'How do you handle memory leaks in RxJS?',
    answer: `Use the \`async\` pipe, manually unsubscribe in \`ngOnDestroy\`, or use operators like \`takeUntil\`.`,
    category: 'rxjs',
    difficulty: 'intermediate',
  },
  {
    id: 119,
    question: 'What is the purpose of the ChangeDetectorRef service?',
    answer: `\`ChangeDetectorRef\` allows you to manually trigger change detection, which is useful when using \`OnPush\` or updating data from outside Angular's zone.`,
    category: 'core',
    difficulty: 'intermediate',
  },
  {
    id: 120,
    question: 'What is the difference between markForCheck() and detectChanges()?',
    answer: `* **markForCheck()**: Marks the component as dirty, so it will be checked in the next cycle.
* **detectChanges()**: Triggers change detection immediately for the component and its children.`,
    category: 'performance',
    difficulty: 'advanced',
  },
  {
    id: 121,
    question: 'What is the purpose of the NgZone service?',
    answer: `\`NgZone\` allows you to run code outside of Angular's zone to prevent unnecessary change detection cycles.`,
    category: 'performance',
    difficulty: 'advanced',
  },
  {
    id: 122,
    question: 'What is ViewEncapsulation?',
    answer: `ViewEncapsulation defines how component styles are scoped. Options are \`Emulated\` (default), \`None\`, and \`ShadowDom\`.`,
    category: 'core',
    difficulty: 'intermediate',
  },
  {
    id: 123,
    question: 'How do you implement a custom form validator?',
    answer: `A custom validator is a function that returns \`null\` if valid or an error object if invalid.`,
    code: `export function forbiddenNameValidator(control: AbstractControl): ValidationErrors | null {
  return control.value === 'admin' ? { forbidden: true } : null;
}`,
    category: 'forms',
    difficulty: 'intermediate',
  },
  {
    id: 124,
    question: 'What is the difference between Reactive Forms and Template-driven Forms?',
    answer: `* **Reactive Forms**: More scalable, logic in TS, synchronous.
* **Template-driven Forms**: Simple, logic in HTML, asynchronous.`,
    category: 'forms',
    difficulty: 'beginner',
  },
  {
    id: 125,
    question: 'How do you lazy load a standalone component?',
    answer: `You lazy load a standalone component by using \`loadComponent\` in your route configuration.`,
    code: `{ path: 'admin', loadComponent: () => import('./admin.component').then(c => c.AdminComponent) }`,
    category: 'routing',
    difficulty: 'intermediate',
  },
  {
    id: 126,
    question: 'What is the purpose of the inject() function?',
    answer: `\`inject()\` is a functional way to inject dependencies, introduced in Angular 14. It can be used in constructors, field initializers, and factory functions.`,
    category: 'core',
    difficulty: 'beginner',
  },
  {
    id: 127,
    question: 'How do you perform animation in Angular?',
    answer: `Angular provides a powerful animation system based on CSS transitions and keyframes. You define animations in the \`animations\` array of the \`@Component\` decorator using functions like \`trigger\`, \`state\`, \`style\`, \`transition\`, and \`animate\`.`,
    code: `@Component({
  animations: [
    trigger('openClose', [
      state('open', style({ height: '200px', opacity: 1 })),
      state('closed', style({ height: '100px', opacity: 0.5 })),
      transition('open => closed', [animate('1s')]),
      transition('closed => open', [animate('0.5s')])
    ])
  ]
})`,
    category: 'animations',
    difficulty: 'intermediate',
  },
  {
    id: 128,
    question: 'What is the purpose of the animation-specific state() function?',
    answer: `The \`state()\` function defines a set of CSS styles that should be applied to the element when it is in a particular named state (e.g., 'active', 'inactive', 'collapsed').`,
    category: 'animations',
    difficulty: 'beginner',
  },
  {
    id: 129,
    question: 'How do you use the @.disabled property in animations?',
    answer: `You can bind to the \`@.disabled\` property on an element to programmatically disable all animations for that element and its children.`,
    code: `<div [@.disabled]="animationsDisabled">
  <div [@myAnimation]="state"></div>
</div>`,
    category: 'animations',
    difficulty: 'intermediate',
  },
  {
    id: 130,
    question: 'What is the difference between transition() and animate()?',
    answer: `* **transition()**: Defines the path between two states (e.g., 'open => closed').
* **animate()**: Defines the duration, delay, and easing of the transition (e.g., '500ms ease-in').`,
    category: 'animations',
    difficulty: 'beginner',
  },
  {
    id: 131,
    question: 'How do you implement staggered animations?',
    answer: `Staggered animations are implemented using the \`query()\` and \`stagger()\` functions. They allow you to apply the same animation to a list of elements with a consistent delay between each.`,
    code: `trigger('listAnimation', [
  transition('* => *', [
    query(':enter', [
      style({ opacity: 0 }),
      stagger(100, [
        animate('0.5s', style({ opacity: 1 }))
      ])
    ])
  ])
])`,
    category: 'animations',
    difficulty: 'advanced',
  },
  {
    id: 132,
    question: 'What is the purpose of the :enter and :leave aliases in animations?',
    answer: `* **:enter**: A shorthand for the transition \`void => *\` (when an element is added to the DOM).
* **:leave**: A shorthand for the transition \`* => void\` (when an element is removed from the DOM).`,
    category: 'animations',
    difficulty: 'beginner',
  },
  {
    id: 133,
    question: 'How do you handle animation callbacks (start and done)?',
    answer: `You can listen for animation events in the template using the \`(@trigger.start)\` and \`(@trigger.done)\` syntax.`,
    code: `<div [@openClose]="isOpen ? 'open' : 'closed'"
     (@openClose.start)="onAnimationStart($event)"
     (@openClose.done)="onAnimationDone($event)">
</div>`,
    category: 'animations',
    difficulty: 'intermediate',
  },
  {
    id: 134,
    question: 'What is the purpose of the group() function in animations?',
    answer: `The \`group()\` function allows you to run multiple animation steps in parallel. All steps within the group start at the same time.`,
    category: 'animations',
    difficulty: 'intermediate',
  },
  {
    id: 135,
    question: 'How do you define a reusable animation?',
    answer: `You can define a reusable animation using the \`animation()\` function and then invoke it in your components using the \`useAnimation()\` function.`,
    code: `export const slideInAnimation = animation([
  style({ transform: 'translateX(-100%)' }),
  animate('{{ time }}', style({ transform: 'translateX(0)' }))
]);

// Usage
transition(':enter', [
  useAnimation(slideInAnimation, { params: { time: '500ms' } })
])`,
    category: 'animations',
    difficulty: 'advanced',
  },
  {
    id: 136,
    question: 'What is the purpose of the query() function in animations?',
    answer: `The \`query()\` function allows you to find one or more inner elements within the host element being animated, so you can apply styles or animations directly to them.`,
    category: 'animations',
    difficulty: 'intermediate',
  },
  {
    id: 137,
    question: 'How do you handle route-based animations?',
    answer: `You can define animations on the \`router-outlet\` container. In your routing module, add data to each route (e.g., \`animation: 'HomePage'\`), and then use a trigger to animate based on the current state of the outlet.`,
    code: `trigger('routeAnimations', [
  transition('HomePage <=> AboutPage', [
    // Define animation logic
  ])
])`,
    category: 'animations',
    difficulty: 'advanced',
  },
  {
    id: 138,
    question: 'What is the purpose of the keyframes() function?',
    answer: `The \`keyframes()\` function allows you to define a multi-step animation by specifying several style checkpoints with optional offsets (0 to 1).`,
    code: `animate('1s', keyframes([
  style({ opacity: 0, offset: 0 }),
  style({ opacity: 0.5, offset: 0.5 }),
  style({ opacity: 1, offset: 1 })
]))`,
    category: 'animations',
    difficulty: 'intermediate',
  },
  {
    id: 139,
    question: 'How do you implement code splitting in Angular?',
    answer: `Code splitting is automatically achieved when using lazy-loaded routes. Each lazy-loaded route is bundled into its own separate JavaScript file.`,
    category: 'performance',
    difficulty: 'beginner',
  },
  {
    id: 140,
    question: 'What is the purpose of the preloadingStrategy in routing?',
    answer: `\`preloadingStrategy\` allows you to download lazy-loaded modules in the background after the initial application has loaded, reducing navigation delay.`,
    code: `provideRouter(routes, withPreloading(PreloadAllModules))`,
    category: 'performance',
    difficulty: 'intermediate',
  },
  {
    id: 141,
    question: 'How do you create a custom preloading strategy?',
    answer: `You implement the \`PreloadingStrategy\` interface and its \`preload()\` method to selectively preload modules based on custom criteria.`,
    category: 'performance',
    difficulty: 'advanced',
  },
  {
    id: 142,
    question: 'What is the purpose of the trackBy function in *ngFor?',
    answer: `\`trackBy\` helps Angular identify which items in a list have changed, been added, or been removed, preventing unnecessary DOM re-renders and improving performance.`,
    code: `<li *ngFor="let item of items; trackBy: trackById">{{ item.name }}</li>`,
    category: 'performance',
    difficulty: 'beginner',
  },
  {
    id: 143,
    question: 'What is the difference between JIT and AOT compilation?',
    answer: `* **JIT (Just-in-Time)**: Compiles in the browser at runtime.
* **AOT (Ahead-of-Time)**: Compiles during the build process, resulting in faster load times and smaller bundles.`,
    category: 'core',
    difficulty: 'intermediate',
  },
  {
    id: 144,
    question: 'What is the purpose of the Ivy compiler?',
    answer: `Ivy is Angular's modern rendering engine and compiler, providing smaller bundles, faster compilation, and support for features like standalone components.`,
    category: 'core',
    difficulty: 'intermediate',
  },
  {
    id: 145,
    question: 'How do you implement Server-Side Rendering (SSR) in Angular?',
    answer: `You use Angular Universal to render the application on the server into static HTML before sending it to the client.`,
    category: 'advanced',
    difficulty: 'advanced',
  },
  {
    id: 146,
    question: 'What is the purpose of the TransferState service in SSR?',
    answer: `\`TransferState\` allows you to transfer data from the server to the client during bootstrap, preventing redundant API calls on the client.`,
    category: 'advanced',
    difficulty: 'advanced',
  },
  {
    id: 147,
    question: 'How do you handle browser-specific code in SSR?',
    answer: `Use \`isPlatformBrowser\` and \`isPlatformServer\` to wrap code that should only run in a specific environment.`,
    code: `if (isPlatformBrowser(this.platformId)) { /* browser code */ }`,
    category: 'advanced',
    difficulty: 'intermediate',
  },
  {
    id: 148,
    question: 'What is the purpose of the hydration feature in Angular 16+?',
    answer: `Hydration allows Angular to reuse server-rendered DOM structures on the client, improving performance and preventing UI flicker.`,
    category: 'performance',
    difficulty: 'advanced',
  },
  {
    id: 149,
    question: 'How do you perform tree-shaking in Angular?',
    answer: `Tree-shaking is a build optimization that removes unused code. It is enabled by default in production builds.`,
    category: 'performance',
    difficulty: 'intermediate',
  },
  {
    id: 150,
    question: 'What is the purpose of the budget feature in angular.json?',
    answer: `Budgets allow you to set size limits for your application bundles, producing warnings or errors if thresholds are exceeded.`,
    code: `"budgets": [{ "type": "initial", "maximumWarning": "500kb" }]`,
    category: 'performance',
    difficulty: 'intermediate',
  },
];
