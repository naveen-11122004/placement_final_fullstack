
import { useState, useEffect } from "react";
import { Droplet, Target, Trophy, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import WaterProgress from "./WaterProgress";
import QuickAddButtons from "./QuickAddButtons";
import IntakeHistory from "./IntakeHistory";

interface IntakeEntry {
  id: string;
  amount: number;
  time: string;
}

const WaterTracker = () => {
  const [dailyGoal, setDailyGoal] = useState(2000); // Default 2L
  const [currentIntake, setCurrentIntake] = useState(0);
  const [customAmount, setCustomAmount] = useState("");
  const [intakeHistory, setIntakeHistory] = useState<IntakeEntry[]>([]);
  const { toast } = useToast();

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedGoal = localStorage.getItem("waterGoal");
    const savedIntake = localStorage.getItem("currentIntake");
    const savedHistory = localStorage.getItem("intakeHistory");
    const lastReset = localStorage.getItem("lastReset");
    
    const today = new Date().toDateString();
    
    // Reset if it's a new day
    if (lastReset !== today) {
      setCurrentIntake(0);
      setIntakeHistory([]);
      localStorage.setItem("currentIntake", "0");
      localStorage.setItem("intakeHistory", JSON.stringify([]));
      localStorage.setItem("lastReset", today);
    } else {
      if (savedGoal) setDailyGoal(parseInt(savedGoal));
      if (savedIntake) setCurrentIntake(parseInt(savedIntake));
      if (savedHistory) setIntakeHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save to localStorage whenever values change
  useEffect(() => {
    localStorage.setItem("waterGoal", dailyGoal.toString());
  }, [dailyGoal]);

  useEffect(() => {
    localStorage.setItem("currentIntake", currentIntake.toString());
  }, [currentIntake]);

  useEffect(() => {
    localStorage.setItem("intakeHistory", JSON.stringify(intakeHistory));
  }, [intakeHistory]);

  const addWater = (amount: number) => {
    const newIntake = currentIntake + amount;
    setCurrentIntake(newIntake);
    
    const newEntry: IntakeEntry = {
      id: Date.now().toString(),
      amount,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setIntakeHistory(prev => [newEntry, ...prev]);

    // Show motivational toast
    const percentage = Math.round((newIntake / dailyGoal) * 100);
    if (newIntake >= dailyGoal) {
      toast({
        title: "🎉 Goal Achieved!",
        description: "Congratulations! You've reached your daily hydration goal!",
      });
    } else if (percentage >= 75) {
      toast({
        title: "💪 Almost There!",
        description: `You're at ${percentage}% of your daily goal. Keep it up!`,
      });
    } else if (percentage >= 50) {
      toast({
        title: "👍 Great Progress!",
        description: `Halfway there! ${percentage}% of your goal completed.`,
      });
    } else {
      toast({
        title: "💧 Water Added!",
        description: `Added ${amount}ml. You're doing great!`,
      });
    }
  };

  const addCustomAmount = () => {
    const amount = parseInt(customAmount);
    if (amount > 0 && amount <= 2000) {
      addWater(amount);
      setCustomAmount("");
    } else {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount between 1-2000ml",
        variant: "destructive"
      });
    }
  };

  const resetDay = () => {
    setCurrentIntake(0);
    setIntakeHistory([]);
    toast({
      title: "Day Reset",
      description: "Your daily intake has been reset to 0ml",
    });
  };

  const updateGoal = (newGoal: number) => {
    if (newGoal >= 500 && newGoal <= 5000) {
      setDailyGoal(newGoal);
      toast({
        title: "Goal Updated",
        description: `Daily goal set to ${newGoal}ml`,
      });
    }
  };

  const progressPercentage = Math.min((currentIntake / dailyGoal) * 100, 100);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Droplet className="w-8 h-8 text-blue-500" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Hydration Tracker
          </h1>
        </div>
        <p className="text-gray-600 text-lg">Stay hydrated, stay healthy! Track your daily water intake.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column - Progress and Controls */}
        <div className="space-y-6">
          {/* Progress Card */}
          <Card className="overflow-hidden">
            <CardHeader className="text-center pb-4">
              <CardTitle className="flex items-center justify-center gap-2">
                <Target className="w-5 h-5 text-blue-500" />
                Today's Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <WaterProgress 
                current={currentIntake} 
                goal={dailyGoal} 
                percentage={progressPercentage} 
              />
              <div className="mt-4 space-y-2">
                <p className="text-2xl font-bold text-gray-800">
                  {currentIntake}ml / {dailyGoal}ml
                </p>
                <p className="text-gray-600">
                  {Math.round(progressPercentage)}% of daily goal
                </p>
                {currentIntake >= dailyGoal && (
                  <div className="flex items-center justify-center gap-2 text-green-600 font-semibold">
                    <Trophy className="w-5 h-5" />
                    Goal Achieved!
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Add Buttons */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Add</CardTitle>
            </CardHeader>
            <CardContent>
              <QuickAddButtons onAddWater={addWater} />
            </CardContent>
          </Card>

          {/* Custom Amount */}
          <Card>
            <CardHeader>
              <CardTitle>Custom Amount</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label htmlFor="custom-amount">Amount (ml)</Label>
                  <Input
                    id="custom-amount"
                    type="number"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder="Enter amount..."
                    min="1"
                    max="2000"
                  />
                </div>
                <Button 
                  onClick={addCustomAmount}
                  className="mt-6 bg-blue-500 hover:bg-blue-600"
                  disabled={!customAmount || parseInt(customAmount) <= 0}
                >
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Settings and History */}
        <div className="space-y-6">
          {/* Settings Card */}
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="daily-goal">Daily Goal (ml)</Label>
                <Input
                  id="daily-goal"
                  type="number"
                  value={dailyGoal}
                  onChange={(e) => updateGoal(parseInt(e.target.value))}
                  min="500"
                  max="5000"
                  step="250"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Recommended: 2000ml (8 glasses)
                </p>
              </div>
              
              <Button 
                onClick={resetDay}
                variant="outline"
                className="w-full"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset Today
              </Button>
            </CardContent>
          </Card>

          {/* Intake History */}
          <IntakeHistory history={intakeHistory} />
        </div>
      </div>
    </div>
  );
};

export default WaterTracker;
