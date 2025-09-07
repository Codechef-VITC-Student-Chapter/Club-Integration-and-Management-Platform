"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Edit, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Button,
  Switch,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Badge,
} from "@/components/ui";
import { useUpdateTaskMutation, useDeleteTaskMutation } from "@/lib/redux/api";
import { FullTask, TaskUpdateInfo } from "@/types";
import { toast } from "sonner";

interface LeadsTaskComponentProps {
  task: FullTask;
}

export function LeadsTaskComponent({ task }: LeadsTaskComponentProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();
  const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation();

  const updateForm = useForm<TaskUpdateInfo>({
    defaultValues: {
      title: task.task.title,
      points: task.task.points,
      is_active: task.task.is_active,
    },
  });

  const handleUpdate = async (data: TaskUpdateInfo) => {
    try {
      await updateTask({
        id: task.task.id,
        data,
      }).unwrap();

      toast.success("Task updated successfully!");
      setIsEditDialogOpen(false);
      updateForm.reset();
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "data" in error
          ? (error.data as { message?: string })?.message
          : "Failed to update task";
      toast.error(errorMessage);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTask(task.task.id).unwrap();
      toast.success("Task deleted successfully!");
      setIsDeleteDialogOpen(false);
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "data" in error
          ? (error.data as { message?: string })?.message
          : "Failed to delete task";
      toast.error(errorMessage);
    }
  };

  const handleToggleActive = async (checked: boolean) => {
    try {
      await updateTask({
        id: task.task.id,
        data: { is_active: checked },
      }).unwrap();

      toast.success(
        `Task ${checked ? "activated" : "deactivated"} successfully!`
      );
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "data" in error
          ? (error.data as { message?: string })?.message
          : "Failed to update task status";
      toast.error(errorMessage);
    }
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold">
              {task.task.title}
            </CardTitle>
            <CardDescription>
              {task.department_name && (
                <span className="text-sm text-muted-foreground">
                  {task.department_name}
                </span>
              )}
            </CardDescription>
          </div>

          <div className="flex gap-2">
            <Button onClick={() => setIsEditDialogOpen(true)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant={"destructive"}
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="font-semibold">
              {task.task.points} points
            </Badge>
            {task.club_name && (
              <span className="text-sm text-muted-foreground">
                {task.club_name}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center space-x-2">
              <Switch
                checked={task.task.is_active}
                onCheckedChange={handleToggleActive}
                disabled={isUpdating}
              />
              <span className="text-sm font-medium">
                {task.task.is_active ? "Active" : "Inactive"}
              </span>
            </div>
            <Badge
              variant={task.task.is_active ? "default" : "secondary"}
              className="text-xs"
            >
              {task.task.is_active ? "Live" : "Paused"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Edit Task Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>
              Make changes to the task details here.
            </DialogDescription>
          </DialogHeader>
          <Form {...updateForm}>
            <form
              onSubmit={updateForm.handleSubmit(handleUpdate)}
              className="space-y-4"
            >
              <FormField
                control={updateForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter task title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={updateForm.control}
                name="points"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Points</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        placeholder="Enter points"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={updateForm.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Task Status</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Enable or disable this task for members
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? "Updating..." : "Update Task"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{task.task.title}&quot;?
              <br />
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
