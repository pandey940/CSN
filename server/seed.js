const mongoose = require('mongoose');
const Note = require('./models/Note');
const User = require('./models/User');

const mongoURI = 'mongodb://127.0.0.1:27017/academic-curator';

const sampleNotes = [
    {
        title: "Triple Integrals & Polar Coordinates Master Guide",
        description: "Complete set of notes covering multivariate integration with worked examples and exam patterns from last 5 years.",
        subject: "Advanced Calculus",
        college: "Stanford University",
        course: "B.Tech",
        branch: "Computer Science",
        semester: 3,
        fileType: "PDF",
        status: "Approved",
        author: "Prof. Aris T.",
        fileUrl: "https://example.com/notes1.pdf",
        thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuDRnvvksimOikm30ok2Yu5Y5LgAEi5y1e_L66JZnhTmgYUCvAGKH9SjkhvSiZaKhvwCwm1x-dMygjgjc7ZyZSkks7ubYec8sqi465Pujp5akzPvWhwlwuR2AN3YKrhhijvPj0dKUle3WZjuvXOZAIM7qFhvWpfFGn2UfH-5FH9qvnj90oUkcOzJ8XwmqhFjE5BngqYAHc8nQuze-0lxFTRwCUwjh5FW4eSXY2e_KaJWWizrZl1fBGUJUJUt9Mv7Q-dCygEIKPX1FW1i"
    },
    {
        title: "Vector Calculus: Green's & Stokes' Theorem",
        description: "Extremely neat handwritten notes with color-coded diagrams for visualizing 3D vector fields.",
        subject: "Advanced Calculus",
        college: "MIT",
        course: "B.Tech",
        branch: "Mechanical Engineering",
        semester: 4,
        fileType: "Handwritten",
        status: "Approved",
        author: "Sarah Jenkins",
        fileUrl: "https://example.com/notes2.pdf",
        thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuCNB8OTLdGKcUiR19ZnSfkEh2sCznnGk72Kdq-QB7yTpxGTkLBm_g1q6Hvs9nf1CeOnrqUCo9BLU5vh_bsn5D8zlqzZhO4TKkUfhCelbT0JS6ttWqCxxZw6_WPZvqSAZAf6U-tkh7km0u_VI2Z4QA-XHYbgsbUnkYTBEkRqRnbZHqCB_aVjGBwSBRA5n2CSPrbzxnny5HV8bs-I2TlmMQqSPSSQ_8TLtvcLL5gYaFdSTolMRhg3MnbOyt7WdXcs_s1nrmI80nPMp6OB"
    },
    {
        title: "Thermodynamics Lab Notes - Final Week",
        description: "Comprehensive notes on enthalpy and entropy cycles with hand-drawn diagrams from Professor Stein's lecture.",
        subject: "Thermodynamics",
        college: "MIT",
        course: "B.Tech",
        branch: "Mechanical Engineering",
        semester: 4,
        fileType: "PDF",
        status: "Pending",
        author: "Alex Rivera",
        fileUrl: "https://example.com/notes3.pdf",
        thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuDRnvvksimOikm30ok2Yu5Y5LgAEi5y1e_L66JZnhTmgYUCvAGKH9SjkhvSiZaKhvwCwm1x-dMygjgjc7ZyZSkks7ubYec8sqi465Pujp5akzPvWhwlwuR2AN3YKrhhijvPj0dKUle3WZjuvXOZAIM7qFhvWpfFGn2UfH-5FH9qvnj90oUkcOzJ8XwmqhFjE5BngqYAHc8nQuze-0lxFTRwCUwjh5FW4eSXY2e_KaJWWizrZl1fBGUJUJUt9Mv7Q-dCygEIKPX1FW1i"
    }
];

async function seedDB() {
    try {
        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB for seeding...');

        await Note.deleteMany({});
        await Note.insertMany(sampleNotes);
        
        console.log('Database seeded successfully!');
        mongoose.disconnect();
    } catch (err) {
        console.error('Error seeding database:', err);
    }
}

seedDB();
