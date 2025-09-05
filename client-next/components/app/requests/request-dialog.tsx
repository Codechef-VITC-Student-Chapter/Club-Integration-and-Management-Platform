"use client";

import { useState } from "react";
import {
  Badge,
  Button,
} from "@/components/ui";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Calendar,
  Check,
  X,
  User,
  Building,
  FileText,
  ExternalLink,
} from "lucide-react";
import { Contribution } from "@/types";

// Props type
interface RequestDialogProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  selectedRequest: Contribution | null;
  handleApprove: (id: string) => void;
  handleReject: (id: string) => void;
  handleStatusChange: (id: string, status: string) => void;
  getStatusColor: (status: string) => string;
  formatDate: (date: string) => string;
}

export const RequestDialog = ({
  isDialogOpen,
  setIsDialogOpen,
  selectedRequest,
  handleApprove,
  handleReject,
  handleStatusChange,
  getStatusColor,
  formatDate,
}: RequestDialogProps) => {
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        {selectedRequest && (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">
                Request Details
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Title and Status */}
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedRequest.title}
                  </h2>
                  <Badge className={getStatusColor(selectedRequest.status)}>
                    {selectedRequest.status}
                  </Badge>
                </div>
                <Badge className="bg-orange-100 text-orange-700 text-lg px-3 py-1">
                  {selectedRequest.points} pts
                </Badge>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <User size={16} className="text-gray-500" />
                  <span className="text-sm text-gray-600">Submitted by:</span>
                  <span className="font-medium">{selectedRequest.user_id}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Building size={16} className="text-gray-500" />
                  <span className="text-sm text-gray-600">Department:</span>
                  <span className="font-medium">{selectedRequest.department}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar size={16} className="text-gray-500" />
                  <span className="text-sm text-gray-600">Created:</span>
                  <span className="font-medium">
                    {formatDate(selectedRequest.created_at)}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <FileText size={16} className="text-gray-500" />
                  <span className="font-semibold text-gray-900">Description</span>
                </div>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                  {selectedRequest.description}
                </p>
              </div>

              {/* Proof Files */}
              {selectedRequest.proof_files &&
                selectedRequest.proof_files.length > 0 && (
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <ExternalLink size={16} className="text-gray-500" />
                      <span className="font-semibold text-gray-900">
                        Proof Files
                      </span>
                    </div>
                    <div className="space-y-2">
                      {selectedRequest.proof_files.map((file, idx) => (
                        <a
                          key={idx}
                          href={file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm"
                        >
                          <ExternalLink size={14} />
                          <span>Proof File {idx + 1}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                {selectedRequest.status === "pending" && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => handleReject(selectedRequest.id)}
                      className="text-red-600 border-red-600 hover:bg-red-50"
                    >
                      <X size={16} className="mr-2" />
                      Reject
                    </Button>
                    <Button
                      onClick={() => handleApprove(selectedRequest.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check size={16} className="mr-2" />
                      Approve
                    </Button>
                  </>
                )}

                {selectedRequest.status === "approved" && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() =>
                        handleStatusChange(selectedRequest.id, "pending")
                      }
                      className="text-yellow-600 border-yellow-600 hover:bg-yellow-50"
                    >
                      Move to Pending
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() =>
                        handleStatusChange(selectedRequest.id, "rejected")
                      }
                      className="text-red-600 border-red-600 hover:bg-red-50"
                    >
                      <X size={16} className="mr-2" />
                      Reject
                    </Button>
                  </>
                )}

                {selectedRequest.status === "rejected" && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() =>
                        handleStatusChange(selectedRequest.id, "pending")
                      }
                      className="text-yellow-600 border-yellow-600 hover:bg-yellow-50"
                    >
                      Move to Pending
                    </Button>
                    <Button
                      onClick={() =>
                        handleStatusChange(selectedRequest.id, "approved")
                      }
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check size={16} className="mr-2" />
                      Approve
                    </Button>
                  </>
                )}

                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};