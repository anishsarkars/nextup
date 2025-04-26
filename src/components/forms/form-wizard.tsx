
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Check, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Step {
  title: string;
  description?: string;
  content: React.ReactNode;
  optional?: boolean;
}

interface FormWizardProps {
  steps: Step[];
  onComplete: () => void;
  isSubmitting?: boolean;
  submitButtonText?: string;
}

export function FormWizard({
  steps,
  onComplete,
  isSubmitting = false,
  submitButtonText = "Complete"
}: FormWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  
  const handleNext = () => {
    if (!isLastStep) {
      setCompletedSteps(prev => [...prev, currentStep]);
      setCurrentStep(prev => prev + 1);
    }
  };
  
  const handleBack = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  const handleComplete = () => {
    setCompletedSteps(prev => [...prev, currentStep]);
    onComplete();
  };
  
  const isStepCompleted = (index: number) => {
    return completedSteps.includes(index);
  };
  
  return (
    <div className="w-full">
      {/* Step indicator */}
      <div className="mb-8">
        <div className="flex justify-between">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center">
              <div 
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2",
                  currentStep === index
                    ? "border-primary bg-primary text-primary-foreground"
                    : isStepCompleted(index)
                      ? "border-green-500 bg-green-500 text-white"
                      : "border-muted bg-background text-muted-foreground"
                )}
              >
                {isStepCompleted(index) ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span className={cn(
                "text-xs mt-2 text-center hidden sm:block",
                currentStep === index
                  ? "text-primary font-medium"
                  : "text-muted-foreground"
              )}>
                {step.title}
                {step.optional && <span className="text-muted-foreground"> (Optional)</span>}
              </span>
            </div>
          ))}
        </div>
        
        {/* Progress bar */}
        <div className="relative mt-2">
          <div className="absolute h-1 bg-muted w-full rounded" />
          <motion.div
            className="absolute h-1 bg-primary rounded"
            initial={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
      
      {/* Step content */}
      <Card className="p-6 mb-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="mb-4">
              <h3 className="text-lg font-medium">{steps[currentStep].title}</h3>
              {steps[currentStep].description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {steps[currentStep].description}
                </p>
              )}
            </div>
            
            <div className="py-4">
              {steps[currentStep].content}
            </div>
          </motion.div>
        </AnimatePresence>
      </Card>
      
      {/* Navigation buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={isFirstStep}
        >
          Back
        </Button>
        
        <div className="flex gap-2">
          {steps[currentStep].optional && !isLastStep && (
            <Button
              variant="ghost"
              onClick={handleNext}
            >
              Skip
            </Button>
          )}
          
          {isLastStep ? (
            <Button 
              disabled={isSubmitting}
              onClick={handleComplete}
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {submitButtonText}
            </Button>
          ) : (
            <Button onClick={handleNext}>
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
