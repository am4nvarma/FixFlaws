# FixFlaw's 🚀
### Local Services, Made Simple

FixFlow is a React Native mobile app concept that connects people who need local services with professionals who can provide them. Customers can post service requests, while providers can discover available jobs, accept requests, and update their progress until completion.

The goal is to build a practical, end-to-end marketplace that demonstrates real-world mobile development, backend integration, authentication, database security, state management, and production-ready engineering practices.

> **Project status:** In active development. Features listed below describe the planned MVP and roadmap; availability will depend on implementation progress.

## ✨ Planned Features

### 👤 Customer Experience
- Sign up and sign in securely.
- Browse available service categories.
- Create service requests with descriptions, preferred schedules, addresses, and optional photos.
- Track request status and view service history.
- Cancel eligible requests.
- Review completed services and providers.

### 🛠️ Service Provider Experience
- Create a provider profile and select service categories.
- Complete the planned profile verification process.
- Browse available service requests.
- Accept jobs and manage assigned work.
- Update job status from accepted to in progress and completed.
- View job history and customer reviews.

### 🔄 Job Lifecycle

`Open → Accepted → In Progress → Completed`

The app will enforce job ownership, valid status transitions, and safe job acceptance through backend rules rather than relying on the mobile UI alone.

## 🧰 Tech Stack

| Technology | Purpose |
|---|---|
| React Native | Cross-platform mobile UI |
| Expo | App development and native capabilities |
| TypeScript | Type safety and maintainability |
| Expo Router | File-based navigation |
| Supabase | Backend platform and authentication |
| PostgreSQL | Relational database |
| Row Level Security (RLS) | Database access control |
| TanStack Query | Server-state fetching, caching, and synchronization |
| Zustand | Lightweight client-side state |
| React Hook Form + Zod | Form handling and validation |
| Expo Image | Efficient image loading |
| Expo Image Picker | Selecting request photos |
| Expo Location | Location features, where needed |
| Expo Notifications | Push notifications |
| Jest + React Native Testing Library | Automated testing |
| Sentry | Error monitoring |
| Git + GitHub | Version control and collaboration |
| GitHub Actions | Automated checks and CI |
| EAS Build | Cloud builds and release preparation |

## 🏗️ Architecture

FixFlow will use a single role-aware mobile application for both customers and service providers.

- **Presentation layer:** Screens, reusable components, forms, and navigation.
- **Application layer:** Feature logic, hooks, and job workflows.
- **Data layer:** Supabase queries, mutations, and authentication.
- **Server state:** TanStack Query for caching and synchronization.
- **Client state:** Zustand for small pieces of local application state.
- **Security layer:** PostgreSQL constraints, Row Level Security policies, and backend-enforced job transitions.

The database will enforce permissions so customers can access their own requests and providers can access only the data permitted by their role and assigned jobs.

## 🔐 Security Principles

- Enforce authorization in the database and backend, not only in the UI.
- Apply and test Row Level Security policies for requests, profiles, addresses, and conversations.
- Prevent multiple providers from accepting the same job through an atomic backend operation.
- Validate permitted job-status transitions.
- Keep private credentials and Supabase service-role keys out of the mobile application.
- Validate inputs and handle network failures safely.

## 🗺️ Development Roadmap

- [ ] **Phase 1 — Foundation:** Expo, TypeScript, navigation, project structure, and Supabase setup.
- [ ] **Phase 2 — Authentication:** User sessions, customer/provider roles, and onboarding.
- [ ] **Phase 3 — Customer workflow:** Service discovery, request creation, photos, and history.
- [ ] **Phase 4 — Provider workflow:** Job discovery, acceptance, and assigned jobs.
- [ ] **Phase 5 — Job lifecycle:** Status updates, cancellation rules, and reviews.
- [ ] **Phase 6 — Live features:** Realtime updates, communication, and notifications where practical.
- [ ] **Phase 7 — Quality:** Automated tests, security checks, accessibility, and performance.
- [ ] **Phase 8 — Release:** Android release build, documentation, demo, and deployment preparation.

## 🚧 Scope

The initial goal is a working MVP, not a complete Uber-style dispatch platform.

Advanced features such as live technician GPS tracking, route optimization, payment escrow, provider payouts, AI-powered matching, and separate customer/provider apps are outside the initial scope.

## 🛠️ Getting Started

### Prerequisites

- Node.js (LTS)
- npm
- Expo Go or a compatible Android development environment
- A Supabase project

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/YOUR_USERNAME/FixFlow.git
   cd FixFlow
   ```

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
