
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplet, Clock } from "lucide-react";

interface IntakeEntry {
  id: string;
  amount: number;
  time: string;
}

interface IntakeHistoryProps {
  history: IntakeEntry[];
}

const IntakeHistory = ({ history }: IntakeHistoryProps) => {
  if (history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-500" />
            Today's Intake
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Droplet className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No water recorded yet today.</p>
            <p className="text-sm">Start hydrating!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-500" />
          Today's Intake
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {history.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                  <Droplet className="w-5 h-5 text-white" fill="currentColor" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{entry.amount}ml</p>
                  <p className="text-sm text-gray-600">{entry.time}</p>
                </div>
              </div>
              <div className="text-sm text-blue-600 font-medium">
                +{entry.amount}ml
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default IntakeHistory;
