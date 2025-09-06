"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import {
  useGetTasksByDepartmentIDQuery,
  useGetLeadUserDepartmentInfoQuery,
  useAddTaskMutation,
} from "@/lib/redux";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import {
  TaskOverviewCard,
  TaskPointsBreakdownCard,
  TasksSection,
} from "@/components/app";
import { TaskInfo } from "@/types/api/task";
import { toast } from "sonner";
import { SidebarWrapper } from "@/components/layouts";
import { TaskFormData, taskSchema } from "@/lib/schemas";

export default function TasksPage() {
  const { data: session } = useSession();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Get lead user's department info
  const {
    data: departmentInfo,
    isLoading: isDepartmentLoading,
    error: departmentError,
  } = useGetLeadUserDepartmentInfoQuery(session?.user?.id || "", {
    skip: !session?.user?.id,
  });

  // Get tasks for the department
  const {
    data: tasksData,
    isLoading: isTasksLoading,
    error: tasksError,
    refetch: refetchTasks,
  } = useGetTasksByDepartmentIDQuery(departmentInfo?.department?.id || "", {
    skip: !departmentInfo?.department?.id,
  });

  const [addTask, { isLoading: isAddingTask }] = useAddTaskMutation();

  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      points: 1,
    },
  });

  const handleCreateTask = async (data: TaskFormData) => {
    if (!session?.user?.id || !departmentInfo?.department) {
      toast.error("Missing user or department information");
      return;
    }

    try {
      const taskInfo: TaskInfo = {
        title: data.title,
        points: data.points,
        club_id: departmentInfo.department.club_id,
        department_id: departmentInfo.department.id,
        created_by: session.user.id,
      };

      await addTask(taskInfo).unwrap();
      toast.success("Task created successfully!");
      setIsCreateDialogOpen(false);
      form.reset();
      refetchTasks();
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "data" in error
          ? (error.data as { message?: string })?.message
          : "Failed to create task";
      toast.error(errorMessage);
    }
  };

  // Loading state
  if (isDepartmentLoading) {
    return (
      <SidebarWrapper pageTitle="Tasks">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading department information...</span>
        </div>
      </SidebarWrapper>
    );
  }

  // Error state
  if (departmentError) {
    return (
      <SidebarWrapper pageTitle="Tasks">
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-red-600">Error</CardTitle>
              <CardDescription>
                Failed to load department information. Please try again later.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </SidebarWrapper>
    );
  }

  // No department found
  if (!departmentInfo?.department) {
    return (
      <SidebarWrapper pageTitle="Tasks">
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>No Department Found</CardTitle>
              <CardDescription>
                You are not assigned to any department as a lead.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </SidebarWrapper>
    );
  }

  return (
    <SidebarWrapper pageTitle={`${departmentInfo.department.name} Tasks`}>
      <div className="h-full w-full">
        <div className="p-6 flex flex-col gap-4 w-full h-full">
          <div className="flex flex-col md:flex-row gap-6 w-full">
            <TaskOverviewCard tasks={tasksData?.tasks || []} />
            <TaskPointsBreakdownCard tasks={tasksData?.tasks || []} />
          </div>
          <div className="overflow-hidden relative h-full w-full">
            <TasksSection
              tasks={tasksData?.tasks || []}
              isLoading={isTasksLoading}
              error={!!tasksError}
              isCreateDialogOpen={isCreateDialogOpen}
              setIsCreateDialogOpen={setIsCreateDialogOpen}
              form={form}
              handleCreateTask={handleCreateTask}
              isAddingTask={isAddingTask}
            />
          </div>
        </div>
      </div>
    </SidebarWrapper>
  );
}
