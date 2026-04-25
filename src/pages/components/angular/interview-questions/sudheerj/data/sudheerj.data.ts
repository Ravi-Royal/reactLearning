import type { AngularQuestion, QuestionCategory } from '../../../shared/types';

export const SUDHEERJ_CATEGORIES: QuestionCategory[] = [
  { id: 'core', label: 'Core Concepts', icon: '🏗️' },
  { id: 'components', label: 'Components', icon: '🧩' },
  { id: 'directives', label: 'Directives & Pipes', icon: '🎯' },
  { id: 'services', label: 'Services & DI', icon: '⚙️' },
  { id: 'forms', label: 'Forms', icon: '📋' },
  { id: 'routing', label: 'Routing', icon: '🔀' },
  { id: 'rxjs', label: 'RxJS & HTTP', icon: '🌐' },
  { id: 'performance', label: 'Performance', icon: '⚡' },
  { id: 'testing', label: 'Testing', icon: '🧪' },
];

export const SUDHEERJ_QUESTIONS: AngularQuestion[] = [
  {
    id: 1,
    question: 'What is Angular?',
    answer: `Angular is a TypeScript-based open-source front-end web framework maintained by Google. It is a platform and framework for building single-page client-side applications using HTML and TypeScript.

Key features:
• Component-based architecture
• Two-way data binding
• Dependency Injection
• RxJS integration
• Powerful CLI
• Ahead-of-Time (AOT) compilation`,
    category: 'core',
    difficulty: 'beginner',
  },
  {
    id: 2,
    question: 'What is the difference between Angular and AngularJS?',
    answer: `AngularJS (v1.x) vs Angular (v2+):

| Feature | AngularJS | Angular |
|---------|-----------|---------|
| Language | JavaScript | TypeScript |
| Architecture | MVC | Component-based |
| Rendering | Two-way binding + digest | Change detection + zones |
| Performance | Slower (digest cycles) | Faster (AoT, OnPush) |
| Mobile | Poor support | Mobile-first |
| CLI | None | Powerful ng CLI |
| DI | Simple | Hierarchical & powerful |`,
    category: 'core',
    difficulty: 'beginner',
  },
  {
    id: 3,
    question: 'What is a component in Angular?',
    answer: `A component controls a patch of screen real estate called a view. It consists of:
• TypeScript class with @Component decorator
• HTML template defining the view
• Optional CSS encapsulated styles

Components are the building blocks of an Angular application — the app is a tree of components.`,
    code: `import { Component } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent {
  name = 'Sudheer Jonna';
  age = 30;

  greet() {
    return \`Hello, I'm \${this.name}\`;
  }
}`,
    category: 'components',
    difficulty: 'beginner',
  },
  {
    id: 4,
    question: 'What are lifecycle hooks in Angular?',
    answer: `Angular lifecycle hooks allow you to tap into key moments in the component lifecycle:

1. ngOnChanges(changes) — called before ngOnInit and whenever @Input changes
2. ngOnInit() — called once after first ngOnChanges
3. ngDoCheck() — called during every change detection run
4. ngAfterContentInit() — after ng-content projection is initialised
5. ngAfterContentChecked() — after every check of projected content
6. ngAfterViewInit() — after the component's view (and child views) is initialised
7. ngAfterViewChecked() — after every check of the component's view
8. ngOnDestroy() — cleanup just before Angular destroys the component`,
    code: `export class HeroComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();

  ngOnInit() {
    this.subscription.add(
      this.heroService.getHero().subscribe(h => this.hero = h)
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe(); // prevent memory leak
  }
}`,
    category: 'components',
    difficulty: 'beginner',
  },
  {
    id: 5,
    question: 'What is the difference between @ViewChild and @ContentChild?',
    answer: `@ViewChild — queries the component's own template (internal view).
@ContentChild — queries content projected into the component via <ng-content>.

Both return signals (Angular 17.1+) or decorated properties that are available after the respective lifecycle hook (ngAfterViewInit for @ViewChild, ngAfterContentInit for @ContentChild).`,
    code: `@Component({
  selector: 'app-parent',
  template: \`
    <p #viewPara>I am in the view</p>
    <ng-content></ng-content>
  \`
})
export class ParentComponent implements AfterViewInit, AfterContentInit {
  @ViewChild('viewPara') viewPara!: ElementRef;
  @ContentChild('contentPara') contentPara!: ElementRef;

  ngAfterViewInit() {
    // Access view element here
    console.log(this.viewPara.nativeElement.textContent);
  }

  ngAfterContentInit() {
    // Access projected content element here
    console.log(this.contentPara.nativeElement.textContent);
  }
}

// Usage
<app-parent>
  <p #contentPara>I am projected content</p>
</app-parent>`,
    category: 'components',
    difficulty: 'intermediate',
  },
  {
    id: 6,
    question: 'What are directives in Angular? Explain types.',
    answer: `Directives extend the behaviour of HTML elements.

1. Components — directives with a template (most common)

2. Structural Directives — modify the DOM structure:
   • *ngIf, *ngFor, *ngSwitch (legacy)
   • @if, @for, @switch (Angular 17+)

3. Attribute Directives — change element appearance/behaviour:
   • NgClass, NgStyle
   • Custom attribute directives using @Directive`,
    code: `// Custom attribute directive
@Directive({ selector: '[appHighlight]' })
export class HighlightDirective {
  @Input() appHighlight = 'yellow';

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter') onEnter() {
    this.renderer.setStyle(
      this.el.nativeElement, 'backgroundColor', this.appHighlight
    );
  }

  @HostListener('mouseleave') onLeave() {
    this.renderer.removeStyle(this.el.nativeElement, 'backgroundColor');
  }
}

// Usage
<p appHighlight="lightblue">Hover over me!</p>`,
    category: 'directives',
    difficulty: 'intermediate',
  },
  {
    id: 7,
    question: 'What is the difference between pure and impure pipes?',
    answer: `Pure pipes (default):
• Re-run transform() ONLY when the input value or reference changes
• Are memoised — same input returns cached output
• Very performant

Impure pipes (pure: false):
• Re-run transform() on EVERY change detection cycle
• Necessary for mutable data (filtering arrays in place)
• Can hurt performance — use sparingly`,
    code: `// Pure pipe (default)
@Pipe({ name: 'formatPrice' })
export class FormatPricePipe implements PipeTransform {
  transform(value: number, currency = 'INR'): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency', currency
    }).format(value);
  }
}

// Impure pipe
@Pipe({ name: 'filterList', pure: false })
export class FilterListPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items || !searchText) return items;
    return items.filter(i =>
      i.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }
}`,
    category: 'directives',
    difficulty: 'intermediate',
  },
  {
    id: 8,
    question: 'What is dependency injection and how does it work in Angular?',
    answer: `DI is a design pattern where dependencies are provided externally rather than created by the class itself. Angular's DI system:

1. You declare what you need (via constructor parameter types)
2. Angular's injector looks up the registered provider
3. Creates or retrieves the instance
4. Injects it into your class

Providers can be registered at: root, module, component, or element level.`,
    code: `// Service with DI
@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {} // HttpClient injected by Angular

  getData(url: string): Observable<any> {
    return this.http.get(url);
  }
}

// Component injecting the service
@Component({ ... })
export class DataComponent {
  data: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getData('/api/items').subscribe(res => this.data = res);
  }
}`,
    category: 'services',
    difficulty: 'intermediate',
  },
  {
    id: 9,
    question: 'What is NgModule and what are its key properties?',
    answer: `NgModule is a class decorated with @NgModule that organises a cohesive block of code. Key properties:

• declarations — components, directives, pipes belonging to this module
• imports — other NgModules this module depends on
• exports — declarations/imports re-exported for other modules
• providers — services registered in this module's injector
• bootstrap — root component(s) to bootstrap (root module only)
• entryComponents — (deprecated in Ivy) dynamically created components`,
    code: `@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    SharedModule,
    AppRoutingModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}`,
    category: 'core',
    difficulty: 'intermediate',
  },
  {
    id: 10,
    question: 'What is the async pipe and why is it preferred?',
    answer: `The async pipe automatically subscribes to an Observable or Promise and renders the emitted value. When the component is destroyed, it automatically unsubscribes — preventing memory leaks.

Why prefer it over manual subscribe:
• No need for ngOnDestroy cleanup
• Cleaner code — no local subscription variables
• Works with ChangeDetectionStrategy.OnPush out of the box
• Re-triggers change detection on each new value`,
    code: `// Component
@Component({
  template: \`
    <!-- async pipe subscribes and unsubscribes automatically -->
    <div *ngIf="user$ | async as user">
      <h2>{{ user.name }}</h2>
      <p>{{ user.email }}</p>
    </div>

    <!-- Loading state with ngIf -->
    <div *ngIf="(data$ | async) === null">Loading...</div>

    <!-- List rendering -->
    <li *ngFor="let item of items$ | async">{{ item.name }}</li>
  \`
})
export class UserComponent {
  user$ = this.userService.getCurrentUser();
  items$ = this.itemService.getItems();

  constructor(
    private userService: UserService,
    private itemService: ItemService
  ) {}
}`,
    category: 'rxjs',
    difficulty: 'intermediate',
  },
  {
    id: 11,
    question: 'What is RxJS and its core concepts?',
    answer: `RxJS (Reactive Extensions for JavaScript) is a library for reactive programming using Observables. Angular uses it extensively for async operations.

Core concepts:
• Observable — a lazy push-based collection of multiple values
• Observer — consumer of Observable values (next/error/complete)
• Subscription — represents the execution of an Observable
• Operators — pure functions to create/transform Observables (map, filter, switchMap, etc.)
• Subject — special Observable that is also an Observer (multicast)
• Schedulers — control concurrency`,
    code: `import { fromEvent, interval } from 'rxjs';
import { map, filter, debounceTime, switchMap, takeUntil } from 'rxjs/operators';

// Example: type-ahead search
const searchInput = document.getElementById('search');
const destroy$ = new Subject<void>();

fromEvent(searchInput, 'input').pipe(
  map((e: Event) => (e.target as HTMLInputElement).value),
  filter(query => query.length > 2),
  debounceTime(300),
  switchMap(query => this.searchService.search(query)),
  takeUntil(destroy$)
).subscribe(results => this.results = results);

// Cleanup
ngOnDestroy() {
  destroy$.next();
  destroy$.complete();
}`,
    category: 'rxjs',
    difficulty: 'intermediate',
  },
  {
    id: 12,
    question: 'What is change detection in Angular?',
    answer: `Change detection is the process by which Angular checks if the UI needs to be updated when data changes.

Default strategy: Angular checks every component from root to leaf after any async event.

OnPush strategy: Component only checked when:
1. An @Input reference changes
2. An event fires within the component
3. An Observable (async pipe) emits
4. ChangeDetectorRef.markForCheck() is called

Use OnPush for better performance in large apps.`,
    code: `@Component({
  selector: 'app-product-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div class="card">
      <h3>{{ product.name }}</h3>
      <p>{{ product.price | currency }}</p>
    </div>
  \`
})
export class ProductCardComponent {
  @Input() product!: Product;
  // Only re-checked when product reference changes
}`,
    category: 'performance',
    difficulty: 'advanced',
  },
  {
    id: 13,
    question: 'What is lazy loading in Angular?',
    answer: `Lazy loading defers loading a module's code until the user navigates to it, reducing initial bundle size.

Steps to implement:
1. Create a feature module with its own routing
2. Use loadChildren or loadComponent in the route config with dynamic import()
3. Do NOT import the module in AppModule`,
    code: `// app-routing.module.ts
const routes: Routes = [
  {
    path: 'products',
    loadChildren: () =>
      import('./products/products.module').then(m => m.ProductsModule)
  },
  // Standalone (Angular 14+)
  {
    path: 'profile',
    loadComponent: () =>
      import('./profile/profile.component').then(c => c.ProfileComponent)
  }
];

// products-routing.module.ts
const routes: Routes = [
  { path: '', component: ProductListComponent },
  { path: ':id', component: ProductDetailComponent }
];`,
    category: 'routing',
    difficulty: 'intermediate',
  },
  {
    id: 14,
    question: 'What are Angular route guards?',
    answer: `Route guards are services or functions that control access to routes.

Types:
• canActivate — can the user enter this route?
• canActivateChild — can the user enter child routes?
• canDeactivate — can the user leave this route?
• canMatch — should this route definition match at all?
• resolve — pre-fetch data before activating the route

Return: boolean | UrlTree | Observable<boolean|UrlTree>`,
    code: `// Modern functional guard (Angular 14+)
export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.isAdmin()
    ? true
    : router.createUrlTree(['/forbidden']);
};

// Resolve guard (pre-fetch data)
export const productResolver: ResolveFn<Product> = (route) => {
  const id = route.paramMap.get('id')!;
  return inject(ProductService).getProduct(id);
};

// In routes
{ path: 'admin', component: AdminComponent, canActivate: [adminGuard] }
{ path: 'product/:id', component: ProductComponent, resolve: { product: productResolver } }`,
    category: 'routing',
    difficulty: 'intermediate',
  },
  {
    id: 15,
    question: 'What is FormBuilder in Angular?',
    answer: `FormBuilder is a service that provides shorthand syntax for creating reactive form controls. Instead of new FormControl('') and new FormGroup({}), you use fb.control() and fb.group() — reducing boilerplate code.`,
    code: `@Component({ template: '...' })
export class RegistrationComponent {
  // Using inject() (modern approach)
  private fb = inject(FormBuilder);

  registerForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: this.fb.group({
      value: ['', Validators.required],
      confirm: ['', Validators.required]
    }),
    interests: this.fb.array([
      this.fb.control('Angular'),
    ])
  });

  addInterest() {
    (this.registerForm.get('interests') as FormArray)
      .push(this.fb.control(''));
  }

  onSubmit() {
    if (this.registerForm.valid) {
      console.log(this.registerForm.value);
    }
  }
}`,
    category: 'forms',
    difficulty: 'intermediate',
  },
  {
    id: 16,
    question: 'What is TestBed in Angular testing?',
    answer: `TestBed is the primary Angular testing utility. It creates a testing module environment similar to an @NgModule, allowing you to configure components, services, imports, and providers for isolated unit testing.

Key methods:
• TestBed.configureTestingModule({}) — set up the testing module
• TestBed.createComponent(Component) — create a component instance
• TestBed.inject(Service) — retrieve an injected service
• fixture.detectChanges() — trigger change detection in tests`,
    code: `describe('CounterComponent', () => {
  let fixture: ComponentFixture<CounterComponent>;
  let component: CounterComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CounterComponent],
      providers: [
        { provide: CounterService, useClass: MockCounterService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should increment counter', () => {
    component.increment();
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('.count');
    expect(el.textContent).toContain('1');
  });
});`,
    category: 'testing',
    difficulty: 'advanced',
  },
  {
    id: 17,
    question: 'What is Renderer2 in Angular?',
    answer: `Renderer2 is an abstraction for DOM manipulation that makes your code platform-agnostic (works with SSR, Web Workers). Use it instead of directly accessing nativeElement to avoid XSS risks and SSR issues.

Common methods: createElement, appendChild, setAttribute, addClass, removeClass, setStyle, listen.`,
    code: `@Component({ template: '<button #btn>Click me</button>' })
export class ExampleComponent implements AfterViewInit {
  @ViewChild('btn') btnRef!: ElementRef;

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit() {
    const btn = this.btnRef.nativeElement;

    // Safe DOM manipulation via Renderer2
    this.renderer.setStyle(btn, 'backgroundColor', '#6366f1');
    this.renderer.setAttribute(btn, 'aria-label', 'Action button');
    this.renderer.addClass(btn, 'rounded-xl');

    // Safe event listener (returns cleanup fn)
    this.renderer.listen(btn, 'click', () => {
      console.log('Button clicked!');
    });
  }
}`,
    category: 'components',
    difficulty: 'advanced',
  },
  {
    id: 18,
    question: 'What is the trackBy function in *ngFor?',
    answer: `By default, *ngFor re-renders the entire list when any item changes. trackBy tells Angular how to uniquely identify each item — only items whose identity changes are re-rendered.

Benefits: prevents unnecessary DOM destruction/recreation, preserves focus/scroll/animations.`,
    code: `// Component
export class ProductListComponent {
  products: Product[] = [];

  trackByProductId(index: number, product: Product): number {
    return product.id; // unique identifier
  }
}

// Template
<ul>
  <li *ngFor="let product of products; trackBy: trackByProductId">
    {{ product.name }} — {{ product.price | currency }}
  </li>
</ul>

// Angular 17+ control flow
@for (product of products; track product.id) {
  <li>{{ product.name }}</li>
}`,
    category: 'performance',
    difficulty: 'intermediate',
  },
  {
    id: 19,
    question: 'How do you handle errors in Angular HTTP requests?',
    answer: `Angular HTTP error handling approaches:

1. catchError operator in the service/component Observable pipe
2. HTTP Interceptors for centralised error handling
3. Custom ErrorHandler class for global runtime errors`,
    code: `// Service-level error handling
@Injectable({ providedIn: 'root' })
export class ProductService {
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>('/api/products').pipe(
      retry(2), // retry on failure twice
      catchError(this.handleError)
    );
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    let message = 'An error occurred';
    if (err.status === 404) message = 'Resource not found';
    else if (err.status === 401) message = 'Unauthorised access';
    else if (err.error instanceof ErrorEvent) {
      message = err.error.message; // client-side error
    }
    return throwError(() => new Error(message));
  }
}

// Component usage
this.productService.getProducts().subscribe({
  next: products => this.products = products,
  error: err => this.errorMessage = err.message
});`,
    category: 'rxjs',
    difficulty: 'intermediate',
  },
  {
    id: 20,
    question: 'What is Angular Universal (SSR)?',
    answer: `Angular Universal enables Server-Side Rendering — the app runs on a Node.js server to pre-render HTML before sending it to the client.

Benefits:
• SEO — search engine crawlers see full HTML
• Performance — faster First Contentful Paint
• Social sharing — correct meta tags in HTML

From Angular 16, hydration is supported — the client reuses server-rendered DOM without re-rendering.`,
    code: `// Setup (Angular 17+)
ng add @angular/ssr

// server.ts (Express example)
import { CommonEngine } from '@angular/ssr';

const engine = new CommonEngine();

server.get('*', async (req, res) => {
  const html = await engine.render({
    bootstrap: AppComponent,
    documentFilePath: join(distFolder, 'browser/index.html'),
    url: \`\${req.protocol}://\${req.headers.host}\${req.originalUrl}\`,
  });
  res.send(html);
});`,
    category: 'performance',
    difficulty: 'advanced',
  },
  {
    id: 21,
    question: 'How do you create a custom pipe in Angular?',
    answer: `To create a custom pipe, you use the \`@Pipe\` decorator and implement the \`PipeTransform\` interface. The \`transform\` method handles the logic.

Steps:
1. Create a class and decorate it with \`@Pipe({ name: 'myPipe' })\`.
2. Implement \`PipeTransform\` and its \`transform(value: any, ...args: any[])\` method.
3. Declare it in the \`NgModule\` (or set \`standalone: true\`).`,
    code: `import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filesize',
  standalone: true
})
export class FileSizePipe implements PipeTransform {
  transform(sizeInBytes: number, extension: string = 'MB'): string {
    const size = sizeInBytes / (1024 * 1024);
    return \`\${size.toFixed(2)} \${extension}\`;
  }
}

// Usage in template
// <p>{{ 1048576 | filesize:'MB' }}</p> // Outputs: "1.00 MB"`,
    category: 'directives',
    difficulty: 'intermediate',
  },
  {
    id: 22,
    question: 'What is the purpose of NgContent and Content Projection?',
    answer: `Content projection (using \`<ng-content>\`) allows you to pass HTML content from a parent component into a child component's template. It's similar to React's \`children\` prop.

Angular supports:
*   **Single-slot projection**: One \`<ng-content>\` tag.
*   **Multi-slot projection**: Multiple \`<ng-content>\` tags with \`select\` attributes (e.g., \`select="[header]"\`).`,
    code: `// Child Component (Card)
@Component({
  selector: 'app-card',
  template: \`
    <div class="card">
      <div class="header">
        <ng-content select="[card-title]"></ng-content>
      </div>
      <div class="body">
        <ng-content></ng-content> <!-- Default slot -->
      </div>
    </div>
  \`
})
export class CardComponent {}

// Parent Usage
<app-card>
  <h2 card-title>User Profile</h2>
  <p>This is the main body content projected into the card.</p>
</app-card>`,
    category: 'components',
    difficulty: 'intermediate',
  },
  {
    id: 23,
    question: 'Explain the difference between constructor and ngOnInit.',
    answer: `*   **constructor**: A standard JavaScript/TypeScript feature for class instantiation. In Angular, it should be used **strictly for dependency injection**. Input bindings (\`@Input\`) are **not yet available** inside the constructor.
*   **ngOnInit**: An Angular lifecycle hook called once after the first \`ngOnChanges\`. Angular has finished initializing the component and bound the \`@Input\` properties. It is the correct place for **initialization logic** (e.g., fetching data from an API).`,
    code: `export class UserComponent implements OnInit {
  @Input() userId!: string;

  constructor(private api: ApiService) {
    // userId is undefined here!
  }

  ngOnInit() {
    // userId is now bound and available
    this.api.getUser(this.userId).subscribe(...);
  }
}`,
    category: 'core',
    difficulty: 'beginner',
  },
  {
    id: 24,
    question: 'What are HostListener and HostBinding?',
    answer: `*   **@HostListener**: A decorator that listens to DOM events on the host element of a directive or component.
*   **@HostBinding**: A decorator that binds a class property to a property (like a class or style) of the host element.`,
    code: `@Directive({
  selector: '[appHoverEffect]',
  standalone: true
})
export class HoverEffectDirective {
  // Bind the 'class.active' property on the host to this variable
  @HostBinding('class.active') isHovering = false;

  // Listen to 'mouseenter' event on the host
  @HostListener('mouseenter') onMouseEnter() {
    this.isHovering = true;
  }

  // Listen to 'mouseleave' event on the host
  @HostListener('mouseleave') onMouseLeave() {
    this.isHovering = false;
  }
}`,
    category: 'directives',
    difficulty: 'intermediate',
  },
  {
    id: 25,
    question: 'How do you perform component interaction in Angular?',
    answer: `Component interaction can be done in several ways:
1.  **Parent to Child**: Using \`@Input()\` decorator.
2.  **Child to Parent**: Using \`@Output()\` decorator and \`EventEmitter\`.
3.  **Parent interacting with Child reference**: Using \`@ViewChild()\` to get the child component instance.
4.  **Unrelated Components**: Using a shared Service with \`RxJS Subjects\` (or \`Signals\`) to communicate.`,
    code: `// Shared Service example for unrelated components
@Injectable({ providedIn: 'root' })
export class MessageService {
  private messageSource = new Subject<string>();
  message$ = this.messageSource.asObservable();

  sendMessage(message: string) {
    this.messageSource.next(message);
  }
}

// Sender Component
this.messageService.sendMessage('Hello from sender!');

// Receiver Component
this.messageService.message$.subscribe(msg => console.log(msg));`,
    category: 'components',
    difficulty: 'intermediate',
  },
  {
    id: 26,
    question: 'What is the purpose of ViewEncapsulation?',
    answer: `\`ViewEncapsulation\` defines how CSS styles are applied and scoped to a component. Angular supports three modes:
*   **Emulated (Default)**: Styles are scoped to the component by adding unique attributes (e.g., \`_ngcontent-c1\`) to elements. They don't leak out.
*   **None**: Styles are globally applied, affecting the whole application.
*   **ShadowDom**: Uses the browser's native Shadow DOM API to encapsulate styles completely.`,
    code: `import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-global-styles',
  template: '<p class="global-text">I am global</p>',
  styles: ['.global-text { color: red; }'],
  encapsulation: ViewEncapsulation.None // Styles leak globally!
})
export class GlobalStylesComponent {}`,
    category: 'components',
    difficulty: 'advanced',
  },
  {
    id: 27,
    question: 'What is a Router Outlet and how do you use multiple named outlets?',
    answer: `\`<router-outlet>\` is a directive that acts as a placeholder where the router should display the components for the matched routes.

**Named Outlets (Auxiliary Routes)** allow multiple outlets on the same page (e.g., a main view and a sidebar/chat widget). You give the outlet a \`name\` attribute.`,
    code: `// HTML Template
<router-outlet></router-outlet> <!-- Primary -->
<router-outlet name="sidebar"></router-outlet> <!-- Named -->

// Routing Config
const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'chat', component: ChatComponent, outlet: 'sidebar' }
];

// Navigation Link
// Generates URL: /home(sidebar:chat)
<a [routerLink]="[{ outlets: { primary: 'home', sidebar: 'chat' } }]">
  Open Chat
</a>`,
    category: 'routing',
    difficulty: 'advanced',
  },
  {
    id: 28,
    question: 'How do you handle memory leaks in Angular?',
    answer: `Memory leaks in Angular typically happen because of unclosed RxJS Subscriptions, DOM event listeners, or timer intervals.

Solutions:
1.  **Use the \`async\` pipe** in templates (it auto-subscribes/unsubscribes).
2.  **Use \`takeUntilDestroyed()\`** (Angular 16+) to auto-cancel subscriptions when the component is destroyed.
3.  **Use \`takeUntil(subject)\`** and trigger the subject in \`ngOnDestroy\`.
4.  Manually call \`subscription.unsubscribe()\` in \`ngOnDestroy\`.`,
    code: `import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({...})
export class MyComponent {
  constructor(private api: ApiService) {
    // Automatically unsubscribes on destroy!
    this.api.getData()
      .pipe(takeUntilDestroyed())
      .subscribe(data => console.log(data));
  }
}`,
    category: 'performance',
    difficulty: 'advanced',
  },
  {
    id: 29,
    question: 'Explain Angular HTTP Interceptors.',
    answer: `HTTP Interceptors are a mechanism to intercept and modify HTTP requests or responses globally before they are sent to the server or received by the application.

Use cases:
*   Adding Authentication headers (JWT tokens).
*   Global error handling (e.g., redirecting on 401).
*   Logging requests/responses.
*   Showing/hiding global loading spinners.`,
    code: `import { HttpInterceptorFn } from '@angular/common/http';

// Functional Interceptor (Angular 15+)
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  
  if (token) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', \`Bearer \${token}\`)
    });
    return next(authReq);
  }
  
  return next(req);
};

// Register in providers (main.ts):
// provideHttpClient(withInterceptors([authInterceptor]))`,
    category: 'rxjs',
    difficulty: 'intermediate',
  },
  {
    id: 30,
    question: 'What are Angular Signals (v16+)?',
    answer: `Signals are a new reactive primitive in Angular that provide fine-grained reactivity. Unlike Observables (RxJS), Signals are synchronous, always have a value, and automatically track dependencies without needing \`Zone.js\`.

Key concepts:
*   **\`signal()\`**: Writable state.
*   **\`computed()\`**: Read-only derived state (memoized).
*   **\`effect()\`**: Side-effects that run when a signal changes.`,
    code: `import { Component, signal, computed, effect } from '@angular/core';

@Component({
  template: \`
    <button (click)="increment()">Count: {{ count() }}</button>
    <p>Double: {{ doubleCount() }}</p>
  \`
})
export class CounterComponent {
  count = signal(0);
  doubleCount = computed(() => this.count() * 2);

  constructor() {
    effect(() => {
      console.log(\`Count changed to \${this.count()}\`);
    });
  }

  increment() {
    this.count.update(c => c + 1);
  }
}`,
    category: 'performance',
    difficulty: 'advanced',
  },
  {
    id: 31,
    question: 'How do you bypass sanitization in Angular to trust a value?',
    answer: `Angular automatically sanitizes untrusted values (HTML, styles, URLs) to prevent Cross-Site Scripting (XSS). If you absolutely trust a value and need to bypass sanitization, you use the \`DomSanitizer\` service.

Methods available:
*   \`bypassSecurityTrustHtml\`
*   \`bypassSecurityTrustStyle\`
*   \`bypassSecurityTrustScript\`
*   \`bypassSecurityTrustUrl\`
*   \`bypassSecurityTrustResourceUrl\``,
    code: `import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  template: \`<div [innerHTML]="trustedHtml"></div>\`
})
export class SafeContentComponent {
  trustedHtml: SafeHtml;

  constructor(private sanitizer: DomSanitizer) {
    const rawHtml = '<script>alert("safe!")</script><strong>Bold</strong>';
    // Tell Angular this HTML is safe and shouldn't be stripped
    this.trustedHtml = this.sanitizer.bypassSecurityTrustHtml(rawHtml);
  }
}`,
    category: 'core',
    difficulty: 'advanced',
  },
  {
    id: 32,
    question: 'What is the purpose of the forwardRef function?',
    answer: `\`forwardRef\` allows you to refer to references (classes) that are not yet defined. This is commonly used in Angular when a class needs to refer to itself, which happens frequently when implementing \`ControlValueAccessor\` for custom form controls.`,
    code: `import { Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'app-custom-input',
  template: \`<input [(ngModel)]="value" (blur)="onTouched()">\`,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      // CustomInputComponent is not defined yet here, so we use forwardRef
      useExisting: forwardRef(() => CustomInputComponent),
      multi: true
    }
  ]
})
export class CustomInputComponent implements ControlValueAccessor {
  /* ... ControlValueAccessor implementation ... */
}`,
    category: 'advanced',
    difficulty: 'advanced',
  },
  {
    id: 33,
    question: 'Explain the difference between Promise.all and forkJoin.',
    answer: `Both are used to execute multiple asynchronous operations in parallel and wait for all of them to complete.

*   **\`Promise.all()\`**: Takes an array of Promises. It resolves when *all* promises resolve, or rejects immediately if *any* promise rejects.
*   **\`forkJoin()\`**: An RxJS operator that takes an array/dictionary of Observables. It waits for all observables to **complete**, and then emits a single array/object containing the **last emitted value** from each observable.`,
    code: `import { forkJoin, of } from 'rxjs';
import { delay } from 'rxjs/operators';

// forkJoin example
const obs1$ = of('First').pipe(delay(1000));
const obs2$ = of('Second').pipe(delay(2000));

forkJoin([obs1$, obs2$]).subscribe(results => {
  console.log(results); // ['First', 'Second'] after 2 seconds
});

// Object syntax (easier to read)
forkJoin({
  user: this.api.getUser(),
  posts: this.api.getPosts()
}).subscribe(res => {
  console.log(res.user, res.posts);
});`,
    category: 'rxjs',
    difficulty: 'intermediate',
  },
  {
    id: 34,
    question: 'What is the purpose of NgTemplateOutlet?',
    answer: `\`NgTemplateOutlet\` is a structural directive used to insert an embedded view created from a prepared \`<ng-template>\`. It is heavily used for creating highly reusable and customizable components (like dynamic tables or tabs) where the parent component can pass a template to the child.`,
    code: `// Child Component
@Component({
  selector: 'app-list',
  template: \`
    <ul>
      <li *ngFor="let item of items">
        <!-- Render the template passed by parent, providing 'item' as context -->
        <ng-container *ngTemplateOutlet="itemTemplate; context: { $implicit: item }">
        </ng-container>
      </li>
    </ul>
  \`
})
export class ListComponent {
  @Input() items: any[] = [];
  @Input() itemTemplate!: TemplateRef<any>;
}

// Parent Usage
<app-list [items]="users" [itemTemplate]="userTpl"></app-list>

<ng-template #userTpl let-user>
  <strong>{{ user.name }}</strong> ({{ user.email }})
</ng-template>`,
    category: 'directives',
    difficulty: 'advanced',
  },
  {
    id: 35,
    question: 'What is the trackBy function and why is it important?',
    answer: `In an \`*ngFor\` loop, if the array changes (e.g., data is refreshed from an API), Angular destroys all existing DOM elements and recreates them, which is slow.
    
By providing a \`trackBy\` function, you tell Angular how to uniquely identify each item (like an ID). Angular will only recreate the DOM elements for items that were actually added, removed, or whose ID changed.`,
    code: `// Component
export class ItemComponent {
  items = [{ id: 1, name: 'A' }, { id: 2, name: 'B' }];

  trackByFn(index: number, item: any): number {
    return item.id; // Unique identifier
  }
}

// Template
<ul>
  <li *ngFor="let item of items; trackBy: trackByFn">
    {{ item.name }}
  </li>
</ul>`,
    category: 'performance',
    difficulty: 'intermediate',
  },
  {
    id: 36,
    question: 'How do you handle multiple HTTP requests sequentially?',
    answer: `To handle requests sequentially (one after the other, where the second request depends on the first), use the **\`concatMap\`** or **\`switchMap\`** operator.`,
    code: `import { concatMap } from 'rxjs/operators';

// Get user, then use user.id to get their posts
this.http.get<User>('/api/user/1').pipe(
  concatMap(user => {
    // This request waits for the user request to finish
    return this.http.get<Post[]>(\`/api/posts?userId=\${user.id}\`);
  })
).subscribe(posts => {
  console.log('Posts for user:', posts);
});`,
    category: 'rxjs',
    difficulty: 'intermediate',
  },
  {
    id: 37,
    question: 'What is the difference between ViewChild and ViewChildren?',
    answer: `*   **\`@ViewChild\`**: Returns the **first** element or directive matching the selector from the view DOM. Returns a single instance (or \`ElementRef\`).
*   **\`@ViewChildren\`**: Returns a **QueryList** of **all** elements or directives matching the selector. It automatically updates when elements are added or removed dynamically (e.g., via \`*ngIf\` or \`*ngFor\`).`,
    code: `import { Component, ViewChild, ViewChildren, QueryList, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  template: \`
    <input #mainInput type="text" placeholder="Main">
    <div *ngFor="let i of [1,2,3]" #listItems>Item {{i}}</div>
  \`
})
export class ViewComponent implements AfterViewInit {
  @ViewChild('mainInput') mainInput!: ElementRef;
  @ViewChildren('listItems') listItems!: QueryList<ElementRef>;

  ngAfterViewInit() {
    this.mainInput.nativeElement.focus(); // Access single element
    
    // Access multiple elements
    this.listItems.forEach(item => {
      console.log(item.nativeElement.textContent);
    });
  }
}`,
    category: 'components',
    difficulty: 'intermediate',
  },
  {
    id: 38,
    question: 'How do you implement a Custom Validator in Reactive Forms?',
    answer: `A custom validator is a function that takes an \`AbstractControl\` and returns either \`null\` (if valid) or a \`ValidationErrors\` object (if invalid).`,
    code: `import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Custom Validator Factory
export function forbiddenNameValidator(nameRe: RegExp): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const forbidden = nameRe.test(control.value);
    // Return error object if invalid, null if valid
    return forbidden ? { forbiddenName: { value: control.value } } : null;
  };
}

// Usage in Component
this.form = this.fb.group({
  username: ['', [
    Validators.required,
    forbiddenNameValidator(/admin/i) // 'admin' is forbidden
  ]]
});

// Usage in Template
// <div *ngIf="form.get('username')?.hasError('forbiddenName')">Username not allowed</div>`,
    category: 'forms',
    difficulty: 'advanced',
  },
  {
    id: 39,
    question: 'What is the difference between debounceTime and throttleTime?',
    answer: `Both are RxJS operators used to rate-limit events (like clicks or keystrokes).

*   **\`debounceTime(ms)\`**: Waits for a specified pause duration (\`ms\`) to pass *without any new events* before emitting the last event. Ideal for **search inputs** (wait until the user stops typing).
*   **\`throttleTime(ms)\`**: Emits the first event, then ignores all subsequent events for the specified duration (\`ms\`). Ideal for **button clicks** or **scroll events** (prevent spamming).`,
    code: `import { fromEvent } from 'rxjs';
import { debounceTime, throttleTime } from 'rxjs/operators';

const input = document.getElementById('search');
const button = document.getElementById('submit');

// Search: Waits 500ms AFTER the user stops typing
fromEvent(input, 'keyup').pipe(
  debounceTime(500)
).subscribe(() => console.log('Search triggered'));

// Click: Emits immediately, then ignores clicks for 1000ms
fromEvent(button, 'click').pipe(
  throttleTime(1000)
).subscribe(() => console.log('Button clicked'));`,
    category: 'rxjs',
    difficulty: 'intermediate',
  },
  {
    id: 40,
    question: 'What is Dependency Injection (DI) Token in Angular?',
    answer: `An InjectionToken is used to create a unique identifier for injecting non-class dependencies (like plain objects, strings, functions, or interfaces) into a component or service.`,
    code: `import { InjectionToken, Inject } from '@angular/core';

// 1. Create the token
export const API_URL = new InjectionToken<string>('api.url');

// 2. Provide the token (e.g., in app.module.ts or app.config.ts)
providers: [
  { provide: API_URL, useValue: 'https://api.mycompany.com/v1' }
]

// 3. Inject the token
import { Component, Inject } from '@angular/core';

@Component({...})
export class MyComponent {
  constructor(@Inject(API_URL) private apiUrl: string) {
    console.log('Connecting to:', this.apiUrl);
  }
}`,
    category: 'services',
    difficulty: 'advanced',
  },
  {
    id: 41,
    question: 'What is the purpose of NgZone.runOutsideAngular()?',
    answer: `Angular relies on \`Zone.js\` to know when asynchronous tasks (like \`setTimeout\`, DOM events, or XHR) finish so it can run Change Detection.

If you have a task that fires very frequently (like \`requestAnimationFrame\` or a \`mousemove\` event), triggering Change Detection every time will cause massive performance issues. 

\`runOutsideAngular()\` executes the code outside of Angular's zone, preventing change detection from running until you explicitly re-enter it using \`NgZone.run()\`.`,
    code: `import { Component, NgZone, OnInit } from '@angular/core';

@Component({...})
export class AnimationComponent implements OnInit {
  progress = 0;

  constructor(private ngZone: NgZone) {}

  ngOnInit() {
    // Run loop OUTSIDE Angular to prevent constant change detection
    this.ngZone.runOutsideAngular(() => {
      const interval = setInterval(() => {
        this.progress += 1;
        
        // Re-enter Angular zone ONLY when UI needs to update (e.g., at 100%)
        if (this.progress === 100) {
          clearInterval(interval);
          this.ngZone.run(() => {
            console.log('Finished!');
          });
        }
      }, 10);
    });
  }
}`,
    category: 'performance',
    difficulty: 'advanced',
  },
  {
    id: 42,
    question: 'How do you unsubscribe from Observables to prevent memory leaks?',
    answer: `Failing to unsubscribe from Observables leads to memory leaks because the subscription keeps the component alive in memory even after it is destroyed.

Methods to unsubscribe:
1.  **\`AsyncPipe\` (\`| async\`)**: The best method; Angular handles unsubscription automatically in the template.
2.  **\`takeUntilDestroyed()\`**: (Angular 16+) Placed in the constructor, auto-unsubscribes on destroy.
3.  **\`takeUntil(subject)\`**: Classic RxJS pattern using a Subject triggered in \`ngOnDestroy\`.
4.  **Manual \`unsubscribe()\`**: Storing the \`Subscription\` and calling \`.unsubscribe()\` in \`ngOnDestroy\`.`,
    code: `import { Component, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({...})
export class DestroyExampleComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  private mySub: Subscription;

  constructor(private api: ApiService) {
    // Method 1: takeUntil pattern
    this.api.getData().pipe(
      takeUntil(this.destroy$)
    ).subscribe(data => console.log(data));

    // Method 2: Manual subscription
    this.mySub = this.api.getOtherData().subscribe();
  }

  ngOnDestroy() {
    // Cleanup takeUntil
    this.destroy$.next();
    this.destroy$.complete();
    
    // Cleanup manual subscription
    if (this.mySub) this.mySub.unsubscribe();
  }
}`,
    category: 'rxjs',
    difficulty: 'advanced',
  },
  {
    id: 43,
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
    id: 44,
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
    id: 45,
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
    id: 46,
    question: 'What is the difference between Angular Template-driven forms and Reactive forms?',
    answer: `*   **Template-Driven Forms**: The form logic and structure are defined directly in the HTML template using directives like \`ngModel\`. They are asynchronous, mutable, and good for simple scenarios. Testing is harder because it requires a DOM.
*   **Reactive Forms**: The form logic, structure, and validation are defined synchronously in the component class using \`FormControl\` and \`FormGroup\`. The template simply binds to these objects. They are robust, immutable, scalable, and highly testable without needing a DOM.`,
    category: 'forms',
    difficulty: 'intermediate',
  },
  {
    id: 47,
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
    id: 48,
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
    id: 49,
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
    id: 50,
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
    id: 51,
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
    id: 52,
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
    id: 53,
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
    id: 54,
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
    id: 55,
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
    id: 56,
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
    id: 57,
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
    id: 58,
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
    id: 59,
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
    id: 60,
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
    id: 61,
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
    id: 62,
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
    id: 63,
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
    id: 64,
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
    id: 65,
    question: 'Explain the difference between find and findIndex in arrays (TypeScript/JS).',
    answer: `While not strictly Angular-specific, they are heavily used when manipulating data.
*   **\`find()\`**: Returns the *value* of the first element in the array that satisfies the provided testing function. Returns \`undefined\` if not found.
*   **\`findIndex()\`**: Returns the *index* of the first element that satisfies the testing function. Returns \`-1\` if not found.`,
    code: `const users = [
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' }
];

// Returns the object: { id: 2, name: 'Jane' }
const user = users.find(u => u.name === 'Jane');

// Returns the index: 1
const index = users.findIndex(u => u.name === 'Jane');`,
    category: 'core',
    difficulty: 'beginner',
  },
  {
    id: 66,
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
    id: 67,
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
    id: 68,
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
    id: 69,
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
    id: 70,
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
    question: 'How does Angular handle change detection?',
    answer: `Angular uses a library called \`Zone.js\` to patch standard asynchronous browser APIs (like \`setTimeout\`, \`setInterval\`, DOM events, and \`XMLHttpRequest\`).
    
Whenever one of these asynchronous events completes, Zone.js notifies Angular. Angular then traverses its component tree from top to bottom, checking bindings and updating the DOM where necessary. This top-down approach ensures predictable UI updates.`,
    category: 'performance',
    difficulty: 'advanced',
  },
  {
    id: 92,
    question: 'What is the purpose of the forwardRef function?',
    answer: `\`forwardRef\` allows you to refer to references (like classes) that are not yet defined at the time the reference is made.

It is most commonly used when a class needs to refer to itself within its own \`providers\` array, which is required when implementing custom form controls (\`ControlValueAccessor\`).`,
    code: `import { Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-custom-input',
  template: \`<input>\`,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    // Without forwardRef, CustomInputComponent is undefined here
    useExisting: forwardRef(() => CustomInputComponent), 
    multi: true
  }]
})
export class CustomInputComponent {
  // ...
}`,
    category: 'core',
    difficulty: 'advanced',
  },
  {
    id: 93,
    question: 'Explain the distinctUntilChanged operator in RxJS.',
    answer: `\`distinctUntilChanged\` is an RxJS operator that only emits a value if it is *different* from the previously emitted value.

By default, it uses simple strict equality (\`===\`). You can also pass a custom comparator function to compare complex objects. It is heavily used in search inputs to prevent firing an API call if the user types a letter and immediately backspaces it.`,
    code: `import { of } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

const source$ = of(1, 1, 2, 2, 3, 1);

source$.pipe(
  distinctUntilChanged()
).subscribe(val => console.log(val));
// Output: 1, 2, 3, 1  (Notice the final '1' is emitted because it's different from '3')`,
    category: 'rxjs',
    difficulty: 'intermediate',
  },
  {
    id: 94,
    question: 'What are Route Parameters and Query Parameters?',
    answer: `*   **Route Parameters**: Essential parts of the route path used to identify a specific resource. (e.g., \`/users/123\`). They are defined in the route config (\`path: 'users/:id'\`).
*   **Query Parameters**: Optional parameters appended to the end of the URL after a question mark (\`?\`). Used for sorting, filtering, or pagination (e.g., \`/users?sort=asc&page=2\`). They are *not* defined in the route config.`,
    code: `// 1. Reading Route Parameters (/users/123)
this.route.paramMap.subscribe(params => {
  const userId = params.get('id');
});

// 2. Reading Query Parameters (/users?page=2)
this.route.queryParamMap.subscribe(queryParams => {
  const page = queryParams.get('page');
});

// 3. Setting Query Parameters programmatically
this.router.navigate(['/users'], { queryParams: { page: 2 } });`,
    category: 'routing',
    difficulty: 'beginner',
  },
  {
    id: 95,
    question: 'How do you style a host element using Angular?',
    answer: `A component cannot easily style its own host tag (e.g., \`<app-card>\`) from within its HTML template because the host tag wraps the template.

To style the host element, use the \`:host\` pseudo-class selector in the component's CSS file.`,
    code: `/* card.component.css */
:host {
  display: block;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
}

/* Apply style only when host has the 'active' class: <app-card class="active"> */
:host(.active) {
  border-color: blue;
}`,
    category: 'components',
    difficulty: 'intermediate',
  },
  {
    id: 96,
    question: 'What is the purpose of the ng-container tag?',
    answer: `\`<ng-container>\` is an invisible grouping element. It allows you to use structural directives (like \`*ngIf\` or \`*ngFor\`) without adding an extra element (like a \`<div>\` or \`<span>\`) to the final DOM.

It is incredibly useful when you want to loop over multiple elements or apply an \`*ngIf\` without messing up CSS grid/flexbox layouts.`,
    code: `<!-- Bad: Adds unnecessary <div> elements to the DOM -->
<div *ngIf="isLoggedIn">
  <p>Welcome back</p>
  <button>Logout</button>
</div>

<!-- Good: ng-container disappears, only <p> and <button> are rendered -->
<ng-container *ngIf="isLoggedIn">
  <p>Welcome back</p>
  <button>Logout</button>
</ng-container>`,
    category: 'templates',
    difficulty: 'beginner',
  },
  {
    id: 97,
    question: 'What is the difference between a Component and a Module?',
    answer: `*   **Component**: Controls a specific portion of the screen (a View). It consists of an HTML template, CSS styles, and a TypeScript class containing the logic.
*   **Module (\`NgModule\`)**: A logical grouping mechanism. It bundles together related Components, Directives, Pipes, and Services. It dictates the compilation context and defines what is exported to other modules.`,
    category: 'core',
    difficulty: 'beginner',
  },
  {
    id: 98,
    question: 'Explain the catchError operator in RxJS.',
    answer: `\`catchError\` intercepts an error occurring in an Observable. 

It allows you to gracefully handle the error (e.g., log it) and return a *new* Observable so the stream can either complete normally (using \`of()\`) or re-throw the error (using \`throwError()\`) to be handled by the subscriber.`,
    code: `import { of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

this.http.get('/api/data').pipe(
  catchError(error => {
    console.error('API failed!', error);
    // Option 1: Return fallback data to keep the app running
    // return of({ fallback: true, data: [] });
    
    // Option 2: Rethrow the error to the component
    return throwError(() => new Error('Custom error message'));
  })
).subscribe({
  next: data => console.log('Success', data),
  error: err => console.log('Component caught error', err)
});`,
    category: 'rxjs',
    difficulty: 'intermediate',
  },
  {
    id: 99,
    question: 'How do you create an HttpInterceptor?',
    answer: `1.  Create a class that implements the \`HttpInterceptor\` interface.
2.  Implement the \`intercept\` method, which receives the \`HttpRequest\` and the \`HttpHandler\` (\`next\`).
3.  Clone the request to modify it (requests are immutable).
4.  Provide the interceptor in your root module using the \`HTTP_INTERCEPTORS\` injection token.`,
    code: `// 1. The Interceptor
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const cloned = req.clone({
      setHeaders: { Authorization: \`Bearer my-token\` }
    });
    return next.handle(cloned);
  }
}

// 2. Providing it in AppModule
@NgModule({
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
  ]
})
export class AppModule { }`,
    category: 'services',
    difficulty: 'advanced',
  },
  {
    id: 100,
    question: 'What is the purpose of the ngAfterViewInit lifecycle hook?',
    answer: `\`ngAfterViewInit\` is called exactly once after Angular has fully initialized a component's view and its child views. 

This is the **safest and earliest** lifecycle hook to interact with DOM elements queried via \`@ViewChild\` or \`@ViewChildren\`. If you try to access a \`@ViewChild\` in \`ngOnInit\`, it will likely be \`undefined\`.`,
    code: `import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  template: \`<canvas #myCanvas></canvas>\`
})
export class CanvasComponent implements AfterViewInit {
  @ViewChild('myCanvas') canvas!: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit() {
    // The canvas element is now guaranteed to be in the DOM
    const ctx = this.canvas.nativeElement.getContext('2d');
    ctx?.fillRect(0, 0, 100, 100);
  }
}`,
    category: 'core',
    difficulty: 'intermediate',
  },
  {
    id: 101,
    question: 'What is Content Projection and how is it achieved?',
    answer: `Content projection allows you to insert HTML content from a parent component directly into a specific location within a child component's template. It creates highly reusable components (like Modals or Cards).

It is achieved using the \`<ng-content>\` tag inside the child component.`,
    code: `// Child (CardComponent)
<div class="card">
  <div class="card-header">
    <ng-content select="[card-title]"></ng-content>
  </div>
  <div class="card-body">
    <!-- Default slot -->
    <ng-content></ng-content>
  </div>
</div>

// Parent Usage
<app-card>
  <h2 card-title>My Title</h2>
  <p>This is the projected body content.</p>
</app-card>`,
    category: 'templates',
    difficulty: 'intermediate',
  },
  {
    id: 102,
    question: 'Explain the difference between Promise and Observable.',
    answer: `*   **Promise**: Emits a single value (or fails) and completes. It is executed immediately upon creation (eager). It cannot be cancelled.
*   **Observable**: Can emit multiple values over time. It is not executed until a consumer \`subscribes\` to it (lazy). It can be easily cancelled by unsubscribing. It provides powerful operators for data transformation (\`map\`, \`filter\`, \`switchMap\`).`,
    category: 'rxjs',
    difficulty: 'beginner',
  },
  {
    id: 103,
    question: 'What is a FormArray in Reactive Forms?',
    answer: `A \`FormArray\` is a variant of \`FormGroup\`. While \`FormGroup\` manages an object of controls with string keys, \`FormArray\` manages an array of controls with numerical indexes.

It is heavily used for dynamic forms where the user can add or remove an unknown number of identical inputs (e.g., adding multiple phone numbers or email addresses).`,
    code: `import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

@Component({...})
export class UserFormComponent implements OnInit {
  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: [''],
      emails: this.fb.array([
        this.fb.control('') // Initial email input
      ])
    });
  }

  get emails() {
    return this.form.get('emails') as FormArray;
  }

  addEmail() {
    this.emails.push(this.fb.control(''));
  }
}`,
    category: 'forms',
    difficulty: 'advanced',
  },
  {
    id: 104,
    question: 'What are Angular elements?',
    answer: `Angular Elements are standard Angular components packaged as **Custom Elements** (a Web Components standard). 

This allows you to embed an Angular component into non-Angular applications (like a React app, a static HTML page, or a CMS) because the browser treats it as a native HTML tag.`,
    category: 'advanced',
    difficulty: 'advanced',
  },
  {
    id: 105,
    question: 'How do you handle multiple HTTP requests simultaneously?',
    answer: `To run multiple independent HTTP requests in parallel and wait for all of them to complete, use the RxJS \`forkJoin\` operator. It behaves similarly to \`Promise.all()\`.`,
    code: `import { forkJoin } from 'rxjs';

export class DashboardComponent {
  constructor(private api: ApiService) {}

  loadDashboardData() {
    // Both requests fire immediately
    forkJoin({
      user: this.api.getUserProfile(),
      stats: this.api.getStatistics()
    }).subscribe(({ user, stats }) => {
      // This block executes ONLY when BOTH requests complete successfully
      console.log('User:', user);
      console.log('Stats:', stats);
    });
  }
}`,
    category: 'rxjs',
    difficulty: 'intermediate',
  },
  {
    id: 106,
    question: 'What is the purpose of the Renderer2 service?',
    answer: `\`Renderer2\` is an Angular service providing an abstraction layer for manipulating the DOM. 

You should use \`Renderer2\` instead of native methods like \`document.getElementById()\` because Angular applications can run in environments where a DOM does not exist (like Server-Side Rendering or Web Workers). \`Renderer2\` ensures your DOM manipulations are platform-safe.`,
    code: `import { Component, Renderer2, ElementRef } from '@angular/core';

@Component({
  template: \`<div #myDiv>Hello</div>\`
})
export class SafeDomComponent {
  @ViewChild('myDiv') divRef!: ElementRef;

  constructor(private renderer: Renderer2) {}

  highlight() {
    // Safe DOM manipulation
    this.renderer.setStyle(this.divRef.nativeElement, 'backgroundColor', 'yellow');
    this.renderer.addClass(this.divRef.nativeElement, 'highlight-class');
  }
}`,
    category: 'core',
    difficulty: 'advanced',
  },
  {
    id: 107,
    question: 'What is TrackBy in ngFor and why is it important?',
    answer: `By default, when an array bound to \`*ngFor\` changes, Angular tears down all DOM elements and recreates them, which is incredibly expensive.

\`trackBy\` provides a unique identifier for each item. Angular uses this ID to track which specific items were added, modified, or removed, and updates *only* those specific DOM nodes, resulting in massive performance gains for large lists.`,
    code: `// Component
export class ListComponent {
  items = [{ id: 1, name: 'A' }, { id: 2, name: 'B' }];

  // Returns the unique identifier
  trackById(index: number, item: any): number {
    return item.id;
  }
}

// Template
<ul>
  <li *ngFor="let item of items; trackBy: trackById">
    {{ item.name }}
  </li>
</ul>`,
    category: 'performance',
    difficulty: 'intermediate',
  },
  {
    id: 108,
    question: 'How do you detect when a user navigates away from a component with unsaved changes?',
    answer: `Use the \`CanDeactivate\` route guard. This guard is executed when the user attempts to leave a route. It can return a boolean or an Observable/Promise resolving to a boolean. If it returns false, the navigation is cancelled.`,
    code: `// 1. Create an interface the component must implement
export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

// 2. The Guard
export const unsavedChangesGuard: CanDeactivateFn<CanComponentDeactivate> = (component) => {
  return component.canDeactivate ? component.canDeactivate() : true;
};

// 3. The Component
export class EditComponent implements CanComponentDeactivate {
  hasUnsavedChanges = true;

  canDeactivate() {
    if (this.hasUnsavedChanges) {
      return confirm('You have unsaved changes. Do you really want to leave?');
    }
    return true;
  }
}

// 4. Routing
// { path: 'edit', component: EditComponent, canDeactivate: [unsavedChangesGuard] }`,
    category: 'routing',
    difficulty: 'advanced',
  },
  {
    id: 109,
    question: 'What is a Subject vs BehaviorSubject vs ReplaySubject?',
    answer: `*   **\`Subject\`**: Multicasts to multiple observers. Does NOT store the current value. Late subscribers miss past events.
*   **\`BehaviorSubject\`**: Requires an initial value. Stores the *last* emitted value. Late subscribers immediately receive the most recent value.
*   **\`ReplaySubject\`**: Stores a specified number of past values. Late subscribers immediately receive a "replay" of those past values.`,
    category: 'rxjs',
    difficulty: 'intermediate',
  },
  {
    id: 110,
    question: 'What are Angular Standalone Components?',
    answer: `Introduced in Angular 14, standalone components allow you to build Angular applications without using \`NgModules\`. 

You set \`standalone: true\` in the \`@Component\` decorator, and you explicitly define the component's dependencies (other components, pipes, directives) directly in its \`imports\` array. This drastically simplifies the architecture and learning curve of Angular.`,
    code: `import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Replaces BrowserModule imports
import { ButtonComponent } from './button.component';

@Component({
  selector: 'app-standalone-hero',
  standalone: true,
  imports: [CommonModule, ButtonComponent], // Explicit dependencies
  template: \`
    <div *ngIf="show">
      <h1>Hero</h1>
      <app-button>Click Me</app-button>
    </div>
  \`
})
export class StandaloneHeroComponent {
  show = true;
}`,
    category: 'core',
    difficulty: 'intermediate',
  },
  {
    id: 111,
    question: 'How do you test an Angular component that uses a Router?',
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
    question: 'How do you handle multiple route parameters in a single route?',
    answer: `You can define multiple parameters in a route path using the colon prefix for each. These are then accessible via the \`paramMap\` or \`params\` observables of the \`ActivatedRoute\` service.`,
    code: `// Route definition
{ path: 'user/:userId/post/:postId', component: PostDetailComponent }

// Component retrieval
constructor(private route: ActivatedRoute) {}

ngOnInit() {
  this.route.paramMap.subscribe(params => {
    const userId = params.get('userId');
    const postId = params.get('postId');
  });
}`,
    category: 'routing',
    difficulty: 'beginner',
  },
  {
    id: 132,
    question: 'What is the purpose of the takeUntil operator in component destruction?',
    answer: `The \`takeUntil\` operator is used to automatically unsubscribe from observables when a component is destroyed, preventing memory leaks. You create a subject (often called \`destroy$\`) that emits a value in \`ngOnDestroy\`, and pipe \`takeUntil(this.destroy$)\` into your observable streams.`,
    code: `private destroy$ = new Subject<void>();

ngOnInit() {
  this.dataService.getData().pipe(
    takeUntil(this.destroy$)
  ).subscribe(data => this.data = data);
}

ngOnDestroy() {
  this.destroy$.next();
  this.destroy$.complete();
}`,
    category: 'rxjs',
    difficulty: 'intermediate',
  },
  {
    id: 133,
    question: 'How do you implement a custom validator for a Reactive Form?',
    answer: `A custom validator is a function that takes an \`AbstractControl\` and returns either an object of validation errors if the value is invalid, or \`null\` if it is valid.`,
    code: `import { AbstractControl, ValidationErrors } from '@angular/forms';

export function forbiddenNameValidator(control: AbstractControl): ValidationErrors | null {
  const forbidden = /admin/i.test(control.value);
  return forbidden ? { forbiddenName: { value: control.value } } : null;
}

// Usage in form
this.form = this.fb.group({
  username: ['', [Validators.required, forbiddenNameValidator]]
});`,
    category: 'forms',
    difficulty: 'intermediate',
  },
  {
    id: 134,
    question: 'What is the withComponentInputBinding() feature in Angular 16?',
    answer: `Introduced in Angular 16, \`withComponentInputBinding()\` allows the router to automatically bind route parameters, query parameters, and static data directly to component \`@Input()\` properties, eliminating the need to inject \`ActivatedRoute\`.`,
    code: `// In appConfig
provideRouter(routes, withComponentInputBinding())

// In Component
@Component({...})
export class DetailComponent {
  @Input() id!: string; // Bound from /detail/:id
  @Input() query!: string; // Bound from ?query=xxx
}`,
    category: 'routing',
    difficulty: 'intermediate',
  },
  {
    id: 135,
    question: 'Explain the difference between ViewChild and ContentChild.',
    answer: `* **ViewChild**: Accesses a child element, component, or directive that is part of the component's *own template*.
* **ContentChild**: Accesses a child element, component, or directive that is *projected* into the component via \`<ng-content>\`.`,
    code: `@Component({
  selector: 'app-parent',
  template: \`
    <app-child #internalChild></app-child> <!-- ViewChild -->
    <ng-content></ng-content> <!-- ContentChild comes here -->
  \`
})
export class ParentComponent {
  @ViewChild('internalChild') viewChild!: ChildComponent;
  @ContentChild(ChildComponent) contentChild!: ChildComponent;
}`,
    category: 'core',
    difficulty: 'intermediate',
  },
  {
    id: 136,
    question: 'What is a resolver in Angular routing?',
    answer: `A resolver is a service or function that pre-fetches data before a route is activated. This ensures that the component only loads once the data is ready, avoiding "empty state" or loading flicker in the UI.`,
    code: `// Resolver function
export const userResolver: ResolveFn<User> = (route, state) => {
  return inject(UserService).getUser(route.paramMap.get('id')!);
};

// Route definition
{ 
  path: 'user/:id', 
  component: UserComponent, 
  resolve: { user: userResolver } 
}

// Access in component
constructor(private route: ActivatedRoute) {
  this.user = this.route.snapshot.data['user'];
}`,
    category: 'routing',
    difficulty: 'intermediate',
  },
  {
    id: 137,
    question: 'How do you create a standalone directive?',
    answer: `Similar to standalone components, you set \`standalone: true\` in the \`@Directive\` decorator. It can then be imported directly into other standalone components or modules.`,
    code: `@Directive({
  selector: '[appHighlight]',
  standalone: true
})
export class HighlightDirective {
  @HostBinding('style.backgroundColor') bgColor = 'yellow';
}`,
    category: 'directives',
    difficulty: 'beginner',
  },
  {
    id: 138,
    question: 'What is the purpose of the entryComponents array in older Angular versions?',
    answer: `In versions before Ivy (pre-Angular 9), \`entryComponents\` was used to tell Angular to compile components that were not referenced in a template (e.g., components loaded dynamically via \`ComponentFactoryResolver\` for modals or dialogs). In Ivy, this is no longer necessary.`,
    category: 'core',
    difficulty: 'advanced',
  },
  {
    id: 139,
    question: 'How do you mock a service in Angular unit tests?',
    answer: `You can mock a service by providing a fake object in the \`TestBed\` configuration using the \`useValue\` or \`useClass\` property.`,
    code: `const mockUserService = {
  getUsers: () => of([{ id: 1, name: 'Test' }])
};

TestBed.configureTestingModule({
  providers: [
    { provide: UserService, useValue: mockUserService }
  ]
});`,
    category: 'testing',
    difficulty: 'intermediate',
  },
  {
    id: 140,
    question: 'What is the difference between debounceTime and throttleTime?',
    answer: `* **debounceTime**: Emits a value only after a specified period of silence (inactivity). Useful for search inputs.
* **throttleTime**: Emits the first value, then ignores subsequent values for a specified duration. Useful for limiting rate-limited actions like button clicks.`,
    code: `// debounceTime: Wait for 300ms pause
input$.pipe(debounceTime(300)).subscribe();

// throttleTime: Emit immediately, then wait 1000ms
click$.pipe(throttleTime(1000)).subscribe();`,
    category: 'rxjs',
    difficulty: 'intermediate',
  },
  {
    id: 141,
    question: 'How do you define optional parameters in a route?',
    answer: `Optional parameters are not part of the route path definition. They are passed as an object to the \`navigate\` method and appear in the URL as matrix parameters (e.g., \`;key=value\`).`,
    code: `// Navigation
this.router.navigate(['/user', id, { folder: 'inbox' }]);

// URL: /user/1;folder=inbox

// Retrieval
this.route.paramMap.get('folder');`,
    category: 'routing',
    difficulty: 'beginner',
  },
  {
    id: 142,
    question: 'What is the purpose of the providedIn: root syntax?',
    answer: `Setting \`providedIn: 'root'\` in the \`@Injectable\` decorator makes the service a singleton available throughout the entire application. It also allows the service to be tree-shaken if it is not used.`,
    code: `@Injectable({
  providedIn: 'root'
})
export class AppService { }`,
    category: 'services',
    difficulty: 'beginner',
  },
  {
    id: 143,
    question: 'How do you share data between unrelated components?',
    answer: `The most common way to share data between unrelated components is by using a shared service with a \`Subject\` or \`BehaviorSubject\`. Components can push data to the service, and other components can subscribe to it.`,
    code: `@Injectable({ providedIn: 'root' })
export class DataService {
  private messageSource = new BehaviorSubject('default');
  currentMessage = this.messageSource.asObservable();

  changeMessage(message: string) {
    this.messageSource.next(message);
  }
}`,
    category: 'services',
    difficulty: 'intermediate',
  },
  {
    id: 144,
    question: 'What is the difference between Reactive Forms and Template-driven Forms?',
    answer: `* **Reactive Forms**: More robust, scalable, and testable. The form structure is defined in the TypeScript code. It is synchronous and uses immutable data structures.
* **Template-driven Forms**: Easier to use for simple forms. The form structure is defined in the HTML template using directives like \`ngModel\`. It is asynchronous.`,
    category: 'forms',
    difficulty: 'beginner',
  },
  {
    id: 145,
    question: 'What is the purpose of the skipLocationChange option in navigation?',
    answer: `When \`skipLocationChange\` is set to \`true\`, the browser's URL does not update when navigating to a new route. This is useful for internal transitions or redirects where you don't want the user to see the intermediate URL.`,
    code: `this.router.navigate(['/hidden'], { skipLocationChange: true });`,
    category: 'routing',
    difficulty: 'intermediate',
  },
  {
    id: 146,
    question: 'How do you handle global errors in an Angular application?',
    answer: `You can handle global errors by implementing the \`ErrorHandler\` interface. This custom class can then be provided in the root module or application config.`,
    code: `@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: any): void {
    console.error('Global error caught:', error);
    // Optionally send to a logging service
  }
}

// In appConfig
providers: [
  { provide: ErrorHandler, useClass: GlobalErrorHandler }
]`,
    category: 'core',
    difficulty: 'advanced',
  },
  {
    id: 147,
    question: 'What is the purpose of the ng-template element?',
    answer: `\`ng-template\` is used to define a template that is not rendered by default. It can be used with structural directives like \`*ngIf\` (for the else block) or manually rendered using \`ViewContainerRef\`.`,
    code: `<div *ngIf="isLoggedIn; else loginTemplate">
  Welcome back!
</div>

<ng-template #loginTemplate>
  Please log in.
</ng-template>`,
    category: 'templates',
    difficulty: 'beginner',
  },
  {
    id: 148,
    question: 'What is the difference between mergeMap and switchMap?',
    answer: `* **mergeMap**: Subscribes to all inner observables and emits values from all of them concurrently.
* **switchMap**: Unsubscribes from the previous inner observable when a new value is emitted by the source observable, effectively "switching" to the latest stream.`,
    category: 'rxjs',
    difficulty: 'intermediate',
  },
  {
    id: 149,
    question: 'How do you optimize an Angular application for production?',
    answer: `1. Enable Ahead-of-Time (AOT) compilation.
2. Use tree-shaking to remove unused code.
3. Implement lazy loading for modules.
4. Use the \`OnPush\` change detection strategy.
5. Minify and bundle assets.
6. Use service workers for PWA features.`,
    category: 'performance',
    difficulty: 'intermediate',
  },
  {
    id: 150,
    question: 'What is the purpose of the ngZone.run() method?',
    answer: `\`ngZone.run()\` is used to explicitly run code inside the Angular zone. This is necessary when updates are made from outside Angular's detection mechanism (like 3rd party libraries or certain browser APIs) to ensure change detection is triggered.`,
    code: `this.ngZone.run(() => {
  this.data = externalData; // UI will update
});`,
    category: 'core',
    difficulty: 'advanced',
  },
  {
    id: 151,
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
    id: 152,
    question: 'What is the purpose of the animation-specific state() function?',
    answer: `The \`state()\` function defines a set of CSS styles that should be applied to the element when it is in a particular named state (e.g., 'active', 'inactive', 'collapsed').`,
    category: 'animations',
    difficulty: 'beginner',
  },
  {
    id: 153,
    question: 'How do you use the @.disabled property in animations?',
    answer: `You can bind to the \`@.disabled\` property on an element to programmatically disable all animations for that element and its children. This is useful for performance optimization or accessibility.`,
    code: `<div [@.disabled]="animationsDisabled">
  <div [@myAnimation]="state"></div>
</div>`,
    category: 'animations',
    difficulty: 'intermediate',
  },
  {
    id: 154,
    question: 'What is the difference between transition() and animate()?',
    answer: `* **transition()**: Defines the path between two states (e.g., 'open => closed').
* **animate()**: Defines the duration, delay, and easing of the transition (e.g., '500ms ease-in').`,
    category: 'animations',
    difficulty: 'beginner',
  },
  {
    id: 155,
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
    id: 156,
    question: 'What is the purpose of the :enter and :leave aliases in animations?',
    answer: `* **:enter**: A shorthand for the transition \`void => *\` (when an element is added to the DOM).
* **:leave**: A shorthand for the transition \`* => void\` (when an element is removed from the DOM).`,
    category: 'animations',
    difficulty: 'beginner',
  },
  {
    id: 157,
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
    id: 158,
    question: 'What is the purpose of the group() function in animations?',
    answer: `The \`group()\` function allows you to run multiple animation steps in parallel. All steps within the group start at the same time.`,
    category: 'animations',
    difficulty: 'intermediate',
  },
  {
    id: 159,
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
    id: 160,
    question: 'What is the purpose of the query() function in animations?',
    answer: `The \`query()\` function allows you to find one or more inner elements within the host element being animated, so you can apply styles or animations directly to them.`,
    category: 'animations',
    difficulty: 'intermediate',
  },
  {
    id: 161,
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
    id: 162,
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
    id: 163,
    question: 'What is the difference between a Component and a Directive?',
    answer: `* **Component**: A directive with a template. It is used to create UI elements with logic.
* **Directive**: Attaches behavior to existing DOM elements (e.g., \`ngIf\`, \`ngClass\`). It does not have its own template.`,
    category: 'core',
    difficulty: 'beginner',
  },
  {
    id: 164,
    question: 'What are the different types of directives in Angular?',
    answer: `1. **Component Directives**: Directives with templates.
2. **Structural Directives**: Change the DOM layout by adding or removing elements (e.g., \`*ngIf\`, \`*ngFor\`).
3. **Attribute Directives**: Change the appearance or behavior of an element (e.g., \`ngStyle\`, \`ngClass\`).`,
    category: 'directives',
    difficulty: 'beginner',
  },
  {
    id: 165,
    question: 'What is the purpose of the ElementRef service?',
    answer: `\`ElementRef\` is a wrapper around a native DOM element. It allows you to access the element directly, although direct DOM manipulation is discouraged in favor of using \`Renderer2\`.`,
    category: 'core',
    difficulty: 'beginner',
  },
  {
    id: 166,
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
    id: 167,
    question: 'What is the purpose of the HostBinding decorator?',
    answer: `\`@HostBinding\` allows you to bind a host element property to a property in your directive or component class.`,
    code: `@HostBinding('class.active') isActive = true;`,
    category: 'directives',
    difficulty: 'intermediate',
  },
  {
    id: 168,
    question: 'What is the purpose of the HostListener decorator?',
    answer: `\`@HostListener\` allows you to subscribe to events emitted by the host element.`,
    code: `@HostListener('click') onClick() { console.log('Clicked!'); }`,
    category: 'directives',
    difficulty: 'intermediate',
  },
  {
    id: 169,
    question: 'How do you create a custom structural directive?',
    answer: `You create a class decorated with \`@Directive\`, inject \`TemplateRef\` (representing the content) and \`ViewContainerRef\` (where the content is rendered), and use logic to decide when to render the template.`,
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
    id: 170,
    question: 'What is the purpose of the TemplateRef service?',
    answer: `\`TemplateRef\` represents an embedded template (the content inside an \`ng-template\`). It can be used to instantiate multiple views from the same template.`,
    category: 'core',
    difficulty: 'intermediate',
  },
  {
    id: 171,
    question: 'What is the purpose of the ViewContainerRef service?',
    answer: `\`ViewContainerRef\` represents a container where one or more views can be attached. It provides methods like \`createEmbeddedView\` and \`createComponent\` to dynamically manage the DOM.`,
    category: 'core',
    difficulty: 'advanced',
  },
  {
    id: 172,
    question: 'How do you pass data to a structural directive?',
    answer: `You can pass data using \`@Input()\` properties. The property name must match the directive's selector or follow a specific naming convention (e.g., \`*appRepeat="5"\` requires an input named \`appRepeat\`).`,
    category: 'directives',
    difficulty: 'intermediate',
  },
  {
    id: 173,
    question: 'What is the difference between a pipe and a directive?',
    answer: `* **Pipe**: Transforms data for display in the template (e.g., \`uppercase\`, \`date\`).
* **Directive**: Modifies the behavior or structure of DOM elements.`,
    category: 'core',
    difficulty: 'beginner',
  },
  {
    id: 174,
    question: 'What are pure and impure pipes?',
    answer: `* **Pure Pipe**: Only re-executes when the input value or its reference changes. This is the default and is more performant.
* **Impure Pipe**: Re-executes on every change detection cycle (e.g., \`async\` pipe). Useful for data that changes frequently without changing its reference.`,
    category: 'pipes',
    difficulty: 'intermediate',
  },
  {
    id: 175,
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
    id: 176,
    question: 'How do you use the async pipe?',
    answer: `The \`async\` pipe subscribes to an observable or promise and returns the latest value it has emitted. When a new value is emitted, the pipe marks the component to be checked for changes. It also automatically unsubscribes when the component is destroyed.`,
    code: `<div *ngIf="user$ | async as user">
  {{ user.name }}
</div>`,
    category: 'pipes',
    difficulty: 'beginner',
  },
  {
    id: 177,
    question: 'How do you handle error handling in observables?',
    answer: `You can handle errors using the \`catchError\` operator, which allows you to catch an error and return a new observable or re-throw the error.`,
    code: `this.http.get('/api/data').pipe(
  catchError(error => {
    console.error('Error occurred:', error);
    return of([]); // Return an empty array as a fallback
  })
).subscribe();`,
    category: 'rxjs',
    difficulty: 'intermediate',
  },
  {
    id: 178,
    question: 'What is the purpose of the retry and retryWhen operators?',
    answer: `* **retry**: Resubscribes to the source observable a specified number of times if it errors.
* **retryWhen**: Resubscribes to the source observable based on a custom logic defined in a notifier observable.`,
    category: 'rxjs',
    difficulty: 'intermediate',
  },
  {
    id: 179,
    question: 'How do you create an observable from an event?',
    answer: `You can use the \`fromEvent\` function from RxJS to create an observable from a DOM event.`,
    code: `const clicks = fromEvent(document, 'click');
clicks.subscribe(x => console.log(x));`,
    category: 'rxjs',
    difficulty: 'beginner',
  },
  {
    id: 180,
    question: 'What is the difference between a cold and a hot observable?',
    answer: `* **Cold Observable**: Starts emitting values only when a subscriber subscribes. Each subscriber gets its own independent stream of data (e.g., \`http.get\`).
* **Hot Observable**: Emits values even if there are no subscribers. All subscribers share the same stream of data (e.g., \`fromEvent\`, \`Subject\`).`,
    category: 'rxjs',
    difficulty: 'intermediate',
  },
  {
    id: 181,
    question: 'How do you convert a cold observable to a hot observable?',
    answer: `You can use the \`share()\` operator to multicast the source observable to multiple subscribers, effectively making it hot.`,
    category: 'rxjs',
    difficulty: 'advanced',
  },
  {
    id: 182,
    question: 'What is the purpose of the BehaviorSubject?',
    answer: `A \`BehaviorSubject\` is a type of \`Subject\` that stores the current value and emits it immediately to any new subscribers. It requires an initial value.`,
    code: `const subject = new BehaviorSubject(0);
subject.subscribe(x => console.log(x)); // Emits 0 immediately
subject.next(1); // Emits 1`,
    category: 'rxjs',
    difficulty: 'beginner',
  },
  {
    id: 183,
    question: 'What is the purpose of the ReplaySubject?',
    answer: `A \`ReplaySubject\` is a type of \`Subject\` that "replays" a specified number of previous values to new subscribers.`,
    code: `const subject = new ReplaySubject(2);
subject.next(1);
subject.next(2);
subject.next(3);
subject.subscribe(x => console.log(x)); // Emits 2, 3`,
    category: 'rxjs',
    difficulty: 'intermediate',
  },
  {
    id: 184,
    question: 'What is the purpose of the AsyncSubject?',
    answer: `An \`AsyncSubject\` only emits the last value emitted by the source observable, and only when the source completes.`,
    category: 'rxjs',
    difficulty: 'advanced',
  },
  {
    id: 185,
    question: 'How do you combine multiple observables?',
    answer: `RxJS provides several operators for combining observables:
1. **merge**: Combines multiple observables into one by emitting values from all of them as they occur.
2. **concat**: Combines multiple observables into one by emitting values from each in sequence.
3. **combineLatest**: Emits an array of the latest values from each observable whenever any of them emits a value.
4. **zip**: Emits an array of values from each observable only when all of them have emitted a value at the same index.
5. **forkJoin**: Waits for all observables to complete and then emits an array of their final values.`,
    category: 'rxjs',
    difficulty: 'intermediate',
  },
  {
    id: 186,
    question: 'How do you transform data using RxJS operators?',
    answer: `Common transformation operators include:
1. **map**: Applies a function to each emitted value.
2. **pluck**: Selects a specific property from each emitted object.
3. **scan**: Applies an accumulator function over time (similar to \`Array.reduce\`).
4. **buffer**: Collects emitted values into arrays and emits them when a notifier observable emits.`,
    category: 'rxjs',
    difficulty: 'intermediate',
  },
  {
    id: 187,
    question: 'What is the difference between switchMap, mergeMap, concatMap, and exhaustMap?',
    answer: `* **switchMap**: Cancels the previous inner observable when a new value is emitted.
* **mergeMap**: Subscribes to all inner observables concurrently.
* **concatMap**: Waits for each inner observable to complete before starting the next one (preserves order).
* **exhaustMap**: Ignores new source values while an inner observable is running.`,
    category: 'rxjs',
    difficulty: 'advanced',
  },
  {
    id: 188,
    question: 'How do you handle memory leaks in RxJS?',
    answer: `Memory leaks occur when subscriptions are not properly closed.
1. Use the \`async\` pipe in templates.
2. Manually unsubscribe in \`ngOnDestroy\`.
3. Use the \`take(1)\` or \`takeUntil\` operators to automatically close streams.`,
    category: 'rxjs',
    difficulty: 'intermediate',
  },
  {
    id: 189,
    question: 'What is the purpose of the tap operator?',
    answer: `The \`tap\` operator is used for performing side effects (e.g., logging, updating local state) without modifying the emitted values.`,
    category: 'rxjs',
    difficulty: 'beginner',
  },
  {
    id: 190,
    question: 'How do you create an observable from a promise?',
    answer: `You can use the \`from\` function from RxJS to convert a promise into an observable.`,
    code: `const promise = fetch('/api/data').then(res => res.json());
const observable = from(promise);`,
    category: 'rxjs',
    difficulty: 'beginner',
  },
  {
    id: 191,
    question: 'What is the purpose of the of and from functions?',
    answer: `* **of**: Creates an observable from a list of arguments.
* **from**: Creates an observable from an array, an iterable, or a promise.`,
    category: 'rxjs',
    difficulty: 'beginner',
  },
  {
    id: 192,
    question: 'How do you use the filter operator?',
    answer: `The \`filter\` operator emits only those values that satisfy a specified predicate function.`,
    code: `of(1, 2, 3, 4).pipe(
  filter(x => x % 2 === 0)
).subscribe(console.log); // Output: 2, 4`,
    category: 'rxjs',
    difficulty: 'beginner',
  },
  {
    id: 193,
    question: 'What is the purpose of the first and last operators?',
    answer: `* **first**: Emits only the first value (or the first value that satisfies a predicate) and then completes.
* **last**: Emits only the last value (or the last value that satisfies a predicate) and then completes.`,
    category: 'rxjs',
    difficulty: 'beginner',
  },
  {
    id: 194,
    question: 'How do you use the delay operator?',
    answer: `The \`delay\` operator shifts the emissions of an observable by a specified duration.`,
    category: 'rxjs',
    difficulty: 'beginner',
  },
  {
    id: 195,
    question: 'What is the difference between Reactive Forms and Template-driven Forms?',
    answer: `* **Reactive Forms**: More scalable and testable. Form logic is in the component class. Synchronous.
* **Template-driven Forms**: Easier for simple forms. Form logic is in the template using directives like \`ngModel\`. Asynchronous.`,
    category: 'forms',
    difficulty: 'beginner',
  },
  {
    id: 196,
    question: 'How do you create a Reactive Form?',
    answer: `You use the \`FormBuilder\`, \`FormGroup\`, and \`FormControl\` classes.`,
    code: `this.loginForm = this.fb.group({
  email: ['', [Validators.required, Validators.email]],
  password: ['', Validators.required]
});`,
    category: 'forms',
    difficulty: 'beginner',
  },
  {
    id: 197,
    question: 'How do you set and get values in a Reactive Form?',
    answer: `* **setValue**: Sets the value for the entire form group (requires all fields).
* **patchValue**: Sets the value for specific fields in the group.
* **get**: Retrieves the \`FormControl\` for a specific field.
* **value**: Property that returns the current value of the form.`,
    category: 'forms',
    difficulty: 'beginner',
  },
  {
    id: 198,
    question: 'How do you handle form validation in Reactive Forms?',
    answer: `You can pass an array of validators to the \`FormControl\` constructor or the \`fb.group()\` method. Angular provides built-in validators like \`required\`, \`minLength\`, \`email\`, etc.`,
    category: 'forms',
    difficulty: 'beginner',
  },
  {
    id: 199,
    question: 'How do you track the status of a form control?',
    answer: `You can check the properties of a \`FormControl\` like \`valid\`, \`invalid\`, \`pending\`, \`pristine\`, \`dirty\`, \`touched\`, and \`untouched\`.`,
    category: 'forms',
    difficulty: 'beginner',
  },
  {
    id: 200,
    question: 'How do you reset a form?',
    answer: `You can use the \`reset()\` method on the \`FormGroup\` or \`FormControl\` instance.`,
    code: `this.loginForm.reset();`,
    category: 'forms',
    difficulty: 'beginner',
  },
  {
    id: 201,
    question: 'How do you handle status changes in a form control?',
    answer: `You can subscribe to the \`statusChanges\` observable of a \`FormControl\`, \`FormGroup\`, or \`FormArray\` to react to changes in the validation status (e.g., \`VALID\`, \`INVALID\`, \`PENDING\`, \`DISABLED\`).`,
    code: `this.control.statusChanges.subscribe(status => console.log('Status:', status));`,
    category: 'forms',
    difficulty: 'intermediate',
  },
  {
    id: 202,
    question: 'What is the purpose of the updateOn option in form controls?',
    answer: `The \`updateOn\` option allows you to specify when the form control should update its value and validation status. Options are \`change\` (default), \`blur\`, and \`submit\`.`,
    code: `this.control = new FormControl('', { updateOn: 'blur' });`,
    category: 'forms',
    difficulty: 'intermediate',
  },
  {
    id: 203,
    question: 'How do you handle unit testing for services with HttpClient?',
    answer: `You use the \`HttpClientTestingModule\` and \`HttpTestingController\` to mock HTTP requests and verify that the service makes the correct calls.`,
    code: `it('should fetch data', () => {
  service.getData().subscribe(data => expect(data).toEqual(mockData));
  const req = httpMock.expectOne('/api/data');
  expect(req.request.method).toBe('GET');
  req.flush(mockData);
});`,
    category: 'testing',
    difficulty: 'intermediate',
  },
  {
    id: 204,
    question: 'What is the purpose of the async and fakeAsync utilities in testing?',
    answer: `* **async** (or \`waitForAsync\`): Used for tests that perform asynchronous operations (like HTTP calls). It waits for all pending tasks to complete.
* **fakeAsync**: Allows you to write asynchronous tests in a synchronous way using the \`tick()\` function to simulate the passage of time.`,
    category: 'testing',
    difficulty: 'advanced',
  },
  {
    id: 205,
    question: 'How do you use the component fixture (ComponentFixture) in testing?',
    answer: `\`ComponentFixture\` is a wrapper around a component and its template. It provides access to the component instance, the debug element, and methods to trigger change detection (\`detectChanges()\`).`,
    category: 'testing',
    difficulty: 'intermediate',
  },
  {
    id: 206,
    question: 'What is the purpose of the DebugElement in testing?',
    answer: `\`DebugElement\` is a wrapper around a native DOM element that provides cross-platform methods for interacting with the element (e.g., \`query\`, \`triggerEventHandler\`).`,
    category: 'testing',
    difficulty: 'intermediate',
  },
  {
    id: 207,
    question: 'How do you test a component that uses the Router service?',
    answer: `You can use the \`RouterTestingModule\` to mock navigation or provide a spy for the \`Router\` service.`,
    code: `TestBed.configureTestingModule({
  imports: [RouterTestingModule.withRoutes([])],
  providers: [{ provide: Router, useValue: routerSpy }]
});`,
    category: 'testing',
    difficulty: 'intermediate',
  },
  {
    id: 208,
    question: 'What is the purpose of the By class in testing?',
    answer: `The \`By\` class provides utility methods for selecting elements from the DOM in tests (e.g., \`By.css('.my-class')\`, \`By.directive(MyDirective)\`).`,
    category: 'testing',
    difficulty: 'beginner',
  },
  {
    id: 209,
    question: 'How do you test a component with asynchronous data fetching in ngOnInit?',
    answer: `You use \`fakeAsync\` and \`tick()\` to wait for the data fetch to complete before making assertions.`,
    code: `it('should load data on init', fakeAsync(() => {
  fixture.detectChanges();
  tick(); // Wait for async calls
  fixture.detectChanges();
  expect(component.data).toBeDefined();
}));`,
    category: 'testing',
    difficulty: 'advanced',
  },
  {
    id: 210,
    question: 'What is the purpose of the overrideComponent method in testing?',
    answer: `\`overrideComponent\` allows you to modify a component's metadata (e.g., template, providers) during testing. This is often used to mock child components or services.`,
    category: 'testing',
    difficulty: 'advanced',
  },
  {
    id: 211,
    question: 'What is the difference between Jasmine and Karma?',
    answer: `* **Jasmine**: The behavior-driven development (BDD) framework used for writing the actual test cases (e.g., \`describe\`, \`it\`, \`expect\`).
* **Karma**: The test runner that executes the tests in real browsers and reports the results.`,
    category: 'testing',
    difficulty: 'beginner',
  },
  {
    id: 212,
    question: 'How do you handle testing for OnPush components?',
    answer: `Since \`fixture.detectChanges()\` does not automatically trigger change detection for \`OnPush\` components unless inputs change, you may need to manually call \`markForCheck()\` or use \`fixture.componentRef.injector.get(ChangeDetectorRef).detectChanges()\`.`,
    category: 'testing',
    difficulty: 'advanced',
  },
  {
    id: 213,
    question: 'What is the purpose of the withModule(s) approach in modern standalone testing?',
    answer: `In standalone component testing, you use the \`imports\` array of \`TestBed.configureTestingModule\` to include necessary components, directives, and modules, as there is no \`NgModule\` to provide them.`,
    category: 'testing',
    difficulty: 'intermediate',
  },
  {
    id: 214,
    question: 'How do you perform a performance audit on an Angular app?',
    answer: `1. Use Chrome DevTools (Performance tab).
2. Use Lighthouse to check core web vitals.
3. Use the Angular DevTools extension to profile change detection and explore the component tree.
4. Check bundle size using \`webpack-bundle-analyzer\`.`,
    category: 'performance',
    difficulty: 'advanced',
  },
  {
    id: 215,
    question: 'What is the purpose of the budget feature in angular.json?',
    answer: `Budgets allow you to set size limits for your application bundles. If a bundle exceeds the specified threshold, the build will produce a warning or an error.`,
    code: `"budgets": [
  { "type": "initial", "maximumWarning": "500kb", "maximumError": "1mb" }
]`,
    category: 'performance',
    difficulty: 'intermediate',
  },
  {
    id: 216,
    question: 'How do you implement code splitting in Angular?',
    answer: `Code splitting is automatically achieved when using lazy-loaded routes. Each lazy-loaded route is bundled into its own separate JavaScript file, which is only downloaded when needed.`,
    category: 'performance',
    difficulty: 'beginner',
  },
  {
    id: 217,
    question: 'What is the purpose of the preloadingStrategy in routing?',
    answer: `\`preloadingStrategy\` allows you to download lazy-loaded modules in the background after the initial application has loaded, reducing navigation delay. Common strategies are \`NoPreloading\` (default) and \`PreloadAllModules\`.`,
    code: `provideRouter(routes, withPreloading(PreloadAllModules))`,
    category: 'performance',
    difficulty: 'intermediate',
  },
  {
    id: 218,
    question: 'How do you create a custom preloading strategy?',
    answer: `You implement the \`PreloadingStrategy\` interface and its \`preload()\` method. This allows you to selectively preload modules based on custom criteria (e.g., data attributes or user behavior).`,
    category: 'performance',
    difficulty: 'advanced',
  },
  {
    id: 219,
    question: 'What is the purpose of the trackBy function in *ngFor?',
    answer: `\`trackBy\` helps Angular identify which items in a list have changed, been added, or been removed by providing a unique identifier. This prevents Angular from re-rendering the entire list when only one item changes, significantly improving performance.`,
    code: `<li *ngFor="let item of items; trackBy: trackById">{{ item.name }}</li>`,
    category: 'performance',
    difficulty: 'beginner',
  },
  {
    id: 220,
    question: 'What is the difference between JIT and AOT compilation?',
    answer: `* **JIT (Just-in-Time)**: Compiles the application in the browser at runtime. Slower initial load, larger bundle.
* **AOT (Ahead-of-Time)**: Compiles the application during the build process. Faster load, smaller bundle, better security (template errors caught early).`,
    category: 'core',
    difficulty: 'intermediate',
  },
  {
    id: 221,
    question: 'What is the purpose of the Ivy compiler?',
    answer: `Ivy is Angular's modern rendering engine and compiler. It produces smaller bundles, enables better debugging, faster compilation, and supports advanced features like standalone components and functional guards.`,
    category: 'core',
    difficulty: 'intermediate',
  },
  {
    id: 222,
    question: 'How do you implement Server-Side Rendering (SSR) in Angular?',
    answer: `You can use Angular Universal by running \`ng add @nguniversal/express-engine\`. This allows the server to pre-render the application into HTML before sending it to the client.`,
    category: 'advanced',
    difficulty: 'advanced',
  },
  {
    id: 223,
    question: 'What is the purpose of the TransferState service in SSR?',
    answer: `\`TransferState\` allows you to transfer data from the server to the client during the bootstrap process. This prevents the client from making redundant API calls that were already completed on the server.`,
    category: 'advanced',
    difficulty: 'advanced',
  },
  {
    id: 224,
    question: 'How do you handle browser-specific code in SSR?',
    answer: `You use the \`isPlatformBrowser\` and \`isPlatformServer\` functions from \`@angular/common\` to wrap code that should only run in a specific environment (e.g., accessing \`window\` or \`document\`).`,
    code: `if (isPlatformBrowser(this.platformId)) {
  // Safe to use window
}`,
    category: 'advanced',
    difficulty: 'intermediate',
  },
  {
    id: 225,
    question: 'What is the purpose of the hydration feature in Angular 16+?',
    answer: `Hydration (specifically Non-destructive Hydration) allows Angular to reuse the existing DOM structures rendered on the server instead of re-creating them from scratch on the client. This significantly improves the Largest Contentful Paint (LCP) and prevents UI flicker.`,
    category: 'performance',
    difficulty: 'advanced',
  },
  {
    id: 226,
    question: 'How do you perform tree-shaking in Angular?',
    answer: `Tree-shaking is a build optimization that removes unused code from the final bundle. It is enabled by default in production builds. To make your own code tree-shakable, use \`providedIn: 'root'\` for services and avoid global side effects.`,
    category: 'performance',
    difficulty: 'intermediate',
  },
  {
    id: 227,
    question: 'What is the purpose of the ng-content element?',
    answer: `\`ng-content\` is used for content projection. It allows you to create a "slot" in a component's template where external HTML can be inserted by the parent component.`,
    category: 'core',
    difficulty: 'beginner',
  },
  {
    id: 228,
    question: 'What is the purpose of the ng-template element?',
    answer: `\`ng-template\` defines a template that is not rendered by default. It can be used with structural directives or manually rendered using \`ViewContainerRef\`.`,
    category: 'core',
    difficulty: 'beginner',
  },
  {
    id: 229,
    question: 'What is the purpose of the ng-container element?',
    answer: `\`ng-container\` is a grouping element that does not render as a tag in the DOM. It's used to apply structural directives without adding unnecessary elements to the DOM.`,
    category: 'core',
    difficulty: 'beginner',
  },
  {
    id: 230,
    question: 'How do you pass data from a parent to a child component?',
    answer: `You use the \`@Input()\` decorator in the child component to define properties that can be bound to from the parent's template.`,
    category: 'core',
    difficulty: 'beginner',
  },
  {
    id: 231,
    question: 'How do you pass data from a child to a parent component?',
    answer: `You use the \`@Output()\` decorator and an \`EventEmitter\` in the child component to emit events that the parent can listen to.`,
    category: 'core',
    difficulty: 'beginner',
  },
  {
    id: 232,
    question: 'What is the purpose of the EventEmitter class?',
    answer: `\`EventEmitter\` is used in child components to emit custom events to parent components. It extends the RxJS \`Subject\` class.`,
    category: 'core',
    difficulty: 'beginner',
  },
  {
    id: 233,
    question: 'What is the purpose of the @ViewChild decorator?',
    answer: `\`@ViewChild\` allows you to access a child component, directive, or DOM element from the parent component class.`,
    category: 'core',
    difficulty: 'beginner',
  },
  {
    id: 234,
    question: 'What is the purpose of the @ContentChild decorator?',
    answer: `\`@ContentChild\` allows you to access a projected child component, directive, or element (via \`ng-content\`) from the host component class.`,
    category: 'core',
    difficulty: 'intermediate',
  },
  {
    id: 235,
    question: 'What is the difference between ViewChild and ContentChild?',
    answer: `* **ViewChild**: Accesses children in the component's own template.
* **ContentChild**: Accesses children projected into the component via \`<ng-content>\`.`,
    category: 'core',
    difficulty: 'intermediate',
  },
  {
    id: 236,
    question: 'How do you handle lifecycle hooks in Angular?',
    answer: `Lifecycle hooks are special methods that Angular calls at different stages of a component's or directive's life (e.g., \`ngOnInit\`, \`ngOnChanges\`, \`ngOnDestroy\`). You implement the corresponding interface (e.g., \`OnInit\`) and define the method.`,
    category: 'core',
    difficulty: 'beginner',
  },
  {
    id: 237,
    question: 'What is the purpose of the ngOnChanges hook?',
    answer: `\`ngOnChanges\` is called whenever one or more data-bound input properties (\`@Input\`) change. It receives a \`SimpleChanges\` object containing the previous and current values.`,
    category: 'core',
    difficulty: 'beginner',
  },
  {
    id: 238,
    question: 'What is the purpose of the ngOnInit hook?',
    answer: `\`ngOnInit\` is called once after Angular has initialized all data-bound properties. It is the ideal place for initialization logic and data fetching.`,
    category: 'core',
    difficulty: 'beginner',
  },
  {
    id: 239,
    question: 'What is the purpose of the ngDoCheck hook?',
    answer: `\`ngDoCheck\` is called during every change detection cycle, allowing you to implement custom change detection logic that Angular's default mechanism might miss.`,
    category: 'core',
    difficulty: 'advanced',
  },
  {
    id: 240,
    question: 'What is the purpose of the ngAfterContentInit and ngAfterContentChecked hooks?',
    answer: `* **ngAfterContentInit**: Called after Angular projects external content into the component's view.
* **ngAfterContentChecked**: Called after Angular checks the projected content.`,
    category: 'core',
    difficulty: 'intermediate',
  },
  {
    id: 241,
    question: 'What is the purpose of the ngAfterViewInit and ngAfterViewChecked hooks?',
    answer: `* **ngAfterViewInit**: Called after Angular initializes the component's views and child views.
* **ngAfterViewChecked**: Called after Angular checks the component's views and child views.`,
    category: 'core',
    difficulty: 'intermediate',
  },
  {
    id: 242,
    question: 'What is the purpose of the ngOnDestroy hook?',
    answer: `\`ngOnDestroy\` is called just before Angular destroys the component or directive. It is the place to perform cleanup, such as unsubscribing from observables and detaching event handlers.`,
    category: 'core',
    difficulty: 'beginner',
  },
  {
    id: 243,
    question: 'What is the difference between a constructor and ngOnInit?',
    answer: `* **Constructor**: A JS feature used for dependency injection. Inputs are not yet available.
* **ngOnInit**: An Angular hook. Inputs are available. Ideal for initialization.`,
    category: 'core',
    difficulty: 'beginner',
  },
  {
    id: 244,
    question: 'How do you handle element-level DOM manipulation safely?',
    answer: `Use the \`Renderer2\` service instead of directly accessing \`nativeElement\` to ensure compatibility with non-browser environments like SSR.`,
    category: 'core',
    difficulty: 'intermediate',
  },
  {
    id: 245,
    question: 'What is the purpose of the @Host decorator?',
    answer: `The \`@Host()\` decorator tells Angular to search for the dependency only in the local injector of the host component.`,
    category: 'core',
    difficulty: 'advanced',
  },
  {
    id: 246,
    question: 'What is the purpose of the @Optional decorator?',
    answer: `The \`@Optional()\` decorator allows a dependency to be null if it is not provided, preventing a \`NullInjectorError\`.`,
    category: 'core',
    difficulty: 'beginner',
  },
  {
    id: 247,
    question: 'What is the purpose of the @Self decorator?',
    answer: `The \`@Self()\` decorator restricts the dependency search to the local injector of the current element.`,
    category: 'core',
    difficulty: 'intermediate',
  },
  {
    id: 248,
    question: 'What is the purpose of the @SkipSelf decorator?',
    answer: `The \`@SkipSelf()\` decorator tells Angular to start searching for a dependency in the parent injector, skipping the local one.`,
    category: 'core',
    difficulty: 'intermediate',
  },
  {
    id: 249,
    question: 'How do you handle circular dependencies between services?',
    answer: `Use the \`forwardRef()\` function or refactor the code to move shared logic into a separate service.`,
    category: 'core',
    difficulty: 'advanced',
  },
  {
    id: 250,
    question: 'What is the difference between @Injectable({ providedIn: "root" }) and providing in an @NgModule?',
    answer: `* **providedIn: "root"**: Service is a singleton and tree-shakable.
* **@NgModule providers**: Service is provided when the module is loaded and is not tree-shakable.`,
    category: 'core',
    difficulty: 'intermediate',
  },
  {
    id: 251,
    question: 'How do you handle dependency injection for a class that is not a component or service?',
    answer: `You can use the \`inject()\` function inside the class constructor or field initializer, provided the class is instantiated within an injection context (e.g., via a factory). Alternatively, you can pass the dependencies manually through the constructor.`,
    category: 'core',
    difficulty: 'advanced',
  },
  {
    id: 252,
    question: 'What is the purpose of the providedIn: "root" syntax?',
    answer: `It makes the service a singleton available throughout the application and enables tree-shaking, meaning the service is only included in the final bundle if it is actually used.`,
    category: 'core',
    difficulty: 'beginner',
  },
  {
    id: 253,
    question: 'What is the purpose of the providedIn: "platform" syntax?',
    answer: `It makes the service a singleton that is shared across all Angular applications running on the same page (useful in micro-frontend architectures).`,
    category: 'advanced',
    difficulty: 'advanced',
  },
  {
    id: 254,
    question: 'How do you provide a service only for a specific component and its children?',
    answer: `You add the service to the \`providers\` array of that specific component's \`@Component\` decorator.`,
    code: `@Component({
  selector: 'app-parent',
  providers: [MyService]
})`,
    category: 'core',
    difficulty: 'beginner',
  },
  {
    id: 255,
    question: 'What is the purpose of the viewProviders property?',
    answer: `\`viewProviders\` makes a service available to a component and its view children, but NOT to its content children (projected content via \`ng-content\`).`,
    category: 'core',
    difficulty: 'advanced',
  },
  {
    id: 256,
    question: 'How do you implement a custom structural directive with multiple inputs?',
    answer: `You use the \`set\` keyword with the directive's selector name for the main input, and standard \`@Input\` decorators for additional properties.`,
    code: `<div *myDirective="condition; let val; delay: 500"></div>

@Directive({ selector: '[myDirective]' })
export class MyDirective {
  @Input() set myDirective(val: any) { ... }
  @Input() myDirectiveDelay: number = 0;
}`,
    category: 'directives',
    difficulty: 'advanced',
  },
  {
    id: 257,
    question: 'What is the purpose of the $any() type cast in templates?',
    answer: `\`$any()\` is used to disable type checking for a specific expression in an Angular template. It's similar to the \`any\` type in TypeScript.`,
    code: `{{ $any(item).dynamicProperty }}`,
    category: 'core',
    difficulty: 'intermediate',
  },
  {
    id: 258,
    question: 'How do you handle global error handling in Angular?',
    answer: `You can create a class that implements the \`ErrorHandler\` interface and provide it using the \`ErrorHandler\` token.`,
    code: `@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: any) {
    console.error('Caught by Global Handler:', error);
  }
}

// In providers
{ provide: ErrorHandler, useClass: GlobalErrorHandler }`,
    category: 'advanced',
    difficulty: 'intermediate',
  },
  {
    id: 259,
    question: 'What is the purpose of the HttpXhrBackend service?',
    answer: `\`HttpXhrBackend\` is the default backend for \`HttpClient\` that uses the browser's \`XMLHttpRequest\` API to make requests. You can provide a custom backend for testing or special requirements.`,
    category: 'http',
    difficulty: 'advanced',
  },
  {
    id: 260,
    question: 'How do you perform unit testing for a pipe?',
    answer: `Since pipes are just classes with a \`transform\` method, you can test them as standard TS classes without needing \`TestBed\`.`,
    code: `it('should transform value', () => {
  const pipe = new MyPipe();
  expect(pipe.transform(2)).toBe(4);
});`,
    category: 'testing',
    difficulty: 'beginner',
  },
  {
    id: 261,
    question: 'How do you test a directive?',
    answer: `You create a dummy component that uses the directive and then use \`TestBed\` to inspect the element's behavior or styles.`,
    category: 'testing',
    difficulty: 'intermediate',
  },
  {
    id: 262,
    question: 'What is the purpose of the NO_ERRORS_SCHEMA in testing?',
    answer: `\`NO_ERRORS_SCHEMA\` tells the Angular compiler to ignore unrecognized elements and attributes in your test templates. This is useful for shallow testing where you don't want to declare all child components.`,
    category: 'testing',
    difficulty: 'intermediate',
  },
  {
    id: 263,
    question: 'How do you mock a service using a spy in Jasmine?',
    answer: `You use \`jasmine.createSpyObj\` to create a mock object with specified methods.`,
    code: `const authSpy = jasmine.createSpyObj('AuthService', ['login']);
authSpy.login.and.returnValue(of(true));`,
    category: 'testing',
    difficulty: 'beginner',
  },
  {
    id: 264,
    question: 'What is the difference between it() and fit() in Jasmine?',
    answer: `* **it()**: Defines a standard test case.
* **fit()**: "Focused it" - Jasmine will only run this specific test (and other \`fit\` tests), ignoring the rest of the suite.`,
    category: 'testing',
    difficulty: 'beginner',
  },
  {
    id: 265,
    question: 'What is the difference between describe() and fdescribe()?',
    answer: `* **describe()**: Defines a test suite.
* **fdescribe()**: "Focused describe" - Jasmine will only run the tests within this suite.`,
    category: 'testing',
    difficulty: 'beginner',
  },
  {
    id: 266,
    question: 'How do you implement a debounced search using RxJS?',
    answer: `You can use the \`debounceTime\` and \`distinctUntilChanged\` operators on a form control's \`valueChanges\` observable.`,
    code: `this.searchControl.valueChanges.pipe(
  debounceTime(300),
  distinctUntilChanged(),
  switchMap(query => this.service.search(query))
).subscribe();`,
    category: 'rxjs',
    difficulty: 'intermediate',
  },
  {
    id: 267,
    question: 'What is the purpose of the takeUntil operator?',
    answer: `\`takeUntil\` emits values from the source observable until a second notifier observable emits. It is commonly used to manage subscriptions and prevent memory leaks by passing a "destroy" subject.`,
    code: `obs$.pipe(takeUntil(this.destroy$)).subscribe();`,
    category: 'rxjs',
    difficulty: 'intermediate',
  },
  {
    id: 268,
    question: 'What is the purpose of the race operator?',
    answer: `\`race\` returns an observable that mirrors the first observable to emit a value or an error.`,
    category: 'rxjs',
    difficulty: 'intermediate',
  },
  {
    id: 269,
    question: 'How do you handle multiple parallel HTTP requests where you only care about the first one to complete?',
    answer: `You use the \`race\` operator.`,
    category: 'rxjs',
    difficulty: 'intermediate',
  },
  {
    id: 270,
    question: 'What is the difference between Subject and Observable?',
    answer: `* **Observable**: Unicast. Each subscriber gets a separate execution.
* **Subject**: Multicast. All subscribers share the same execution and receive the same values. It is both an observable and an observer.`,
    category: 'rxjs',
    difficulty: 'intermediate',
  },
  {
    id: 271,
    question: 'How do you use the void state in animations?',
    answer: `The \`void\` state is a special state for elements that are not yet part of the DOM (entering) or are about to be removed (leaving).`,
    category: 'animations',
    difficulty: 'beginner',
  },
  {
    id: 272,
    question: 'What is the purpose of the wildcard (*) state in animations?',
    answer: `The wildcard state matches any animation state. It's often used to define transitions that apply regardless of the current state.`,
    category: 'animations',
    difficulty: 'beginner',
  },
  {
    id: 273,
    question: 'How do you use the query(":self") selector in animations?',
    answer: `\`query(':self')\` selects the element that is the target of the animation trigger itself.`,
    category: 'animations',
    difficulty: 'advanced',
  },
  {
    id: 274,
    question: 'What is the purpose of the animateChild() function?',
    answer: `\`animateChild()\` is used within a parent animation to trigger the animations defined on child elements. By default, parent animations block child animations.`,
    category: 'animations',
    difficulty: 'advanced',
  },
  {
    id: 275,
    question: 'How do you disable animations globally for testing?',
    answer: `You can use the \`NoopAnimationsModule\` instead of \`BrowserAnimationsModule\` in your test setup.`,
    category: 'testing',
    difficulty: 'intermediate',
  },
  {
    id: 276,
    question: 'How do you handle animation sequencing (one after another)?',
    answer: `You can use the \`sequence()\` function or simply define an array of animation steps. Each step must complete before the next one starts.`,
    category: 'animations',
    difficulty: 'intermediate',
  },
  {
    id: 277,
    question: 'What is the purpose of the params property in animations?',
    answer: `\`params\` allow you to pass dynamic values (like duration or color) to an animation at runtime from the template.`,
    code: `<div [@myAnimation]="{ value: state, params: { duration: '500ms' } }"></div>`,
    category: 'animations',
    difficulty: 'advanced',
  },
  {
    id: 278,
    question: 'How do you use the @.disabled property on a specific element?',
    answer: `You can bind a boolean value to the \`[@.disabled]\` property of an element to enable or disable animations for that element and its subtree.`,
    category: 'animations',
    difficulty: 'intermediate',
  },
  {
    id: 279,
    question: 'What is the difference between a module-based and a standalone component?',
    answer: `* **Module-based**: Requires declaration in an \`@NgModule\`.
* **Standalone**: Does not require an \`@NgModule\`. It manages its own dependencies via the \`imports\` array.`,
    category: 'core',
    difficulty: 'beginner',
  },
  {
    id: 280,
    question: 'How do you bootstrap a standalone application?',
    answer: `You use the \`bootstrapApplication()\` function instead of the traditional \`platformBrowserDynamic().bootstrapModule()\` method.`,
    code: `bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes)]
});`,
    category: 'core',
    difficulty: 'intermediate',
  },
  {
    id: 281,
    question: 'What is the purpose of the provideHttpClient() function?',
    answer: `It is a router feature used to provide \`HttpClient\` in a standalone application, replacing \`HttpClientModule\`.`,
    category: 'http',
    difficulty: 'intermediate',
  },
  {
    id: 282,
    question: 'What is the purpose of the provideAnimations() function?',
    answer: `It is used to provide browser animations support in a standalone application, replacing \`BrowserAnimationsModule\`.`,
    category: 'animations',
    difficulty: 'intermediate',
  },
  {
    id: 283,
    question: 'How do you define a signal in Angular 16+?',
    answer: `You use the \`signal()\` function to create a reactive value.`,
    code: `count = signal(0);
increment() { this.count.update(c => c + 1); }
currentCount = this.count(); // Access value`,
    category: 'core',
    difficulty: 'beginner',
  },
  {
    id: 284,
    question: 'What is the difference between signal() and computed()?',
    answer: `* **signal()**: A writable reactive value.
* **computed()**: A read-only reactive value that is automatically updated when its dependencies change.`,
    category: 'core',
    difficulty: 'intermediate',
  },
  {
    id: 285,
    question: 'What is the purpose of the effect() function?',
    answer: `\`effect()\` runs a function whenever the signals it reads change. It is used for side effects like logging or manual DOM updates.`,
    category: 'core',
    difficulty: 'intermediate',
  },
  {
    id: 286,
    question: 'What is the difference between a Signal and an Observable?',
    answer: `* **Signal**: Always has a value, is synchronous, and is optimized for UI state.
* **Observable**: Can be asynchronous, handles streams of values over time, and is better for complex events (like HTTP).`,
    category: 'core',
    difficulty: 'intermediate',
  },
  {
    id: 287,
    question: 'How do you convert an observable to a signal?',
    answer: `You use the \`toSignal()\` function from \`@angular/core/rxjs-interop\`.`,
    code: `userSignal = toSignal(this.userService.user$);`,
    category: 'rxjs',
    difficulty: 'intermediate',
  },
  {
    id: 288,
    question: 'How do you convert a signal to an observable?',
    answer: `You use the \`toObservable()\` function from \`@angular/core/rxjs-interop\`.`,
    category: 'rxjs',
    difficulty: 'intermediate',
  },
  {
    id: 289,
    question: 'What is the purpose of the untracked() function?',
    answer: `\`untracked()\` allows you to read a signal's value inside a reactive context (like an effect) without creating a dependency on that signal.`,
    category: 'core',
    difficulty: 'advanced',
  },
  {
    id: 290,
    question: 'How do you handle input properties using signals?',
    answer: `In Angular 17.1+, you can use the \`input()\` function to define a signal-based input.`,
    code: `userName = input<string>('Guest');`,
    category: 'core',
    difficulty: 'intermediate',
  },
  {
    id: 291,
    question: 'What is the purpose of the model() function?',
    answer: `\`model()\` defines a writable signal that supports two-way binding, replacing the \`@Input()/@Output()\` pattern for simple value synchronization.`,
    category: 'core',
    difficulty: 'advanced',
  },
  {
    id: 292,
    question: 'What is the @defer block in Angular 17?',
    answer: `\`@defer\` allows you to lazily load parts of a template based on specific triggers (e.g., when the element enters the viewport, after a delay, or on a mouse interaction).`,
    code: `@defer (on viewport) {
  <app-heavy-chart />
} @placeholder {
  <p>Loading chart...</p>
}`,
    category: 'performance',
    difficulty: 'advanced',
  },
  {
    id: 293,
    question: 'What are the available triggers for @defer?',
    answer: `Triggers include \`idle\` (default), \`viewport\`, \`interaction\`, \`hover\`, \`immediate\`, \`timer(ms)\`, and \`when (condition)\`.`,
    category: 'performance',
    difficulty: 'intermediate',
  },
  {
    id: 294,
    question: 'What is the purpose of the @placeholder block?',
    answer: `The \`@placeholder\` block displays content while the deferred content is loading or before the trigger is activated.`,
    category: 'performance',
    difficulty: 'beginner',
  },
  {
    id: 295,
    question: 'What is the purpose of the @loading block?',
    answer: `The \`@loading\` block displays content during the actual fetching of the deferred component's dependencies.`,
    category: 'performance',
    difficulty: 'beginner',
  },
  {
    id: 296,
    question: 'What is the purpose of the @error block?',
    answer: `The \`@error\` block displays content if the deferred loading fails.`,
    category: 'performance',
    difficulty: 'beginner',
  },
  {
    id: 297,
    question: 'What is the difference between a Signal and a Subject?',
    answer: `* **Signal**: Pull-based (values are read when needed), synchronous, always has a value.
* **Subject**: Push-based (values are emitted to subscribers), can be asynchronous, and doesn't necessarily hold a "current" value (unless it's a \`BehaviorSubject\`).`,
    category: 'core',
    difficulty: 'advanced',
  },
  {
    id: 298,
    question: 'How do you use the output() function in Angular 17.3+?',
    answer: `\`output()\` is a functional way to define outputs, which is more type-safe and consistent with signal-based inputs. It returns an \`OutputEmitterRef\`.`,
    code: `nameChanged = output<string>();`,
    category: 'core',
    difficulty: 'intermediate',
  },
  {
    id: 299,
    question: 'What is the purpose of the contentChild() and viewChild() signal-based functions?',
    answer: `Introduced in Angular 17.2, these functions provide a signal-based way to access child elements, offering better reactivity and consistency with other signal features.`,
    category: 'core',
    difficulty: 'advanced',
  },
  {
    id: 300,
    question: 'What is the purpose of the take(1) operator?',
    answer: `\`take(1)\` emits only the first value from the source observable and then completes. It is often used for HTTP requests or one-time data fetches to ensure the subscription is automatically closed.`,
    category: 'rxjs',
    difficulty: 'beginner',
  },
];
