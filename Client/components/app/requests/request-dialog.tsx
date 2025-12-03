"use client";

import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Textarea,
} from "@/components/ui";
import {
  Calendar,
  Check,
  X,
  User,
  Building,
  FileText,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import { Contribution, FullContribution, Status } from "@/types";
import { normalizeUrl } from "@/lib/utils";
import { useState } from "react";

interface RequestDialogProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  selectedRequest: Contribution | FullContribution | null;
  handleStatusChange: (id: string, status: Status, reason?: string) => void;
  getStatusColor: (status: string) => string;
  formatDate: (date: string) => string;
  isRequestPage?: boolean;
}

export const RequestDialog = ({
  isDialogOpen,
  setIsDialogOpen,
  selectedRequest,
  handleStatusChange,
  getStatusColor,
  formatDate,
  isRequestPage = true,
}: RequestDialogProps) => {
  const [showReasonInput, setShowReasonInput] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const getContribution = (
    request: Contribution | FullContribution
  ): Contribution =>
    "contribution" in request ? request.contribution : request;

  const getDepartmentName = (
    request: Contribution | FullContribution
  ): string =>
    "department_name" in request ? request.department_name : request.department;

  const getUserName = (request: Contribution | FullContribution): string =>
    "user_name" in request ? request.user_name : request.user_id;

  const handleReject = () => setShowReasonInput(true);

  const handleStatusChangeAndClose = (status: Status) => {
    if (selectedRequest) {
      const contribution = getContribution(selectedRequest);
      handleStatusChange(contribution.id, status);
      setIsDialogOpen(false);
    }
  };

  const confirmReject = () => {
    if (selectedRequest && rejectionReason.trim()) {
      const contribution = getContribution(selectedRequest);
      handleStatusChange(contribution.id, "rejected", rejectionReason);
      setShowReasonInput(false);
      setRejectionReason("");
      setIsDialogOpen(false);
    }
  };

  const cancelReject = () => {
    setShowReasonInput(false);
    setRejectionReason("");
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {selectedRequest && (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">
                Request Details
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Title & Status */}
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold mb-2">
                    {getContribution(selectedRequest).title}
                  </h2>
                  <Badge
                    className={getStatusColor(
                      getContribution(selectedRequest).status
                    )}
                  >
                    {getContribution(selectedRequest).status}
                  </Badge>
                </div>
                <Badge
                  variant="outline"
                  className="text-sm px-3 py-1 bg-primary text-white"
                >
                  {getContribution(selectedRequest).points} pts
                </Badge>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex items-center space-x-2">
                  <User size={16} className="text-muted-foreground" />
                  {isRequestPage ? (
                    <span>
                      <span className="text-sm text-muted-foreground">
                        Submitted by: <br />{" "}
                      </span>
                      <span className="font-medium">
                        {getUserName(selectedRequest)}
                      </span>
                    </span>
                  ) : (
                    <span>
                      <span className="text-sm text-muted-foreground">
                        Lead:{" "}
                      </span>
                      <span className="font-medium">
                        {getContribution(selectedRequest).target}
                      </span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Building size={16} className="text-muted-foreground" />
                  <div className="flex flex-col gap-1">
                    <div className="text-sm text-muted-foreground">
                      Department:
                    </div>
                    <div className="font-medium">
                      {getDepartmentName(selectedRequest)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Calendar size={16} className="text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Created At:{" "}
                  </span>
                  <span className="font-medium">
                    {formatDate(getContribution(selectedRequest).created_at)}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <FileText size={16} className="text-muted-foreground" />
                  <span>Description</span>
                </div>
                <p className="text-sm leading-relaxed bg-muted p-3 rounded-md font-semibold">
                  {getContribution(selectedRequest).description}
                </p>
              </div>

              {/* Rejection Reason (Display) */}
              {getContribution(selectedRequest).status === "rejected" &&
                getContribution(selectedRequest).reason && (
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertCircle size={16} className="text-destructive" />
                      <span className="font-semibold text-destructive">
                        Rejection Reason
                      </span>
                    </div>
                    <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-md border border-destructive/20">
                      {getContribution(selectedRequest).reason}
                    </p>
                  </div>
                )}

              {/* Proof Files */}
              {getContribution(selectedRequest).proof_files && (
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <ExternalLink size={16} className="text-muted-foreground" />
                    <span className="font-semibold">Proof Files</span>
                  </div>
                  <div className="space-y-2">
                    {getContribution(selectedRequest).proof_files!.map(
                      (file, idx) => {
                        const absoluteUrl = normalizeUrl(file);
                        return (
                          <a
                            key={idx}
                            href={absoluteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 text-sm text-primary hover:underline"
                          >
                            <ExternalLink size={14} />
                            <span>Proof File {idx + 1}</span>
                          </a>
                        );
                      }
                    )}
                  </div>
                </div>
              )}

              {/* Rejection Input */}
              {showReasonInput && (
                <div className="border-t border-border pt-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertCircle size={16} className="text-destructive" />
                    <span className="font-semibold text-destructive">
                      Reason for Rejection
                    </span>
                  </div>
                  <Textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Provide a reason..."
                    className="min-h-[100px]"
                  />
                  <div className="flex justify-end gap-2 mt-3">
                    <Button variant="outline" onClick={cancelReject}>
                      Cancel
                    </Button>
                    <Button onClick={confirmReject} variant="destructive">
                      Confirm Rejection
                    </Button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {isRequestPage && !showReasonInput && (
                <div className="flex justify-end gap-2 pt-4 border-t border-border">
                  {getContribution(selectedRequest).status === "pending" && (
                    <>
                      <Button
                        variant="outline"
                        onClick={handleReject}
                        className="bg-destructive text-white hover:bg-destructive"
                      >
                        <X size={16} className="mr-2" />
                        Reject
                      </Button>
                      <Button
                        onClick={() => handleStatusChangeAndClose("approved")}
                        className="bg-green-600"
                      >
                        <Check size={16} className="mr-2" />
                        Approve
                      </Button>
                    </>
                  )}{" "}
                  {getContribution(selectedRequest).status === "approved" && (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => handleStatusChangeAndClose("pending")}
                        className="bg-accent"
                      >
                        Move to Pending
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleReject}
                        className="bg-destructive text-white hover:bg-destructive"
                      >
                        <X size={16} className="mr-2" />
                        Reject
                      </Button>
                    </>
                  )}
                  {getContribution(selectedRequest).status === "rejected" && (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => handleStatusChangeAndClose("pending")}
                        className="bg-accent"
                      >
                        Move to Pending
                      </Button>
                      <Button
                        onClick={() => handleStatusChangeAndClose("approved")}
                        className="bg-green-600"
                      >
                        <Check size={16} className="mr-2" />
                        Approve
                      </Button>
                    </>
                  )}
                  <Button
                    variant="secondary"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Close
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
