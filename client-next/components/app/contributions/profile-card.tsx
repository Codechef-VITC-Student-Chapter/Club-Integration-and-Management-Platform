import { MoreHorizontal, UserCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface IProfile {
    name: String
    regno: String
    type: String
}

export const ProfileCard = ({name, regno, type}: IProfile) => {
  return (
    <Card className="w-fit h-full">
      <CardHeader className="">
        <CardTitle className="text-xl font-semibold">Profile</CardTitle>
      </CardHeader>
      <CardContent className="px-8">
        <div className="flex items-start space-x-4">
          <Avatar className="size-[70px]">
            <AvatarFallback className="bg-transparent">
              <UserCircle className="size-full" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{name}</h3>
            <p className="text-gray-600 text-sm">{regno}</p>
            <p className="text-gray-600 text-sm mt-1">{type}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}