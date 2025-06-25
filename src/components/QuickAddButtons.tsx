
import { Button } from "@/components/ui/button";
import { Droplet } from "lucide-react";

interface QuickAddButtonsProps {
  onAddWater: (amount: number) => void;
}

const QuickAddButtons = ({ onAddWater }: QuickAddButtonsProps) => {
  const quickAmounts = [
    { amount: 250, label: "Glass", subtitle: "250ml" },
    { amount: 500, label: "Bottle", subtitle: "500ml" },
    { amount: 750, label: "Large", subtitle: "750ml" },
    { amount: 1000, label: "Liter", subtitle: "1000ml" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {quickAmounts.map(({ amount, label, subtitle }) => (
        <Button
          key={amount}
          onClick={() => onAddWater(amount)}
          variant="outline"
          className="h-20 flex flex-col items-center justify-center gap-1 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 hover:scale-105"
        >
          <Droplet className="w-5 h-5 text-blue-500" />
          <div className="text-center">
            <div className="font-semibold text-sm">{label}</div>
            <div className="text-xs text-gray-500">{subtitle}</div>
          </div>
        </Button>
      ))}
    </div>
  );
};

export default QuickAddButtons;
