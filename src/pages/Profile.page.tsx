import UserProfileCard from "../components/UserProfileCard"
import { Checkbox } from "@/components/ui/checkbox";
import { user } from "../lib/mock";

export default function Profile() {
  return (
    <div className="flex">

      <div className="flex-1 p-6 flex gap-6 ml-60">
        
        <UserProfileCard user={user} />

        <div className="flex-1">
          <p>Aqui vão os posts...</p>
        </div>

        <Checkbox/>

      </div>
    </div>
  );
}
