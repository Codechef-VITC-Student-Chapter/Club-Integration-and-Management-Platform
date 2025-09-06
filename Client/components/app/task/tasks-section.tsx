import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { LeadsTaskComponent, AddTaskDialog } from "@/components/app/task";
import { UseFormReturn } from "react-hook-form";
import { FullTask } from "@/types/api/task";

interface TaskFormData {
  title: string;
  points: number;
}

interface ITasksSection {
  tasks: FullTask[];
  isLoading: boolean;
  error: boolean;
  isCreateDialogOpen: boolean;
  setIsCreateDialogOpen: (open: boolean) => void;
  form: UseFormReturn<TaskFormData>;
  handleCreateTask: (data: TaskFormData) => Promise<void>;
  isAddingTask: boolean;
}

export const TasksSection = ({
  tasks,
  isLoading,
  error,
  isCreateDialogOpen,
  setIsCreateDialogOpen,
  form,
  handleCreateTask,
  isAddingTask,
}: ITasksSection) => {
  return (
    <div className="space-y-4">
      <div className="w-full flex justify-between">
        <h2 className="text-2xl font-semibold">Tasks</h2>
        <AddTaskDialog
          isCreateDialogOpen={isCreateDialogOpen}
          setIsCreateDialogOpen={setIsCreateDialogOpen}
          form={form}
          handleCreateTask={handleCreateTask}
          isAddingTask={isAddingTask}
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2">Loading tasks...</span>
        </div>
      ) : error ? (
        <Card>
          <CardContent className="py-6">
            <p className="text-center text-muted-foreground">
              Failed to load tasks. Please try again later.
            </p>
          </CardContent>
        </Card>
      ) : !tasks || tasks.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">No tasks found</h3>
              <p className="text-muted-foreground mb-4">
                Create your first task to get started.
              </p>
              <AddTaskDialog
                isCreateDialogOpen={isCreateDialogOpen}
                setIsCreateDialogOpen={setIsCreateDialogOpen}
                form={form}
                handleCreateTask={handleCreateTask}
                isAddingTask={isAddingTask}
              />
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((taskData) => (
            <LeadsTaskComponent key={taskData.task.id} task={taskData} />
          ))}
        </div>
      )}
    </div>
  );
};
