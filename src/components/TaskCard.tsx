import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TaskCardProps {
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  estimatedTime: string;
  onClick: () => void;
}

const TaskCard = ({ title, description, difficulty, estimatedTime, onClick }: TaskCardProps) => {
  const difficultyColor = {
    Easy: "bg-green-500/10 text-green-500",
    Medium: "bg-yellow-500/10 text-yellow-500",
    Hard: "bg-red-500/10 text-red-500",
  }[difficulty];

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer" onClick={onClick}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{title}</CardTitle>
          <Badge className={difficultyColor}>{difficulty}</Badge>
        </div>
        <CardDescription className="mt-2">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="w-4 h-4 mr-1" />
            {estimatedTime}
          </div>
          <Button variant="ghost" size="sm">
            Start Task <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;