# Glass Rental Management System

A comprehensive management system for glass rental businesses, built with React, TypeScript, and Supabase.

## Features

- **Customer Management**: Track customer details and event information
- **Inventory Management**: Manage glassware stock and pricing
- **Order Processing**: Handle rentals with status tracking
- **Stock Control**: Adjust stock levels and track damages
- **Reporting**: Generate business reports and export data
- **Dashboard**: Visualize key metrics and business performance

## Technologies Used

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Charts**: Recharts
- **Icons**: Lucide React
- **Build Tool**: Vite

## Live Demo

- Hosted URL: [https://glass-rental-management-system.vercel.app/](https://glass-rental-management-system.vercel.app/)
- Local URL: [http://localhost:5173/](http://localhost:5173/)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/glass-rental-management-system.git
   cd glass-rental-management-system
````

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with your Supabase credentials:

   ```text
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Usage

* **Login** using the demo credentials or create your own account
* **Dashboard**: View business overview and quick actions
* **Customers**: Add and manage customer information
* **Inventory**: Track glassware stock and prices
* **Orders**: Process rental orders and track status
* **Reports**: Generate and export business reports

### Demo Credentials

* **Email**: [admin@glassrental.com](mailto:admin@glassrental.com)
* **Password**: admin123

## Project Structure

```text
src/
├── components/      # React components
├── hooks/           # Custom hooks
├── lib/             # Supabase configuration
├── services/        # API services
├── types/           # TypeScript interfaces
├── utils/           # Utility functions
├── App.tsx          # Main application
└── main.tsx         # Entry point
```

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Author

Manzi Niyongira Osee
Email: [oseemanzi3@gmail.com](mailto:oseemanzi3@gmail.com)

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Acknowledgments

* Supabase for the backend services
* Vercel for hosting
* The React and TypeScript communities

