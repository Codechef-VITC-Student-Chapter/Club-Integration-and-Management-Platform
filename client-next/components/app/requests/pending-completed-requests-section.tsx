import {
    Badge,
    Button,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui";
import { Contribution } from "@/types";
import { Calendar, Check, X } from "lucide-react";

export const PendingCompletedRequestsSection = ({
    pendingRequests,
    isPending = true,
}: {
    pendingRequests: Contribution[];
    isPending: boolean;
}) => {
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "approved":
                return "bg-green-100 text-green-800";
            case "rejected":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <Card className="h-[58vh] flex flex-col justify-start gap-2 p-0">
            <CardHeader className="mt-4">
                <CardTitle className="text-xl font-semibold text-gray-900">
                    {isPending ? "Pending Requests" : "Completed Requests"}
                </CardTitle>
                <p className="text-sm text-gray-500 mt-1">
                    {isPending
                        ? "Active requests awaiting approval"
                        : "Approved and rejected requests"}
                </p>
            </CardHeader>
            <CardContent className="p-0 flex flex-1 flex-col h-full overflow-auto w-full">
                <div className="flex-1 divide-gray-200 w-full">
                    {pendingRequests.length > 0 ? (
                        pendingRequests.map((request) => (
                            <div
                                key={request.id}
                                className="p-4 hover:bg-gray-50 w-full"
                            >
                                <div className="flex justify-between">
                                    <div className="flex-1 w-full">
                                        <div className="flex gap-4 items-start justify-between">
                                            <div className="flex flex-col">
                                                <h3 className="font-semibold text-gray-900 mb-1 flex gap-4">
                                                    {request.title}
                                                    <Badge className="bg-gray-200 text-gray-800 m-0">
                                                        {request.department}
                                                    </Badge>
                                                </h3>
                                                <p className="text-gray-600 text-sm mb-2">
                                                    {request.description}
                                                </p>
                                            </div>

                                            {isPending && (
                                                <div className="flex items-center space-x-2">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-full cursor-pointer"
                                                    >
                                                        <X size={16} />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        className="p-2 bg-blue-600 text-white hover:bg-blue-700 rounded-full cursor-pointer"
                                                    >
                                                        <Check size={16} />
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-start justify-between space-x-4 text-sm">
                                            <div className="flex items-center space-x-2">
                                                <span className="text-gray-700">
                                                    {request.user_id}
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Calendar
                                                    size={14}
                                                    className="text-gray-400"
                                                />
                                                <span className="text-gray-600">
                                                    {formatDate(
                                                        request.created_at
                                                    )}
                                                </span>
                                            </div>
                                            <Badge
                                                className={getStatusColor(
                                                    request.status
                                                )}
                                            >
                                                {request.status}
                                            </Badge>
                                            <Badge
                                                variant="outline"
                                                className="bg-orange-50 text-orange-700"
                                            >
                                                {request.points} pts
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-8 text-center text-gray-500">
                            <p>No pending requests</p>
                        </div>
                    )}
                </div>
            </CardContent>
            <div className="p-4 border-t border-gray-200 text-center text-sm text-gray-500">
                &nbsp;&nbsp;&nbsp;&nbsp; Rows: {pendingRequests.length}
            </div>
        </Card>
    );
};
