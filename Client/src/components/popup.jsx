import React from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter } from "@material-tailwind/react";

const TaskModal = ({
    taskName,
    target,
    department,
    date,
    description,
    id,
    points,
    status,
    onClose
}) => {
    const taskColor = status === "accepted"
        ? 'rgba(25, 135, 84, 1)'
        : status === "rejected"
            ? 'rgba(220, 53, 69, 1)'
            : 'rgba(255, 172, 51, 1)';
            
    const textColor = status === "pending" ? 'black' : taskColor;
    const textColor1 = status === "pending" ? "black" : "white";

    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/30"
            onClick={onClose} 
        >
            <div
                className="bg-white rounded-lg p-6 shadow-xl max-w-lg mx-auto w-full relative"
                onClick={(e) => e.stopPropagation()} // Prevent close on modal click
            >
                <DialogHeader style={{ backgroundColor: taskColor, color: textColor1 }}>
                    {taskName}
                </DialogHeader>        <DialogBody>
                    <div
                        className="p-4 border rounded-xl shadow-lg font-sans"
                        style={{ fontFamily: 'Lato, sans-serif', border: `1px solid ${taskColor}` }}
                    >
                        {/* <div className="text-lg font-bold mb-4" style={{ color: textColor }}>
              Task: {taskName}
            </div> */}
                        <div className="space-y-2">
                            <div style={{ color: textColor }}>
                                <strong>Target:</strong> {target}
                            </div>
                            <div style={{ color: textColor }}>
                                <strong>Department:</strong> {department}
                            </div>
                            <div style={{ color: textColor }}>
                                <strong>Date:</strong> {date}
                            </div>
                            <div style={{ color: textColor }}>
                                <strong>Description:</strong> {description}
                            </div>
                            <div style={{ color: textColor }}>
                                <strong>Points:</strong> {points}
                            </div>
                        </div>
                        <div className="text-gray-500 mt-4 text-xs">
                            ID: {id}
                        </div>
                    </div>
                </DialogBody>
                <DialogFooter>
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded-md"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </DialogFooter>
            </div>
        </div>
    );
};

export default TaskModal;