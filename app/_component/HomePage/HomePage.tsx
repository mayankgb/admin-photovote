import { ActiveContest } from "./ActiveContest/ActiveContest";
import AdminHeader from "./AdminHeader";
import ContestOverview from "./ContestOverview";
import Participant from "./ParticipantStats";
import PendingApprovals from "./PendingApprovals";
import QuickActions from "./QuickActions";

export function HomePage() {
    return(
        <div className="container mx-auto p-4 space-y-6">
            <AdminHeader/>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <ContestOverview/>
                <Participant/>
                <QuickActions/>
            </div>
            <ActiveContest/>
            <PendingApprovals/>
        </div>
    )
}