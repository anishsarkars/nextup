# Welcome to your NextUP project

## Project info

**URL**: nexttup.vercel.app

🌟 NextUP
NextUP is a minimal yet powerful platform designed for students to discover opportunities, collaborate on projects, and exchange skills. Whether you're looking for scholarships, hackathons, or a team to build your next big idea — NextUP has you covered.

🚀 Features
🔍 Discover
Scholarships, fellowships, and grants (GrantGuru-style filtering)

Hackathons, student-led events, and bootcamps

Personalized recommendations based on your skills and interests

🤝 Collaborate
Post your project, startup, or hackathon idea

Allow others to join or request to join projects

Smart teammate suggestions based on complementary skillsets

Real-time notifications for approvals and invites

⚡ SkillSwap & Gigs
Offer services like design, development, writing, and mentorship

Book and get booked for short-term gigs with reviews and ratings

Secure payments with Stripe integration

🧑‍🎓 User Dashboard
Track saved opportunities, active collaborations, and gigs

Minimal profile with external links (LinkedIn, GitHub, Portfolio)

Availability status and badges for milestones

🎨 UI/UX Highlights
Minimal & Modern: Soft pastel gradients, white space, and rounded edges for a clean experience

Mobile-First: Responsive design with smooth transitions and animations

Dark/Light Mode: Seamless toggle for personalized viewing

Micro-Interactions: Hover effects, toast notifications, and real-time updates

🔧 Tech Stack
Frontend: React (Vite) + TailwindCSS + ShadCN UI

Backend: Supabase (Auth, Database, Real-time Notifications)

Payments: Stripe

Deployment: Vercel

🛠️ Getting Started
Clone the repo:

bash
Copy
Edit
git clone https://github.com/your-username/nextup.git
cd nextup
Install dependencies:

bash
Copy
Edit
npm install
Configure environment variables: Create a .env file with the following:

env
Copy
Edit
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_STRIPE_PUBLIC_KEY=your-stripe-key
Run the development server:

bash
Copy
Edit
npm run dev
Deploy on Vercel:
Follow Vercel’s deployment instructions for seamless production setup.

📂 Project Structure
java
Copy
Edit
nextup/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── services/
│   ├── utils/
│   ├── styles/
│   └── assets/
├── .env
├── package.json
└── README.md
🔑 Key Functionalities
Authentication: OAuth (GitHub/Google) & email/password login

Project & Gig Posting: Step-by-step wizards for creating and managing posts

Real-time Notifications: Supabase channels for invites, approvals, and updates

Filtering & Recommendations: Skill-based matching for projects and gigs

Payment Integration: Secure Stripe checkout for gigs and bookings

📌 Inspiration & Differentiators
Inspired by platforms like:

Lu.ma

Devfolio

Unstop

Topmate

NextUP brings a unique twist with:

Skill complementarity matching

Lightweight profiles with external link focus

Streamlined project & event management

📣 Contributing
Contributions are welcome!

Fork the repo

Create a new branch

Make your changes

Submit a pull request

🙌 Acknowledgements
Designed @ Anish
Built with ❤️ for students, by students.

📄 License
MIT

🌐 Live Demo
Check out the live platform: nexttup.vercel.app

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.
