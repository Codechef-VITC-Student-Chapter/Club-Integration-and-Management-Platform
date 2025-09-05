"use client";

import { useEffect } from "react";
import {
  useForm,
  FormProvider,
  SubmitHandler,
} from "react-hook-form";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";
import EditLinks from "./EditLinks";
import SidebarWrapper from "@/components/layouts/sidebar/sidebar-wrapper";

type Lead = { user_id: string; name: string };
type Department = { id: string; name: string };
type PointOption = { label: string; value: number };

interface FormValues {
  // visible inputs
  department: string;
  lead: string; // transient select value for adding a lead
  title: string;
  description: string;
  links: { url: string }[];
  selectedPoints: string;
  customPoints: number;
  multiplier: number;

  // UI flags kept in form state (no useState)
  isELopen: boolean;
  choseCustom: boolean;

  // fetched data kept in form state (no useState)
  clubId: string;
  clubName: string;
  departments: Department[];
  leadsList: Lead[];
  selectedLeads: Lead[];
  availablePoints: PointOption[];
}

const departmentPoints: Record<string, PointOption[]> = {
  smandc: [
    { label: "Technical Writing - 3 Points/Publish", value: 3 },
    { label: "Reel Script Implemented - 4 Points", value: 4 },
  ],
  design: [
    { label: "Poster Design - 7 Points", value: 7 },
    { label: "Story Design - 7 Points", value: 7 },
  ],
};

const RequestScreen = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const baseURL = process.env.NEXT_PUBLIC_API_URL || "";
  const token = session?.user?.accessToken || "";
  const currentUser =
    session?.user?.first_name && session?.user?.last_name
      ? `${session.user.first_name}${session.user.last_name}`
      : "Loading....";

  const methods = useForm<FormValues>({
    defaultValues: {
      // visible inputs
      department: "",
      lead: "",
      title: "",
      description: "",
      links: [{ url: "" }],
      selectedPoints: "",
      customPoints: 0,
      multiplier: 1,

      // UI flags
      isELopen: false,
      choseCustom: false,

      // fetched data
      clubId: "",
      clubName: "",
      departments: [],
      leadsList: [],
      selectedLeads: [],
      availablePoints: [],
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    getValues,
  } = methods;

  const depChosen = watch("department");
  const selectedPoints = watch("selectedPoints");
  const choseCustom = watch("choseCustom");
  const availablePoints = watch("availablePoints") || [];
  const leadsList = watch("leadsList") || [];
  const selectedLeads = watch("selectedLeads") || [];
  const isELopen = watch("isELopen");

  // Fetch club details
  useEffect(() => {
    const fetchClubDetails = async () => {
      if (!baseURL || !token) return;
      try {
        const id = "codechefvitc";
        const response = await fetch(`${baseURL}/club/info/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Failed to fetch club details");
        const data = await response.json();
        setValue("clubId", data.club?.id ?? "codechefvitc");
        setValue("clubName", data.club?.name ?? "");
      } catch (error) {
        toast.error("Unable to load club details"); // notify failure
      }
    };
    fetchClubDetails();
  }, [baseURL, token, setValue]);
 
  // Fetch departments
  useEffect(() => {
    const fetchDepsDetails = async () => {
      if (!baseURL || !token || !getValues("clubId")) {
        console.log("Missing baseURL, token, or clubId");
        return;
      };
      try {
        const id = "codechefvitc";
        const response = await fetch(
          `${baseURL}/club/info/all/departments/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!response.ok) throw new Error("Failed to fetch departments");
        const data = await response.json();
        setValue("departments", data.departments ?? []);
      } catch (error) {
        toast.error("Unable to load departments"); // notify failure
      }
    };
    fetchDepsDetails();
  }, [baseURL, token, setValue, getValues("clubId")]);

  const getDepartmentLeads = async (dep_id: string) => {
    try {
      const response = await fetch(`${baseURL}/department/leads/${dep_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch department leads");
      const data = await response.json();
      setValue("leadsList", data.leads ?? []);
      setValue("selectedLeads", []); // reset selection on department change
      setValue("availablePoints", departmentPoints[dep_id] || []);
      setValue("selectedPoints", "");
      setValue("customPoints", 0);
      setValue("multiplier", 1);
      setValue("choseCustom", false);
    } catch (error) {
      toast.error("Unable to load department leads"); // notify failure
    }
  };

  const addSelectedLead = () => {
    const chosenId = getValues("lead");
    if (!chosenId) {
      toast.error("Select a lead to add");
      return;
    }
    const allLeads = getValues("leadsList") || [];
    const selLeads = getValues("selectedLeads") || [];
    const found = allLeads.find((l: Lead) => l.user_id === chosenId);
    if (!found) {
      toast.error("Lead not found or already selected");
      return;
    }
    setValue(
      "selectedLeads",
      [...selLeads, found].filter(
        (v, i, arr) => arr.findIndex((x) => x.user_id === v.user_id) === i
      ),
      { shouldDirty: true }
    );
    setValue(
      "leadsList",
      allLeads.filter((l: Lead) => l.user_id !== chosenId),
      { shouldDirty: true }
    );
    setValue("lead", "");
    toast.success("Lead added");
  };

  const removeSelectedLead = (user_id: string) => {
    const allLeads = getValues("leadsList") || [];
    const selLeads = getValues("selectedLeads") || [];
    const removed = selLeads.find((l: Lead) => l.user_id === user_id);
    if (!removed) return;
    setValue("selectedLeads", selLeads.filter((l: Lead) => l.user_id !== user_id), { shouldDirty: true });
    setValue("leadsList", [...allLeads, removed], { shouldDirty: true });
    toast.success("Lead removed");
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    console.log("Form data:", data);
    // validations
    if (!data.department) {
      toast.error("Please select the department");
      return;
    }
    if ((data.selectedLeads || []).length === 0) {
      toast.error("Please select at least one lead");
      return;
    }
    if (!data.title.trim()) {
      toast.error("Please enter the title");
      return;
    }
    if (!data.description.trim()) {
      toast.error("Please enter the description");
      return;
    }
    if (!data.selectedPoints && !data.choseCustom) {
      toast.error("Please select the points requested");
      return;
    }
    

    const finalPoints = !data.choseCustom
      ? Number(data.selectedPoints) * (data.multiplier || 1)
      : Number(data.customPoints || 0);

    const payload = {
      user_id: currentUser,
      title: data.title,
      points: finalPoints,
      description: data.description,
      proof_files: (data.links || [])
        .map((l) => l?.url?.trim())
        .filter(Boolean),
      target: (data.selectedLeads || []).map((l) => l.user_id),
      sec_targets: (data.selectedLeads || []).map((l) => l.user_id).slice(1) || [],
      club_id: data.clubId,
      department: data.department,
      status: "pending",
      created_at: new Date().toISOString(),
    };

    await toast.promise(
      (async () => {
        const response = await fetch(`${baseURL}/contribution/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error("Failed to submit the request");
        return response.json();
      })(),
      {
        loading: "Submitting request...",
        success: "Request submitted successfully!",
        error: "Failed to submit the request",
      }
    );

    reset({
      department: "",
      lead: "",
      title: "",
      description: "",
      links: [{ url: "" }],
      selectedPoints: "",
      customPoints: 0,
      multiplier: 1,
      isELopen: false,
      choseCustom: false,
      clubId: getValues("clubId"),
      clubName: getValues("clubName"),
      departments: getValues("departments"),
      leadsList: [],
      selectedLeads: [],
      availablePoints: [],
    });
    router.refresh();
  };

  return (
    <SidebarWrapper pageTitle="New Request">
    <FormProvider {...methods}>
      <div className="min-h-screen p-5">
        <Toaster richColors position="top-right" />
        <div className="bg-[#E9F1FE] min-h-screen pt-4">
          <h1 className="text-center text-2xl py-4">SUBMIT A REQUEST</h1>
          <div className="mx-4 md:mx-auto max-w-4xl">
            <div className="bg-white rounded-3xl p-6 shadow-md">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                  Club: <b>{watch("clubName") || "Loading..."}</b>
                </div>

                {/* Department */}
                <div className="mb-4">
                  <label className="block mb-2">Department:</label>
                  <select
                    {...register("department")}
                    onChange={(e) => {
                      const val = e.target.value;
                      setValue("department", val, { shouldDirty: true });
                      if (val) getDepartmentLeads(val);
                    }}
                    className="w-full p-2 rounded border"
                  >
                    <option value="">Select Department</option>
                    {(watch("departments") || []).map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Lead selection */}
                <div className="mb-4">
                  <label className="block mb-2">Assign Lead(s):</label>
                  <div className="flex gap-2">
                    <select
                      {...register("lead")}
                      className="w-full p-2 rounded border"
                      disabled={!depChosen || leadsList.length === 0}
                    >
                      <option value="">Select lead</option>
                      {leadsList.map((l) => (
                        <option key={l.user_id} value={l.user_id}>
                          {l.name}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={addSelectedLead}
                      className="px-3 py-2 bg-blue-500 text-white rounded"
                      disabled={!depChosen}
                    >
                      Add
                    </button>
                  </div>

                  {/* Selected leads list */}
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedLeads.map((l) => (
                      <span
                        key={l.user_id}
                        className="inline-flex items-center gap-2 px-2 py-1 bg-blue-50 text-blue-700 rounded"
                      >
                        {l.name}
                        <button
                          type="button"
                          onClick={() => removeSelectedLead(l.user_id)}
                          className="text-red-500"
                          aria-label={`Remove ${l.name}`}
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div className="mb-4">
                  <label>Title:</label>
                  <input
                    {...register("title")}
                    className="w-full p-2 border rounded"
                  />
                </div>

                {/* Description */}
                <div className="mb-4">
                  <label>Description:</label>
                  <textarea
                    {...register("description")}
                    rows={4}
                    className="w-full p-2 border rounded"
                  />
                </div>

                {/* Links */}
                <div className="mb-4">
                  <label>Proof Links:</label>
                  <input
                    {...register(`links.0.url` as const)}
                    className="w-full p-2 border rounded"
                    placeholder="https://drive.google.com/..."
                  />
                  <button
                    type="button"
                    onClick={() => setValue("isELopen", true)}
                    className="text-blue-500 text-sm mt-1"
                  >
                    Edit Links
                  </button>
                </div>

                {/* Points */}
                <div className="mb-4">
                  <label>Points Requested:</label>
                  <select
                    {...register("selectedPoints")}
                    onChange={(e) => {
                      if (e.target.value === "-1") {
                        setValue("choseCustom", true);
                        setValue("selectedPoints", "");
                      } else {
                        setValue("choseCustom", false);
                        setValue("selectedPoints", e.target.value);
                        setValue("customPoints", 0);
                      }
                    }}
                    className="w-full p-2 border rounded"
                    disabled={!depChosen}
                  >
                    <option value="">Select Points</option>
                    {availablePoints.map((p, idx) => (
                      <option key={idx} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                    <option value="-1">Custom Points</option>
                  </select>
                </div>

                {choseCustom && (
                  <div className="mb-4">
                    <label>Custom Points:</label>
                    <input
                      type="number"
                      {...register("customPoints", {
                        valueAsNumber: true,
                        min: 1,
                      })}
                      className="w-full p-2 border rounded"
                      min={1}
                    />
                  </div>
                )}

                {!choseCustom && selectedPoints && (
                  <div className="mb-4">
                    <label>How many times did you complete this task?</label>
                    <input
                      type="number"
                      {...register("multiplier", {
                        valueAsNumber: true,
                        min: 1,
                      })}
                      className="w-full p-2 border rounded"
                      min={1}
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-3 rounded-lg"
                >
                  SUBMIT REQUEST
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Links modal controlled via form state (no useState) */}
        <EditLinks
          isOpen={isELopen}
          onClose={() => methods.setValue("isELopen", false)}
        />
      </div>
    </FormProvider>
    </SidebarWrapper>
  );
};

export default RequestScreen;
