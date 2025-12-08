"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Textarea,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Badge,
  Separator,
} from "@/components/ui";
import {
  Plus,
  X,
  Link,
  Send,
  Users,
  Building2,
  Target,
  FileText,
  Group,
} from "lucide-react";
import {
  useGetClubInfoQuery,
  useGetAllClubDepartmentsQuery,
  useGetDepartmentLeadsQuery,
  useGetTasksByDepartmentIDQuery,
  useAddContributionMutation,
} from "@/lib/redux";
import { toast } from "sonner";
import { useEffect, useState, useMemo } from "react";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SidebarWrapper } from "@/components/layouts";
import { normalizeUrl } from "@/lib/utils";

type Lead = { user_id: string; name: string };

interface FormValues {
  department: string;
  selectedTask: string; // Task ID
  title: string;
  description: string;
  links: { url: string }[];
  selectedPoints: string;
  customPoints: number;
  multiplier: number;
  selectedLeads: Lead[];
  isCustomTask: boolean; // Whether user wants to enter custom title/points
}

const RequestScreen = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>("");
  const [availableLeads, setAvailableLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<string>("");
  const [isCustomPoints, setIsCustomPoints] = useState(false);
  const [isCustomTask, setIsCustomTask] = useState(false);

  const clubId = "codechefvitc"; // Hard-coded club ID

  // Redux API queries
  const { data: clubInfo, isLoading: isClubLoading } =
    useGetClubInfoQuery(clubId);
  const { data: departmentsData, isLoading: isDepartmentsLoading } =
    useGetAllClubDepartmentsQuery(clubId);
  const {
    data: leadsData,
    isLoading: isLeadsLoading,
    isError: isLeadsError,
    error: leadsError,
  } = useGetDepartmentLeadsQuery(selectedDepartmentId, {
    skip: !selectedDepartmentId,
  });
  const { data: tasksData, isLoading: isTasksLoading } =
    useGetTasksByDepartmentIDQuery(selectedDepartmentId, {
      skip: !selectedDepartmentId,
    });
  const [addContribution, { isLoading: isSubmitting }] =
    useAddContributionMutation();

  const form = useForm<FormValues>({
    defaultValues: {
      department: "",
      selectedTask: "",
      title: "",
      description: "",
      links: [{ url: "" }],
      selectedPoints: "",
      customPoints: 0,
      multiplier: 1,
      selectedLeads: [],
      isCustomTask: false,
    },
  });

  const { control, handleSubmit, setValue, watch, reset, register } = form;
  const {
    fields: linkFields,
    append: appendLink,
    remove: removeLink,
  } = useFieldArray({
    control,
    name: "links",
  });

  const watchedSelectedLeads = watch("selectedLeads");
  const selectedLeads = useMemo(
    () => watchedSelectedLeads || [],
    [watchedSelectedLeads]
  );
  const selectedTask = watch("selectedTask");

  // Update available leads when department or leads data changes
  useEffect(() => {
    if (leadsData) {
      const leads = leadsData.leads || [];
      const filteredLeads = leads.filter(
        (lead) =>
          !selectedLeads.some((selected) => selected.user_id === lead.user_id)
      );
      setAvailableLeads(filteredLeads);
    } else {
      setAvailableLeads([]);
    }
  }, [leadsData, selectedLeads]);

  const addLead = () => {
    if (!selectedLead) {
      toast.error("Please select a lead to add");
      return;
    }

    const leadToAdd = availableLeads.find(
      (lead) => lead.user_id === selectedLead
    );
    if (!leadToAdd) {
      toast.error("Lead not found");
      return;
    }

    setValue("selectedLeads", [...selectedLeads, leadToAdd]);
    setSelectedLead("");
    toast.success("Lead added successfully");
  };

  const removeLead = (leadId: string) => {
    setValue(
      "selectedLeads",
      selectedLeads.filter((lead) => lead.user_id !== leadId)
    );
    toast.success("Lead removed successfully");
  };

  const handleDepartmentChange = (value: string) => {
    setValue("department", value);
    setSelectedDepartmentId(value);
    setValue("selectedLeads", []); // Reset selected leads
    setValue("selectedTask", ""); // Reset selected task
    setValue("title", ""); // Reset title
    setValue("selectedPoints", ""); // Reset selected points
    setValue("isCustomTask", false); // Reset custom task flag
    setIsCustomPoints(false);
    setIsCustomTask(false);
  };

  const handleTaskChange = (value: string) => {
    if (value === "custom") {
      setValue("isCustomTask", true);
      setValue("selectedTask", "");
      setValue("title", "");
      setValue("selectedPoints", "");
      setIsCustomTask(true);
    } else {
      setValue("isCustomTask", false);
      setValue("selectedTask", value);
      setIsCustomTask(false);

      // Find the selected task and auto-fill title and points
      const selectedTaskData = tasksData?.tasks?.find(
        (task) => task.task.id === value
      );
      if (selectedTaskData) {
        setValue("title", selectedTaskData.task.title);
        setValue("selectedPoints", selectedTaskData.task.points.toString());
      }
    }
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    // Validation
    if (!data.department) {
      toast.error("Please select a department");
      return;
    }
    if (data.selectedLeads.length === 0) {
      toast.error("Please select at least one lead");
      return;
    }
    if (!data.title.trim()) {
      toast.error("Please enter a title");
      return;
    }
    if (!data.description.trim()) {
      toast.error("Please enter a description");
      return;
    }

    // Validation for custom tasks
    if (isCustomTask) {
      if (!data.customPoints || data.customPoints <= 0) {
        toast.error("Please enter valid custom points");
        return;
      }
      if (data.customPoints > 100) {
        toast.error("Custom points cannot exceed 100");
        return;
      }
    } else if (!selectedTask) {
      // For non-custom tasks, validate points selection
      if (!data.selectedPoints && !isCustomPoints) {
        toast.error("Please select points or enter custom points");
        return;
      }
      if (isCustomPoints && (!data.customPoints || data.customPoints <= 0)) {
        toast.error("Please enter valid custom points");
        return;
      }
    }

    // Calculate final points based on task selection or custom points
    let finalPoints = 0;
    if (isCustomTask) {
      // Custom task - use custom points directly
      finalPoints = data.customPoints;
    } else if (selectedTask) {
      // Selected task - use task points with multiplier
      finalPoints =
        parseInt(data.selectedPoints || "0") * (data.multiplier || 1);
    } else {
      // Fallback to department points (for backward compatibility)
      finalPoints = isCustomPoints
        ? data.customPoints
        : Number(data.selectedPoints) * (data.multiplier || 1);
    }

    const contributionData = {
      user_id: session?.user?.id || "",
      title: data.title,
      points: finalPoints,
      description: data.description,
      proof_files: data.links
        .map((link) => {
          const url = link.url.trim();
          if (!url) return "";
          // Ensure URL is absolute using the utility function
          return normalizeUrl(url);
        })
        .filter(Boolean),
      target: data.selectedLeads[0].user_id, // Primary lead
      sec_targets: data.selectedLeads.slice(1).map((lead) => lead.user_id),
      club_id: clubId,
      department: data.department,
    };

    try {
      await addContribution(contributionData).unwrap();
      toast.success("Request submitted successfully!");
      reset();
      setSelectedDepartmentId("");
      setIsCustomPoints(false);
      setIsCustomTask(false);
      setSelectedLead("");
      router.push("/dashboard/requests");
    } catch (error) {
      toast.error("Failed to submit request");
      console.error("Submit error:", error);
    }
  };

  if (isClubLoading || isDepartmentsLoading) {
    return (
      <SidebarWrapper pageTitle="Submit a Request">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Loading...</p>
          </div>
        </div>
      </SidebarWrapper>
    );
  }

  return (
    <SidebarWrapper pageTitle="Submit a Request">
      <div className="container mx-auto px-4 pb-6 max-w-4xl">
        {/* Club Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Club Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium">
              {clubInfo?.club?.name || "CodeChef VITC Student Chapter"}
            </p>
          </CardContent>
        </Card>

        {/* Main Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Request Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Department Selection */}
              <div className="space-y-2 w-full">
                <Label htmlFor="department">
                  <Group className="size-5" />
                  Department *
                </Label>
                <Select onValueChange={handleDepartmentChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a department" />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    {departmentsData?.departments?.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {selectedDepartmentId && (
                <div className="space-y-4">
                  <Label className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Assign Leads *
                  </Label>

                  <div className="flex gap-2">
                    <Select
                      value={selectedLead}
                      onValueChange={setSelectedLead}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select a lead to add" />
                      </SelectTrigger>
                      <SelectContent>
                        {isLeadsLoading ? (
                          <SelectItem value="loading" disabled>
                            Loading leads...
                          </SelectItem>
                        ) : isLeadsError ? (
                          <SelectItem value="error" disabled>
                            Error loading leads
                          </SelectItem>
                        ) : availableLeads.length === 0 ? (
                          <SelectItem value="empty" disabled>
                            No leads available
                          </SelectItem>
                        ) : (
                          availableLeads.map((lead) => (
                            <SelectItem key={lead.user_id} value={lead.user_id}>
                              {lead.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      onClick={addLead}
                      disabled={!selectedLead || isLeadsLoading}
                      size="icon"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Selected Leads */}
                  {selectedLeads.length > 0 && (
                    <div className="space-y-2">
                      <Label>Selected Leads:</Label>
                      <div className="flex flex-wrap gap-2">
                        {selectedLeads.map((lead) => (
                          <Badge
                            key={lead.user_id}
                            variant="secondary"
                            className="px-3 py-1"
                          >
                            {lead.name}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="ml-2 h-auto p-0 text-gray-500 hover:text-red-500"
                              onClick={() => removeLead(lead.user_id)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Task Selection */}
              {selectedDepartmentId && (
                <div className="space-y-4">
                  <Label className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Select Task or Create Custom *
                  </Label>

                  <Select onValueChange={handleTaskChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a task or create custom" />
                    </SelectTrigger>
                    <SelectContent>
                      {isTasksLoading ? (
                        <SelectItem value="loading" disabled>
                          Loading tasks...
                        </SelectItem>
                      ) : (
                        <>
                          {tasksData?.tasks
                            ?.filter((t) => t.task.is_active)
                            .map((task) => (
                              <SelectItem
                                key={task.task.id}
                                value={task.task.id}
                              >
                                {task.task.title} - {task.task.points} points
                              </SelectItem>
                            ))}
                          <SelectItem value="custom">
                            Create Custom Task
                          </SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Separator />

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">
                  Title *{" "}
                  {!isCustomTask && selectedTask && "(Auto-filled from task)"}
                </Label>
                <Input
                  id="title"
                  placeholder="Enter contribution title"
                  {...register("title", { required: true })}
                  readOnly={!isCustomTask && !!selectedTask}
                  className={
                    !isCustomTask && !!selectedTask ? "bg-gray-50" : ""
                  }
                />
              </div>
              {/* Task Points Display */}
              {selectedTask && !isCustomTask && (
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Points (From Selected Task)
                  </Label>
                  <div className="flex flex-col sm:flex-row items-center gap-4 p-3 bg-green-50 border border-green-200 rounded-md">
                    <span className="text-green-800 font-medium">
                      Points: {watch("selectedPoints")}
                    </span>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="multiplier" className="text-green-700">
                        No.of times you did:
                      </Label>
                      <Input
                        id="multiplier"
                        type="number"
                        min={1}
                        defaultValue={1}
                        className="w-20"
                        {...register("multiplier", {
                          valueAsNumber: true,
                          min: 1,
                        })}
                      />
                    </div>
                    <span className="text-green-800 font-bold">
                      Total:{" "}
                      {parseInt(watch("selectedPoints") || "0") *
                        (watch("multiplier") || 1)}{" "}
                      points
                    </span>
                  </div>
                </div>
              )}
              {/* Points Section */}
              {selectedDepartmentId && isCustomTask && (
                <div className="space-y-4">
                  <Label className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Custom Points (Max 100) *
                  </Label>
                  <Input
                    id="customPoints"
                    type="number"
                    min={1}
                    max={100}
                    placeholder="Enter points (1-100)"
                    {...register("customPoints", {
                      valueAsNumber: true,
                      min: 1,
                      max: 100,
                      required: "Please enter custom points",
                    })}
                  />
                  <p className="text-sm text-gray-600">
                    Enter the points you believe this contribution deserves
                    (maximum 100 points)
                  </p>
                </div>
              )}

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your contribution in detail"
                  rows={4}
                  {...register("description", { required: true })}
                />
              </div>

              {/* Proof Links */}
              <div className="space-y-4">
                <div>
                  <Label className="flex items-center gap-2">
                    <Link className="h-4 w-4" />
                    Proof Links
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Add links to your work proof (Google Drive, GitHub, etc.).
                    Links will open in a new tab.
                  </p>
                </div>

                <div className="space-y-2">
                  {linkFields.map((field, index) => (
                    <div key={field.id} className="flex gap-2">
                      <Input
                        placeholder="https://drive.google.com/... or drive.google.com/..."
                        {...register(`links.${index}.url` as const)}
                        className="flex-1"
                      />
                      {linkFields.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeLink(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => appendLink({ url: "" })}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another Link
                </Button>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Request
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </SidebarWrapper>
  );
};

export default RequestScreen;
