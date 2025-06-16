import {
  PageContent,
  PageHeader,
  PageWrapper,
} from "@/components/layout/PageLayout";
import LastOrderPlacedCard from "../components/customer-detail/last-order-placed-card/LastOrderPlaced";
import TimelineSection from "../components/customer-detail/timeline-section/TimelineSection";
import StoreCreditCard from "../components/customer-detail/store-credit-card/StoreCreditCard";
import NoteCard from "../components/customer-detail/note-card/NoteCard";
import TagCard from "../components/customer-detail/tag-card/TagCard";
import StatsBar from "../components/customer-detail/stats-bar/StatsBar";
import CustomerCard from "../components/customer-detail/customer-card/CustomerCard";
import ActionBar from "../components/customer-detail/action-bar/ActionBar";
import EditCustomerContactModal from "../components/edit-contact-modal/EditCustomerContactModal";
import EditNoteModal from "../components/edit-note-modal/EditNoteModal";

const CustomerDetail = () => {
  return (
    <PageWrapper>
      <PageHeader>
        <ActionBar />
      </PageHeader>
      <PageContent>
        <StatsBar />
        <div className="flex-1 space-y-4">
          <LastOrderPlacedCard />
          <TimelineSection />
        </div>
        <div className="basis-1/3 space-y-4">
          <CustomerCard />
          <StoreCreditCard />
          <TagCard />
          <NoteCard />
        </div>
      </PageContent>
      <EditCustomerContactModal />
      <EditNoteModal />
    </PageWrapper>
  );
};

export default CustomerDetail;
