# Pratham 2.0 🚀

A modern, scalable micro-frontend architecture built with Next.js and Nx for comprehensive school management and educational delivery.

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Development](#development)
- [Micro Frontends](#micro-frontends)
- [Nx Commands](#nx-commands)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

**Pratham 2.0** is a next-generation educational platform designed to manage schools, teachers, and student learning with a modular micro-frontend architecture. It supports multiple host applications and independent micro-frontend modules that communicate seamlessly.

## ✨ Features

- 🏫 **School Management** - Comprehensive school administration
- 👨‍🏫 **Teacher Management** - Teacher profiles and classroom management
- 📱 **Micro-Frontend Architecture** - Scalable, independent modules
- 🔐 **Authentication System** - Secure user authentication module
- 📊 **Youth Network** - Community and collaboration features
- 🎓 **Admin Dashboard** - Powerful admin interface
- ⚡ **High Performance** - Optimized with Next.js and Nx
- 🔄 **Shared Library** - Reusable components and utilities

## 🏗️ Architecture

This project uses a **Micro-Frontend Architecture** with:
- **Host Applications**: Main applications that host micro-frontends
- **Micro-Frontends**: Independent, feature-rich modules
- **Shared Library**: Common components, utilities, and services

```
Pratham 2.0
├── Host Applications
│   ├── Teachers (Port 3001)
│   └── Admin (Port 3002)
├── Micro-Frontends
│   ├── Authentication (Port 4101)
│   ├── SCP Teacher Repo (Port 4102)
│   └── YouthNet (Port 4103)
└── Shared Libraries
    └── Shared Lib (Common utilities & components)
```

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-----------|
| **Framework** | Next.js |
| **Monorepo** | Nx Workspace |
| **Language** | JavaScript/TypeScript |
| **Styling** | CSS / Tailwind CSS |
| **Build Tool** | Nx / Webpack |
| **Package Manager** | npm |
| **Version Control** | Git |

## 📋 Prerequisites

### System Requirements
- **OS**: Windows 7+, macOS 10.0+, or Linux
- **RAM**: >= 8 GB recommended
- **CPU**: 2+ cores, 2+ GHz

### Software Dependencies
- **Node.js**: >= 18.19.0 (LTS)
- **npm**: >= 10.2.3
- **Git**: Latest version

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/AkshataKatwal16/pratham2.0.git
cd pratham2.0
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Install Nx Globally (Optional but Recommended)

```bash
npm install -g nx
```

## 🔧 Development

### Host Applications

#### Teachers Application
Start the Teachers application on **Port 3001**:

```bash
nx dev teachers --port=3001 --verbose
```

Access at: `http://localhost:3001`

#### Admin Application
Start the Admin application on **Port 3002**:

```bash
nx dev admin-app-repo --port=3002 --verbose
```

Access at: `http://localhost:3002`

## 🧩 Micro-Frontends

### Authentication Module
```bash
nx dev authentication --port=4101 --verbose
```
- **URL**: `http://localhost:4101/authentication/`
- **Port**: 4101
- **Purpose**: User authentication and authorization

### SCP Teacher Repository
```bash
nx dev scp-teacher-repo --port=4102 --verbose
```
- **URL**: `http://localhost:4102/scp-teacher-repo/`
- **Port**: 4102
- **Purpose**: Teacher resources and management

### YouthNet
```bash
nx dev youthNet --port=4103 --verbose
```
- **URL**: `http://localhost:4103/youthnet/`
- **Port**: 4103
- **Purpose**: Youth community and networking

## 📊 Nx Commands

### View Project Graph
Visualize the dependency graph of all projects:

```bash
nx graph
```

This generates an interactive graph showing relationships between projects.

### Build All Projects
Build all applications and libraries:

```bash
npx nx run-many --target=build --all
```

### Run Tests
Execute tests for all projects:

```bash
npx nx run-many --target=test --all
```

### Lint Code
Check code quality:

```bash
npx nx run-many --target=lint --all
```

### Run Specific Project
```bash
nx dev <project-name> --port=<port-number>
```

## 📚 Using Shared Library

The `@shared-lib` library contains common components and utilities. Import them in any project:

```typescript
import { SharedLib, ComponentName, UtilityFunction } from '@shared-lib';
```

### Adding to Shared Library

1. Create component in `libs/shared-lib/src/lib`
2. Export from `libs/shared-lib/src/index.ts`
3. Use in any application

## 🔄 Development Workflow

1. **Start Host Applications**:
   ```bash
   nx dev teachers --port=3001
   nx dev admin-app-repo --port=3002
   ```

2. **Start Micro-Frontends** (in separate terminals):
   ```bash
   nx dev authentication --port=4101
   nx dev scp-teacher-repo --port=4102
   nx dev youthNet --port=4103
   ```

3. **Access Host Apps**: Visit `http://localhost:3001` or `http://localhost:3002`

4. **Micro-Frontends** are automatically integrated and accessible from host apps

## 📁 Project Structure

```
pratham2.0/
├── apps/
│   ├── teachers/              # Teachers host app (Next.js)
│   ├── admin-app-repo/        # Admin host app (Next.js)
│   ├── authentication/        # Authentication micro-frontend
│   ├── scp-teacher-repo/      # SCP Teacher micro-frontend
│   └── youthNet/              # YouthNet micro-frontend
├── libs/
│   ├── shared-lib/            # Shared components & utilities
│   └── other-shared-libs/
├── nx.json                    # Nx configuration
├── package.json
├── tsconfig.base.json
└── README.md
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Contribution Guidelines
- Follow code style conventions
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Keep commits atomic and focused

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📧 Contact & Support

For support or questions:
- **GitHub Issues**: [Create an issue](https://github.com/AkshataKatwal16/pratham2.0/issues)
- **Email**: akshatakatwal16@email.com

## 🙏 Acknowledgments

- Nx team for the excellent monorepo setup
- Next.js community for outstanding documentation
- All contributors to this project

## 📖 Additional Resources

- [Nx Documentation](https://nx.dev)
- [Next.js Documentation](https://nextjs.org/docs)
- [Micro Frontends Guide](https://micro-frontends.org/)

---

**Building the Future of Education! 🎓**

*Last Updated: May 2026*
