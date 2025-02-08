import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

const PricingPage = () => {
  return (
    <div className="min-h-screen bg-background py-20">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-muted-foreground">
            Choose the plan that's right for you
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={`
                rounded-lg p-8 
                ${plan.featured ? 'border-2 border-primary ring-2 ring-primary/10' : 'border'}
              `}
            >
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold">${plan.price}</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="text-muted-foreground mb-6">
                {plan.description}
              </p>
              <Link to={`/signup?plan=${plan.id}`}>
                <Button 
                  className="w-full mb-6"
                  variant={plan.featured ? "default" : "outline"}
                >
                  Get Started
                </Button>
              </Link>
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <div key={index}>
                <h3 className="font-semibold mb-2">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const plans = [
  {
    id: "free",
    name: "Free",
    price: 0,
    description: "Perfect for getting started",
    featured: false,
    features: [
      "Access to basic projects",
      "Community support",
      "Basic portfolio tools",
      "Limited code reviews"
    ]
  },
  {
    id: "pro",
    name: "Pro",
    price: 29,
    description: "Best for serious learners",
    featured: true,
    features: [
      "Everything in Free",
      "Unlimited projects",
      "Priority code reviews",
      "1-on-1 mentoring sessions",
      "Advanced portfolio tools",
      "Job search guidance"
    ]
  },
  {
    id: "team",
    name: "Team",
    price: 99,
    description: "For teams and organizations",
    featured: false,
    features: [
      "Everything in Pro",
      "Team collaboration",
      "Custom projects",
      "Dedicated support",
      "Team analytics",
      "API access"
    ]
  }
];

const faqs = [
  {
    question: "Can I cancel my subscription at any time?",
    answer: "Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period."
  },
  {
    question: "Do you offer student discounts?",
    answer: "Yes! Students can get 50% off any paid plan. Just verify your student status with your .edu email."
  },
  // ... more FAQs
];

export default PricingPage; 