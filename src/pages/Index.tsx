import { useState, useRef } from "react";
import HeroSection from "@/components/HeroSection";
import WorkoutForm from "@/components/WorkoutForm";
import ResultsSection from "@/components/ResultsSection";
import WhySection from "@/components/WhySection";
import Footer from "@/components/Footer";
import { generateWorkoutPlan, type WorkoutInput, type WorkoutPlan } from "@/lib/workoutGenerator";

const Index = () => {
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const [lastInput, setLastInput] = useState<WorkoutInput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleGenerate = (input: WorkoutInput) => {
    setIsLoading(true);
    setPlan(null);
    setTimeout(() => {
      const result = generateWorkoutPlan(input);
      setPlan(result);
      setLastInput(input);
      setIsLoading(false);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }, 800);
  };

  return (
    <div className="min-h-screen">
      <HeroSection />
      <WorkoutForm onGenerate={handleGenerate} isLoading={isLoading} />

      <div ref={resultsRef}>
        {plan && lastInput && <ResultsSection plan={plan} input={lastInput} />}
      </div>

      <WhySection />
      <Footer />
    </div>
  );
};

export default Index;
