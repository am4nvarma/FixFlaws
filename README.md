# FixFlaws 🚀
### Local Services, Made Simple

FixFlaws is a React Native mobile application that connects people who need local services with professionals who can provide them. Customers can post service requests, while providers can discover available jobs, accept requests, and update their progress until completion.

The goal was to build a practical, end-to-end marketplace demonstrating real-world mobile development, backend integration, authentication, database security, state management, and production-ready engineering practices.

> **Project status:** MVP Complete. The core application flows and features listed below are fully functional and connected to a live Supabase backend.

## ✨ Features

### 👤 Customer Experience
- Secure Sign Up and Sign In.
- Role-based onboarding (Customer vs. Provider).
- Create service requests with descriptions, categories, and addresses.
- Track request status and view service history.
- Cancel eligible requests (while status is still `Open`).

### 🛠️ Service Provider Experience
- Dedicated Provider dashboard and job feed.
- Browse available service requests.
- Accept jobs and manage assigned work.
- Update job status from `Accepted` to `In Progress` and `Completed`.
- Drop assigned jobs (returns them to the open pool).
- View job history.

### 🔄 Job Lifecycle

`Open → Accepted → In Progress → Completed`

*(Plus `Cancelled` and `Dropped` edge cases)*

The app enforces job ownership, valid status transitions, and safe job acceptance through backend database rules and Row Level Security (RLS) rather than relying on the mobile UI alone.

## 🧰 Tech Stack

| Technology | Purpose |
|---|---|
| React Native | Cross-platform mobile UI |
| Expo & Expo Router | App development, native capabilities, and file-based routing |
| TypeScript | Type safety and maintainability |
| Supabase | Backend platform and authentication |
| PostgreSQL | Relational database |
| Row Level Security (RLS) | Database access control and security |
| TanStack Query | Server-state fetching, caching, and mutations |
| Zustand | Lightweight global client state (Auth & Roles) |
| React Hook Form + Zod | Form handling and validation |
| date-fns | Relative time formatting |
| Ionicons | Tab and UI icons |

## 🏗️ Architecture

FixFlaws uses a single role-aware mobile application for both customers and service providers.

- **Presentation layer:** Screens, reusable components, forms, and navigation.
- **Application layer:** Feature logic, hooks, and job workflows.
- **Data layer:** Supabase queries, mutations, and authentication.
- **Server state:** TanStack Query for caching, synchronization, and optimistic UI updates.
- **Client state:** Zustand for global authentication state and user roles.
- **Security layer:** PostgreSQL constraints, Row Level Security policies, and backend-enforced job transitions.

## 🔐 Security Principles Implemented

- **Authorization in the database:** Enforced through Row Level Security (RLS), not just UI hiding.
- **Atomic Operations:** Prevented multiple providers from accepting the same job via PostgreSQL RLS and conditional updates.
- **Role-based access:** Users can only view and interact with data permitted by their specific role and assigned jobs.
- **Profile triggers:** Automatically creates a `public.profiles` record when a new user signs up via Supabase Auth triggers.
- **Input validation:** Strict form validation using Zod before data ever reaches the database.

## 🗺️ Development Roadmap

- [x] **Phase 1 — Foundation:** Expo, TypeScript, navigation, project structure, and Supabase setup.
- [x] **Phase 2 — Authentication:** User sessions, Customer/Provider roles, and onboarding.
- [x] **Phase 3 — Customer workflow:** Service discovery, request creation, and history.
- [x] **Phase 4 — Provider workflow:** Job discovery, acceptance, and assigned jobs.
- [x] **Phase 5 — Job lifecycle:** Status updates, cancellation rules, and drop rules.
- [ ] **Phase 6 — Live features:** Realtime chat updates and push notifications. *(Future Scope)*
- [ ] **Phase 7 — Quality:** Automated tests, accessibility, and performance. *(Future Scope)*
- [ ] **Phase 8 — Release:** Production deployment and app store release. *(In Progress)*

## 🚧 Scope

The initial goal was a working MVP, not a complete Uber-style dispatch platform. Advanced features such as live technician GPS tracking, route optimization, payment escrow, provider payouts, AI-powered matching, and separate customer/provider apps are outside the initial scope.

## 🛠️ Getting Started

### Prerequisites
- Node.js (LTS)
- npm
- Expo Go or a compatible Android/iOS development environment
- A Supabase project

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/FixFlaws.git
   cd FixFlaws

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure the required environment variables using the project's `.env.example` template. Add your Supabase project URL and publishable client key.

4. Start the development server:

   ```bash
   npx expo start
   ```

5. Scan the QR code using Expo Go or run the app on a compatible development target.

*Setup instructions and environment variables will be updated as the project structure and backend configuration evolve.*

## 🧪 Quality Goals

FixFlow aims to demonstrate more than a polished UI. Development will prioritize:

- Type-safe application code.
- Reusable and maintainable components.
- Secure database access.
- Reliable asynchronous operations.
- Clear loading, empty, error, and offline states.
- Automated tests for important business rules.
- Performance and accessibility on real devices.

## 📚 Documentation

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Supabase Documentation](https://supabase.com/docs)
- [TanStack Query Documentation](https://tanstack.com/query/latest/docs/framework/react/overview)

## 🎯 Project Goal

Build, test, document, and release a functional mobile marketplace while strengthening practical React Native skills, backend integration, debugging, database security, and software engineering fundamentals.

FixFlow is intended to be a portfolio project that demonstrates the ability to take a mobile application from an initial idea to a reliable, working product.

---

**Built with React Native, Expo, TypeScript, and Supabase.**
