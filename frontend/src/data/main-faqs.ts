export interface FAQItem {
  question: string;
  answer: string;
  category: "General" | "Security" | "Pricing" | "AI";
}

export const mainFAQs: FAQItem[] = [
  {
    category: "General",
    question: "What is Mentiscope and how does it help my child?",
    answer: "Mentiscope is an AI-powered growth intelligence platform that analyzes your child's learning patterns, habits, and well-being. Unlike traditional reports that focus on grades, we provide predictive insights to help you support your child's development before challenges become problems."
  },
  {
    category: "AI",
    question: "How does AI-powered learning analysis work?",
    answer: "Our proprietary neural engine processes data across 9 developmental dimensions. It uses advanced pattern recognition to identify strengths, growth areas, and learning preferences, grounded in peer-reviewed educational psychology and neuroscience research."
  },
  {
    category: "General",
    question: "Is Mentiscope suitable for all grade levels?",
    answer: "Yes, Mentiscope is designed for students from Grade 1 through Grade 12. The analysis models and recommendations are age-appropriate and adjust dynamically as your child grows and matures."
  },
  {
    category: "Pricing",
    question: "How much does Mentiscope cost?",
    answer: "We offer both free trial assessments and premium subscription plans. Our goal is to make growth intelligence accessible to every parent. Check our Pricing page for specific package details tailored to your family's needs."
  },
  {
    category: "Security",
    question: "Is my child's data safe and private?",
    answer: "Security is our highest protocol. We use end-to-end encryption and are fully COPPA compliant. We never 'label' or diagnose children; our data is strictly used to provide supportive guidance for parents. Your data is your own."
  },
  {
    category: "General",
    question: "How quickly will I see results?",
    answer: "Initial insights are available immediately after the first assessment. As you use the platform for weekly check-ins, our predictive accuracy increases, providing you with a 90-day trajectory of your child's growth within the first month."
  }
];
